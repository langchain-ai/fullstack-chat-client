"use client";

import { useState, useEffect } from "react";
import { Coins, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/lib/auth/supabase-client";
import { cn } from "@/lib/utils";

export function CreditsDisplay() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log("CreditsDisplay: Fetching credits for user:", user.id);
        const response = await fetch(`/api/user/credits?userId=${user.id}`);

        if (!response.ok) {
          console.error(
            "CreditsDisplay: Credits API failed with status:",
            response.status,
          );
          const errorText = await response.text();
          console.error("CreditsDisplay: Error response:", errorText);
          setCredits(0); // Fallback to 0 credits
          return;
        }

        const data = await response.json();
        console.log("CreditsDisplay: Credits API response:", data);

        if (data.credits !== undefined) {
          setCredits(data.credits);
        } else {
          setCredits(0); // Fallback if no credits field
        }
      } catch (error) {
        console.error("CreditsDisplay: Failed to fetch credits:", error);
        setCredits(0); // Fallback to 0 credits on any error
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [user]);

  // Don't show anything if user is not logged in
  if (!user) {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="bg-muted flex animate-pulse items-center space-x-2 rounded-full px-3 py-1.5">
        <Coins className="h-4 w-4" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    );
  }

  // Determine color based on credit amount
  const getVariant = (credits: number) => {
    if (credits === 0) return "secondary";
    if (credits < 1000) return "secondary";
    return "default";
  };

  const getIcon = (credits: number) => {
    if (credits === 0) return <AlertCircle className="h-4 w-4" />;
    return <Coins className="h-4 w-4" />;
  };

  return (
    <Badge
      variant={getVariant(credits || 0)}
      className={cn(
        "flex items-center space-x-1 px-3 py-1.5 text-sm font-medium",
        credits === 0 && "animate-pulse",
      )}
    >
      {getIcon(credits || 0)}
      <span>
        {credits === null
          ? "Error"
          : credits >= 1000000
            ? "Unlimited"
            : credits.toLocaleString()}{" "}
        credits
      </span>
    </Badge>
  );
}
