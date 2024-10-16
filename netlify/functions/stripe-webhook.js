const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const { userId, planId } = session.metadata;

    // Update user's subscription in Supabase
    const { error } = await supabase
      .from('users')
      .update({ subscriptionPlan: planId })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user subscription:', error);
      return { statusCode: 500, body: 'Error updating user subscription' };
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};