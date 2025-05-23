import { useAuthContext } from "@/providers/Auth";
import { useCreditsContext } from "@/providers/Credits";
import { Coins, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreditBalanceProps {
  className?: string;
  showIcon?: boolean;
}

export function CreditBalance({
  className,
  showIcon = true,
}: CreditBalanceProps) {
  const { isAuthenticated } = useAuthContext();
  const { credits, loading, error } = useCreditsContext();

  // Don't show anything if user is not logged in
  if (!isAuthenticated) {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <Badge
        variant="secondary"
        className={cn(
          "flex animate-pulse items-center space-x-2 px-3 py-1.5",
          className,
        )}
      >
        {showIcon && <Coins className="h-4 w-4" />}
        <span className="text-sm font-medium">Loading...</span>
      </Badge>
    );
  }

  // Handle error state
  if (error || credits === null) {
    return (
      <Badge
        variant="destructive"
        className={cn("flex items-center space-x-2 px-3 py-1.5", className)}
      >
        {showIcon && <AlertCircle className="h-4 w-4" />}
        <span className="text-sm font-medium">Error</span>
      </Badge>
    );
  }

  // Determine badge variant based on credit amount
  const getBadgeVariant = (credits: number) => {
    if (credits === 0) return "destructive";
    if (credits <= 5) return "secondary";
    return "default";
  };

  // Get appropriate icon based on credit amount
  const getIcon = (credits: number) => {
    if (credits === 0) return <AlertCircle className="h-4 w-4" />;
    return <Coins className="h-4 w-4 text-yellow-500" />;
  };

  // Format credit display
  const formatCredits = (credits: number) => {
    if (credits >= 1000000) return "Unlimited";
    return credits.toLocaleString();
  };

  return (
    <Badge
      variant={getBadgeVariant(credits)}
      className={cn(
        "flex items-center space-x-2 px-3 py-1.5 text-sm font-medium",
        credits === 0 && "animate-pulse",
        className,
      )}
    >
      {showIcon && getIcon(credits)}
      <span>
        {formatCredits(credits)} {credits === 1 ? "credit" : "credits"}
      </span>
    </Badge>
  );
}
