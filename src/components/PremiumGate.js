'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const FREE_TRIES = 3;

function getTriesUsed(toolName) {
  if (typeof window === 'undefined') return 0;
  try {
    const data = JSON.parse(sessionStorage.getItem('tt_tool_usage') || '{}');
    return data[toolName] || 0;
  } catch {
    return 0;
  }
}

function incrementTries(toolName) {
  if (typeof window === 'undefined') return;
  try {
    const data = JSON.parse(sessionStorage.getItem('tt_tool_usage') || '{}');
    data[toolName] = (data[toolName] || 0) + 1;
    sessionStorage.setItem('tt_tool_usage', JSON.stringify(data));
  } catch {}
}

export default function PremiumGate({ children, toolName = 'this tool' }) {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [triesLeft, setTriesLeft] = useState(FREE_TRIES);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const checkPremium = async () => {
      // Check localStorage (fast)
      if (typeof window !== 'undefined') {
        const status = localStorage.getItem('texttools_premium');
        if (status === 'active') {
          setUnlocked(true);
          setChecking(false);
          return;
        }
      }

      // Check URL params (redirect from Stripe checkout)
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('premium') === 'activated') {
          localStorage.setItem('texttools_premium', 'active');
          setUnlocked(true);
          setChecking(false);
          window.history.replaceState({}, '', window.location.pathname);
          return;
        }
      }

      // Check server-side Stripe verification
      try {
        const email = typeof window !== 'undefined' ? localStorage.getItem('texttools_email') : null;
        if (email) {
          const res = await fetch(`/api/verify-premium?email=${encodeURIComponent(email)}`);
          const data = await res.json();
          if (data.active) {
            localStorage.setItem('texttools_premium', 'active');
            setUnlocked(true);
            setChecking(false);
            return;
          }
        }
      } catch {}

      // Not premium — check free tries
      const used = getTriesUsed(toolName);
      const remaining = Math.max(0, FREE_TRIES - used);
      setTriesLeft(remaining);

      if (remaining > 0) {
        incrementTries(toolName);
        setTriesLeft(remaining - 1);
        setUnlocked(true);
      } else {
        setShowPaywall(true);
      }

      setChecking(false);
    };

    checkPremium();
  }, [toolName]);

  const handleCheckout = async (plan = 'monthly') => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
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

  if (checking) {
    return (
      <div className="tool-page" style={{ textAlign: 'center', padding: '3rem 0' }}>
        <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Loading tool...</div>
      </div>
    );
  }

  if (unlocked && !showPaywall) {
    const isPremiumUser = typeof window !== 'undefined' && localStorage.getItem('texttools_premium') === 'active';
    return (
      <>
        {!isPremiumUser && triesLeft >= 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #1e293b, #312e81)',
            color: 'white',
            padding: '0.625rem 1rem',
            borderRadius: 'var(--radius, 12px)',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            <span>
              Free trial: <strong>{triesLeft} {triesLeft === 1 ? 'use' : 'uses'} remaining</strong> for {toolName}
            </span>
            <Link href="/pricing" style={{ color: '#a5b4fc', fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}>
              Upgrade to Pro &rarr;
            </Link>
          </div>
        )}
        {children}
      </>
    );
  }

  return (
    <div className="premium-gate">
      <h3>Unlock {toolName} & All Pro Tools</h3>
      <p>Get unlimited access to 15 powerful developer tools. Try any tool 3 times free.</p>

      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', position: 'relative' }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 'var(--radius, 12px)',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
          minWidth: '160px',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>$4.99</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>per month</div>
          <button className="btn btn-accent" onClick={() => handleCheckout('monthly')} disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Loading...' : 'Subscribe'}
          </button>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: '2px solid #a5b4fc',
          borderRadius: 'var(--radius, 12px)',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
          minWidth: '160px',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white',
            fontSize: '0.65rem', fontWeight: 700, padding: '2px 10px', borderRadius: '20px',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>Best Value</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>$29</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>one time, forever</div>
          <button className="btn btn-accent" onClick={() => handleCheckout('lifetime')} disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Loading...' : 'Get Lifetime'}
          </button>
        </div>
      </div>

      <ul className="premium-features">
        <li><CheckIcon /> All 15 Pro tools included</li>
        <li><CheckIcon /> JSON, SQL, Regex, JWT, Cron & more</li>
        <li><CheckIcon /> Cancel anytime, no lock-in</li>
        <li><CheckIcon /> All future tools included free</li>
      </ul>

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
