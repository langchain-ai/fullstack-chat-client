"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "@/lib/stripe";
import { useUser } from "@/lib/auth/supabase-client";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { PLAN_INFO } from "@/lib/stripe-config";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

// Child component that uses the useStripe hook
function PricingContent() {
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useUser();
  const stripe = useStripe();

  const tiers = [
    {
      name: PLAN_INFO.STARTER.name,
      price: PLAN_INFO.STARTER.price,
      description: PLAN_INFO.STARTER.description,
      features: [
        "10,000 AI requests per month",
        "Up to 3 team members",
        "Basic chatbot customization",
        "Standard response time",
        "Email support",
        "1 chatbot deployment",
      ],
      cta: "Subscribe now",
      ctaDescription: "Get started immediately",
      popular: false,
      priceId: PLAN_INFO.STARTER.priceId,
      creditLimit: PLAN_INFO.STARTER.creditLimit,
    },
    {
      name: PLAN_INFO.PROFESSIONAL.name,
      price: PLAN_INFO.PROFESSIONAL.price,
      description: PLAN_INFO.PROFESSIONAL.description,
      features: [
        "50,000 AI requests per month",
        "Up to 10 team members",
        "Advanced chatbot customization",
        "Priority response time",
        "Priority support",
        "Custom domain",
        "API access",
        "5 chatbot deployments",
      ],
      cta: "Subscribe now",
      ctaDescription: "Most popular for businesses",
      popular: true,
      priceId: PLAN_INFO.PROFESSIONAL.priceId,
      creditLimit: PLAN_INFO.PROFESSIONAL.creditLimit,
    },
    {
      name: PLAN_INFO.ENTERPRISE.name,
      price: PLAN_INFO.ENTERPRISE.price,
      description: PLAN_INFO.ENTERPRISE.description,
      features: [
        "Unlimited AI requests",
        "Unlimited team members",
        "Full customization capabilities",
        "Custom AI model fine-tuning",
        "Dedicated support",
        "Custom domains",
        "Advanced API access",
        "SSO authentication",
        "Audit logs",
        "SLA guarantees",
        "Unlimited chatbot deployments",
      ],
      cta: "Subscribe now",
      ctaDescription: "For large organizations",
      popular: false,
      priceId: PLAN_INFO.ENTERPRISE.priceId,
      creditLimit: PLAN_INFO.ENTERPRISE.creditLimit,
    },
  ];

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      toast.error("Please sign in to subscribe to a plan");
      return;
    }

    if (!stripe) {
      toast.error("Stripe not loaded. Please try again.");
      return;
    }

    try {
      setLoading(priceId);

      // Create checkout session
      const { sessionId } = await createCheckoutSession({
        priceId,
        userId: user.id,
        customerEmail: user.email,
      });

      // Redirect to Stripe Checkout using React Stripe JS
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      toast.error("Failed to process your subscription. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-24">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Enterprise AI Chatbot Pricing
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          Choose the perfect plan for your business needs. Scale your AI
          capabilities as you grow.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`flex flex-col ${tier.popular ? "border-primary relative shadow-lg" : "border-border"}`}
          >
            {tier.popular && (
              <Badge className="bg-primary hover:bg-primary absolute -top-2.5 right-6">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <CardDescription className="min-h-[50px]">
                {tier.description}
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start"
                  >
                    <Check className="mr-2 h-5 w-5 shrink-0 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch pt-6">
              <Button
                variant={tier.popular ? "default" : "outline"}
                className="w-full"
                size="lg"
                onClick={() => handleSubscribe(tier.priceId)}
                disabled={loading === tier.priceId}
              >
                {loading === tier.priceId ? "Processing..." : tier.cta}
              </Button>
              <p className="text-muted-foreground mt-3 text-center text-xs">
                {tier.ctaDescription}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20 text-center">
        <h2 className="mb-4 text-2xl font-bold">Need a custom solution?</h2>
        <p className="text-muted-foreground mx-auto mb-6 max-w-2xl">
          Our enterprise solutions can be tailored to your specific AI chatbot
          requirements and integration needs.
        </p>
        <Button
          variant="outline"
          size="lg"
          onClick={() => (window.location.href = "/contact")}
        >
          Contact Sales
        </Button>
      </div>

      <div className="mt-24 border-t pt-12">
        <h3 className="mb-6 text-center text-xl font-semibold">
          Frequently Asked Questions
        </h3>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium">What counts as an AI request?</h4>
            <p className="text-muted-foreground text-sm">
              Each message sent to our AI model counts as one request. Responses
              from the AI are included in the request count.
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-medium">
              Can I upgrade my plan mid-month?
            </h4>
            <p className="text-muted-foreground text-sm">
              Yes, you can upgrade your plan at any time. Your new credit limit
              will be applied immediately and you'll be charged the prorated
              difference.
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Do unused credits roll over?</h4>
            <p className="text-muted-foreground text-sm">
              No, AI request credits reset at the beginning of each billing
              cycle and do not roll over to the next month.
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-medium">
              Do you offer discounts for non-profits?
            </h4>
            <p className="text-muted-foreground text-sm">
              Yes, we offer special pricing for non-profit organizations. Please
              contact our sales team for details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component wrapped with Elements provider
export default function PricingPage() {
  return (
    <Elements stripe={stripePromise}>
      <Navbar />
      <PricingContent />
    </Elements>
  );
}
