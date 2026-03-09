# 🚀 Synthetix AI SaaS Starter Kit 🚀

Welcome to the ultimate production-ready Next.js and Node.js starter kit! You just saved yourself **40+ hours** of tedious infrastructure setup.

This codebase is specifically engineered for indie hackers and developers who want to launch an AI SaaS this weekend. We've handled the Authentication, the Stripe Subscriptions, and the OpenAI streaming—so you can focus purely on your product's core value.

---

## ⚡️ 5-Minute Quick Start Guide

Follow these steps exactly to get your SaaS running locally in under 5 minutes.

### Step 1: Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v20+)
*   [Docker Desktop](https://www.docker.com/) (Must be running for the database)
*   A Stripe Account (Get your Test API Keys)
*   An OpenAI Account (Get your API Key)

### Step 2: Interactive Environment Setup
We built an interactive wizard to automatically scaffold your `.env` files across the Frontend, Backend, and Database.

In the root directory, run:
```bash
npm run setup
```
*(When prompted, paste your Stripe and OpenAI keys. You can just press Enter for the database URL to use the default local Docker Postgres).*

### Step 3: Start the Database
Spin up the local PostgreSQL instance using Docker:
```bash
docker-compose up -d
```

### Step 4: Install & Seed
Install all dependencies across the entire workspace, and seed the database with the schema and a demo admin user:
```bash
npm run install:all
npm run db:push
npm run db:seed
```

### Step 5: Boot Up 🔥
Start both the Next.js Frontend and the Express Backend simultaneously with one command:
```bash
npm run dev:all
```

**Verify Installation:**
Go to [http://localhost:3000](http://localhost:3000) in your browser. 
Log in using:
*   **Email:** `admin@example.com`
*   **Password:** `password123`

---

## 🛠 What's Included? (Tech Stack)
*   **Frontend**: Next.js 14 (App Router), React, TailwindCSS v4, Shadcn UI components.
*   **Backend**: Node.js, Express, TypeScript, JWT Auth.
*   **Database**: PostgreSQL, Prisma ORM.
*   **Payments**: Full Stripe Checkout and Customer Portal integration.
*   **AI**: OpenAI SDK Integration with per-user token usage tracking and tier limits.

---

## 💳 Testing Stripe Webhooks Locally
To test subscriptions overriding token limits, you need to forward Stripe webhooks to your local backend.

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Log in to Stripe CLI: `stripe login`
3. Forward events to your backend:
   ```bash
   stripe listen --forward-to localhost:4000/api/v1/billing/webhook
   ```
4. Copy the webhook secret (`whsec_...`) the CLI gives you and update `STRIPE_WEBHOOK_SECRET` in your `backend/.env` file.

---

## 📝 License
**Standard License**: You are licensed to use this code to build SaaS applications or products for your end-users. You may NOT resell, redistribute, or share the source code, template, or GitHub repository itself.

*Built for velocity. Stop writing boilerplate.*
