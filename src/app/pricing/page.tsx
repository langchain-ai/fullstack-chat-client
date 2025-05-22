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
import { Switch } from "@/components/ui/switch";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const tiers = [
    {
      name: "Starter",
      price: isAnnual ? 29 : 39,
      description:
        "Great for individuals exploring AI chat, personal productivity, and light research.",
      features: [
        "Up to 1,000 messages/month",
        "Access to standard AI model",
        "Basic conversation history",
        "Personal workspace",
        "Community support (24h response)",
      ],
      cta: "Start for free",
      ctaDescription: "No credit card required",
      popular: false,
    },
    {
      name: "Professional",
      price: isAnnual ? 79 : 99,
      description: "For power users and teams needing advanced AI and integrations.",
      features: [
        "Up to 10,000 messages/month",
        "Access to advanced AI models",
        "Team workspaces & sharing",
        "Conversation export & API access",
        "Priority support (12h)",
        "Integrations (Slack, Zapier, etc.)",
        "Custom AI personas",
      ],
      cta: "Start 14-day trial",
      ctaDescription: "No credit card required",
      popular: true,
    },
    {
      name: "Enterprise",
      price: isAnnual ? 299 : 349,
      description:
        "For organizations with high-volume needs, custom security, and dedicated support.",
      features: [
        "Unlimited messages",
        "Dedicated AI model instances",
        "Advanced admin controls",
        "Custom integrations",
        "Dedicated support (4h)",
        "SSO & compliance",
        "Audit logs & analytics",
        "SLA guarantees",
        "Onboarding & training",
      ],
      cta: "Contact sales",
      ctaDescription: "Get a custom quote",
      popular: false,
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-24">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Simple, transparent AI chat pricing
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          Choose the perfect plan for your AI chat experience.
        </p>

        <div className="mt-8 flex items-center justify-center space-x-2">
          <span
            className={`text-sm ${!isAnnual ? "font-medium" : "text-muted-foreground"}`}
          >
            Monthly
          </span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="data-[state=checked]:bg-primary"
          />
          <span
            className={`text-sm ${isAnnual ? "font-medium" : "text-muted-foreground"}`}
          >
            Annual{" "}
            <Badge
              variant="outline"
              className="ml-1.5 border-green-200 bg-green-50 font-normal text-green-700"
            >
              Save 20%
            </Badge>
          </span>
        </div>
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
              {isAnnual && (
                <p className="text-muted-foreground mt-1 text-sm">
                  Billed annually (${tier.price * 12}/year)
                </p>
              )}
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
              >
                {tier.cta}
              </Button>
              <p className="text-muted-foreground mt-3 text-center text-xs">
                {tier.ctaDescription}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20 text-center">
        <h2 className="mb-4 text-2xl font-bold">Need something different?</h2>
        <p className="text-muted-foreground mx-auto mb-6 max-w-2xl">
          Contact our team for custom AI chat solutions, higher message limits, or enterprise integrations tailored to your needs.
        </p>
        <Button
          variant="outline"
          size="lg"
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
            <h4 className="mb-2 font-medium">Can I change my plan later?</h4>
            <p className="text-muted-foreground text-sm">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and your message limits will adjust accordingly.
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-medium">
              What happens after my trial ends?
            </h4>
            <p className="text-muted-foreground text-sm">
              You will remain on your selected plan. Your chat history and settings will always be preserved.
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Do you offer refunds?</h4>
            <p className="text-muted-foreground text-sm">
              Yes, we offer a 30-day money-back guarantee for all plans if you're not satisfied with your AI chat experience.
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-medium">
              Do you offer discounts for non-profits or education?
            </h4>
            <p className="text-muted-foreground text-sm">
              Yes, we offer special pricing for non-profit organizations and educational institutions. Please contact our team for details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
