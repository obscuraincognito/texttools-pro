'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  try {
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function formatExpiry(exp) {
  if (!exp) return null;
  const d = new Date(exp * 1000);
  const now = Date.now();
  const diff = d.getTime() - now;
  const expired = diff < 0;
  const absDiff = Math.abs(diff);
  let relative;
  if (absDiff < 60000) relative = `${Math.floor(absDiff / 1000)}s`;
  else if (absDiff < 3600000) relative = `${Math.floor(absDiff / 60000)}m`;
  else if (absDiff < 86400000) relative = `${Math.floor(absDiff / 3600000)}h`;
  else relative = `${Math.floor(absDiff / 86400000)}d`;
  return {
    date: d.toLocaleString(),
    expired,
    relative: expired ? `Expired ${relative} ago` : `Expires in ${relative}`,
  };
}

const CLAIM_LABELS = {
  iss: 'Issuer', sub: 'Subject', aud: 'Audience', exp: 'Expiration',
  nbf: 'Not Before', iat: 'Issued At', jti: 'JWT ID',
};

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState('');

  const decode = () => {
    setError('');
    setHeader(null);
    setPayload(null);
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT: must have 3 parts separated by dots (header.payload.signature)');
      return;
    }
    const h = base64UrlDecode(parts[0]);
    const p = base64UrlDecode(parts[1]);
    if (!h) { setError('Could not decode JWT header'); return; }
    if (!p) { setError('Could not decode JWT payload'); return; }
    setHeader(h);
    setPayload(p);
  };

  const expInfo = payload?.exp ? formatExpiry(payload.exp) : null;
  const iatInfo = payload?.iat ? new Date(payload.iat * 1000).toLocaleString() : null;

  const sectionStyle = {
    background: 'var(--bg-secondary)', borderRadius: 'var(--radius)',
    border: '1px solid var(--border)', padding: '1rem', marginBottom: '1rem',
  };

  return (
    <PremiumGate toolName="JWT Decoder">
      <div className="tool-page">
        <Link href="/" className="back-link">&larr; All Tools</Link>
        <h1>JWT Decoder</h1>
        <p className="description">Decode and inspect JSON Web Tokens. View header, payload, claims, and expiration status.</p>

        <div className="tool-container">
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Paste JWT Token</label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0..."
            rows={5}
            style={{ fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all' }}
          />
          <button className="btn btn-primary" onClick={decode} style={{ marginTop: '0.75rem' }}>Decode Token</button>

          {error && <div style={{ marginTop: '0.75rem', color: '#ef4444', fontSize: '0.9rem' }}>{error}</div>}

          {header && (
            <div style={{ marginTop: '1.5rem' }}>
              {/* Header */}
              <div style={sectionStyle}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>Header</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                  {Object.entries(header).map(([k, v]) => (
                    <div key={k} style={{ padding: '0.5rem', background: 'var(--bg)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>{k}</div>
                      <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.9rem' }}>{String(v)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expiration Status */}
              {expInfo && (
                <div style={{
                  ...sectionStyle,
                  borderColor: expInfo.expired ? '#ef4444' : '#22c55e',
                  background: expInfo.expired ? 'rgba(239,68,68,0.05)' : 'rgba(34,197,94,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: expInfo.expired ? '#ef4444' : '#22c55e',
                    }} />
                    <div>
                      <div style={{ fontWeight: 700, color: expInfo.expired ? '#ef4444' : '#22c55e' }}>
                        {expInfo.expired ? 'TOKEN EXPIRED' : 'TOKEN VALID'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{expInfo.relative} &middot; {expInfo.date}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payload */}
              <div style={sectionStyle}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>Payload Claims</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {Object.entries(payload).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {CLAIM_LABELS[k] ? `${CLAIM_LABELS[k]} (${k})` : k}
                      </span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-light)', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>
                        {(k === 'exp' || k === 'iat' || k === 'nbf') && typeof v === 'number'
                          ? `${v} (${new Date(v * 1000).toLocaleString()})`
                          : typeof v === 'object' ? JSON.stringify(v) : String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw JSON */}
              <div style={sectionStyle}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>Raw JSON</div>
                <pre style={{ fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>
                  {JSON.stringify({ header, payload }, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </PremiumGate>
  );
}
