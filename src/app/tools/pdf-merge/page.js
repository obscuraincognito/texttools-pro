'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import FileUpload from '../../../components/FileUpload';

export default function PdfMergePage() {
  const [files, setFiles] = useState([]);
  const [merging, setMerging] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFiles = useCallback((newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResult(null);
    setError('');
  }, []);

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const moveFile = (index, direction) => {
    const newFiles = [...files];
    const target = index + direction;
    if (target < 0 || target >= newFiles.length) return;
    [newFiles[index], newFiles[target]] = [newFiles[target], newFiles[index]];
    setFiles(newFiles);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }

    setMerging(true);
    setError('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setResult({
        url,
        size: mergedBytes.length,
        pageCount: mergedPdf.getPageCount(),
      });
    } catch (err) {
      setError('Failed to merge PDFs. Make sure all files are valid PDFs.');
      console.error(err);
    } finally {
      setMerging(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">
        ← Back to Tools
      </Link>
      <h1>PDF Merge</h1>
      <p className="description">
        Combine multiple PDF files into one document. Drag to reorder, then merge. 100% browser-based — your files never leave your device.
      </p>

      <div className="tool-container">
        <FileUpload
          accept=".pdf,application/pdf"
          multiple={true}
          maxSize={100 * 1024 * 1024}
          onFiles={handleFiles}
          label="Drop PDF files here or click to browse"
          sublabel="Supports multiple PDFs up to 100MB each"
        />

        {files.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {files.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: 'var(--bg)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '24px' }}>
                    {i + 1}.
                  </span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatSize(file.size)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      onClick={() => moveFile(i, -1)}
                      disabled={i === 0}
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', opacity: i === 0 ? 0.3 : 1 }}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveFile(i, 1)}
                      disabled={i === files.length - 1}
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', opacity: i === files.length - 1 ? 0.3 : 1 }}
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeFile(i)}
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="btn-group" style={{ marginTop: '1rem' }}>
              <button
                onClick={mergePdfs}
                className="btn btn-primary"
                disabled={merging || files.length < 2}
              >
                {merging ? 'Merging...' : `Merge ${files.length} PDFs`}
              </button>
              <button
                onClick={() => { setFiles([]); setResult(null); setError(''); }}
                className="btn btn-secondary"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.75rem' }}>{error}</p>
        )}

        {result && (
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#ecfdf5', borderRadius: 'var(--radius)', border: '1px solid #a7f3d0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#065f46', marginBottom: '0.5rem' }}>
              ✓ Merge Complete!
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#047857', marginBottom: '0.75rem' }}>
              {result.pageCount} pages · {formatSize(result.size)}
            </p>
            <a
              href={result.url}
              download="merged.pdf"
              className="btn btn-primary"
            >
              Download Merged PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
