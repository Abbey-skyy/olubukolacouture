# Olubukola Couture — Setup Guide

## Quick Start

### 1. Install dependencies
```bash
cd olubukola-couture
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env.local
```
Then edit `.env.local` and fill in all API keys (see table below).

### 3. Seed the database with sample products
```bash
npm run seed
```
This creates 8 sample products and an admin user.
> **Default admin:** `admin@olubukola-couture.com` / `AdminPassword123!`
> **Change this password immediately after first login.**

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Required API Keys

| Service | Purpose | Where to get it |
|---|---|---|
| `MONGODB_URI` | Database | [MongoDB Atlas](https://cloud.mongodb.com) → Create free cluster |
| `NEXTAUTH_SECRET` | Session signing | Run: `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | GBP payments | [dashboard.stripe.com](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe frontend | Same as above |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhooks | Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` |
| `PAYSTACK_SECRET_KEY` | NGN payments | [dashboard.paystack.com](https://dashboard.paystack.com/#/settings/developer) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack frontend | Same as above |
| `CLOUDINARY_CLOUD_NAME` | Image uploads | [cloudinary.com/console](https://cloudinary.com/console) |
| `CLOUDINARY_API_KEY` | Cloudinary | Same as above |
| `CLOUDINARY_API_SECRET` | Cloudinary | Same as above |
| `RESEND_API_KEY` | Email sending | [resend.com](https://resend.com) → Create API key |
| `EMAIL_FROM` | Sender email | Your verified Resend domain |
| `ANTHROPIC_API_KEY` | Newsletter AI improve | [console.anthropic.com](https://console.anthropic.com) |

---

## Project Structure

```
olubukola-couture/
├── app/                     # Next.js App Router pages & API routes
│   ├── (auth)/              # Auth pages (login, register, verify, forgot-password)
│   ├── shop/                # Shop listing page
│   ├── product/[id]/        # Product detail page
│   ├── cart/                # Cart page (drawer-based)
│   ├── checkout/            # Checkout (Stripe + Paystack)
│   ├── profile/             # User dashboard (orders, wishlist, returns, account)
│   ├── admin/               # Admin panel (products, orders, newsletter)
│   └── api/                 # All API endpoints
├── components/              # React components by feature
├── contexts/                # React contexts (Cart, Currency, CookieConsent)
├── emails/                  # React Email templates
├── lib/                     # Server utilities (DB, auth, email, cloudinary)
├── models/                  # Mongoose models (User, Product, Order, Newsletter)
├── scripts/                 # Database seed script
└── middleware.js            # Auth route protection
```

---

## Key Features by File

| Feature | Files |
|---|---|
| Currency Switcher (GBP/NGN) | `contexts/CurrencyContext.jsx`, `components/ui/CurrencySwitcher.jsx`, `lib/currency.js` |
| Authentication | `lib/auth.js`, `app/(auth)/`, `app/api/auth/` |
| Cookie Consent (GDPR) | `contexts/CookieConsentContext.jsx`, `components/cookie/CookieConsent.jsx` |
| Stripe Payment | `app/api/payment/stripe/route.js`, `app/checkout/page.jsx` |
| Paystack Payment | `app/api/payment/paystack/route.js`, `app/checkout/page.jsx` |
| Newsletter Modal | `components/newsletter/NewsletterModal.jsx`, `app/api/newsletter/subscribe/route.js` |
| Admin Dashboard | `app/admin/`, `components/admin/` |
| Email Templates | `emails/` + `lib/email.js` (Resend) |
| Image Uploads | `lib/cloudinary.js` |
| Cart (persistent) | `contexts/CartContext.jsx`, `app/api/user/cart/route.js` |

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

For MongoDB, use [MongoDB Atlas](https://cloud.mongodb.com) free tier.

---

## Exchange Rate

Currently hardcoded: **1 GBP = 1,800 NGN** (set via `GBP_TO_NGN_RATE` env var).

To use live rates, edit `lib/currency.js` → `getExchangeRate()` and uncomment the ExchangeRate-API fetch.
