import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const stripe = new Stripe(stripeSecret);
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!, 
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    console.log(`Processing webhook event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const customerEmail = session.customer_details?.email;

  if (!customerId || !customerEmail) {
    console.error('Missing customer information in checkout session');
    return;
  }

  console.log(`Processing checkout completion for customer: ${customerId}`);

  try {
    // Find or create user based on email
    let userId = null;
    
    // Try to find existing user by email
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    if (!usersError && users) {
      const existingUser = users.users.find(u => u.email === customerEmail);
      if (existingUser) {
        userId = existingUser.id;
      }
    }

    // If no user exists, create one
    if (!userId) {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        email_confirm: true,
        user_metadata: { stripe_customer_id: customerId }
      });

      if (createError) {
        console.error('Error creating user:', createError);
        return;
      }

      userId = newUser.user.id;
      console.log(`Created new user: ${userId} for email: ${customerEmail}`);
    }

    // Create or update customer mapping
    const { error: customerError } = await supabase
      .from('stripe_customers')
      .upsert({
        user_id: userId,
        customer_id: customerId,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'customer_id'
      });

    if (customerError) {
      console.error('Error upserting customer:', customerError);
      return;
    }

    // Handle subscription mode
    if (session.mode === 'subscription' && session.subscription) {
      await syncSubscription(customerId);
    }

    console.log(`Successfully processed checkout for customer: ${customerId}`);

  } catch (error) {
    console.error('Error handling checkout session:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await syncSubscription(subscription.customer as string);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  try {
    const { error } = await supabase
      .from('stripe_subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('customer_id', customerId);

    if (error) {
      console.error('Error updating deleted subscription:', error);
    } else {
      console.log(`Successfully marked subscription as canceled for customer: ${customerId}`);
    }
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

async function syncSubscription(customerId: string) {
  try {
    // Fetch latest subscription data from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    if (subscriptions.data.length === 0) {
      console.log(`No subscriptions found for customer: ${customerId}`);
      return;
    }

    const subscription = subscriptions.data[0];
    
    // Prepare payment method data
    let paymentMethodBrand = null;
    let paymentMethodLast4 = null;
    
    if (subscription.default_payment_method && typeof subscription.default_payment_method !== 'string') {
      const pm = subscription.default_payment_method as Stripe.PaymentMethod;
      paymentMethodBrand = pm.card?.brand || null;
      paymentMethodLast4 = pm.card?.last4 || null;
    }

    // Upsert subscription data
    const { error } = await supabase
      .from('stripe_subscriptions')
      .upsert({
        customer_id: customerId,
        subscription_id: subscription.id,
        price_id: subscription.items.data[0]?.price?.id || null,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        payment_method_brand: paymentMethodBrand,
        payment_method_last4: paymentMethodLast4,
        status: subscription.status as any,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'customer_id'
      });

    if (error) {
      console.error('Error syncing subscription:', error);
    } else {
      console.log(`Successfully synced subscription for customer: ${customerId}`);
    }

  } catch (error) {
    console.error(`Error syncing subscription for customer ${customerId}:`, error);
  }
}