"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/lib/auth/supabase-client";
import { Navbar } from "@/components/navbar";
import Link from "next/link";

interface SubscriptionDetails {
  status: string;
  priceId: string;
  credits: number;
  planName: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] =
    useState<SubscriptionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!user || !sessionId) {
        setLoading(false);
        return;
      }

      try {
        // Check user's subscription status
        const response = await fetch(`/api/user/credits?userId=${user.id}`);
        const data = await response.json();

        if (response.ok) {
          // Map price ID to plan name
          const getPlanName = (priceId: string) => {
            switch (priceId) {
              case "price_1RRlDw5RmLx3D9SH2BQiFTKP":
                return "Starter";
              case "price_1RRlEF5RmLx3D9SHqHonamX0":
                return "Professional";
              case "price_1RRlET5RmLx3D9SHeEeJrMEB":
                return "Enterprise";
              case "price_1RRllZ5RmLx3D9SHTTT1pJxc":
                return "Test Product";
              default:
                return "Unknown Plan";
            }
          };

          setSubscriptionDetails({
            status: data.subscriptionStatus || "active",
            priceId: data.priceId || "",
            credits: data.credits || 0,
            planName: getPlanName(data.priceId),
          });
        } else {
          setError("Failed to fetch subscription details");
        }
      } catch (err) {
        console.error("Error checking subscription:", err);
        setError("Error checking subscription status");
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to allow webhook to process
    const timer = setTimeout(checkSubscriptionStatus, 2000);
    return () => clearTimeout(timer);
  }, [user, sessionId]);

  if (!sessionId) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <div className="container mx-auto max-w-2xl px-4 py-24">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="text-destructive h-6 w-6" />
                <CardTitle>Invalid Session</CardTitle>
              </div>
              <CardDescription>
                No valid checkout session found. Please try subscribing again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/pricing">Return to Pricing</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-24">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              {loading ? (
                <Loader2 className="text-primary h-12 w-12 animate-spin" />
              ) : error ? (
                <AlertCircle className="text-destructive h-12 w-12" />
              ) : (
                <CheckCircle className="h-12 w-12 text-green-500" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {loading
                ? "Processing your subscription..."
                : error
                  ? "Something went wrong"
                  : "Subscription successful!"}
            </CardTitle>
            <CardDescription>
              {loading
                ? "Please wait while we set up your account"
                : error
                  ? error
                  : "Welcome to your new AI chatbot plan"}
            </CardDescription>
          </CardHeader>

          {!loading && !error && subscriptionDetails && (
            <CardContent className="space-y-6">
              <div className="space-y-4 text-center">
                <div>
                  <h3 className="text-lg font-medium">Plan Details</h3>
                  <div className="mt-2 flex items-center justify-center space-x-2">
                    <Badge
                      variant="default"
                      className="px-4 py-1 text-lg"
                    >
                      {subscriptionDetails.planName}
                    </Badge>
                    <Badge variant="outline">
                      {subscriptionDetails.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Available Credits</h3>
                  <div className="text-primary mt-2 text-3xl font-bold">
                    {subscriptionDetails.credits >= 1000000
                      ? "Unlimited"
                      : subscriptionDetails.credits.toLocaleString()}{" "}
                    credits
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="w-full"
                  >
                    <Link href="/">Start Using Your AI Chatbot</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <Link href="/pricing">View All Plans</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          )}

          {error && (
            <CardContent>
              <div className="space-y-4 text-center">
                <p className="text-muted-foreground">
                  Your payment was processed, but we're having trouble loading
                  your subscription details. Please check your account or
                  contact support.
                </p>
                <div className="space-y-2">
                  <Button
                    asChild
                    className="w-full"
                  >
                    <Link href="/">Go to Dashboard</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <Link href="/pricing">Return to Pricing</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Session Info for debugging */}
        {process.env.NODE_ENV === "development" && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground space-y-1 text-xs">
                <p>
                  <strong>Session ID:</strong> {sessionId}
                </p>
                <p>
                  <strong>User ID:</strong> {user?.id || "Not logged in"}
                </p>
                {subscriptionDetails && (
                  <p>
                    <strong>Price ID:</strong> {subscriptionDetails.priceId}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
