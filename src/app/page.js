import Link from 'next/link';

const freeTools = [
  {
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs. Estimate reading time.',
    href: '/tools/word-counter',
    icon: '#',
  },
  {
    name: 'Password Generator',
    description: 'Generate strong, secure random passwords with customizable length and options.',
    href: '/tools/password-generator',
    icon: '***',
  },
  {
    name: 'Case Converter',
    description: 'Convert text between uppercase, lowercase, title case, sentence case, and more.',
    href: '/tools/case-converter',
    icon: 'Aa',
  },
  {
    name: 'Find & Replace',
    description: 'Find and replace text with regex support. Remove blank lines and duplicates.',
    href: '/tools/find-replace',
    icon: '?=',
  },
  {
    name: 'URL Encoder/Decoder',
    description: 'Encode special characters for URLs or decode URL-encoded strings.',
    href: '/tools/url-encoder',
    icon: '%',
  },
  {
    name: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 back to plain text.',
    href: '/tools/base64-tool',
    icon: '{}',
  },
  {
    name: 'HTML Entity Encoder',
    description: 'Convert special characters to HTML entities or decode entities back.',
    href: '/tools/html-entities',
    icon: '&;',
  },
  {
    name: 'Hash Generator',
    description: 'Generate SHA-1, SHA-256, and SHA-512 hashes from text input.',
    href: '/tools/hash-generator',
    icon: '#!',
  },
  {
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text by paragraphs, sentences, or words.',
    href: '/tools/lorem-generator',
    icon: 'T',
  },
];

const premiumTools = [
  {
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON with syntax checking.',
    href: '/tools/json-formatter',
    icon: '{ }',
  },
  {
    name: 'Regex Tester',
    description: 'Test regex patterns with real-time matching, highlighting, groups, and replace.',
    href: '/tools/regex-tester',
    icon: '.*',
  },
  {
    name: 'CSV to JSON Converter',
    description: 'Convert between CSV and JSON formats. Supports custom delimiters.',
    href: '/tools/csv-to-json',
    icon: ',J',
  },
  {
    name: 'SQL Formatter',
    description: 'Format, minify, and beautify SQL queries with customizable indentation.',
    href: '/tools/sql-formatter',
    icon: 'SQ',
  },
  {
    name: 'Color Converter',
    description: 'Convert colors between HEX, RGB, and HSL. Generate shades and tints.',
    href: '/tools/color-converter',
    icon: 'C',
  },
  {
    name: 'Markdown Preview',
    description: 'Write Markdown with live preview. Export to HTML with one click.',
    href: '/tools/markdown-preview',
    icon: 'M',
  },
  {
    name: 'Text Diff Checker',
    description: 'Compare two texts side-by-side and highlight differences line by line.',
    href: '/tools/text-diff',
    icon: '<>',
  },
];

export default function Home() {
  return (
    <div>
      <section className="hero">
        <h1>
          Free Online <span>Text Tools</span>
        </h1>
        <p>
          A collection of fast, privacy-friendly text utilities that run entirely
          in your browser. No data is sent to any server.
        </p>
      </section>

      <h2 className="section-title">Free Tools</h2>
      <div className="tools-grid">
        {freeTools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="tool-card">
            <h3>
              <span style={{ opacity: 0.5 }}>{tool.icon}</span>
              {tool.name}
              <span className="badge badge-free">Free</span>
            </h3>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="section-title">Premium Tools</h2>
      <div className="tools-grid">
        {premiumTools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="tool-card">
            <h3>
              <span style={{ opacity: 0.5 }}>{tool.icon}</span>
              {tool.name}
              <span className="badge badge-premium">Pro</span>
            </h3>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
