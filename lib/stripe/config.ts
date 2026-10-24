export interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyPriceId: string;
  yearlyPriceId: string;
  popular?: boolean;
  features: string[];
  cta: string;
}

const getEnvPriceId = (key: string): string => {
  const val = process.env[key];
  if (!val && process.env.NODE_ENV === "development") {
    console.warn(
      `[Stripe Config] Warning: ${key} is missing from environment variables. Stripe checkout will not work until this is set.`
    );
  }
  return (val || "").trim();
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Targeted environment for prototype exploration and local MVP validation.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyPriceId: "",
    yearlyPriceId: "",
    popular: false,
    features: [
      "1 Active Workspace",
      "Up to 1,000 monthly telemetry calls",
      "Standard Supabase Database",
      "Email & Password Authentication",
      "Community Support via GitHub",
    ],
    cta: "Get Started Free",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Production infrastructure with automated billing workflows and customer self-service.",
    monthlyPrice: 29,
    yearlyPrice: 290,
    monthlyPriceId: getEnvPriceId("NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID"),
    yearlyPriceId: getEnvPriceId("NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID"),
    popular: true,
    features: [
      "Unlimited Production Workspaces",
      "Up to 50,000 active telemetry calls",
      "Stripe Customer Billing Portal",
      "Automated Webhook Sync & Telemetry",
      "Priority Email & Discord Support",
      "Custom Domain & SSL Provisioning",
      "Automated Database Backups",
    ],
    cta: "Upgrade to Pro",
  },
  {
    id: "ultra",
    name: "Ultra",
    description: "High-volume throughput, custom SLA terms, and multi-tenant scaling.",
    monthlyPrice: 79,
    yearlyPrice: 790,
    monthlyPriceId: getEnvPriceId("NEXT_PUBLIC_STRIPE_ULTRA_MONTHLY_PRICE_ID") || getEnvPriceId("NEXT_PUBLIC_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID"),
    yearlyPriceId: getEnvPriceId("NEXT_PUBLIC_STRIPE_ULTRA_YEARLY_PRICE_ID") || getEnvPriceId("NEXT_PUBLIC_STRIPE_ENTERPRISE_YEARLY_PRICE_ID"),
    popular: false,
    features: [
      "Everything in Pro included",
      "Unlimited active telemetry calls",
      "Dedicated Slack channel & 99.9% SLA",
      "Multi-tenant Team Seats & Roles",
      "Custom Commercial Contracts",
      "1-on-1 Architecture & Security Review",
    ],
    cta: "Get Ultra",
  },
];
