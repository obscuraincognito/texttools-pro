import { NextResponse } from 'next/server';
import { getStripe } from '../../../lib/stripe';

export async function POST() {
  try {
    const stripe = getStripe();
    const priceId = process.env.STRIPE_PRICE_ID;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured.' },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/?premium=activated`,
      cancel_url: `${siteUrl}/?premium=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error.message);
    return NextResponse.json(
      { error: 'Failed to create checkout session.' },
      { status: 500 }
    );
  }
}
