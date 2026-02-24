'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

function computeDiff(textA, textB) {
  const linesA = textA.split('\n');
  const linesB = textB.split('\n');
  const result = [];
  const maxLen = Math.max(linesA.length, linesB.length);

  for (let i = 0; i < maxLen; i++) {
    const a = i < linesA.length ? linesA[i] : undefined;
    const b = i < linesB.length ? linesB[i] : undefined;

    if (a === b) {
      result.push({ type: 'same', lineA: i + 1, lineB: i + 1, text: a });
    } else {
      if (a !== undefined) {
        result.push({ type: 'removed', lineA: i + 1, text: a });
      }
      if (b !== undefined) {
        result.push({ type: 'added', lineB: i + 1, text: b });
      }
    }
  }
  return result;
}

function DiffTool() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [diff, setDiff] = useState(null);

  const compare = () => {
    setDiff(computeDiff(textA, textB));
  };

  const colors = {
    same: { bg: 'transparent', color: 'inherit' },
    added: { bg: '#d1fae5', color: '#065f46' },
    removed: { bg: '#fee2e2', color: '#991b1b' },
  };

  const symbols = { same: ' ', added: '+', removed: '-' };

  return (
    <div className="tool-container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>
            Original Text
          </div>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="Paste original text here..."
            rows={10}
          />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>
            Modified Text
          </div>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="Paste modified text here..."
            rows={10}
          />
        </div>
      </div>

      <div className="btn-group">
        <button className="btn btn-primary" onClick={compare}>
          Compare
        </button>
      </div>

      {diff && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>
            Differences ({diff.filter((d) => d.type !== 'same').length} changes)
          </div>
          <div
            className="result-box"
            style={{ maxHeight: '400px', overflow: 'auto', padding: 0 }}
          >
            {diff.map((line, i) => (
              <div
                key={i}
                style={{
                  background: colors[line.type].bg,
                  color: colors[line.type].color,
                  padding: '2px 8px',
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.8125rem',
                  borderBottom: '1px solid var(--border)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <span style={{ opacity: 0.5, marginRight: '0.5rem' }}>
                  {symbols[line.type]}
                </span>
                {line.text}
              </div>
            ))}
            {diff.length === 0 && (
              <div style={{ padding: '1rem', color: 'var(--text-light)', textAlign: 'center' }}>
                No differences found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TextDiffPage() {
  return (
    <div className="tool-page">
      <Link href="/" className="back-link">
        &larr; All Tools
      </Link>
      <h1>Text Diff Checker <span className="badge badge-premium">Pro</span></h1>
      <p className="description">
        Compare two texts and see the differences highlighted line by line.
      </p>
      <PremiumGate>
        <DiffTool />
      </PremiumGate>
    </div>
  );
}
