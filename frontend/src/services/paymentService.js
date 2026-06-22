import { supabase } from '../supabaseClient';

const FUNCTION_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };
}

export async function getCurrentUsage() {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;
  if (!user) return { count: 0, isPremium: false, remaining: 5 };

  const usageMonth = new Date().toISOString().slice(0, 7) + '-01';

  const [usageRes, subRes] = await Promise.all([
    supabase
      .from('ai_usage')
      .select('count')
      .eq('user_id', user.id)
      .eq('feature', 'ai_total')
      .eq('usage_month', usageMonth)
      .maybeSingle(),
    supabase
      .from('subscriptions')
      .select('is_premium, premium_until')
      .eq('user_id', user.id)
      .maybeSingle(),
  ]);

  const count = usageRes.data?.count || 0;
  const isPremium = subRes.data?.is_premium &&
    (!subRes.data.premium_until || new Date(subRes.data.premium_until) > new Date());

  return {
    count,
    isPremium: !!isPremium,
    remaining: isPremium ? Infinity : Math.max(0, 5 - count),
  };
}

export function startRazorpayCheckout({ userEmail, userName, onSuccess, onFailure }) {
  if (!RAZORPAY_KEY_ID) {
    onFailure('Razorpay not configured.');
    return;
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: 2100, // ₹21 in paise (1 rupee = 100 paise)
    currency: 'INR',
    name: 'CareerPilot AI',
    description: 'Premium Plan — 1 Month Unlimited',
    prefill: {
      email: userEmail || '',
      name: userName || '',
    },
    theme: { color: '#6366f1' },
    handler: async function (response) {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${FUNCTION_BASE}/payment-verify`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id || 'order_test',
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature || 'test_signature',
          }),
        });

        if (res.ok) {
          onSuccess();
        } else {
          const err = await res.json();
          onFailure(err.message || 'Payment verification failed.');
        }
      } catch (e) {
        onFailure('Payment verification failed. Please contact support.');
      }
    },
    modal: {
      ondismiss: function () {
        onFailure('Payment cancelled.');
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}