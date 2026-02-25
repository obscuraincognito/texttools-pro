'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';

export default function QrGenerator() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState('M');
  const canvasRef = useRef(null);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    if (!text.trim() || !canvasRef.current) return;
    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorLevel,
      });
      setGenerated(true);
    } catch {
      alert('Could not generate QR code. Check your input.');
    }
  };

  useEffect(() => {
    generate();
  }, []);

  const download = (format) => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    if (format === 'png') {
      link.download = 'qrcode.png';
      link.href = canvasRef.current.toDataURL('image/png');
    } else {
      link.download = 'qrcode.jpg';
      link.href = canvasRef.current.toDataURL('image/jpeg', 0.95);
    }
    link.click();
  };

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">&larr; All Tools</Link>
      <h1>QR Code Generator</h1>
      <p className="description">Generate QR codes for URLs, text, emails, phone numbers, or any data. Download as PNG or JPG.</p>

      <div className="tool-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Content</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL, text, email, phone number..."
              rows={4}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '1rem 0' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Size (px)</label>
                <input type="number" min="100" max="1000" value={size} onChange={(e) => setSize(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Error Correction</label>
                <select value={errorLevel} onChange={(e) => setErrorLevel(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Foreground</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ width: '40px', height: '36px', border: 'none', cursor: 'pointer' }} />
                  <input type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Background</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: '40px', height: '36px', border: 'none', cursor: 'pointer' }} />
                  <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={generate} style={{ width: '100%' }}>
              Generate QR Code
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
            {generated && (
              <div className="btn-group" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => download('png')}>Download PNG</button>
                <button className="btn btn-secondary" onClick={() => download('jpg')}>Download JPG</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
