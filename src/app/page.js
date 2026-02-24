import Link from 'next/link';

const freeTools = [
  {
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs. Estimate reading time.',
    href: '/tools/word-counter',
    icon: '#',
  },
  {
    name: 'Case Converter',
    description: 'Convert text between uppercase, lowercase, title case, sentence case, and more.',
    href: '/tools/case-converter',
    icon: 'Aa',
  },
  {
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text by paragraphs, sentences, or words.',
    href: '/tools/lorem-generator',
    icon: 'T',
  },
  {
    name: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 back to plain text.',
    href: '/tools/base64-tool',
    icon: '{}',
  },
  {
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text input.',
    href: '/tools/hash-generator',
    icon: '#!',
  },
];

const premiumTools = [
  {
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON. Tree view with syntax highlighting.',
    href: '/tools/json-formatter',
    icon: '{ }',
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
