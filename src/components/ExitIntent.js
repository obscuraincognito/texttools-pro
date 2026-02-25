'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ExitIntent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem('tt_exit_shown')) return;

    // Check if already premium
    if (localStorage.getItem('tt_premium')) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 5 && !sessionStorage.getItem('tt_exit_shown')) {
        setShow(true);
        sessionStorage.setItem('tt_exit_shown', '1');
      }
    };

    // Delay attaching the listener so it doesn't fire immediately
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 10000); // Wait 10 seconds before enabling

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="exit-overlay" onClick={() => setShow(false)}>
      <div className="exit-popup" onClick={(e) => e.stopPropagation()}>
        <button className="exit-close" onClick={() => setShow(false)}>✕</button>
        <div className="exit-content">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚡</div>
          <h2>Wait — Don&apos;t Leave Empty-Handed!</h2>
          <p>Get <strong>lifetime access</strong> to all 15 Pro tools for just <strong>$29</strong> — that&apos;s less than $2 per tool.</p>
          <ul className="exit-features">
            <li>✓ All premium tools, forever</li>
            <li>✓ Every future tool we add</li>
            <li>✓ 7-day money-back guarantee</li>
          </ul>
          <Link href="/pricing" className="btn btn-primary exit-cta" onClick={() => setShow(false)}>
            View Pricing →
          </Link>
          <button className="exit-dismiss" onClick={() => setShow(false)}>
            No thanks, I&apos;ll keep using free tools
          </button>
        </div>
      </div>
    </div>
  );
}
