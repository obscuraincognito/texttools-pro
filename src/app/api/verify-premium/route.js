import { NextResponse } from 'next/server';
import { getStripe } from '../../../lib/stripe';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ active: false });
    }

    const stripe = getStripe();

    // Search for customers by email
    const customers = await stripe.customers.list({
      email: email.toLowerCase(),
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ active: false });
    }

    const customer = customers.data[0];

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      return NextResponse.json({ active: true, type: 'subscription' });
    }

    // Check for lifetime purchase (one-time payment)
    const payments = await stripe.paymentIntents.list({
      customer: customer.id,
      limit: 10,
    });

    const hasLifetime = payments.data.some(
      (p) => p.status === 'succeeded' && p.metadata?.plan === 'lifetime'
    );

    if (hasLifetime) {
      return NextResponse.json({ active: true, type: 'lifetime' });
    }

    return NextResponse.json({ active: false });
  } catch (error) {
    console.error('Verify premium error:', error.message);
    return NextResponse.json({ active: false });
  }
}
