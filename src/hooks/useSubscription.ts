import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface Subscription {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.log("useSubscription: No user found, setting subscription to null and loading to false.");
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      setLoading(true); // Ensure loading is true during fetch
      try {
        console.log("useSubscription: Attempting to fetch subscription for user ID:", user.id);
        const { data, error } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .maybeSingle();

        if (error) {
          console.error('useSubscription: Error fetching subscription data from Supabase:', error);
        } else {
          console.log('useSubscription: Raw data fetched from Supabase:', data);
        }

        setSubscription(data || null);
      } catch (error) {
        console.error('useSubscription: Unexpected error during subscription fetch:', error);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const isActive = subscription?.subscription_status === 'active' && 
    subscription.current_period_end && 
    new Date(subscription.current_period_end * 1000) > new Date();

  console.log('useSubscription: Current subscription object state:', subscription);
  console.log('useSubscription: Calculated isActive status:', isActive);

  const currentProduct = subscription?.price_id ? { name: 'Premium Plan', priceId: subscription.price_id } : null;

  return { subscription, loading, isActive, currentProduct };
};