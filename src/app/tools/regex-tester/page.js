'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

const COMMON_PATTERNS = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { name: 'URL', pattern: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+[\\w\\-.,@?^=%&:/~+#]*' },
  { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
  { name: 'IP Address', pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b' },
  { name: 'Date (MM/DD/YYYY)', pattern: '\\d{2}/\\d{2}/\\d{4}' },
  { name: 'Hex Color', pattern: '#[0-9a-fA-F]{3,6}\\b' },
  { name: 'Numbers Only', pattern: '\\d+' },
  { name: 'Words Only', pattern: '[a-zA-Z]+' },
];

function RegexTool() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [replaceWith, setReplaceWith] = useState('');
  const [replaceResult, setReplaceResult] = useState('');
  const [error, setError] = useState('');

  let regex = null;
  let matches = [];
  let highlightedHtml = '';

  try {
    if (pattern) {
      regex = new RegExp(pattern, flags);
      matches = [...testString.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))];

      // Build highlighted HTML
      let lastIndex = 0;
      let html = '';
      const allMatches = [...testString.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))];

      allMatches.forEach((match, i) => {
        const start = match.index;
        const end = start + match[0].length;
        html += testString.slice(lastIndex, start);
        html += `<mark style="background:#dbeafe;border:1px solid #93c5fd;border-radius:2px;padding:0 2px">${testString.slice(start, end)}</mark>`;
        lastIndex = end;
      });
      html += testString.slice(lastIndex);
      highlightedHtml = html;
    }
    if (error) setError('');
  } catch (e) {
    setError(e.message);
    matches = [];
    highlightedHtml = testString;
  }

  const doReplace = () => {
    try {
      if (!pattern) return;
      const r = new RegExp(pattern, flags);
      setReplaceResult(testString.replace(r, replaceWith));
    } catch (e) {
      setReplaceResult('Error: ' + e.message);
    }
  };

  return (
    <div className="tool-container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Regular Expression</label>
          <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter regex pattern..." style={{ fontFamily: "'Courier New', monospace" }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Flags</label>
          <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="g" style={{ width: '80px', fontFamily: "'Courier New', monospace" }} />
        </div>
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Test String</label>
        <textarea value={testString} onChange={(e) => setTestString(e.target.value)} placeholder="Enter text to test against..." rows={6} />
      </div>

      <div className="stats-grid" style={{ marginBottom: '1rem' }}>
        <div className="stat-card">
          <div className="value">{matches.length}</div>
          <div className="label">Matches</div>
        </div>
        <div className="stat-card">
          <div className="value">{matches.reduce((acc, m) => acc + (m.length - 1), 0)}</div>
          <div className="label">Groups</div>
        </div>
      </div>

      {testString && pattern && !error && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Highlighted Matches</label>
          <div className="result-box" style={{ fontFamily: "'Courier New', monospace" }} dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        </div>
      )}

      {matches.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Match Details</label>
          <div style={{ maxHeight: '200px', overflow: 'auto' }}>
            {matches.map((match, i) => (
              <div key={i} style={{ padding: '0.375rem 0.75rem', background: i % 2 === 0 ? 'var(--bg)' : 'transparent', fontSize: '0.8125rem', fontFamily: "'Courier New', monospace" }}>
                <strong>Match {i + 1}:</strong> &quot;{match[0]}&quot; <span style={{ color: 'var(--text-light)' }}>(index {match.index})</span>
                {match.length > 1 && (
                  <span style={{ color: 'var(--primary)', marginLeft: '0.5rem' }}>
                    Groups: {match.slice(1).map((g, j) => `$${j + 1}="${g}"`).join(', ')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Replace With</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input type="text" value={replaceWith} onChange={(e) => setReplaceWith(e.target.value)} placeholder="Replacement string..." style={{ flex: 1, fontFamily: "'Courier New', monospace" }} />
          <button className="btn btn-primary" onClick={doReplace}>Replace</button>
        </div>
      </div>

      {replaceResult && <div className="result-box">{replaceResult}</div>}

      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Common Patterns</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {COMMON_PATTERNS.map((p) => (
            <button key={p.name} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }} onClick={() => setPattern(p.pattern)}>
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RegexTesterPage() {
  return (
    <div className="tool-page">
      <Link href="/" className="back-link">&larr; All Tools</Link>
      <h1>Regex Tester <span className="badge badge-premium">Pro</span></h1>
      <p className="description">Test regular expressions with real-time matching, highlighting, group capture, and replace.</p>
      <PremiumGate>
        <RegexTool />
      </PremiumGate>
    </div>
  );
}
