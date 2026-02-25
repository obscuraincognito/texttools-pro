'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [currentTs, setCurrentTs] = useState(Math.floor(Date.now() / 1000));
  const [result, setResult] = useState(null);
  const [tsResult, setTsResult] = useState(null);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTs(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertTimestamp = () => {
    if (!timestamp.trim()) return;
    let ts = Number(timestamp.trim());
    // If it looks like milliseconds (13+ digits), convert to seconds
    if (ts > 9999999999) ts = Math.floor(ts / 1000);
    const d = new Date(ts * 1000);
    if (isNaN(d.getTime())) {
      setResult({ error: 'Invalid timestamp' });
      return;
    }
    setResult({
      utc: d.toUTCString(),
      local: d.toLocaleString(),
      iso: d.toISOString(),
      relative: getRelativeTime(d),
      dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'long' }),
      dayOfYear: getDayOfYear(d),
    });
  };

  const convertDate = () => {
    if (!dateStr.trim()) return;
    const d = new Date(dateStr.trim());
    if (isNaN(d.getTime())) {
      setTsResult({ error: 'Invalid date string' });
      return;
    }
    setTsResult({
      seconds: Math.floor(d.getTime() / 1000),
      milliseconds: d.getTime(),
      iso: d.toISOString(),
    });
  };

  const getRelativeTime = (d) => {
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 0) {
      const absDiff = Math.abs(diff);
      if (absDiff < 60) return `${absDiff} seconds from now`;
      if (absDiff < 3600) return `${Math.floor(absDiff / 60)} minutes from now`;
      if (absDiff < 86400) return `${Math.floor(absDiff / 3600)} hours from now`;
      return `${Math.floor(absDiff / 86400)} days from now`;
    }
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    return `${Math.floor(diff / 2592000)} months ago`;
  };

  const getDayOfYear = (d) => {
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d - start;
    return Math.floor(diff / 86400000);
  };

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(String(text));
      setCopied(label);
      setTimeout(() => setCopied(''), 1500);
    } catch {}
  };

  const labelStyle = { display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 };
  const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' };

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">&larr; All Tools</Link>
      <h1>Unix Timestamp Converter</h1>
      <p className="description">Convert between Unix timestamps and human-readable dates. Live clock included.</p>

      <div className="tool-container">
        {/* Live Clock */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 600, marginBottom: '0.25rem' }}>Current Unix Timestamp</div>
          <div style={{ fontSize: '2rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{currentTs}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>{new Date().toUTCString()}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Timestamp to Date */}
          <div>
            <label style={labelStyle}>Timestamp → Date</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="e.g. 1700000000"
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" onClick={convertTimestamp}>Convert</button>
            </div>
            {result && (
              <div style={{ marginTop: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '0.75rem' }}>
                {result.error ? (
                  <div style={{ color: '#ef4444' }}>{result.error}</div>
                ) : (
                  <>
                    <div style={rowStyle}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>UTC</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => copyText(result.utc, 'utc')}>{result.utc} {copied === 'utc' ? '✓' : '📋'}</span>
                    </div>
                    <div style={rowStyle}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Local</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => copyText(result.local, 'local')}>{result.local} {copied === 'local' ? '✓' : '📋'}</span>
                    </div>
                    <div style={rowStyle}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>ISO 8601</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => copyText(result.iso, 'iso')}>{result.iso} {copied === 'iso' ? '✓' : '📋'}</span>
                    </div>
                    <div style={rowStyle}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Relative</span>
                      <span style={{ fontSize: '0.85rem' }}>{result.relative}</span>
                    </div>
                    <div style={{ ...rowStyle, borderBottom: 'none' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Day</span>
                      <span style={{ fontSize: '0.85rem' }}>{result.dayOfWeek} (day {result.dayOfYear})</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Date to Timestamp */}
          <div>
            <label style={labelStyle}>Date → Timestamp</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                placeholder="e.g. 2024-01-15 or Jan 15, 2024"
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" onClick={convertDate}>Convert</button>
            </div>
            {tsResult && (
              <div style={{ marginTop: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '0.75rem' }}>
                {tsResult.error ? (
                  <div style={{ color: '#ef4444' }}>{tsResult.error}</div>
                ) : (
                  <>
                    <div style={rowStyle}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Seconds</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => copyText(tsResult.seconds, 'sec')}>{tsResult.seconds} {copied === 'sec' ? '✓' : '📋'}</span>
                    </div>
                    <div style={rowStyle}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Milliseconds</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => copyText(tsResult.milliseconds, 'ms')}>{tsResult.milliseconds} {copied === 'ms' ? '✓' : '📋'}</span>
                    </div>
                    <div style={{ ...rowStyle, borderBottom: 'none' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>ISO 8601</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => copyText(tsResult.iso, 'iso2')}>{tsResult.iso} {copied === 'iso2' ? '✓' : '📋'}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
