'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

export default function PlaceholderImagePage() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [bgColor, setBgColor] = useState('#e2e8f0');
  const [textColor, setTextColor] = useState('#64748b');
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(0); // 0 = auto
  const [format, setFormat] = useState('png');
  const [preview, setPreview] = useState(null);
  const canvasRef = useRef(null);

  const displayText = text || `${width} × ${height}`;

  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Text
    const autoSize = fontSize || Math.min(width, height) / 8;
    ctx.fillStyle = textColor;
    ctx.font = `600 ${autoSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, width / 2, height / 2);

    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const dataUrl = canvas.toDataURL(mimeType, 0.92);
    setPreview(dataUrl);
  }, [width, height, bgColor, textColor, displayText, fontSize, format]);

  const downloadImage = () => {
    if (!preview) return;
    const a = document.createElement('a');
    a.href = preview;
    a.download = `placeholder-${width}x${height}.${format}`;
    a.click();
  };

  const copyDataUri = async () => {
    if (!preview) return;
    try {
      await navigator.clipboard.writeText(preview);
    } catch {}
  };

  const presets = [
    { label: 'Social Card (1200×630)', w: 1200, h: 630 },
    { label: 'Instagram Post (1080×1080)', w: 1080, h: 1080 },
    { label: 'HD (1920×1080)', w: 1920, h: 1080 },
    { label: 'Thumbnail (300×200)', w: 300, h: 200 },
    { label: 'Avatar (200×200)', w: 200, h: 200 },
    { label: 'Banner (728×90)', w: 728, h: 90 },
  ];

  const colorPresets = [
    { bg: '#e2e8f0', text: '#64748b', label: 'Gray' },
    { bg: '#dbeafe', text: '#1d4ed8', label: 'Blue' },
    { bg: '#dcfce7', text: '#15803d', label: 'Green' },
    { bg: '#fef3c7', text: '#b45309', label: 'Yellow' },
    { bg: '#fce7f3', text: '#be185d', label: 'Pink' },
    { bg: '#1e293b', text: '#94a3b8', label: 'Dark' },
  ];

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">← Back to Tools</Link>
      <h1>Placeholder Image Generator</h1>
      <p className="description">
        Generate custom placeholder images for mockups, wireframes, and development. Choose dimensions, colors, and text.
      </p>

      <PremiumGate toolName="Placeholder Image Generator">
        <div className="tool-container">
          {/* Dimensions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Width (px)</label>
              <input type="number" value={width} onChange={(e) => setWidth(Math.max(1, Math.min(4000, Number(e.target.value))))} min="1" max="4000" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Height (px)</label>
              <input type="number" value={height} onChange={(e) => setHeight(Math.max(1, Math.min(4000, Number(e.target.value))))} min="1" max="4000" />
            </div>
          </div>

          {/* Size Presets */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>Quick Sizes</label>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              {presets.map((p) => (
                <button key={p.label} onClick={() => { setWidth(p.w); setHeight(p.h); }} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Background Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: '40px', height: '36px', padding: 0, border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }} />
                <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Text Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} style={{ width: '40px', height: '36px', padding: 0, border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }} />
                <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
          </div>

          {/* Color Presets */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>Color Themes</label>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              {colorPresets.map((c) => (
                <button
                  key={c.label}
                  onClick={() => { setBgColor(c.bg); setTextColor(c.text); }}
                  style={{
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem',
                    background: c.bg,
                    color: c.text,
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Custom Text <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(leave blank for dimensions)</span>
            </label>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder={`${width} × ${height}`} />
          </div>

          {/* Font Size + Format */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Font Size <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(0 = auto)</span>
              </label>
              <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} min="0" max="500" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Format</label>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                <button onClick={() => setFormat('png')} className={`btn ${format === 'png' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, justifyContent: 'center', padding: '0.5rem' }}>PNG</button>
                <button onClick={() => setFormat('jpg')} className={`btn ${format === 'jpg' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, justifyContent: 'center', padding: '0.5rem' }}>JPG</button>
              </div>
            </div>
          </div>

          <button onClick={generateImage} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Generate Image
          </button>

          {preview && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{
                background: 'repeating-conic-gradient(#e2e8f0 0% 25%, transparent 0% 50%) 0 0 / 16px 16px',
                borderRadius: 'var(--radius)',
                padding: '1rem',
                textAlign: 'center',
                border: '1px solid var(--border)',
              }}>
                <img
                  src={preview}
                  alt={`${width}×${height} placeholder`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '4px',
                    boxShadow: 'var(--shadow)',
                  }}
                />
              </div>
              <div className="btn-group" style={{ marginTop: '0.75rem' }}>
                <button onClick={downloadImage} className="btn btn-primary">Download {format.toUpperCase()}</button>
                <button onClick={copyDataUri} className="btn btn-secondary">Copy Data URI</button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </PremiumGate>
    </div>
  );
}
