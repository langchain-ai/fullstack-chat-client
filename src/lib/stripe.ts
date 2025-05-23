import { supabase } from "@/lib/auth/supabase-client";

type CheckoutSessionParams = {
  priceId: string;
  userId: string;
  customerEmail: string;
};

export async function createCheckoutSession({
  priceId,
  userId,
  customerEmail,
}: CheckoutSessionParams) {
  try {
    // Call your API route that creates a Stripe checkout session
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId,
        userId,
        customerEmail,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create checkout session");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

export async function getCustomerSubscription(userId: string) {
  try {
    // Call your API route that fetches the customer's subscription
    const response = await fetch(`/api/subscriptions?userId=${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch subscription");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching subscription:", error);
    throw error;
  }
}

export async function addUserCredits(userId: string, creditsToAdd: number) {
  try {
    // Add credits to user's balance
    const { data: currentUser } = await supabase
      .from("users")
      .select("credits_available")
      .eq("id", userId)
      .single();

    const currentCredits = (currentUser?.credits_available as number) || 0;
    const newCredits = currentCredits + creditsToAdd;

    const { error } = await supabase
      .from("users")
      .update({
        credits_available: newCredits,
        subscription_status: "active", // Ensure user has active status when adding credits
      })
      .eq("id", userId);

    if (error) throw error;

    return { success: true, newBalance: newCredits };
  } catch (error) {
    console.error("Error adding user credits:", error);
    throw error;
  }
}

export async function deductUserCredits(
  userId: string,
  creditsToDeduct: number,
) {
  try {
    // Deduct credits from user's balance
    const { data: currentUser, error: fetchError } = await supabase
      .from("users")
      .select("credits_available")
      .eq("id", userId)
      .single();

    if (fetchError) throw fetchError;

    const currentBalance = (currentUser?.credits_available as number) || 0;
    if (currentBalance < creditsToDeduct) {
      throw new Error("Insufficient credits");
    }

    const newCredits = currentBalance - creditsToDeduct;

    const { error } = await supabase
      .from("users")
      .update({
        credits_available: newCredits,
      })
      .eq("id", userId);

    if (error) throw error;

    return { success: true, newBalance: newCredits };
  } catch (error) {
    console.error("Error deducting user credits:", error);
    throw error;
  }
}
