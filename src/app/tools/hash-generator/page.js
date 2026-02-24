'use client';

import { useState } from 'react';
import Link from 'next/link';

async function hashText(text, algorithm) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState(null);
  const [copiedField, setCopiedField] = useState('');

  const generate = async () => {
    if (!input.trim()) return;
    const [sha1, sha256, sha512] = await Promise.all([
      hashText(input, 'SHA-1'),
      hashText(input, 'SHA-256'),
      hashText(input, 'SHA-512'),
    ]);
    setHashes({ sha1, sha256, sha512 });
  };

  const copyHash = (name, value) => {
    navigator.clipboard.writeText(value);
    setCopiedField(name);
    setTimeout(() => setCopiedField(''), 2000);
  };

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">
        &larr; All Tools
      </Link>
      <h1>Hash Generator</h1>
      <p className="description">
        Generate cryptographic hashes from your text using SHA-1, SHA-256, and SHA-512.
      </p>

      <div className="tool-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          rows={4}
        />

        <div className="btn-group">
          <button className="btn btn-primary" onClick={generate}>
            Generate Hashes
          </button>
        </div>

        {hashes && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            {Object.entries(hashes).map(([name, value]) => (
              <div key={name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <strong style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    {name.replace('sha', 'SHA-')}
                  </strong>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                    onClick={() => copyHash(name, value)}
                  >
                    {copiedField === name ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="result-box" style={{ minHeight: 'auto', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
