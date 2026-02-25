'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

const TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: 'US/Eastern (New York)', value: 'America/New_York' },
  { label: 'US/Central (Chicago)', value: 'America/Chicago' },
  { label: 'US/Pacific (Los Angeles)', value: 'America/Los_Angeles' },
  { label: 'Europe/London', value: 'Europe/London' },
  { label: 'Europe/Paris', value: 'Europe/Paris' },
  { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
  { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
  { label: 'Australia/Sydney', value: 'Australia/Sydney' },
];

function parseRelativeDate(input) {
  const lower = input.trim().toLowerCase();

  // "now"
  if (lower === 'now') return new Date();

  // "yesterday" / "tomorrow"
  if (lower === 'yesterday') {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  }
  if (lower === 'tomorrow') {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }

  // "X units ago" pattern
  const agoMatch = lower.match(/^(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/);
  if (agoMatch) {
    const amount = parseInt(agoMatch[1], 10);
    const unit = agoMatch[2];
    const d = new Date();
    switch (unit) {
      case 'second': d.setSeconds(d.getSeconds() - amount); break;
      case 'minute': d.setMinutes(d.getMinutes() - amount); break;
      case 'hour': d.setHours(d.getHours() - amount); break;
      case 'day': d.setDate(d.getDate() - amount); break;
      case 'week': d.setDate(d.getDate() - amount * 7); break;
      case 'month': d.setMonth(d.getMonth() - amount); break;
      case 'year': d.setFullYear(d.getFullYear() - amount); break;
    }
    return d;
  }

  // "in X units" pattern
  const inMatch = lower.match(/^in\s+(\d+)\s+(second|minute|hour|day|week|month|year)s?$/);
  if (inMatch) {
    const amount = parseInt(inMatch[1], 10);
    const unit = inMatch[2];
    const d = new Date();
    switch (unit) {
      case 'second': d.setSeconds(d.getSeconds() + amount); break;
      case 'minute': d.setMinutes(d.getMinutes() + amount); break;
      case 'hour': d.setHours(d.getHours() + amount); break;
      case 'day': d.setDate(d.getDate() + amount); break;
      case 'week': d.setDate(d.getDate() + amount * 7); break;
      case 'month': d.setMonth(d.getMonth() + amount); break;
      case 'year': d.setFullYear(d.getFullYear() + amount); break;
    }
    return d;
  }

  return null;
}

function parseInputDate(input) {
  if (!input || !input.trim()) return null;
  const trimmed = input.trim();

  // Try Unix timestamp (pure number)
  if (/^\d+$/.test(trimmed)) {
    const num = Number(trimmed);
    // If 13+ digits, treat as milliseconds
    if (num > 9999999999) {
      const d = new Date(num);
      if (!isNaN(d.getTime())) return d;
    }
    // Otherwise treat as seconds
    const d = new Date(num * 1000);
    if (!isNaN(d.getTime())) return d;
  }

  // Try negative Unix timestamp
  if (/^-\d+$/.test(trimmed)) {
    const num = Number(trimmed);
    const d = new Date(num > -9999999999 ? num * 1000 : num);
    if (!isNaN(d.getTime())) return d;
  }

  // Try relative / natural language
  const relativeResult = parseRelativeDate(trimmed);
  if (relativeResult && !isNaN(relativeResult.getTime())) return relativeResult;

  // Try native Date parsing (covers ISO 8601, RFC 2822, and many natural formats)
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) return d;

  return null;
}

function getRelativeTime(date) {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const absDiff = Math.abs(diffMs);
  const isFuture = diffMs < 0;
  const suffix = isFuture ? 'from now' : 'ago';

  const seconds = Math.floor(absDiff / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds} seconds ${suffix}`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ${suffix}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ${suffix}`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ${suffix}`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ${suffix}`;

  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? 's' : ''} ${suffix}`;
}

function DateConverterTool() {
  const [input, setInput] = useState('');
  const [parsedDate, setParsedDate] = useState(null);
  const [error, setError] = useState('');
  const [selectedTz, setSelectedTz] = useState('UTC');
  const [copied, setCopied] = useState('');
  const [liveRelative, setLiveRelative] = useState('');

  const convert = useCallback(() => {
    if (!input.trim()) {
      setParsedDate(null);
      setError('');
      return;
    }
    const d = parseInputDate(input);
    if (d) {
      setParsedDate(d);
      setError('');
      setLiveRelative(getRelativeTime(d));
    } else {
      setParsedDate(null);
      setError('Could not parse the date. Try ISO 8601, Unix timestamp, or relative formats like "2 days ago".');
    }
  }, [input]);

  // Update relative time live
  useEffect(() => {
    if (!parsedDate) return;
    const interval = setInterval(() => {
      setLiveRelative(getRelativeTime(parsedDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [parsedDate]);

  const setNow = () => {
    const now = new Date();
    setInput(now.toISOString());
    setParsedDate(now);
    setError('');
    setLiveRelative(getRelativeTime(now));
  };

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(String(text));
      setCopied(label);
      setTimeout(() => setCopied(''), 1500);
    } catch {}
  };

  const getTimezoneString = (date, tz) => {
    try {
      return date.toLocaleString('en-US', {
        timeZone: tz,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short',
      });
    } catch {
      return 'Invalid timezone';
    }
  };

  const formats = parsedDate
    ? [
        { label: 'ISO 8601', value: parsedDate.toISOString() },
        { label: 'Unix (seconds)', value: String(Math.floor(parsedDate.getTime() / 1000)) },
        { label: 'Unix (milliseconds)', value: String(parsedDate.getTime()) },
        { label: 'RFC 2822', value: parsedDate.toUTCString() },
        { label: 'Relative', value: liveRelative },
        { label: 'UTC String', value: parsedDate.toUTCString() },
        { label: 'Local String', value: parsedDate.toLocaleString() },
      ]
    : [];

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--text-light)',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
    fontWeight: 600,
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.625rem 0.75rem',
    borderBottom: '1px solid var(--border)',
    gap: '1rem',
  };

  const copyBtnStyle = {
    background: 'none',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    color: 'var(--text-light)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  };

  return (
    <div className="tool-container">
      {/* Input Section */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle}>Enter a date (any format)</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && convert()}
            placeholder="e.g. 2024-01-15T10:30:00Z, 1705312200, 2 days ago, tomorrow"
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={convert}>
            Convert
          </button>
          <button className="btn btn-secondary" onClick={setNow}>
            Now
          </button>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
          Supports: ISO 8601, Unix timestamp (seconds or ms), relative dates ("3 days ago", "in 2 hours"), natural language ("Jan 15 2024"), "yesterday", "tomorrow"
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="result-box"
          style={{
            color: '#ef4444',
            borderColor: '#ef4444',
            marginBottom: '1.5rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Results */}
      {parsedDate && (
        <>
          {/* All Formats */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Converted Formats
            </h3>
            <div className="result-box" style={{ padding: 0, overflow: 'hidden' }}>
              {formats.map((f, i) => (
                <div
                  key={f.label}
                  style={{
                    ...rowStyle,
                    borderBottom: i === formats.length - 1 ? 'none' : '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, minWidth: '120px', flexShrink: 0 }}>
                    {f.label}
                  </span>
                  <code style={{ fontFamily: "'Courier New', monospace", fontSize: '0.85rem', flex: 1, wordBreak: 'break-all' }}>
                    {f.value}
                  </code>
                  <button
                    style={copyBtnStyle}
                    onClick={() => copyText(f.value, f.label)}
                  >
                    {copied === f.label ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Timezone Converter */}
          <div>
            <h3 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Timezone Converter
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Select timezone</label>
              <select
                value={selectedTz}
                onChange={(e) => setSelectedTz(e.target.value)}
                style={{ width: '100%', maxWidth: '320px' }}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="result-box" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {TIMEZONES.find((t) => t.value === selectedTz)?.label || selectedTz}
                  </div>
                  <code style={{ fontFamily: "'Courier New', monospace", fontSize: '0.95rem' }}>
                    {getTimezoneString(parsedDate, selectedTz)}
                  </code>
                </div>
                <button
                  style={copyBtnStyle}
                  onClick={() => copyText(getTimezoneString(parsedDate, selectedTz), 'tz-selected')}
                >
                  {copied === 'tz-selected' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* All timezones at a glance */}
            <div className="stats-grid">
              {TIMEZONES.map((tz) => (
                <div
                  className="stat-card"
                  key={tz.value}
                  style={{ cursor: 'pointer' }}
                  onClick={() => copyText(getTimezoneString(parsedDate, tz.value), `tz-${tz.value}`)}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {tz.label}
                  </div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.8rem', wordBreak: 'break-word' }}>
                    {copied === `tz-${tz.value}` ? 'Copied!' : getTimezoneString(parsedDate, tz.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function DateConverterPage() {
  return (
    <div className="tool-page">
      <Link href="/" className="back-link">&larr; All Tools</Link>
      <h1>Date &amp; Time Converter <span className="badge badge-premium">Pro</span></h1>
      <p className="description">
        Convert dates between multiple formats instantly. Supports ISO 8601, Unix timestamps, relative dates, natural language, and timezone conversion.
      </p>
      <PremiumGate toolName="Date Converter">
        <DateConverterTool />
      </PremiumGate>
    </div>
  );
}
