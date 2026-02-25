'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 1rem',
      maxWidth: '500px',
      margin: '0 auto',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
        Something went wrong
      </h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        An unexpected error occurred. This tool runs entirely in your browser, so no data was lost.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <button onClick={() => reset()} className="btn btn-primary">
          Try Again
        </button>
        <a href="/" className="btn btn-secondary">
          Go Home
        </a>
      </div>
    </div>
  );
}
