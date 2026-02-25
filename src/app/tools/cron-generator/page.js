'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

const PRESETS = [
  { label: 'Every minute', cron: '* * * * *' },
  { label: 'Every 5 minutes', cron: '*/5 * * * *' },
  { label: 'Every 15 minutes', cron: '*/15 * * * *' },
  { label: 'Every hour', cron: '0 * * * *' },
  { label: 'Every 6 hours', cron: '0 */6 * * *' },
  { label: 'Every day at midnight', cron: '0 0 * * *' },
  { label: 'Every day at noon', cron: '0 12 * * *' },
  { label: 'Every Monday at 9 AM', cron: '0 9 * * 1' },
  { label: 'Every weekday at 9 AM', cron: '0 9 * * 1-5' },
  { label: 'First day of month', cron: '0 0 1 * *' },
  { label: 'Every Sunday at midnight', cron: '0 0 * * 0' },
  { label: 'Every January 1st', cron: '0 0 1 1 *' },
];

const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function describeCron(cron) {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return 'Invalid cron expression (need 5 fields)';
  const [min, hour, dom, month, dow] = parts;

  const pieces = [];

  // Minute
  if (min === '*') pieces.push('Every minute');
  else if (min.startsWith('*/')) pieces.push(`Every ${min.slice(2)} minutes`);
  else pieces.push(`At minute ${min}`);

  // Hour
  if (hour === '*') { /* already covered */ }
  else if (hour.startsWith('*/')) pieces.push(`every ${hour.slice(2)} hours`);
  else {
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    pieces.push(`at ${h12}:${min === '*' ? '00' : min.padStart(2, '0')} ${ampm}`);
  }

  // Day of month
  if (dom !== '*') {
    if (dom.startsWith('*/')) pieces.push(`every ${dom.slice(2)} days`);
    else pieces.push(`on day ${dom} of the month`);
  }

  // Month
  if (month !== '*') {
    if (month.startsWith('*/')) pieces.push(`every ${month.slice(2)} months`);
    else {
      const m = parseInt(month);
      pieces.push(`in ${MONTHS[m] || month}`);
    }
  }

  // Day of week
  if (dow !== '*') {
    if (dow.includes('-')) {
      const [start, end] = dow.split('-').map(Number);
      pieces.push(`${DAYS[start] || start} through ${DAYS[end] || end}`);
    } else if (dow.includes(',')) {
      const dayNames = dow.split(',').map((d) => DAYS[parseInt(d)] || d).join(', ');
      pieces.push(`on ${dayNames}`);
    } else {
      pieces.push(`on ${DAYS[parseInt(dow)] || dow}`);
    }
  }

  return pieces.join(', ');
}

function getNextRuns(cron, count = 5) {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  const [minP, hourP, domP, monthP, dowP] = parts;

  const runs = [];
  const now = new Date();
  let check = new Date(now);
  check.setSeconds(0, 0);
  check.setMinutes(check.getMinutes() + 1);

  const maxIterations = 525600; // 1 year of minutes
  for (let i = 0; i < maxIterations && runs.length < count; i++) {
    if (matchField(check.getMinutes(), minP, 0, 59) &&
        matchField(check.getHours(), hourP, 0, 23) &&
        matchField(check.getDate(), domP, 1, 31) &&
        matchField(check.getMonth() + 1, monthP, 1, 12) &&
        matchField(check.getDay(), dowP, 0, 6)) {
      runs.push(new Date(check));
    }
    check.setMinutes(check.getMinutes() + 1);
  }
  return runs;
}

function matchField(value, pattern, min, max) {
  if (pattern === '*') return true;
  if (pattern.startsWith('*/')) {
    const step = parseInt(pattern.slice(2));
    return value % step === 0;
  }
  if (pattern.includes(',')) {
    return pattern.split(',').map(Number).includes(value);
  }
  if (pattern.includes('-')) {
    const [start, end] = pattern.split('-').map(Number);
    return value >= start && value <= end;
  }
  return parseInt(pattern) === value;
}

export default function CronGenerator() {
  const [cron, setCron] = useState('0 * * * *');
  const [fields, setFields] = useState({ minute: '0', hour: '*', dom: '*', month: '*', dow: '*' });
  const [nextRuns, setNextRuns] = useState([]);

  useEffect(() => {
    setCron(`${fields.minute} ${fields.hour} ${fields.dom} ${fields.month} ${fields.dow}`);
  }, [fields]);

  useEffect(() => {
    setNextRuns(getNextRuns(cron));
  }, [cron]);

  const handleCronInput = (val) => {
    setCron(val);
    const parts = val.trim().split(/\s+/);
    if (parts.length === 5) {
      setFields({ minute: parts[0], hour: parts[1], dom: parts[2], month: parts[3], dow: parts[4] });
    }
  };

  const applyPreset = (preset) => {
    handleCronInput(preset.cron);
  };

  const fieldStyle = { flex: 1, textAlign: 'center' };
  const labelStyle = { display: 'block', fontSize: '0.7rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600, textAlign: 'center' };

  return (
    <PremiumGate toolName="Cron Expression Generator">
      <div className="tool-page">
        <Link href="/" className="back-link">&larr; All Tools</Link>
        <h1>Cron Expression Generator</h1>
        <p className="description">Build and understand cron expressions visually. See next run times and human-readable descriptions.</p>

        <div className="tool-container">
          {/* Main expression input */}
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Cron Expression</label>
          <input
            type="text"
            value={cron}
            onChange={(e) => handleCronInput(e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '0.1em', fontWeight: 700 }}
          />

          {/* Human-readable description */}
          <div style={{ margin: '1rem 0', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center', fontSize: '1rem', fontWeight: 500 }}>
            {describeCron(cron)}
          </div>

          {/* Field editors */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Minute</label>
              <input type="text" value={fields.minute} onChange={(e) => setFields({ ...fields, minute: e.target.value })} style={{ textAlign: 'center', fontFamily: 'monospace' }} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Hour</label>
              <input type="text" value={fields.hour} onChange={(e) => setFields({ ...fields, hour: e.target.value })} style={{ textAlign: 'center', fontFamily: 'monospace' }} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Day (Month)</label>
              <input type="text" value={fields.dom} onChange={(e) => setFields({ ...fields, dom: e.target.value })} style={{ textAlign: 'center', fontFamily: 'monospace' }} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Month</label>
              <input type="text" value={fields.month} onChange={(e) => setFields({ ...fields, month: e.target.value })} style={{ textAlign: 'center', fontFamily: 'monospace' }} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Day (Week)</label>
              <input type="text" value={fields.dow} onChange={(e) => setFields({ ...fields, dow: e.target.value })} style={{ textAlign: 'center', fontFamily: 'monospace' }} />
            </div>
          </div>

          {/* Presets */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>Quick Presets</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {PRESETS.map((p) => (
                <button
                  key={p.cron}
                  className="btn btn-secondary"
                  onClick={() => applyPreset(p)}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Next runs */}
          {nextRuns.length > 0 && (
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>Next 5 Run Times</div>
              {nextRuns.map((d, i) => (
                <div key={i} style={{
                  padding: '0.5rem 0',
                  borderBottom: i < nextRuns.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}>
                  <span>{d.toLocaleString()}</span>
                  <span style={{ color: 'var(--text-light)' }}>
                    {(() => {
                      const diff = Math.floor((d.getTime() - Date.now()) / 60000);
                      if (diff < 60) return `in ${diff}m`;
                      if (diff < 1440) return `in ${Math.floor(diff / 60)}h ${diff % 60}m`;
                      return `in ${Math.floor(diff / 1440)}d ${Math.floor((diff % 1440) / 60)}h`;
                    })()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PremiumGate>
  );
}
