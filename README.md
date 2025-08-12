# SaasFlow - Complete SaaS Application

A complete SaaS application built with React, Supabase, and Stripe integration featuring:

- 🎨 Beautiful landing page with premium design
- 🔐 Secure authentication system
- 💳 Stripe subscription integration
- 📊 Premium dashboard for subscribers
- 🔄 Automatic webhook synchronization

## Features

### 🌟 Landing Page
- Modern gradient design with responsive layout
- Clear call-to-action for subscriptions
- Feature highlights and pricing section
- Professional UI with hover effects

### 🔑 Authentication
- Email/password registration and login
- Protected routes based on subscription status
- Automatic user creation via Stripe webhooks

### 💰 Stripe Integration
- Secure checkout sessions
- Subscription management
- Webhook handling for real-time sync
- Automatic user activation after payment

### 📈 Premium Dashboard
- Analytics and stats overview
- Premium feature access
- Recent activity tracking
- Subscription status display

## Prerequisites

Before starting, you'll need:

1. **Supabase Account**: [Sign up at supabase.com](https://supabase.com)
2. **Stripe Account**: [Sign up at stripe.com](https://stripe.com)
3. **Node.js 18+**: [Download from nodejs.org](https://nodejs.org)

## Setup Guide

### 1. Supabase Setup

#### Create Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details and create

#### Get Credentials
1. Go to **Settings** → **API**
2. Copy your `Project URL` and `anon public` key

#### Setup Database
1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy and paste the content from `supabase/migrations/create_stripe_tables.sql`
4. Click "Run" to execute the migration

#### Setup Edge Functions
1. Go to **Edge Functions** in Supabase
2. Create a new function called `stripe-checkout`
3. Copy the code from `supabase/functions/stripe-checkout/index.ts`
4. Deploy the function
5. Create another function called `stripe-webhook`  
6. Copy the code from `supabase/functions/stripe-webhook/index.ts`
7. Deploy the function

### 2. Stripe Setup

#### Get API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API Keys**
3. Copy your **Publishable key** and **Secret key**

#### Create Product and Price
1. Go to **Products** in Stripe Dashboard
2. Click "Add Product"
3. Create a product (e.g., "Premium Plan")
4. Add a recurring price (e.g., $29/month)
5. Copy the **Price ID** (starts with `price_`)

#### Setup Webhook
1. Go to **Developers** → **Webhooks**
2. Click "Add endpoint"
3. Set endpoint URL to: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook`
   - Replace `YOUR_PROJECT_REF` with your Supabase project reference
4. Select events to send:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)

### 3. Environment Variables

Create a `.env` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration  
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
```

### 4. Update Supabase Edge Function Environment Variables

1. Go to **Edge Functions** in Supabase
2. Click on **stripe-checkout** function
3. Go to **Settings** tab
4. Add environment variables:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
5. Repeat for **stripe-webhook** function:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key  
   - `STRIPE_WEBHOOK_SECRET`: Your webhook signing secret

### 5. Update Price ID in Code

1. Open `src/pages/Landing.tsx`
2. Find the `handleGetStarted` function
3. Replace the `priceId` value with your actual Stripe Price ID:

```typescript
const priceId = 'price_YOUR_ACTUAL_PRICE_ID';
```

### 6. Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 7. Test the Flow

1. **Visit Landing Page**: Navigate to `http://localhost:5173`
2. **Click "Get Started"**: This should redirect to Stripe Checkout
3. **Complete Payment**: Use Stripe test card: `4242 4242 4242 4242`
4. **Check Success**: You should be redirected to the success page
5. **Access Dashboard**: Navigate to `/dashboard` to see premium content

## Deployment

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to [Netlify](https://netlify.com) and deploy the `dist` folder

3. Add environment variables in Netlify:
   - Go to **Site settings** → **Environment variables**
   - Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

4. Update Stripe webhook URL to point to your production domain

## Testing

### Test Cards
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002  
- **Requires Authentication**: 4000 0025 0000 3155

### Test Flow
1. Create account or sign in
2. Click subscribe from landing page
3. Complete Stripe checkout
4. Verify webhook processes correctly
5. Check dashboard access

## Troubleshooting

### Common Issues

1. **Webhook not working**: 
   - Verify webhook URL is correct
   - Check webhook signing secret
   - Ensure edge function has proper environment variables

2. **User not getting activated**:
   - Check Supabase logs in dashboard
   - Verify email matches between Stripe and Supabase
   - Check edge function logs

3. **Dashboard not accessible**:
   - Verify user has active subscription in database
   - Check RLS policies are working
   - Ensure subscription status is 'active'

### Debugging

1. **Check Supabase Logs**: Go to Logs section in Supabase dashboard
2. **Check Stripe Logs**: Go to Developers → Events in Stripe
3. **Browser Console**: Check for JavaScript errors
4. **Network Tab**: Verify API calls are working

## Project Structure

```
src/
├── components/          # Reusable components
├── hooks/              # Custom React hooks  
├── lib/                # Utility libraries
├── pages/              # Page components
└── main.tsx           # App entry point

supabase/
├── functions/          # Edge functions
└── migrations/         # Database migrations
```

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review Supabase and Stripe documentation
3. Check browser console and network logs
4. Contact support at support@saasflow.com

## License

MIT License - feel free to use this project for your own SaaS applications!