<div align="center">

# LaunchKit — Next.js 14 Micro-SaaS Starter

**A production-grade, commercial-ready boilerplate built with Next.js 14 (App Router), Supabase SSR, Stripe Subscriptions, and Tailwind CSS.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-SSR%20Auth%20%26%20RLS-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-17.2%20Subscriptions-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Dark%20System-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Commercial-white?style=flat-square)](#-commercial-license--terms)

[Architecture Overview](#-architecture--key-features) • [Quickstart](#-getting-started) • [Supabase Setup](#-supabase-configuration) • [Stripe Engine](#-stripe-configuration) • [Deployment](#-production-deployment-vercel)

</div>

---

## ⚡ Overview

**LaunchKit** eliminates 40+ hours of boilerplate setup by providing a rock-solid, type-safe foundation for commercial SaaS products. Built with an opinionated dark aesthetic (`#09090b`), floating glassmorphic navigation, automated Stripe webhook synchronization, and Supabase Row Level Security (RLS).

No bloated dependencies. No demo clutter. Pure, hardened architecture ready for production traffic.

---

## 💎 Architecture & Key Features

| Domain | Implementation Details |
| :--- | :--- |
| **Framework** | Next.js 14 App Router, React Server Components (RSC), and Server Actions. |
| **Type Safety** | 100% strict TypeScript. Zero `any` casting, zero lint warnings. |
| **Authentication** | `@supabase/ssr` cookie-based auth. Supports Email/Password and Google OAuth. |
| **Database & Security** | PostgreSQL with automated signup triggers and strict Row Level Security (RLS) on `public.profiles`. |
| **Billing Engine** | Stripe Checkout with customer mapping, billing portal self-management, and idempotent webhook handlers. |
| **Edge Guard** | Next.js Edge Middleware for proactive session token refreshes and instant route protection. |
| **Design System** | Tailored dark theme (`#09090b`), Radix UI primitives, Lucide icons, and refined typography. |

---

## 📁 Repository Structure

```tree
├── app/
│   ├── login/page.tsx           # Email/password & Google OAuth sign-in
│   ├── signup/page.tsx          # Registration with automated profile trigger
│   ├── forgot-password/page.tsx # Password recovery email request
│   ├── reset-password/
│   │   ├── page.tsx             # Password reset session validator
│   │   └── reset-password-form.tsx # New password submission form
│   ├── api/
│   │   ├── auth/callback/       # Supabase OAuth PKCE exchange handler
│   │   ├── user/delete/         # Account deletion API
│   │   └── stripe/
│   │       ├── checkout/        # Stripe Checkout session creator
│   │       ├── portal/          # Customer Billing Portal session creator
│   │       └── webhook/         # Signature-verified Stripe webhook handler
│   ├── dashboard/
│   │   ├── layout.tsx           # Authenticated shell with floating console nav
│   │   └── page.tsx             # Telemetry stat cards & credentials inspector
│   ├── globals.css              # Dark theme CSS tokens & typography defaults
│   ├── layout.tsx               # Root application layout
│   └── page.tsx                 # High-converting landing page
├── components/
│   ├── auth/                    # OAuth buttons and form helpers
│   ├── dashboard/               # Console navigation, billing portal, and checkout trigger
│   ├── landing/                 # Floating navbar, hero, features, pricing, FAQ, footer
│   └── ui/                      # Accessible UI primitives (Radix UI + Tailwind)
├── lib/
│   ├── stripe/                  # Stripe Node SDK instance and plan configurations
│   ├── supabase/                # Browser, server, admin, and middleware client factories
│   └── utils.ts                 # Class merger utility (`cn`)
├── supabase/
│   └── schema.sql               # Production database schema, triggers, and RLS policies
├── middleware.ts                # Edge session refresher and route guard
├── .env.example                 # Environment configuration template
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-org/launchkit.git
cd launchkit
npm install
```

### 2. Configure Environment Variables

Duplicate the `.env.example` file to create your local environment file:

```bash
cp .env.example .env.local
```

Fill in the required credentials outlined in the sections below.

---

## 🗄️ Supabase Configuration

### Step 1: Create Project & Retrieve API Keys
1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to **Project Settings** → **API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` *(Server-only; never expose to the client)*.

### Step 2: Execute Database Migrations
1. Open your Supabase Dashboard → **SQL Editor**.
2. Create a **New Query**.
3. Copy and run the entire contents of [`supabase/schema.sql`](supabase/schema.sql).
4. The migration will establish:
   - The `public.profiles` table linked directly to `auth.users`.
   - The `handle_new_user()` Postgres function and trigger to generate a user profile automatically upon signup.
   - Strict Row Level Security policies permitting users to only view and update their own records.
   - Database indexes on `stripe_customer_id` and `stripe_subscription_id`.

### Step 3: Configure Auth URLs
1. In the Supabase Dashboard, go to **Authentication** → **URL Configuration**.
2. Set **Site URL** to:
   ```text
   http://localhost:3000
   ```
3. Add to **Redirect URLs**:
   ```text
   http://localhost:3000/api/auth/callback
   https://your-production-domain.com/api/auth/callback
   ```

*(Optional)* For Google OAuth: Navigate to **Authentication** → **Providers** → **Google**, enable the provider, and provide your Google Cloud OAuth Client ID and Secret.

---

## 💳 Stripe Configuration

### Step 1: Obtain Stripe API Keys
1. In the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) (Test Mode):
   - Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy **Secret key** → `STRIPE_SECRET_KEY`

### Step 2: Create Subscription Products & Prices
1. In **Product Catalog** → **Add Product**, create your subscription tiers:
   - **Pro**: `$29.00/month` & `$290.00/year`
   - **Ultra**: `$79.00/month` & `$790.00/year`
2. Copy each Price ID (`price_...`) to its respective variable in `.env.local`:
   ```bash
   NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_...
   NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_...
   NEXT_PUBLIC_STRIPE_ULTRA_MONTHLY_PRICE_ID=price_...
   NEXT_PUBLIC_STRIPE_ULTRA_YEARLY_PRICE_ID=price_...
   ```

### Step 3: Enable the Stripe Customer Portal
1. Navigate to **Settings** → **Billing** → **Customer portal**.
2. Click **Activate link**.
3. Enable permissions for customers to cancel subscriptions, update payment methods, and switch plans.

### Step 4: Test Local Webhooks
To handle subscription synchronization locally, use the Stripe CLI:

```bash
# Login to your Stripe account
stripe login

# Forward webhook events to your Next.js route
npm run stripe:listen
```

Copy the printed webhook signing secret (starts with `whsec_...`) and paste it into `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 💻 Running Locally

Start the Next.js development server:

```bash
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser:
- **Landing Page**: [`http://localhost:3000`](http://localhost:3000)
- **Sign In**: [`http://localhost:3000/login`](http://localhost:3000/login)
- **Sign Up**: [`http://localhost:3000/signup`](http://localhost:3000/signup)
- **Protected Console**: [`http://localhost:3000/dashboard`](http://localhost:3000/dashboard)

To verify TypeScript and type integrity across the codebase:

```bash
npx tsc --noEmit
```

---

## 🚢 Production Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Push your repository to GitHub or GitLab.
2. Import the project in [Vercel](https://vercel.com/new).
3. Set the build preset to **Next.js**.

### Step 2: Set Environment Variables
In Vercel's **Project Settings** → **Environment Variables**, add:
- `NEXT_PUBLIC_APP_URL` (`https://your-domain.com`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- All `NEXT_PUBLIC_STRIPE_*_PRICE_ID` variables

### Step 3: Configure Production Webhook
1. In your **Stripe Dashboard** (Live Mode) → **Developers** → **Webhooks**:
2. Click **Add endpoint** with URL:
   ```text
   https://your-domain.com/api/stripe/webhook
   ```
3. Subscribe to the following events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the Signing Secret and set it as `STRIPE_WEBHOOK_SECRET` in your Vercel Production environment.

---

## 📄 Commercial License & Terms

Purchasing or licensing this starter kit grants you a **perpetual, commercial license**:

- **You can:**
  - Build, deploy, and sell unlimited commercial SaaS applications.
  - Use in client projects, freelance work, and internal company tools.
  - Modify, rebrand, and adapt every component without attribution.
- **You cannot:**
  - Redistribute, resell, open-source, or sub-license this boilerplate (or parts of it) as a template, starter kit, or UI library in its raw form.

---

<div align="center">
  <p className="text-zinc-500 text-xs">
    Engineered with precision for ambitious founders.
  </p>
</div>
