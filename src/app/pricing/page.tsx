"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const tiers = [
    {
      name: "Starter",
      price: isAnnual ? 29 : 39,
      description: "Perfect for individuals and small teams just getting started.",
      features: [
        "Up to 3 team members",
        "5 projects",
        "10GB storage",
        "Basic analytics",
        "24-hour support response time",
      ],
      cta: "Start for free",
      ctaDescription: "No credit card required",
      popular: false,
    },
    {
      name: "Professional",
      price: isAnnual ? 79 : 99,
      description: "Ideal for growing teams with advanced needs.",
      features: [
        "Up to 10 team members",
        "Unlimited projects",
        "50GB storage",
        "Advanced analytics",
        "Priority support (12 hours)",
        "Custom domains",
        "API access",
      ],
      cta: "Start 14-day trial",
      ctaDescription: "No credit card required",
      popular: true,
    },
    {
      name: "Enterprise",
      price: isAnnual ? 299 : 349,
      description: "For organizations with complex requirements and large teams.",
      features: [
        "Unlimited team members",
        "Unlimited projects",
        "Unlimited storage",
        "Custom analytics",
        "Dedicated support (4 hours)",
        "Custom domains",
        "Advanced API access",
        "SSO authentication",
        "Audit logs",
        "SLA guarantees",
      ],
      cta: "Contact sales",
      ctaDescription: "Get a custom quote",
      popular: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your team. All plans include a 14-day trial period.
        </p>

        <div className="flex items-center justify-center mt-8 space-x-2">
          <span className={`text-sm ${!isAnnual ? "font-medium" : "text-muted-foreground"}`}>Monthly</span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} className="data-[state=checked]:bg-primary" />
          <span className={`text-sm ${isAnnual ? "font-medium" : "text-muted-foreground"}`}>
            Annual{" "}
            <Badge variant="outline" className="ml-1.5 font-normal bg-green-50 text-green-700 border-green-200">
              Save 20%
            </Badge>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`flex flex-col ${tier.popular ? "border-primary shadow-lg relative" : "border-border"}`}
          >
            {tier.popular && (
              <Badge className="absolute -top-2.5 right-6 bg-primary hover:bg-primary">Most Popular</Badge>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <CardDescription className="min-h-[50px]">{tier.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              {isAnnual && (
                <p className="text-sm text-muted-foreground mt-1">Billed annually (${tier.price * 12}/year)</p>
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch pt-6">
              <Button variant={tier.popular ? "default" : "outline"} className="w-full" size="lg">
                {tier.cta}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">{tier.ctaDescription}</p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Need something different?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Contact our sales team for custom pricing options tailored to your specific requirements.
        </p>
        <Button variant="outline" size="lg">
          Contact Sales
        </Button>
      </div>

      <div className="mt-24 border-t pt-12">
        <h3 className="text-xl font-semibold mb-6 text-center">Frequently Asked Questions</h3>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h4 className="font-medium mb-2">Can I change my plan later?</h4>
            <p className="text-muted-foreground text-sm">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">What happens after my trial ends?</h4>
            <p className="text-muted-foreground text-sm">
              After your 14-day trial, you'll be automatically switched to your selected plan unless you cancel.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Do you offer refunds?</h4>
            <p className="text-muted-foreground text-sm">
              Yes, we offer a 30-day money-back guarantee for all plans if you're not satisfied.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Do you offer discounts for non-profits?</h4>
            <p className="text-muted-foreground text-sm">
              Yes, we offer special pricing for non-profit organizations. Please contact our sales team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
