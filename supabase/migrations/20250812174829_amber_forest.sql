/*
  # Complete Stripe Integration Schema

  1. New Tables
    - `stripe_customers`: Links Supabase users to Stripe customers
    - `stripe_subscriptions`: Manages subscription data
    - `stripe_orders`: Stores order/purchase information

  2. Views
    - `stripe_user_subscriptions`: Secure view for user subscription data
    - `stripe_user_orders`: Secure view for user order history

  3. Security
    - Enables Row Level Security (RLS) on all tables
    - Implements policies for authenticated users to view their own data
*/

-- Custom enum types
CREATE TYPE stripe_subscription_status AS ENUM (
    'not_started',
    'incomplete',
    'incomplete_expired',
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid',
    'paused'
);

CREATE TYPE stripe_order_status AS ENUM (
    'pending',
    'completed',
    'canceled'
);

-- Stripe Customers table
CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null unique,
  customer_id text not null unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own customer data"
    ON stripe_customers
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Stripe Subscriptions table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id bigint primary key generated always as identity,
  customer_id text unique not null,
  subscription_id text default null,
  price_id text default null,
  current_period_start bigint default null,
  current_period_end bigint default null,
  cancel_at_period_end boolean default false,
  payment_method_brand text default null,
  payment_method_last4 text default null,
  status stripe_subscription_status not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription data"
    ON stripe_subscriptions
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id
            FROM stripe_customers
            WHERE user_id = auth.uid() AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

-- Stripe Orders table
CREATE TABLE IF NOT EXISTS stripe_orders (
    id bigint primary key generated always as identity,
    checkout_session_id text not null,
    payment_intent_id text not null,
    customer_id text not null,
    amount_subtotal bigint not null,
    amount_total bigint not null,
    currency text not null,
    payment_status text not null,
    status stripe_order_status not null default 'pending',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order data"
    ON stripe_orders
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id
            FROM stripe_customers
            WHERE user_id = auth.uid() AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

-- Create secure views
CREATE OR REPLACE VIEW stripe_user_subscriptions AS
SELECT 
    s.*,
    c.user_id,
    s.status as subscription_status
FROM stripe_subscriptions s
JOIN stripe_customers c ON s.customer_id = c.customer_id
WHERE c.user_id = auth.uid() 
  AND c.deleted_at IS NULL 
  AND s.deleted_at IS NULL;

CREATE OR REPLACE VIEW stripe_user_orders AS
SELECT 
    o.*,
    c.user_id
FROM stripe_orders o
JOIN stripe_customers c ON o.customer_id = c.customer_id
WHERE c.user_id = auth.uid() 
  AND c.deleted_at IS NULL 
  AND o.deleted_at IS NULL;