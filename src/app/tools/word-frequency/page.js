'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WordFrequency() {
  const [text, setText] = useState('');
  const [results, setResults] = useState([]);
  const [minLength, setMinLength] = useState(1);
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [ignoreCommon, setIgnoreCommon] = useState(false);
  const [sortBy, setSortBy] = useState('frequency');

  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see',
    'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
    'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work',
    'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
    'give', 'day', 'most', 'us', 'is', 'are', 'was', 'were', 'been', 'has',
    'had', 'did', 'am', 'does', 'doing', 'done',
  ]);

  const analyze = () => {
    if (!text.trim()) { setResults([]); return; }
    const words = text.match(/[\w']+/g) || [];
    const freq = {};
    words.forEach((w) => {
      let word = ignoreCase ? w.toLowerCase() : w;
      if (word.length < minLength) return;
      if (ignoreCommon && commonWords.has(word.toLowerCase())) return;
      freq[word] = (freq[word] || 0) + 1;
    });

    let sorted = Object.entries(freq);
    if (sortBy === 'frequency') {
      sorted.sort((a, b) => b[1] - a[1]);
    } else {
      sorted.sort((a, b) => a[0].localeCompare(b[0]));
    }
    setResults(sorted);
  };

  const totalWords = results.reduce((sum, [, c]) => sum + c, 0);
  const uniqueWords = results.length;

  const copyResults = async () => {
    const csv = 'Word,Count\n' + results.map(([w, c]) => `${w},${c}`).join('\n');
    try { await navigator.clipboard.writeText(csv); } catch {}
  };

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">&larr; All Tools</Link>
      <h1>Word Frequency Counter</h1>
      <p className="description">Analyze text to find the most common words. Sort by frequency or alphabetically. Export as CSV.</p>

      <div className="tool-container">
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Input Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here to analyze word frequency..."
          rows={8}
        />

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', margin: '1rem 0', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Min Word Length</label>
            <input type="number" min="1" max="20" value={minLength} onChange={(e) => setMinLength(Number(e.target.value))} style={{ width: '80px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <option value="frequency">Frequency</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} />
            Ignore Case
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input type="checkbox" checked={ignoreCommon} onChange={(e) => setIgnoreCommon(e.target.checked)} />
            Ignore Common Words
          </label>
          <button className="btn btn-primary" onClick={analyze}>Analyze</button>
        </div>

        {results.length > 0 && (
          <>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div><span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Total Words</span><div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{totalWords}</div></div>
              <div><span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Unique Words</span><div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{uniqueWords}</div></div>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', position: 'sticky', top: 0 }}>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)' }}>#</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)' }}>Word</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)' }}>Count</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)' }}>%</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)', width: '30%' }}>Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 200).map(([word, count], i) => {
                    const pct = ((count / totalWords) * 100).toFixed(1);
                    const barPct = (count / results[0][1]) * 100;
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.4rem 0.75rem', color: 'var(--text-light)', fontSize: '0.8rem' }}>{i + 1}</td>
                        <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'monospace', fontWeight: 500 }}>{word}</td>
                        <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>{count}</td>
                        <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', color: 'var(--text-light)' }}>{pct}%</td>
                        <td style={{ padding: '0.4rem 0.75rem' }}>
                          <div style={{ background: 'var(--border)', borderRadius: '4px', overflow: 'hidden', height: '8px' }}>
                            <div style={{ width: `${barPct}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={copyResults}>Copy as CSV</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
