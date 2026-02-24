'use client';

import { useState } from 'react';

export default function PremiumGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check localStorage for premium status on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const status = localStorage.getItem('texttools_premium');
      if (status === 'active') {
        setUnlocked(true);
      }
    }
  });

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Could not start checkout. Make sure Stripe is configured.');
      }
    } catch {
      alert('Could not connect to payment server. Check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="premium-gate">
      <h3>Unlock Premium Tools</h3>
      <p>Get unlimited access to all premium tools with a simple subscription.</p>
      <div className="price">$4.99</div>
      <div className="price-period">per month</div>
      <button className="btn btn-accent" onClick={handleCheckout} disabled={loading}>
        {loading ? 'Loading...' : 'Upgrade to Pro'}
      </button>
      <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#92400e' }}>
        Secure payment via Stripe. Cancel anytime.
      </p>
    </div>
  );
}
