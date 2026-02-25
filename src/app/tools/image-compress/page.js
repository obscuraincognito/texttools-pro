'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import FileUpload from '../../../components/FileUpload';

export default function ImageCompressPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quality, setQuality] = useState(80);
  const [compressing, setCompressing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const handleFiles = useCallback((files) => {
    const f = files[0];
    setFile(f);
    setResult(null);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }, []);

  const compressImage = async () => {
    if (!file || !preview) return;

    setCompressing(true);
    setError('');

    try {
      const img = new Image();
      img.src = preview;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const qualityValue = mimeType === 'image/png' ? undefined : quality / 100;

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, mimeType, qualityValue);
      });

      const url = URL.createObjectURL(blob);

      setResult({
        url,
        originalSize: file.size,
        compressedSize: blob.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
        mimeType,
      });
    } catch {
      setError('Failed to compress image. Please try a different file.');
    } finally {
      setCompressing(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const savings = result
    ? Math.max(0, ((1 - result.compressedSize / result.originalSize) * 100)).toFixed(1)
    : 0;

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">
        ← Back to Tools
      </Link>
      <h1>Image Compress</h1>
      <p className="description">
        Reduce image file size while preserving quality. Adjust the quality slider and download the optimized result. 100% browser-based.
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
                  {formatSize(file.size)} · {file.type}
                </div>
              </div>
            </div>

            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Quality: {quality}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={quality}
              onChange={(e) => { setQuality(Number(e.target.value)); setResult(null); }}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>

            <button
              onClick={compressImage}
              className="btn btn-primary"
              disabled={compressing}
            >
              {compressing ? 'Compressing...' : 'Compress Image'}
            </button>
          </div>
        )}

        {result && (
          <div style={{ marginTop: '1.5rem' }}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="value">{formatSize(result.originalSize)}</div>
                <div className="label">Original</div>
              </div>
              <div className="stat-card">
                <div className="value">{formatSize(result.compressedSize)}</div>
                <div className="label">Compressed</div>
              </div>
              <div className="stat-card">
                <div className="value" style={{ color: Number(savings) > 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {savings}%
                </div>
                <div className="label">Saved</div>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <a
                href={result.url}
                download={`compressed-${file.name}`}
                className="btn btn-primary"
              >
                Download Compressed Image
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
