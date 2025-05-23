// Stripe Configuration
// Real Stripe Price IDs from your account

export const STRIPE_PRICE_IDS = {
  STARTER: "price_1RRlDw5RmLx3D9SH2BQiFTKP", // $1.29/month
  PROFESSIONAL: "price_1RRlEF5RmLx3D9SHqHonamX0", // $2.99/month
  ENTERPRISE: "price_1RRlET5RmLx3D9SHeEeJrMEB", // $11.99/month
  TEST_PRODUCT: "price_1RRllZ5RmLx3D9SHTTT1pJxc", // $0.15/month (for testing)
} as const;

export const STRIPE_PRODUCT_IDS = {
  STARTER: "prod_SMUCJvjUO3b10X",
  PROFESSIONAL: "prod_SMUCgGg7VyCXlm",
  ENTERPRISE: "prod_SMUCwCBX9XED4d",
  TEST_PRODUCT: "prod_SMUljCmE8mcxv3",
} as const;

// Credit limits for each plan
export const CREDIT_LIMITS = {
  STARTER: 10000,
  PROFESSIONAL: 50000,
  ENTERPRISE: 1000000, // "Unlimited"
  TEST_PRODUCT: 1000,
} as const;

// Plan information for display
export const PLAN_INFO = {
  STARTER: {
    name: "Starter",
    price: 1.29,
    priceId: STRIPE_PRICE_IDS.STARTER,
    productId: STRIPE_PRODUCT_IDS.STARTER,
    creditLimit: CREDIT_LIMITS.STARTER,
    description: "For small teams exploring AI chatbot capabilities.",
  },
  PROFESSIONAL: {
    name: "Professional",
    price: 2.99,
    priceId: STRIPE_PRICE_IDS.PROFESSIONAL,
    productId: STRIPE_PRODUCT_IDS.PROFESSIONAL,
    creditLimit: CREDIT_LIMITS.PROFESSIONAL,
    description: "Ideal for growing businesses with advanced AI needs.",
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 11.99,
    priceId: STRIPE_PRICE_IDS.ENTERPRISE,
    productId: STRIPE_PRODUCT_IDS.ENTERPRISE,
    creditLimit: CREDIT_LIMITS.ENTERPRISE,
    description:
      "For organizations with complex AI requirements and large teams.",
  },
  TEST_PRODUCT: {
    name: "Test Product",
    price: 0.15,
    priceId: STRIPE_PRICE_IDS.TEST_PRODUCT,
    productId: STRIPE_PRODUCT_IDS.TEST_PRODUCT,
    creditLimit: CREDIT_LIMITS.TEST_PRODUCT,
    description: "Test product for development and testing.",
  },
} as const;

// Helper function to get credit limit by price ID
export function getCreditLimitByPriceId(priceId: string): number {
  switch (priceId) {
    case STRIPE_PRICE_IDS.STARTER:
      return CREDIT_LIMITS.STARTER;
    case STRIPE_PRICE_IDS.PROFESSIONAL:
      return CREDIT_LIMITS.PROFESSIONAL;
    case STRIPE_PRICE_IDS.ENTERPRISE:
      return CREDIT_LIMITS.ENTERPRISE;
    case STRIPE_PRICE_IDS.TEST_PRODUCT:
      return CREDIT_LIMITS.TEST_PRODUCT;
    default:
      return 0;
  }
}
