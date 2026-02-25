'use client';

import { useState } from 'react';
import Link from 'next/link';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const freeFeatures = [
  'Word Counter & Text Stats',
  'Password Generator',
  'QR Code Generator',
  'UUID Generator',
  'Timestamp Converter',
  'Word Frequency Analyzer',
  'Case Converter',
  'Lorem Ipsum Generator',
  'Find & Replace (with regex)',
  'Base64 Encode/Decode',
  'URL Encoder/Decoder',
  'HTML Entity Encoder',
  'Hash Generator (SHA-1/256/512)',
  'PDF Merge, Split & Text Extract',
  'Image Compress, Resize & Base64',
];

const proFeatures = [
  'JSON Formatter & Validator',
  'Regex Tester (live matching)',
  'Text Diff Comparison',
  'Markdown Preview',
  'SQL Formatter',
  'Color Converter (HEX/RGB/HSL)',
  'JWT Decoder',
  'Cron Expression Generator',
  'JSON ↔ YAML Converter',
  'Code Minifier (JS/CSS/HTML)',
  'API Request Tester',
  'JSON Path Explorer',
  'Placeholder Image Generator',
  'Date & Time Converter',
  '+ All future premium tools',
];

const faqs = [
  {
    q: 'What happens after I pay?',
    a: 'You get instant access to all Pro tools. A confirmation email is sent with your receipt. Use the same email to unlock Pro on any device.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes! Monthly plans can be cancelled at any time from your Stripe billing portal. No questions asked, no hidden fees.',
  },
  {
    q: 'What is the Lifetime deal?',
    a: 'Pay $29 once and unlock every Pro tool forever — including all future tools we add. No recurring charges. Best value for power users.',
  },
  {
    q: 'Is my data safe?',
    a: 'Absolutely. All tools run 100% in your browser. Your text, files, and data never leave your device. We don\'t collect, store, or transmit any of your content.',
  },
  {
    q: 'Do I need an account?',
    a: 'Nope. Just enter your email at checkout. Stripe handles the payment securely. Use that same email to verify your Pro status on any device.',
  },
  {
    q: 'What if I\'m not satisfied?',
    a: 'Email us within 7 days and we\'ll refund you in full. No hassle, no questions.',
  },
];

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const handleCheckout = async (plan) => {
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="pricing-page">
      {/* Hero */}
      <section className="pricing-hero">
        <div className="badge">Simple, Transparent Pricing</div>
        <h1>Unlock All Pro Tools</h1>
        <p>Try every Pro tool 3 times free. When you&apos;re ready, upgrade to unlock unlimited access to the full toolkit.</p>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-cards">
        {/* Free Plan */}
        <div className="pricing-card">
          <div className="pricing-card-header">
            <h3>Free</h3>
            <div className="pricing-price">
              <span className="pricing-amount">$0</span>
              <span className="pricing-period">forever</span>
            </div>
            <p className="pricing-tagline">Perfect for occasional use</p>
          </div>
          <ul className="pricing-features">
            <li><span className="check-icon"><CheckIcon /></span> 15 free tools — unlimited use</li>
            <li><span className="check-icon"><CheckIcon /></span> 3 free tries on each Pro tool</li>
            <li><span className="check-icon"><CheckIcon /></span> 100% browser-based & private</li>
            <li><span className="check-icon"><CheckIcon /></span> No account required</li>
            <li className="feature-disabled"><span className="x-icon"><XIcon /></span> Unlimited Pro tool access</li>
            <li className="feature-disabled"><span className="x-icon"><XIcon /></span> Future premium tools</li>
          </ul>
          <Link href="/" className="btn btn-secondary pricing-btn">
            Browse Free Tools
          </Link>
        </div>

        {/* Monthly Plan */}
        <div className="pricing-card">
          <div className="pricing-card-header">
            <h3>Pro Monthly</h3>
            <div className="pricing-price">
              <span className="pricing-amount">$4.99</span>
              <span className="pricing-period">/month</span>
            </div>
            <p className="pricing-tagline">Cancel anytime, no commitment</p>
          </div>
          <ul className="pricing-features">
            <li><span className="check-icon"><CheckIcon /></span> Everything in Free</li>
            <li><span className="check-icon"><CheckIcon /></span> Unlimited access to all Pro tools</li>
            <li><span className="check-icon"><CheckIcon /></span> New Pro tools as they launch</li>
            <li><span className="check-icon"><CheckIcon /></span> Priority support</li>
            <li><span className="check-icon"><CheckIcon /></span> Cancel anytime</li>
          </ul>
          <button
            onClick={() => handleCheckout('monthly')}
            className="btn btn-primary pricing-btn"
            disabled={loadingPlan === 'monthly'}
          >
            {loadingPlan === 'monthly' ? 'Loading...' : 'Start Pro Monthly'}
          </button>
        </div>

        {/* Lifetime Plan */}
        <div className="pricing-card pricing-card-featured">
          <div className="pricing-popular-badge">
            <StarIcon /> Best Value
          </div>
          <div className="pricing-card-header">
            <h3>Pro Lifetime</h3>
            <div className="pricing-price">
              <span className="pricing-amount">$29</span>
              <span className="pricing-period">one-time</span>
            </div>
            <p className="pricing-tagline">Pay once, own it forever</p>
          </div>
          <ul className="pricing-features">
            <li><span className="check-icon"><CheckIcon /></span> Everything in Pro Monthly</li>
            <li><span className="check-icon"><CheckIcon /></span> One payment, lifetime access</li>
            <li><span className="check-icon"><CheckIcon /></span> All future Pro tools included</li>
            <li><span className="check-icon"><CheckIcon /></span> Priority support forever</li>
            <li><span className="check-icon"><CheckIcon /></span> No recurring charges</li>
          </ul>
          <button
            onClick={() => handleCheckout('lifetime')}
            className="btn btn-primary pricing-btn"
            disabled={loadingPlan === 'lifetime'}
          >
            {loadingPlan === 'lifetime' ? 'Loading...' : 'Get Lifetime Access — $29'}
          </button>
          <p className="pricing-savings">Save $30+ vs monthly in just 6 months</p>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="pricing-comparison">
        <h2>What&apos;s Included</h2>
        <div className="comparison-grid">
          <div className="comparison-col">
            <h3>15 Free Tools</h3>
            <ul>
              {freeFeatures.map((f) => (
                <li key={f}><span className="check-icon"><CheckIcon /></span> {f}</li>
              ))}
            </ul>
          </div>
          <div className="comparison-col comparison-col-pro">
            <h3>15 Pro Tools <span className="pro-badge-sm">PRO</span></h3>
            <ul>
              {proFeatures.map((f) => (
                <li key={f}><span className="check-icon"><CheckIcon /></span> {f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="pricing-trust">
        <div className="trust-items">
          <div className="trust-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <div>
              <strong>Secure Payments</strong>
              <p>Powered by Stripe. We never see your card details.</p>
            </div>
          </div>
          <div className="trust-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <div>
              <strong>100% Private</strong>
              <p>All tools run in your browser. Zero data collection.</p>
            </div>
          </div>
          <div className="trust-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div>
              <strong>7-Day Refund</strong>
              <p>Not happy? Full refund within 7 days, no questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item ${openFaq === i ? 'faq-open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{faq.q}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="faq-chevron"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="pricing-final-cta">
        <h2>Ready to unlock every tool?</h2>
        <p>Join developers and writers who save hours each week with TextTools Pro.</p>
        <button
          onClick={() => handleCheckout('lifetime')}
          className="btn btn-primary btn-lg"
          disabled={loadingPlan === 'lifetime'}
        >
          {loadingPlan === 'lifetime' ? 'Loading...' : 'Get Lifetime Access — $29'}
        </button>
        <p className="pricing-guarantee">7-day money-back guarantee · Secure checkout via Stripe</p>
      </section>
    </div>
  );
}
