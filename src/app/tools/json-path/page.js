'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

const sampleJson = `{
  "store": {
    "name": "Book Shop",
    "books": [
      { "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "price": 12.99 },
      { "title": "1984", "author": "George Orwell", "price": 9.99 },
      { "title": "To Kill a Mockingbird", "author": "Harper Lee", "price": 14.50 }
    ],
    "location": {
      "city": "New York",
      "state": "NY",
      "zip": "10001"
    }
  }
}`;

function getJsonPaths(obj, prefix = '$') {
  const paths = [];
  if (obj === null || obj === undefined) {
    paths.push({ path: prefix, value: obj, type: 'null' });
    return paths;
  }
  if (Array.isArray(obj)) {
    paths.push({ path: prefix, value: `Array[${obj.length}]`, type: 'array' });
    obj.forEach((item, i) => {
      paths.push(...getJsonPaths(item, `${prefix}[${i}]`));
    });
  } else if (typeof obj === 'object') {
    paths.push({ path: prefix, value: '{...}', type: 'object' });
    Object.keys(obj).forEach((key) => {
      const safePath = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
        ? `${prefix}.${key}`
        : `${prefix}["${key}"]`;
      paths.push(...getJsonPaths(obj[key], safePath));
    });
  } else {
    const type = typeof obj;
    paths.push({ path: prefix, value: obj, type });
  }
  return paths;
}

function evaluatePath(obj, pathStr) {
  try {
    // Simple JSONPath evaluator for dot notation and bracket notation
    let current = obj;
    const parts = pathStr.replace(/^\$\.?/, '').split(/\.(?![^[]*\])/);

    for (const part of parts) {
      if (!part) continue;
      const bracketMatch = part.match(/^(.+?)\[(\d+)\]$/);
      if (bracketMatch) {
        current = current[bracketMatch[1]][Number(bracketMatch[2])];
      } else if (part.startsWith('[')) {
        const idx = part.replace(/[\[\]"]/g, '');
        current = current[isNaN(idx) ? idx : Number(idx)];
      } else {
        current = current[part];
      }
      if (current === undefined) return undefined;
    }
    return current;
  } catch {
    return undefined;
  }
}

export default function JsonPathPage() {
  const [input, setInput] = useState(sampleJson);
  const [pathQuery, setPathQuery] = useState('');
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');

  const parsed = useMemo(() => {
    try {
      const obj = JSON.parse(input);
      setError('');
      return obj;
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
      return null;
    }
  }, [input]);

  const allPaths = useMemo(() => {
    if (!parsed) return [];
    return getJsonPaths(parsed);
  }, [parsed]);

  const filteredPaths = useMemo(() => {
    if (!pathQuery.trim()) return allPaths;
    const q = pathQuery.toLowerCase();
    return allPaths.filter(
      (p) => p.path.toLowerCase().includes(q) || String(p.value).toLowerCase().includes(q)
    );
  }, [allPaths, pathQuery]);

  const queryResult = useMemo(() => {
    if (!parsed || !pathQuery.startsWith('$')) return null;
    const result = evaluatePath(parsed, pathQuery);
    if (result === undefined) return null;
    return JSON.stringify(result, null, 2);
  }, [parsed, pathQuery]);

  const copyPath = async (path) => {
    try {
      await navigator.clipboard.writeText(path);
      setCopied(path);
      setTimeout(() => setCopied(''), 1500);
    } catch {}
  };

  const typeColors = {
    string: '#10b981',
    number: '#3b82f6',
    boolean: '#f59e0b',
    null: '#94a3b8',
    object: '#8b5cf6',
    array: '#ec4899',
  };

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">← Back to Tools</Link>
      <h1>JSON Path Explorer</h1>
      <p className="description">
        Paste JSON and explore all paths. Click any path to copy it. Search paths or evaluate JSONPath expressions.
      </p>

      <PremiumGate toolName="JSON Path Explorer">
        <div className="tool-container">
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            JSON Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            rows={10}
            style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}
          />
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.8125rem', marginTop: '0.5rem' }}>{error}</p>}

          {parsed && (
            <>
              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Search / Query Path
                </label>
                <input
                  type="text"
                  value={pathQuery}
                  onChange={(e) => setPathQuery(e.target.value)}
                  placeholder='Search paths or enter a path like $.store.books[0].title'
                />
              </div>

              {queryResult && (
                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--success)' }}>
                    Query Result:
                  </label>
                  <div className="result-box" style={{ marginTop: '0.25rem', fontSize: '0.8125rem' }}>
                    {queryResult}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    All Paths ({filteredPaths.length})
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to copy</span>
                </div>
                <div style={{
                  maxHeight: '400px',
                  overflow: 'auto',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}>
                  {filteredPaths.map((p, i) => (
                    <div
                      key={i}
                      onClick={() => copyPath(p.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.8125rem',
                        fontFamily: 'monospace',
                        borderBottom: i < filteredPaths.length - 1 ? '1px solid var(--border-light)' : 'none',
                        cursor: 'pointer',
                        transition: 'background 100ms ease',
                        background: copied === p.path ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                      }}
                      onMouseEnter={(e) => { if (copied !== p.path) e.currentTarget.style.background = 'var(--bg-subtle)'; }}
                      onMouseLeave={(e) => { if (copied !== p.path) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{p.path}</span>
                      <span style={{
                        flexShrink: 0,
                        fontSize: '0.75rem',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '4px',
                        background: `${typeColors[p.type] || '#94a3b8'}15`,
                        color: typeColors[p.type] || '#94a3b8',
                        fontWeight: 500,
                      }}>
                        {copied === p.path ? '✓ Copied' : (
                          p.type === 'string' ? `"${String(p.value).slice(0, 20)}${String(p.value).length > 20 ? '...' : ''}"` :
                          String(p.value).slice(0, 25)
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </PremiumGate>
    </div>
  );
}
