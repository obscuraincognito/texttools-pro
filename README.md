# TextTools Pro - Setup & Deployment Guide

A micro-SaaS web app offering free and premium text utilities.
Premium tools are gated behind a $4.99/month Stripe subscription.

---

## Quick Start (Local Development)

1. **Install Node.js** (v18+): https://nodejs.org

2. **Open a terminal in this folder** and install dependencies:
   ```
   npm install
   ```

3. **Copy the example environment file:**
   ```
   cp .env.example .env.local
   ```

4. **Run the dev server:**
   ```
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

---

## Setting Up Stripe (Payment Processing)

This is how you connect your bank account and start earning money.

### Step 1: Create a Stripe Account
1. Go to https://dashboard.stripe.com/register
2. Create an account and verify your identity
3. In the Stripe Dashboard, go to **Settings > Bank accounts** and add your bank account
   - Stripe will deposit payouts directly to your linked bank account
   - Payouts typically arrive in 2 business days

### Step 2: Get Your API Keys
1. In Stripe Dashboard, go to **Developers > API keys**
2. Copy the **Publishable key** (starts with `pk_`)
3. Copy the **Secret key** (starts with `sk_`)
4. Paste them into your `.env.local` file

### Step 3: Create a Subscription Product
1. In Stripe Dashboard, go to **Products > Add Product**
2. Name: "TextTools Pro"
3. Pricing: $4.99/month (recurring)
4. Click **Save**
5. Copy the **Price ID** (starts with `price_`)
6. Paste it into your `.env.local` file as `STRIPE_PRICE_ID`

### Step 4: Set Up Webhooks (for production)
1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Click **Add endpoint**
3. URL: `https://yourdomain.com/api/webhook`
4. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** and add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

---

## Deploying to Production (Vercel - Free Hosting)

Vercel is the easiest way to deploy a Next.js app for free.

### Step 1: Push Code to GitHub
1. Create a GitHub account if you don't have one: https://github.com
2. Create a new repository
3. Push this project to the repository:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click **Import Project** and select your repository
3. Add your environment variables (from `.env.local`) in the Vercel settings
4. Click **Deploy**
5. Your site will be live at `https://your-project.vercel.app`

### Step 3: Connect Custom Domain (Optional)
1. Buy a domain (e.g., from Namecheap, Google Domains, Cloudflare)
2. In Vercel, go to **Settings > Domains** and add your domain
3. Update your DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables

### Step 4: Switch Stripe to Live Mode
1. In Stripe Dashboard, toggle from **Test mode** to **Live mode**
2. Get your live API keys and update them in Vercel environment variables
3. Create a live webhook endpoint pointing to your domain
4. Redeploy on Vercel

---

## How the Money Flows

1. Users visit your site and use free tools
2. They click "Upgrade to Pro" on premium tools
3. Stripe handles the $4.99/month payment securely
4. Stripe deposits the money to your linked bank account (minus ~2.9% + $0.30 per transaction)
5. Payouts happen automatically on a rolling basis

---

## Growing Your Revenue

- **SEO**: The site is built with good SEO practices. Each tool page can rank on Google
  for searches like "free word counter online" or "JSON formatter tool"
- **Content**: Consider adding a blog with helpful articles to drive organic traffic
- **More tools**: Add more premium tools to increase the value proposition
- **Pricing tiers**: Consider a lifetime deal option alongside the monthly subscription
- **Ads**: Add non-intrusive ads on free tool pages for additional revenue (e.g., Google AdSense)

---

## Project Structure

```
src/
  app/
    page.js              - Homepage with tool listings
    layout.js            - Shared layout (header/footer)
    globals.css          - All styles
    tools/
      word-counter/      - Free: word/character counting
      case-converter/    - Free: text case conversion
      lorem-generator/   - Free: placeholder text
      base64-tool/       - Free: Base64 encode/decode
      hash-generator/    - Free: SHA hash generation
      json-formatter/    - Premium: JSON format/validate
      markdown-preview/  - Premium: live markdown editor
      text-diff/         - Premium: text comparison
    api/
      checkout/          - Stripe checkout session creation
      webhook/           - Stripe webhook handler
  components/
    Header.js            - Site header/nav
    Footer.js            - Site footer
    PremiumGate.js       - Premium paywall component
  lib/
    stripe.js            - Stripe SDK initialization
```

---

## Important Notes

- All free tools run entirely in the browser (no server processing needed)
- No user data is collected or stored on the server
- Stripe handles all payment security and PCI compliance
- The webhook handler should be extended with a database for production use
  (to track which users have active subscriptions)
