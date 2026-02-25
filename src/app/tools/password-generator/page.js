'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [passwords, setPasswords] = useState([]);

  const generate = useCallback(() => {
    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setPassword('Select at least one character type');
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    const result = Array.from(array, (n) => chars[n % chars.length]).join('');
    setPassword(result);
  }, [length, uppercase, lowercase, numbers, symbols]);

  const generateBulk = () => {
    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) return;

    const results = [];
    for (let i = 0; i < 10; i++) {
      const array = new Uint32Array(length);
      crypto.getRandomValues(array);
      results.push(Array.from(array, (n) => chars[n % chars.length]).join(''));
    }
    setPasswords(results);
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text || password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    if (!password || password === 'Select at least one character type') return { label: '', color: '' };
    let poolSize = 0;
    if (uppercase) poolSize += 26;
    if (lowercase) poolSize += 26;
    if (numbers) poolSize += 10;
    if (symbols) poolSize += 26;
    const entropy = Math.log2(Math.pow(poolSize, length));

    if (entropy < 40) return { label: 'Weak', color: 'var(--danger)' };
    if (entropy < 60) return { label: 'Fair', color: '#f59e0b' };
    if (entropy < 80) return { label: 'Strong', color: '#10b981' };
    return { label: 'Very Strong', color: '#059669' };
  };

  const strength = getStrength();

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">&larr; All Tools</Link>
      <h1>Password Generator</h1>
      <p className="description">Generate secure, random passwords with customizable options.</p>

      <div className="tool-container">
        {password && (
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <code style={{ fontSize: '1.125rem', wordBreak: 'break-all', flex: 1 }}>{password}</code>
            <button className="btn btn-secondary" style={{ marginLeft: '1rem', whiteSpace: 'nowrap' }} onClick={() => copy()}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}

        {strength.label && (
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Strength: </span>
            <strong style={{ color: strength.color }}>{strength.label}</strong>
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Length: {length}
          </label>
          <input
            type="range"
            min="4"
            max="128"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)' }}>
            <span>4</span><span>128</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          {[
            { label: 'Uppercase (A-Z)', state: uppercase, set: setUppercase },
            { label: 'Lowercase (a-z)', state: lowercase, set: setLowercase },
            { label: 'Numbers (0-9)', state: numbers, set: setNumbers },
            { label: 'Symbols (!@#$)', state: symbols, set: setSymbols },
          ].map((opt) => (
            <label key={opt.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={opt.state}
                onChange={(e) => opt.set(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              {opt.label}
            </label>
          ))}
        </div>

        <div className="btn-group">
          <button className="btn btn-primary" onClick={generate}>Generate Password</button>
          <button className="btn btn-secondary" onClick={generateBulk}>Generate 10</button>
        </div>

        {passwords.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            {passwords.map((pw, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: i % 2 === 0 ? 'var(--bg)' : 'transparent', borderRadius: '4px', fontSize: '0.875rem' }}>
                <code style={{ wordBreak: 'break-all', flex: 1 }}>{pw}</code>
                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginLeft: '0.5rem' }} onClick={() => copy(pw)}>
                  Copy
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
