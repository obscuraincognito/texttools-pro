import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="logo">
            TextTools<span>Pro</span>
          </Link>
          <p>Fast, free, and private text utilities. All tools run entirely in your browser. No data is ever collected or stored.</p>
        </div>

        <div className="footer-col">
          <h4>Free Tools</h4>
          <ul>
            <li><Link href="/tools/word-counter">Word Counter</Link></li>
            <li><Link href="/tools/pdf-merge">PDF Merge</Link></li>
            <li><Link href="/tools/image-compress">Image Compress</Link></li>
            <li><Link href="/tools/password-generator">Password Generator</Link></li>
            <li><Link href="/tools/qr-generator">QR Code Generator</Link></li>
            <li><Link href="/tools/image-resize">Image Resize</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Pro Tools</h4>
          <ul>
            <li><Link href="/tools/json-formatter">JSON Formatter</Link></li>
            <li><Link href="/tools/api-tester">API Tester</Link></li>
            <li><Link href="/tools/jwt-decoder">JWT Decoder</Link></li>
            <li><Link href="/tools/json-path">JSON Path</Link></li>
            <li><Link href="/tools/date-converter">Date Converter</Link></li>
            <li><Link href="/tools/color-converter">Color Converter</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><Link href="/">All Tools</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/pricing">Get Pro</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 TextTools Pro. All rights reserved.</p>
        <div className="footer-badges">
          <span className="footer-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Secure
          </span>
          <span className="footer-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Private
          </span>
          <span className="footer-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Browser-Based
          </span>
        </div>
      </div>
    </footer>
  );
}
