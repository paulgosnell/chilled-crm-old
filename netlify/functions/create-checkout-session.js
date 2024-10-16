const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { planId, userId } = JSON.parse(event.body);

  try {
    // Fetch the user's email from Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError) throw new Error('Error fetching user data');

    const prices = {
      standard: process.env.STRIPE_STANDARD_PRICE_ID,
      pro: process.env.STRIPE_PRO_PRICE_ID,
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: prices[planId],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.URL}/subscription?success=true`,
      cancel_url: `${process.env.URL}/subscription?canceled=true`,
      customer_email: userData.email,
      client_reference_id: userId,
      metadata: {
        userId,
        planId,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create checkout session' }),
    };
  }
};