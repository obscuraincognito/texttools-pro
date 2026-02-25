'use client';

import { useState } from 'react';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setStatus('loading');

    try {
      // Store email in localStorage as a backup / demo
      // In production, replace this with your email service API call
      // (e.g., Mailchimp, ConvertKit, Buttondown, or your own API endpoint)
      const stored = JSON.parse(localStorage.getItem('tt_subscribers') || '[]');
      if (!stored.includes(email.trim().toLowerCase())) {
        stored.push(email.trim().toLowerCase());
        localStorage.setItem('tt_subscribers', JSON.stringify(stored));
      }

      // TODO: Replace with real API call, e.g.:
      // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });

      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="email-capture">
        <div className="email-capture-inner">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>&#10003;</div>
            <h3>You&apos;re on the list!</h3>
            <p>We&apos;ll send you updates about new tools and features. No spam, ever.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="email-capture">
      <div className="email-capture-inner">
        <div className="email-capture-text">
          <h3>Get notified about new tools</h3>
          <p>Join our newsletter for new tool releases, tips, and exclusive Pro offers. No spam.</p>
        </div>
        <form onSubmit={handleSubmit} className="email-capture-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="email-capture-input"
          />
          <button
            type="submit"
            className="btn btn-primary email-capture-btn"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Joining...' : 'Subscribe'}
          </button>
        </form>
        {status === 'error' && (
          <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>Something went wrong. Please try again.</p>
        )}
      </div>
    </div>
  );
}
