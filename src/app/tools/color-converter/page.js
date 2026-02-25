'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function generateShades(hex, count = 8) {
  const { r, g, b } = hexToRgb(hex);
  const shades = [];
  for (let i = 0; i <= count; i++) {
    const factor = i / count;
    shades.push(rgbToHex(
      Math.round(r + (255 - r) * (1 - factor) * 0 + (0 - r) * factor * 0 + r * (1 - factor * 0.85)),
      Math.round(g + (255 - g) * (1 - factor) * 0 + (0 - g) * factor * 0 + g * (1 - factor * 0.85)),
      Math.round(b + (255 - b) * (1 - factor) * 0 + (0 - b) * factor * 0 + b * (1 - factor * 0.85))
    ));
  }
  return shades;
}

function generateTints(hex, count = 8) {
  const { r, g, b } = hexToRgb(hex);
  const tints = [];
  for (let i = 0; i <= count; i++) {
    const factor = i / count;
    tints.push(rgbToHex(
      Math.round(r + (255 - r) * factor),
      Math.round(g + (255 - g) * factor),
      Math.round(b + (255 - b) * factor)
    ));
  }
  return tints;
}

function ColorTool() {
  const [hex, setHex] = useState('#2563eb');
  const [copied, setCopied] = useState('');

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const shades = generateShades(hex);
  const tints = generateTints(hex);

  const copyValue = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleHexInput = (val) => {
    if (!val.startsWith('#')) val = '#' + val;
    setHex(val);
  };

  const handleRgbInput = (channel, value) => {
    const newRgb = { ...rgb, [channel]: Number(value) || 0 };
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHslInput = (channel, value) => {
    const newHsl = { ...hsl, [channel]: Number(value) || 0 };
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const formats = [
    { label: 'HEX', value: hex.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'CSS RGB', value: `${rgb.r}, ${rgb.g}, ${rgb.b}` },
  ];

  return (
    <div className="tool-container">
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ width: '200px', height: '200px', background: hex, borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '0.75rem' }} />
          <input type="color" value={hex.length === 7 ? hex : '#000000'} onChange={(e) => setHex(e.target.value)} style={{ width: '100%', height: '40px', cursor: 'pointer', border: 'none' }} />
        </div>

        <div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>HEX</label>
            <input type="text" value={hex} onChange={(e) => handleHexInput(e.target.value)} style={{ fontFamily: "'Courier New', monospace" }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>R</label>
              <input type="number" min="0" max="255" value={rgb.r} onChange={(e) => handleRgbInput('r', e.target.value)} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>G</label>
              <input type="number" min="0" max="255" value={rgb.g} onChange={(e) => handleRgbInput('g', e.target.value)} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>B</label>
              <input type="number" min="0" max="255" value={rgb.b} onChange={(e) => handleRgbInput('b', e.target.value)} style={{ width: '100%' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>H</label>
              <input type="number" min="0" max="360" value={hsl.h} onChange={(e) => handleHslInput('h', e.target.value)} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>S%</label>
              <input type="number" min="0" max="100" value={hsl.s} onChange={(e) => handleHslInput('s', e.target.value)} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>L%</label>
              <input type="number" min="0" max="100" value={hsl.l} onChange={(e) => handleHslInput('l', e.target.value)} style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {formats.map((f) => (
          <button key={f.label} onClick={() => copyValue(f.value, f.label)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: '0.8125rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-light)' }}>{f.label}</span>
            <code>{copied === f.label ? 'Copied!' : f.value}</code>
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Shades</h3>
        <div style={{ display: 'flex', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {shades.map((shade, i) => (
            <div key={i} onClick={() => { setHex(shade); copyValue(shade, 'shade'); }} style={{ flex: 1, height: '50px', background: shade, cursor: 'pointer' }} title={shade} />
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Tints</h3>
        <div style={{ display: 'flex', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {tints.map((tint, i) => (
            <div key={i} onClick={() => { setHex(tint); copyValue(tint, 'tint'); }} style={{ flex: 1, height: '50px', background: tint, cursor: 'pointer' }} title={tint} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ColorConverterPage() {
  return (
    <div className="tool-page">
      <Link href="/" className="back-link">&larr; All Tools</Link>
      <h1>Color Converter <span className="badge badge-premium">Pro</span></h1>
      <p className="description">Convert colors between HEX, RGB, and HSL. Generate shades and tints.</p>
      <PremiumGate>
        <ColorTool />
      </PremiumGate>
    </div>
  );
}
