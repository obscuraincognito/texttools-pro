'use client';

import { useState } from 'react';
import Link from 'next/link';

function generateUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState([generateUUIDv4()]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const list = [];
    for (let i = 0; i < Math.min(count, 100); i++) {
      let id = generateUUIDv4();
      if (noDashes) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      list.push(id);
    }
    setUuids(list);
    setCopied(false);
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = uuids.join('\n');
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">&larr; All Tools</Link>
      <h1>UUID Generator</h1>
      <p className="description">Generate random UUID v4 identifiers. Create single or bulk UUIDs with formatting options.</p>

      <div className="tool-container">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Quantity</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
              style={{ width: '100px' }}
            />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
            Uppercase
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input type="checkbox" checked={noDashes} onChange={(e) => setNoDashes(e.target.checked)} />
            No Dashes
          </label>
          <button className="btn btn-primary" onClick={generate}>Generate</button>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          padding: '1rem',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          minHeight: '60px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}>
          {uuids.map((id, i) => (
            <div key={i} style={{ padding: '0.25rem 0', borderBottom: i < uuids.length - 1 ? '1px solid var(--border)' : 'none' }}>
              {id}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={copyAll}>
            {copied ? '✓ Copied!' : 'Copy All'}
          </button>
        </div>
      </div>
    </div>
  );
}
