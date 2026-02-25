import { NextResponse } from 'next/server';
import { getStripe } from '../../../lib/stripe';

export async function POST(request) {
  try {
    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    let plan = 'monthly';
    try {
      const body = await request.json();
      plan = body.plan || 'monthly';
    } catch {}

    if (plan === 'lifetime') {
      // One-time payment for lifetime access ($29)
      const lifetimePriceId = process.env.STRIPE_LIFETIME_PRICE_ID;

      if (!lifetimePriceId) {
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'TextTools Pro - Lifetime Access',
                description: 'One-time payment for unlimited lifetime access to all Pro tools.',
              },
              unit_amount: 2900,
            },
            quantity: 1,
          }],
          payment_intent_data: {
            metadata: { plan: 'lifetime' },
          },
          success_url: `${siteUrl}/?premium=activated`,
          cancel_url: `${siteUrl}/pricing?cancelled=true`,
        });
        return NextResponse.json({ url: session.url });
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{ price: lifetimePriceId, quantity: 1 }],
        payment_intent_data: {
          metadata: { plan: 'lifetime' },
        },
        success_url: `${siteUrl}/?premium=activated`,
        cancel_url: `${siteUrl}/pricing?cancelled=true`,
      });
      return NextResponse.json({ url: session.url });
    }

    // Monthly subscription
    const priceId = process.env.STRIPE_PRICE_ID;
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
      cancel_url: `${siteUrl}/pricing?cancelled=true`,
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
