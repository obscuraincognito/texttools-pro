import Link from 'next/link';

const allTools = [
  { name: 'Word Counter', href: '/tools/word-counter', category: 'text' },
  { name: 'Password Generator', href: '/tools/password-generator', category: 'text' },
  { name: 'Case Converter', href: '/tools/case-converter', category: 'text' },
  { name: 'Find & Replace', href: '/tools/find-replace', category: 'text' },
  { name: 'URL Encoder', href: '/tools/url-encoder', category: 'encoding' },
  { name: 'Base64 Tool', href: '/tools/base64-tool', category: 'encoding' },
  { name: 'HTML Entities', href: '/tools/html-entities', category: 'encoding' },
  { name: 'Hash Generator', href: '/tools/hash-generator', category: 'encoding' },
  { name: 'Lorem Ipsum', href: '/tools/lorem-generator', category: 'text' },
  { name: 'QR Code Generator', href: '/tools/qr-generator', category: 'text' },
  { name: 'UUID Generator', href: '/tools/uuid-generator', category: 'developer' },
  { name: 'Timestamp Converter', href: '/tools/timestamp-converter', category: 'developer' },
  { name: 'Word Frequency', href: '/tools/word-frequency', category: 'text' },
  { name: 'PDF Merge', href: '/tools/pdf-merge', category: 'pdf' },
  { name: 'PDF Split', href: '/tools/pdf-split', category: 'pdf' },
  { name: 'PDF to Text', href: '/tools/pdf-to-text', category: 'pdf' },
  { name: 'Image Compress', href: '/tools/image-compress', category: 'image' },
  { name: 'Image Resize', href: '/tools/image-resize', category: 'image' },
  { name: 'Image to Base64', href: '/tools/image-to-base64', category: 'image' },
  { name: 'JSON Formatter', href: '/tools/json-formatter', category: 'developer' },
  { name: 'Regex Tester', href: '/tools/regex-tester', category: 'developer' },
  { name: 'CSV to JSON', href: '/tools/csv-to-json', category: 'developer' },
  { name: 'SQL Formatter', href: '/tools/sql-formatter', category: 'developer' },
  { name: 'Color Converter', href: '/tools/color-converter', category: 'developer' },
  { name: 'Markdown Preview', href: '/tools/markdown-preview', category: 'developer' },
  { name: 'Text Diff', href: '/tools/text-diff', category: 'text' },
  { name: 'JWT Decoder', href: '/tools/jwt-decoder', category: 'developer' },
  { name: 'Cron Generator', href: '/tools/cron-generator', category: 'developer' },
  { name: 'JSON ↔ YAML', href: '/tools/json-yaml', category: 'developer' },
  { name: 'Code Minifier', href: '/tools/code-minifier', category: 'developer' },
  { name: 'API Tester', href: '/tools/api-tester', category: 'developer' },
  { name: 'JSON Path', href: '/tools/json-path', category: 'developer' },
  { name: 'Placeholder Image', href: '/tools/placeholder-image', category: 'image' },
  { name: 'Date Converter', href: '/tools/date-converter', category: 'developer' },
];

export default function RelatedTools({ currentTool, category = 'text' }) {
  // Find tools in the same category, excluding current tool
  const related = allTools
    .filter((t) => t.category === category && t.href !== `/tools/${currentTool}`)
    .slice(0, 4);

  // If not enough same-category tools, pad with random tools
  if (related.length < 4) {
    const others = allTools.filter(
      (t) => t.category !== category && t.href !== `/tools/${currentTool}` && !related.includes(t)
    );
    while (related.length < 4 && others.length > 0) {
      const idx = Math.floor(Math.random() * others.length);
      related.push(others.splice(idx, 1)[0]);
    }
  }

  if (related.length === 0) return null;

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <h3 style={{
        fontSize: '1rem',
        fontWeight: 600,
        marginBottom: '0.75rem',
        color: 'var(--text-secondary)',
      }}>
        Related Tools
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '0.75rem',
      }}>
        {related.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            style={{
              padding: '0.875rem 1rem',
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
              color: 'var(--text)',
              fontSize: '0.875rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
            }}
          >
            {tool.name}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
