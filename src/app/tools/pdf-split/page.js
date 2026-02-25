'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import FileUpload from '../../../components/FileUpload';

export default function PdfSplitPage() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [rangeInput, setRangeInput] = useState('');
  const [splitting, setSplitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFiles = useCallback(async (files) => {
    const f = files[0];
    setFile(f);
    setResult(null);
    setError('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const count = pdf.getPageCount();
      setPageCount(count);
      setRangeInput(`1-${count}`);
    } catch {
      setError('Could not read PDF. Make sure it\'s a valid PDF file.');
    }
  }, []);

  const parseRanges = (input, max) => {
    const ranges = [];
    const parts = input.split(',').map((p) => p.trim()).filter(Boolean);

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (isNaN(start) || isNaN(end) || start < 1 || end > max || start > end) {
          return null;
        }
        const pages = [];
        for (let i = start; i <= end; i++) pages.push(i - 1);
        ranges.push({ label: `Pages ${start}-${end}`, pages });
      } else {
        const num = Number(part);
        if (isNaN(num) || num < 1 || num > max) return null;
        ranges.push({ label: `Page ${num}`, pages: [num - 1] });
      }
    }
    return ranges;
  };

  const splitPdf = async () => {
    if (!file || !rangeInput.trim()) return;

    const ranges = parseRanges(rangeInput, pageCount);
    if (!ranges || ranges.length === 0) {
      setError(`Invalid range. Use format like "1-3, 5, 7-10" (pages 1 to ${pageCount}).`);
      return;
    }

    setSplitting(true);
    setError('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const results = [];

      for (const range of ranges) {
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(sourcePdf, range.pages);
        copiedPages.forEach((page) => newPdf.addPage(page));
        const bytes = await newPdf.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        results.push({
          label: range.label,
          url,
          size: bytes.length,
          pages: range.pages.length,
        });
      }

      setResult(results);
    } catch {
      setError('Failed to split PDF. Please try again.');
    } finally {
      setSplitting(false);
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
      <h1>PDF Split</h1>
      <p className="description">
        Extract specific pages or split a PDF into smaller files. Enter page ranges separated by commas. 100% browser-based.
      </p>

      <div className="tool-container">
        {!file ? (
          <FileUpload
            accept=".pdf,application/pdf"
            multiple={false}
            maxSize={100 * 1024 * 1024}
            onFiles={handleFiles}
            label="Drop a PDF file here or click to browse"
            sublabel="Supports PDFs up to 100MB"
          />
        ) : (
          <>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{file.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {formatSize(file.size)} · {pageCount} page{pageCount !== 1 ? 's' : ''}
                </div>
              </div>
              <button
                onClick={() => { setFile(null); setPageCount(0); setResult(null); setError(''); }}
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              >
                Change File
              </button>
            </div>

            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Page Ranges <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(1 to {pageCount})</span>
            </label>
            <input
              type="text"
              value={rangeInput}
              onChange={(e) => { setRangeInput(e.target.value); setResult(null); }}
              placeholder="e.g. 1-3, 5, 7-10"
              style={{ marginBottom: '0.5rem' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Each comma-separated range becomes a separate PDF. Example: &quot;1-3, 4-6&quot; creates 2 files.
            </p>

            <div className="btn-group">
              <button
                onClick={splitPdf}
                className="btn btn-primary"
                disabled={splitting || !rangeInput.trim()}
              >
                {splitting ? 'Splitting...' : 'Split PDF'}
              </button>
            </div>
          </>
        )}

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.75rem' }}>{error}</p>
        )}

        {result && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#065f46' }}>
              ✓ Split into {result.length} file{result.length > 1 ? 's' : ''}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {result.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: '#ecfdf5',
                    borderRadius: 'var(--radius)',
                    border: '1px solid #a7f3d0',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#065f46' }}>{r.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#047857' }}>{r.pages} page{r.pages > 1 ? 's' : ''} · {formatSize(r.size)}</div>
                  </div>
                  <a
                    href={r.url}
                    download={`split-${i + 1}.pdf`}
                    className="btn btn-primary"
                    style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
