import { NextResponse } from 'next/server';
import { getStripe } from '../../../lib/stripe';

export async function POST(request) {
  const stripe = getStripe();
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured.');
    return NextResponse.json({ error: 'Webhook secret not set.' }, { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('New subscription:', session.subscription);
      // In production, save the customer/subscription to a database
      // and verify subscription status on each premium page load.
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      console.log('Subscription cancelled:', subscription.id);
      // Mark the user as no longer premium in your database.
      break;
    }
    default:
      console.log('Unhandled event type:', event.type);
  }

  return NextResponse.json({ received: true });
}
