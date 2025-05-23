import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/auth/supabase-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 },
      );
    }

    console.log("Fetching credits for user:", userId);

    // Get user's credit information from Supabase
    const { data: userData, error } = await supabaseServer
      .from("users")
      .select("credits_available, subscription_status, price_id")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user credits:", error);

      // If user doesn't exist, create a basic record
      if (error.code === "PGRST116") {
        console.log("User not found in database, creating basic record...");

        const { data: newUser, error: createError } = await supabaseServer
          .from("users")
          .insert({
            id: userId,
            credits_available: 0,
            subscription_status: "inactive",
          })
          .select("credits_available, subscription_status, price_id")
          .single();

        if (createError) {
          console.error("Error creating user record:", createError);
          return NextResponse.json(
            { error: "Failed to create user record" },
            { status: 500 },
          );
        }

        return NextResponse.json({
          credits: newUser.credits_available || 0,
          subscriptionStatus: newUser.subscription_status,
          priceId: newUser.price_id,
        });
      }

      return NextResponse.json(
        { error: "Failed to fetch credits" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      credits: userData.credits_available || 0,
      subscriptionStatus: userData.subscription_status,
      priceId: userData.price_id,
    });
  } catch (error) {
    console.error("Credits API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
