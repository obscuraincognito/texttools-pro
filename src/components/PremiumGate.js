'use client';

import { useState } from 'react';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

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
      <h3>Unlock All Premium Tools</h3>
      <p>Get unlimited access to 7 powerful developer tools with a simple subscription.</p>
      <div className="price">$4.99</div>
      <div className="price-period">per month</div>

      <ul className="premium-features">
        <li><CheckIcon /> All 7 Pro tools included</li>
        <li><CheckIcon /> JSON, SQL, Regex, CSV & more</li>
        <li><CheckIcon /> Cancel anytime, no lock-in</li>
        <li><CheckIcon /> Future tools included free</li>
      </ul>

      <button className="btn btn-accent" onClick={handleCheckout} disabled={loading}>
        {loading ? 'Loading...' : 'Upgrade to Pro'}
      </button>

      <div className="premium-trust">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Secure checkout via Stripe
        </span>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Cancel anytime
        </span>
      </div>
    </div>
  );
}
