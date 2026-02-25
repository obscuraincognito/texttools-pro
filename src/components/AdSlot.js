'use client';

import { useEffect, useRef } from 'react';

/**
 * Google AdSense-ready ad slot component.
 *
 * To activate:
 * 1. Sign up for Google AdSense at https://www.google.com/adsense/
 * 2. Get your publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
 * 3. Add the AdSense script to layout.js:
 *    <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous" />
 * 4. Create ad units in your AdSense dashboard and replace the data-ad-slot values below.
 *
 * Until AdSense is configured, this shows a placeholder.
 */
export default function AdSlot({ format = 'horizontal', className = '' }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Only push ads if AdSense is loaded
    if (typeof window !== 'undefined' && window.adsbygoogle && !pushed.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {}
    }
  }, []);

  const styles = {
    horizontal: {
      minHeight: '90px',
      width: '100%',
    },
    rectangle: {
      minHeight: '250px',
      width: '100%',
      maxWidth: '336px',
    },
    vertical: {
      minHeight: '600px',
      width: '100%',
      maxWidth: '160px',
    },
  };

  const isAdSenseLoaded = typeof window !== 'undefined' && window.adsbygoogle;

  return (
    <div className={`ad-slot ${className}`} style={{ margin: '1.5rem 0', textAlign: 'center' }}>
      {isAdSenseLoaded ? (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', ...styles[format] }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"  /* Replace with your AdSense publisher ID */
          data-ad-slot="XXXXXXXXXX"                  /* Replace with your ad unit slot ID */
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        /* Placeholder shown when AdSense is not yet configured */
        <div style={{
          ...styles[format],
          background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))',
          borderRadius: 'var(--radius)',
          border: '1px dashed var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-light)',
          fontSize: '0.8rem',
          margin: '0 auto',
        }}>
          <span>Ad Space — Configure AdSense to activate</span>
        </div>
      )}
    </div>
  );
}
