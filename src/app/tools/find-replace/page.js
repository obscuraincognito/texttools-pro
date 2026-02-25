'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FindReplace() {
  const [text, setText] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [result, setResult] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const doReplace = () => {
    if (!find) {
      setResult(text);
      setMatchCount(0);
      return;
    }

    try {
      let regex;
      if (useRegex) {
        regex = new RegExp(find, caseSensitive ? 'g' : 'gi');
      } else {
        const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        regex = new RegExp(escaped, caseSensitive ? 'g' : 'gi');
      }

      const matches = text.match(regex);
      setMatchCount(matches ? matches.length : 0);
      setResult(text.replace(regex, replace));
    } catch (e) {
      setResult('Invalid regex pattern: ' + e.message);
      setMatchCount(0);
    }
  };

  const doFind = () => {
    if (!find) {
      setMatchCount(0);
      return;
    }

    try {
      let regex;
      if (useRegex) {
        regex = new RegExp(find, caseSensitive ? 'g' : 'gi');
      } else {
        const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        regex = new RegExp(escaped, caseSensitive ? 'g' : 'gi');
      }

      const matches = text.match(regex);
      setMatchCount(matches ? matches.length : 0);
    } catch (e) {
      setMatchCount(0);
    }
  };

  const removeBlankLines = () => {
    setResult(text.split('\n').filter((line) => line.trim() !== '').join('\n'));
  };

  const removeDuplicateLines = () => {
    const lines = text.split('\n');
    const unique = [...new Set(lines)];
    setResult(unique.join('\n'));
    setMatchCount(lines.length - unique.length);
  };

  const trimLines = () => {
    setResult(text.split('\n').map((line) => line.trim()).join('\n'));
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">&larr; All Tools</Link>
      <h1>Find & Replace</h1>
      <p className="description">Find and replace text with support for case sensitivity and regular expressions.</p>

      <div className="tool-container">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
          rows={8}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '1rem 0' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Find</label>
            <input type="text" value={find} onChange={(e) => setFind(e.target.value)} placeholder="Search for..." />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Replace with</label>
            <input type="text" value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="Replace with..." />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
            Case sensitive
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} />
            Use regex
          </label>
        </div>

        <div className="btn-group">
          <button className="btn btn-primary" onClick={doReplace}>Replace All</button>
          <button className="btn btn-secondary" onClick={doFind}>Count Matches</button>
          <button className="btn btn-secondary" onClick={removeBlankLines}>Remove Blank Lines</button>
          <button className="btn btn-secondary" onClick={removeDuplicateLines}>Remove Duplicates</button>
          <button className="btn btn-secondary" onClick={trimLines}>Trim Lines</button>
        </div>

        {matchCount > 0 && (
          <p style={{ fontSize: '0.875rem', color: 'var(--primary)', marginTop: '0.5rem' }}>
            {matchCount} match{matchCount !== 1 ? 'es' : ''} found
          </p>
        )}

        {result && (
          <>
            <div className="result-box">{result}</div>
            <div className="btn-group">
              <button className="btn btn-secondary" onClick={copy}>
                Copy {copied && <span className="copy-feedback">Copied!</span>}
              </button>
              <button className="btn btn-secondary" onClick={() => setText(result)}>
                Use as Input
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
