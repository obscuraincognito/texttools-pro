'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import FileUpload from '../../../components/FileUpload';

export default function ImageResizePage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [originalDims, setOriginalDims] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockAspect, setLockAspect] = useState(true);
  const [resizing, setResizing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const aspectRatio = useRef(1);

  const handleFiles = useCallback((files) => {
    const f = files[0];
    setFile(f);
    setResult(null);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      const img = new Image();
      img.onload = () => {
        setOriginalDims({ width: img.naturalWidth, height: img.naturalHeight });
        setWidth(String(img.naturalWidth));
        setHeight(String(img.naturalHeight));
        aspectRatio.current = img.naturalWidth / img.naturalHeight;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(f);
  }, []);

  const handleWidthChange = (val) => {
    setWidth(val);
    setResult(null);
    if (lockAspect && val) {
      setHeight(String(Math.round(Number(val) / aspectRatio.current)));
    }
  };

  const handleHeightChange = (val) => {
    setHeight(val);
    setResult(null);
    if (lockAspect && val) {
      setWidth(String(Math.round(Number(val) * aspectRatio.current)));
    }
  };

  const applyPreset = (w, h) => {
    setWidth(String(w));
    setHeight(String(h));
    setLockAspect(false);
    setResult(null);
  };

  const resizeImage = async () => {
    if (!file || !preview || !width || !height) return;

    const w = Number(width);
    const h = Number(height);
    if (w <= 0 || h <= 0 || w > 10000 || h > 10000) {
      setError('Dimensions must be between 1 and 10,000 pixels.');
      return;
    }

    setResizing(true);
    setError('');

    try {
      const img = new Image();
      img.src = preview;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      // Use high-quality resampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, mimeType, 0.92);
      });

      const url = URL.createObjectURL(blob);

      setResult({
        url,
        originalSize: file.size,
        newSize: blob.size,
        width: w,
        height: h,
      });
    } catch {
      setError('Failed to resize image. Please try a different file.');
    } finally {
      setResizing(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const presets = [
    { label: 'Profile (400×400)', w: 400, h: 400 },
    { label: 'HD (1280×720)', w: 1280, h: 720 },
    { label: 'Full HD (1920×1080)', w: 1920, h: 1080 },
    { label: 'Twitter Header (1500×500)', w: 1500, h: 500 },
    { label: 'Instagram (1080×1080)', w: 1080, h: 1080 },
    { label: 'OG Image (1200×630)', w: 1200, h: 630 },
  ];

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">
        ← Back to Tools
      </Link>
      <h1>Image Resize</h1>
      <p className="description">
        Resize images to exact dimensions with aspect ratio lock. Choose from presets or enter custom sizes. 100% browser-based.
      </p>

      <div className="tool-container">
        <FileUpload
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          multiple={false}
          maxSize={50 * 1024 * 1024}
          onFiles={handleFiles}
          label="Drop an image here or click to browse"
          sublabel="Supports JPEG, PNG, WebP up to 50MB"
        />

        {file && preview && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              background: 'var(--bg)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              marginBottom: '1rem',
            }}>
              <img
                src={preview}
                alt="Preview"
                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{file.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {originalDims.width} × {originalDims.height} · {formatSize(file.size)}
                </div>
              </div>
            </div>

            {/* Dimension Inputs */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'end', marginBottom: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  min="1"
                  max="10000"
                />
              </div>
              <button
                onClick={() => setLockAspect(!lockAspect)}
                className="btn btn-secondary"
                style={{ padding: '0.75rem', marginBottom: '0' }}
                title={lockAspect ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
              >
                {lockAspect ? '🔒' : '🔓'}
              </button>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  min="1"
                  max="10000"
                />
              </div>
            </div>

            {/* Presets */}
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Quick Presets</p>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.w, p.h)}
                    className="btn btn-secondary"
                    style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={resizeImage}
              className="btn btn-primary"
              disabled={resizing || !width || !height}
            >
              {resizing ? 'Resizing...' : `Resize to ${width} × ${height}`}
            </button>
          </div>
        )}

        {result && (
          <div style={{ marginTop: '1.5rem' }}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="value">{originalDims.width}×{originalDims.height}</div>
                <div className="label">Original</div>
              </div>
              <div className="stat-card">
                <div className="value">{result.width}×{result.height}</div>
                <div className="label">New Size</div>
              </div>
              <div className="stat-card">
                <div className="value">{formatSize(result.newSize)}</div>
                <div className="label">File Size</div>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <a
                href={result.url}
                download={`resized-${file.name}`}
                className="btn btn-primary"
              >
                Download Resized Image
              </a>
            </div>
          </div>
        )}

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.75rem' }}>{error}</p>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
