import { supabase } from './supabase';

export const createCheckoutSession = async (
  priceId: string,
  mode: 'payment' | 'subscription' = 'subscription',
  userEmail?: string
) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session?.access_token ? `Bearer ${session.access_token}` : '',
      },
      body: JSON.stringify({
        price_id: priceId,
        mode,
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/`,
        customer_email: userEmail,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create checkout session');
  }

  const { url } = await response.json();
  return { url };
};