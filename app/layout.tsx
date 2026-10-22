import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LaunchKit — Production Next.js 14 Micro-SaaS Starter Kit",
  description:
    "Production-ready Next.js 14 App Router boilerplate engineered with Supabase SSR, PostgreSQL Row Level Security, idempotent Stripe Subscriptions, and modern TypeScript architecture.",
  keywords: [
    "Next.js 14 Starter Kit",
    "Micro-SaaS Boilerplate",
    "Supabase SSR Authentication",
    "Stripe Subscriptions",
    "PostgreSQL Row Level Security",
    "Tailwind CSS",
    "Shadcn UI",
    "TypeScript SaaS Boilerplate",
    "Autonomous SaaS Architecture",
  ],
  authors: [{ name: "LaunchKit" }],
  creator: "LaunchKit",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "LaunchKit — Production Next.js 14 Micro-SaaS Starter Kit",
    description:
      "Production-ready Next.js 14 App Router boilerplate engineered with Supabase SSR, PostgreSQL Row Level Security, and idempotent Stripe Subscriptions.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchKit — Production Next.js 14 Micro-SaaS Starter Kit",
    description:
      "Production-ready Next.js 14 App Router boilerplate engineered with Supabase SSR, PostgreSQL Row Level Security, and idempotent Stripe Subscriptions.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary`}>
        {children}
      </body>
    </html>
  );
}
