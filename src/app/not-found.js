import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 1rem',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem', opacity: 0.3 }}>404</div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '2rem', lineHeight: 1.6 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Try one of our popular tools below.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <Link href="/" className="btn btn-primary">
          Browse All Tools
        </Link>
        <Link href="/pricing" className="btn btn-secondary">
          View Pricing
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '0.75rem',
        textAlign: 'left',
      }}>
        {[
          { name: 'Word Counter', href: '/tools/word-counter' },
          { name: 'Password Generator', href: '/tools/password-generator' },
          { name: 'PDF Merge', href: '/tools/pdf-merge' },
          { name: 'Image Compress', href: '/tools/image-compress' },
          { name: 'JSON Formatter', href: '/tools/json-formatter' },
          { name: 'QR Code Generator', href: '/tools/qr-generator' },
        ].map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
              color: 'var(--text)',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'border-color 200ms ease, box-shadow 200ms ease',
            }}
          >
            {tool.name} →
          </Link>
        ))}
      </div>
    </div>
  );
}
