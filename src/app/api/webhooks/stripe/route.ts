import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer } from "@/lib/auth/supabase-server";
import { getCreditLimitByPriceId } from "@/lib/stripe-config";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

// This is your Stripe webhook secret for testing your endpoint locally
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature") || "";

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  console.log(`Received webhook event: ${event.type}`);

  // Handle the event
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;

      console.log("Processing subscription:", subscription.id);
      console.log("Subscription metadata:", subscription.metadata);
      console.log("Customer ID:", subscription.customer);

      // Get the user ID from the metadata
      let userId = subscription.metadata.userId;

      // If userId is not in subscription metadata, try to get it from the customer
      if (!userId) {
        console.log(
          "No userId in subscription metadata, fetching from customer...",
        );
        try {
          const customer = await stripe.customers.retrieve(
            subscription.customer as string,
          );
          if (customer && !customer.deleted) {
            userId = customer.metadata.userId;
            console.log("Found userId in customer metadata:", userId);
          }
        } catch (err) {
          console.error("Error fetching customer:", err);
        }
      }

      // If still no userId, try to find by stripe_customer_id in database
      if (!userId) {
        console.log("No userId found, searching database by customer ID...");
        const { data: userData, error } = await supabaseServer
          .from("users")
          .select("id")
          .eq("stripe_customer_id", subscription.customer as string)
          .single();

        if (!error && userData) {
          userId = userData.id;
          console.log("Found userId in database:", userId);
        } else if (error) {
          console.error("Database search error:", error);
        }
      }

      if (userId) {
        console.log("Updating user subscription for userId:", userId);

        // Fetch email from Stripe customer
        let customerEmail = null;
        try {
          const customer = await stripe.customers.retrieve(
            subscription.customer as string,
          );
          if (customer && !customer.deleted && customer.email) {
            customerEmail = customer.email;
            console.log("Found customer email:", customerEmail);
          }
        } catch (err) {
          console.error("Error fetching customer email:", err);
        }

        // If no email from Stripe, try to get from existing user record
        if (!customerEmail) {
          console.log("No email from Stripe, checking existing user record...");
          const { data: existingUser, error: userError } = await supabaseServer
            .from("users")
            .select("email")
            .eq("id", userId)
            .single();

          if (!userError && existingUser?.email) {
            customerEmail = existingUser.email;
            console.log("Found email in existing user record:", customerEmail);
          }
        }

        // Determine credits based on price ID and subscription status
        let creditsAvailable = 0;

        if (subscription.status === "active") {
          creditsAvailable = getCreditLimitByPriceId(
            subscription.items.data[0].price.id,
          );
          console.log(
            "Credits calculated:",
            creditsAvailable,
            "for price:",
            subscription.items.data[0].price.id,
          );
        }

        const updateData = {
          id: userId,
          email: customerEmail,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer as string,
          subscription_status: subscription.status,
          price_id: subscription.items.data[0].price.id,
          credits_available: creditsAvailable,
          current_period_end: (subscription as any).current_period_end
            ? new Date(
                (subscription as any).current_period_end * 1000,
              ).toISOString()
            : null,
        };

        console.log("Update data:", updateData);

        // Update the user's subscription and credits in one operation
        const { error } = await supabaseServer
          .from("users")
          .upsert(updateData, {
            onConflict: "id",
          });

        if (error) {
          console.error("Error updating user subscription:", error);
          throw new Error(`Database update failed: ${error.message}`);
        } else {
          console.log("Successfully updated user subscription");
        }
      } else {
        console.error(
          "Could not find userId for subscription:",
          subscription.id,
        );
        throw new Error("Could not find userId for subscription");
      }
      break;
    }

    case "customer.subscription.deleted": {
      const deletedSubscription = event.data.object as Stripe.Subscription;
      const deletedUserId = deletedSubscription.metadata.userId;

      if (deletedUserId) {
        // Update the user's subscription status and remove credits
        const { error } = await supabaseServer
          .from("users")
          .update({
            subscription_status: "canceled",
            credits_available: 0,
          })
          .eq("stripe_subscription_id", deletedSubscription.id);

        if (error) {
          console.error("Error updating user subscription:", error);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
