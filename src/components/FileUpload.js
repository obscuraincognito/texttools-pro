'use client';

import { useState, useRef, useCallback } from 'react';

export default function FileUpload({
  accept = '*',
  multiple = false,
  maxSize = 50 * 1024 * 1024, // 50MB default
  onFiles,
  label = 'Drop files here or click to browse',
  sublabel = '',
}) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (fileList) => {
      setError('');
      const files = Array.from(fileList);

      // Check file sizes
      const oversized = files.find((f) => f.size > maxSize);
      if (oversized) {
        setError(`File "${oversized.name}" exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit.`);
        return;
      }

      // Check accept types
      if (accept !== '*') {
        const acceptTypes = accept.split(',').map((t) => t.trim().toLowerCase());
        const invalid = files.find((f) => {
          const ext = '.' + f.name.split('.').pop().toLowerCase();
          const mime = f.type.toLowerCase();
          return !acceptTypes.some(
            (t) => t === ext || t === mime || (t.endsWith('/*') && mime.startsWith(t.replace('/*', '/')))
          );
        });
        if (invalid) {
          setError(`File "${invalid.name}" is not a supported format.`);
          return;
        }
      }

      if (!multiple && files.length > 1) {
        setError('Please upload only one file.');
        return;
      }

      onFiles(files);
    },
    [accept, maxSize, multiple, onFiles]
  );

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div>
      <div
        className={`file-upload-zone ${dragActive ? 'file-upload-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{label}</p>
        {sublabel && <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{sublabel}</p>}
      </div>
      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>
      )}
    </div>
  );
}
