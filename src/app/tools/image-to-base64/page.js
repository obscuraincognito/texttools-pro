'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import FileUpload from '../../../components/FileUpload';

export default function ImageToBase64Page() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [base64, setBase64] = useState('');
  const [dataUri, setDataUri] = useState('');
  const [copied, setCopied] = useState('');
  const [outputMode, setOutputMode] = useState('datauri'); // datauri | raw | html | css

  const handleFiles = useCallback((files) => {
    const f = files[0];
    setFile(f);
    setCopied('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setDataUri(result);
      setPreview(result);
      // Extract raw base64 (remove data:image/xxx;base64, prefix)
      const rawBase64 = result.split(',')[1] || '';
      setBase64(rawBase64);
    };
    reader.readAsDataURL(f);
  }, []);

  const getOutput = () => {
    switch (outputMode) {
      case 'raw':
        return base64;
      case 'html':
        return `<img src="${dataUri}" alt="${file?.name || 'image'}" />`;
      case 'css':
        return `background-image: url(${dataUri});`;
      case 'datauri':
      default:
        return dataUri;
    }
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const modes = [
    { key: 'datauri', label: 'Data URI' },
    { key: 'raw', label: 'Raw Base64' },
    { key: 'html', label: 'HTML <img>' },
    { key: 'css', label: 'CSS Background' },
  ];

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">
        ← Back to Tools
      </Link>
      <h1>Image to Base64</h1>
      <p className="description">
        Convert images to Base64-encoded strings for embedding directly in HTML, CSS, or JSON. No external file hosting needed.
      </p>

      <div className="tool-container">
        <FileUpload
          accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.svg,.ico,.bmp"
          multiple={false}
          maxSize={10 * 1024 * 1024}
          onFiles={handleFiles}
          label="Drop an image here or click to browse"
          sublabel="Supports all image formats up to 10MB"
        />

        {file && (
          <div style={{ marginTop: '1.25rem' }}>
            {/* File info + preview */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: 'var(--bg)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              marginBottom: '1.25rem',
            }}>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'contain',
                    borderRadius: '6px',
                    background: 'repeating-conic-gradient(#e2e8f0 0% 25%, transparent 0% 50%) 0 0 / 16px 16px',
                  }}
                />
              )}
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{file.name}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                  {file.type} · {formatSize(file.size)}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Base64 size: {formatSize(base64.length)} ({((base64.length / file.size) * 100).toFixed(0)}% of original)
                </div>
              </div>
            </div>

            {/* Output mode tabs */}
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              {modes.map((m) => (
                <button
                  key={m.key}
                  onClick={() => { setOutputMode(m.key); setCopied(''); }}
                  className={`btn ${outputMode === m.key ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Output */}
            <div style={{ position: 'relative' }}>
              <div
                className="result-box"
                style={{
                  maxHeight: '200px',
                  overflow: 'auto',
                  fontSize: '0.75rem',
                  wordBreak: 'break-all',
                }}
              >
                {getOutput()}
              </div>
              <button
                onClick={() => copyToClipboard(getOutput(), outputMode)}
                className="btn btn-primary"
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  padding: '0.25rem 0.625rem',
                  fontSize: '0.75rem',
                }}
              >
                {copied === outputMode ? '✓ Copied!' : 'Copy'}
              </button>
            </div>

            {/* Quick copy all formats */}
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => copyToClipboard(dataUri, 'datauri-btn')}
                className="btn btn-secondary"
                style={{ fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}
              >
                {copied === 'datauri-btn' ? '✓ Copied!' : 'Copy Data URI'}
              </button>
              <button
                onClick={() => copyToClipboard(base64, 'raw-btn')}
                className="btn btn-secondary"
                style={{ fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}
              >
                {copied === 'raw-btn' ? '✓ Copied!' : 'Copy Raw Base64'}
              </button>
              <button
                onClick={() => copyToClipboard(`<img src="${dataUri}" alt="${file.name}" />`, 'html-btn')}
                className="btn btn-secondary"
                style={{ fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}
              >
                {copied === 'html-btn' ? '✓ Copied!' : 'Copy HTML'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
