import Link from 'next/link';
import Script from 'next/script';
import EmailCapture from '../components/EmailCapture';
import AdSlot from '../components/AdSlot';

/* ==================== STRUCTURED DATA FOR GOOGLE ==================== */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'TextTools Pro',
  url: 'https://texttools-pro.vercel.app',
  description: 'A collection of 34 fast, privacy-friendly text, PDF, and image utilities that run entirely in your browser.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: '19 free tools available with no sign-up, 15 premium tools',
  },
  aggregateRating: undefined,
};

/* ==================== SVG ICON COMPONENTS ==================== */
const TypeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
  </svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
);
const HashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);
const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const HelpCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);
const DatabaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);
const DropletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);
const MaximizeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6"/><path d="M9 21H3v-6"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
);
const QrCodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="4" height="4"/><line x1="22" y1="14" x2="22" y2="22"/><line x1="14" y1="22" x2="22" y2="22"/>
  </svg>
);
const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const RepeatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);
const MinimizeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
);
const PdfIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12h4"/><path d="M10 16h4"/>
  </svg>
);
const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);
const CompressIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
);
const ArrowIcon = () => (
  <svg className="tool-card-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ==================== TOOL DATA ==================== */
const freeTools = [
  {
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs. Estimate reading time.',
    href: '/tools/word-counter',
    icon: <TypeIcon />,
    iconBg: '#3b82f6',
  },
  {
    name: 'Password Generator',
    description: 'Generate strong, secure random passwords with customizable length and options.',
    href: '/tools/password-generator',
    icon: <LockIcon />,
    iconBg: '#10b981',
  },
  {
    name: 'Case Converter',
    description: 'Convert text between uppercase, lowercase, title case, sentence case, and more.',
    href: '/tools/case-converter',
    icon: <TypeIcon />,
    iconBg: '#3b82f6',
  },
  {
    name: 'Find & Replace',
    description: 'Find and replace text with regex support. Remove blank lines and duplicates.',
    href: '/tools/find-replace',
    icon: <SearchIcon />,
    iconBg: '#3b82f6',
  },
  {
    name: 'URL Encoder/Decoder',
    description: 'Encode special characters for URLs or decode URL-encoded strings.',
    href: '/tools/url-encoder',
    icon: <LinkIcon />,
    iconBg: '#8b5cf6',
  },
  {
    name: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 back to plain text.',
    href: '/tools/base64-tool',
    icon: <CodeIcon />,
    iconBg: '#8b5cf6',
  },
  {
    name: 'HTML Entity Encoder',
    description: 'Convert special characters to HTML entities or decode entities back.',
    href: '/tools/html-entities',
    icon: <CodeIcon />,
    iconBg: '#8b5cf6',
  },
  {
    name: 'Hash Generator',
    description: 'Generate SHA-1, SHA-256, and SHA-512 hashes from text input.',
    href: '/tools/hash-generator',
    icon: <HashIcon />,
    iconBg: '#8b5cf6',
  },
  {
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text by paragraphs, sentences, or words.',
    href: '/tools/lorem-generator',
    icon: <FileTextIcon />,
    iconBg: '#3b82f6',
  },
  {
    name: 'QR Code Generator',
    description: 'Generate QR codes for URLs, text, emails, or any data. Download as PNG or JPG.',
    href: '/tools/qr-generator',
    icon: <QrCodeIcon />,
    iconBg: '#10b981',
  },
  {
    name: 'UUID Generator',
    description: 'Generate random UUID v4 identifiers. Create single or bulk UUIDs instantly.',
    href: '/tools/uuid-generator',
    icon: <KeyIcon />,
    iconBg: '#8b5cf6',
  },
  {
    name: 'Unix Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates with live clock.',
    href: '/tools/timestamp-converter',
    icon: <ClockIcon />,
    iconBg: '#f59e0b',
  },
  {
    name: 'Word Frequency Counter',
    description: 'Analyze text to find the most common words. Sort by frequency and export CSV.',
    href: '/tools/word-frequency',
    icon: <BarChartIcon />,
    iconBg: '#3b82f6',
  },
  {
    name: 'PDF Merge',
    description: 'Combine multiple PDF files into a single document. Drag to reorder pages.',
    href: '/tools/pdf-merge',
    icon: <PdfIcon />,
    iconBg: '#ef4444',
  },
  {
    name: 'PDF Split',
    description: 'Extract specific pages or split a PDF into smaller files by page range.',
    href: '/tools/pdf-split',
    icon: <PdfIcon />,
    iconBg: '#ef4444',
  },
  {
    name: 'PDF to Text',
    description: 'Extract text content from PDF files. Copy or download as plain text.',
    href: '/tools/pdf-to-text',
    icon: <PdfIcon />,
    iconBg: '#ef4444',
  },
  {
    name: 'Image Compress',
    description: 'Reduce image file size with adjustable quality slider. Supports JPEG, PNG, WebP.',
    href: '/tools/image-compress',
    icon: <CompressIcon />,
    iconBg: '#10b981',
  },
  {
    name: 'Image Resize',
    description: 'Resize images to exact dimensions with aspect ratio lock and quick presets.',
    href: '/tools/image-resize',
    icon: <ImageIcon />,
    iconBg: '#10b981',
  },
  {
    name: 'Image to Base64',
    description: 'Convert images to Base64 strings for embedding in HTML, CSS, or JSON.',
    href: '/tools/image-to-base64',
    icon: <ImageIcon />,
    iconBg: '#10b981',
  },
];

const premiumTools = [
  {
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON with syntax checking.',
    href: '/tools/json-formatter',
    icon: <CodeIcon />,
    iconBg: '#6366f1',
  },
  {
    name: 'Regex Tester',
    description: 'Test regex patterns with real-time matching, highlighting, groups, and replace.',
    href: '/tools/regex-tester',
    icon: <HelpCircleIcon />,
    iconBg: '#6366f1',
  },
  {
    name: 'CSV to JSON Converter',
    description: 'Convert between CSV and JSON formats. Supports custom delimiters.',
    href: '/tools/csv-to-json',
    icon: <FileIcon />,
    iconBg: '#6366f1',
  },
  {
    name: 'SQL Formatter',
    description: 'Format, minify, and beautify SQL queries with customizable indentation.',
    href: '/tools/sql-formatter',
    icon: <DatabaseIcon />,
    iconBg: '#6366f1',
  },
  {
    name: 'Color Converter',
    description: 'Convert colors between HEX, RGB, and HSL. Generate shades and tints.',
    href: '/tools/color-converter',
    icon: <DropletIcon />,
    iconBg: '#ec4899',
  },
  {
    name: 'Markdown Preview',
    description: 'Write Markdown with live preview. Export to HTML with one click.',
    href: '/tools/markdown-preview',
    icon: <FileTextIcon />,
    iconBg: '#ec4899',
  },
  {
    name: 'Text Diff Checker',
    description: 'Compare two texts side-by-side and highlight differences line by line.',
    href: '/tools/text-diff',
    icon: <MaximizeIcon />,
    iconBg: '#ec4899',
  },
  {
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens. View header, payload, and expiration status.',
    href: '/tools/jwt-decoder',
    icon: <ShieldIcon />,
    iconBg: '#6366f1',
  },
  {
    name: 'Cron Expression Generator',
    description: 'Build cron expressions visually. See human-readable descriptions and next run times.',
    href: '/tools/cron-generator',
    icon: <RepeatIcon />,
    iconBg: '#6366f1',
  },
  {
    name: 'JSON ↔ YAML Converter',
    description: 'Convert between JSON and YAML formats. Handles nested objects and arrays.',
    href: '/tools/json-yaml',
    icon: <CodeIcon />,
    iconBg: '#6366f1',
  },
  {
    name: 'Code Minifier',
    description: 'Minify or beautify JavaScript, CSS, and HTML. See file size savings instantly.',
    href: '/tools/code-minifier',
    icon: <MinimizeIcon />,
    iconBg: '#ec4899',
  },
  {
    name: 'API Tester',
    description: 'Build and send HTTP requests. View response status, headers, body, and timing.',
    href: '/tools/api-tester',
    icon: <CodeIcon />,
    iconBg: '#6366f1',
  },
  {
    name: 'JSON Path Explorer',
    description: 'Browse JSON structure visually. Click any value to get its JSONPath expression.',
    href: '/tools/json-path',
    icon: <SearchIcon />,
    iconBg: '#6366f1',
  },
  {
    name: 'Placeholder Image',
    description: 'Generate custom placeholder images with dimensions, colors, and text for mockups.',
    href: '/tools/placeholder-image',
    icon: <ImageIcon />,
    iconBg: '#ec4899',
  },
  {
    name: 'Date Converter',
    description: 'Convert dates between formats: ISO 8601, Unix timestamp, RFC 2822, with timezone support.',
    href: '/tools/date-converter',
    icon: <ClockIcon />,
    iconBg: '#ec4899',
  },
];

/* ==================== TOOL CARD COMPONENT ==================== */
function ToolCard({ tool, badge }) {
  return (
    <Link href={tool.href} className="tool-card">
      <div className="tool-card-header">
        <div className="tool-icon" style={{ background: tool.iconBg }}>
          {tool.icon}
        </div>
        <h3>{tool.name}</h3>
      </div>
      <p>{tool.description}</p>
      <div className="tool-card-footer">
        <span className={`badge ${badge === 'free' ? 'badge-free' : 'badge-premium'}`}>
          {badge === 'free' ? 'Free' : 'Pro'}
        </span>
        <ArrowIcon />
      </div>
    </Link>
  );
}

/* ==================== PAGE ==================== */
export default function Home() {
  return (
    <div>
      {/* ===== STRUCTURED DATA FOR GOOGLE ===== */}
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ===== HERO SECTION ===== */}
      <div className="hero-wrapper">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <section className="hero">
          <h1>
            Free Online <span>Text Tools</span>
          </h1>
          <p className="hero-tagline">
            A collection of fast, privacy-friendly text, PDF, and image utilities that run entirely
            in your browser. No data is sent to any server.
          </p>
          <div className="hero-badges">
            <span className="hero-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              34 Free & Pro Tools
            </span>
            <span className="hero-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              100% Private
            </span>
            <span className="hero-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              No Sign-Up Required
            </span>
          </div>
        </section>
      </div>

      {/* ===== AD SLOT ===== */}
      <AdSlot format="horizontal" />

      {/* ===== FREE TOOLS ===== */}
      <h2 className="section-title">Free Tools</h2>
      <div className="tools-grid">
        {freeTools.map((tool) => (
          <ToolCard key={tool.href} tool={tool} badge="free" />
        ))}
      </div>

      {/* ===== EMAIL CAPTURE ===== */}
      <EmailCapture />

      {/* ===== PREMIUM TOOLS ===== */}
      <h2 className="section-title">Premium Tools</h2>
      <div className="tools-grid">
        {premiumTools.map((tool) => (
          <ToolCard key={tool.href} tool={tool} badge="premium" />
        ))}
      </div>

      {/* ===== AD SLOT ===== */}
      <AdSlot format="horizontal" />

      {/* ===== TRUST SECTION ===== */}
      <section className="trust-section">
        <h2>Why TextTools Pro?</h2>
        <p>Built for developers and writers who value speed, privacy, and simplicity.</p>
        <div className="trust-grid">
          <div className="trust-card">
            <div className="trust-card-icon" style={{ background: '#3b82f6' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3>No Data Collection</h3>
            <p>Every tool runs 100% in your browser. Your text never leaves your device.</p>
          </div>
          <div className="trust-card">
            <div className="trust-card-icon" style={{ background: '#8b5cf6' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h3>Lightning Fast</h3>
            <p>No server round-trips. Instant results powered by client-side processing.</p>
          </div>
          <div className="trust-card">
            <div className="trust-card-icon" style={{ background: '#10b981' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                <polyline points="16 3.13 16.83 4 19 2" style={{ transform: 'translate(0, 1px)' }}/>
              </svg>
            </div>
            <h3>No Sign-Up Required</h3>
            <p>Start using any free tool immediately. No account, no email, no friction.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
