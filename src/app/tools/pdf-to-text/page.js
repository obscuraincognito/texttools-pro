'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import FileUpload from '../../../components/FileUpload';

export default function PdfToTextPage() {
  const [file, setFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [text, setText] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFiles = useCallback(async (files) => {
    const f = files[0];
    setFile(f);
    setText('');
    setStats(null);
    setError('');
    setExtracting(true);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();

      // Use a simple text extraction approach via pdf-lib
      // pdf-lib doesn't directly extract text, so we'll use a different approach
      // We'll parse the PDF content streams for text
      let extractedText = '';

      // Read raw bytes and extract visible text patterns
      const uint8 = new Uint8Array(arrayBuffer);
      const rawText = new TextDecoder('utf-8', { fatal: false }).decode(uint8);

      // Extract text between BT/ET (Begin Text/End Text) operators
      const textBlocks = [];
      const btEtRegex = /BT\s([\s\S]*?)ET/g;
      let match;

      while ((match = btEtRegex.exec(rawText)) !== null) {
        const block = match[1];
        // Extract text from Tj, TJ, ', " operators
        const tjRegex = /\(([^)]*)\)\s*Tj/g;
        let tjMatch;
        while ((tjMatch = tjRegex.exec(block)) !== null) {
          textBlocks.push(tjMatch[1]);
        }

        // TJ array operator
        const tjArrayRegex = /\[([^\]]*)\]\s*TJ/g;
        let tjArrMatch;
        while ((tjArrMatch = tjArrayRegex.exec(block)) !== null) {
          const items = tjArrMatch[1];
          const stringRegex = /\(([^)]*)\)/g;
          let strMatch;
          while ((strMatch = stringRegex.exec(items)) !== null) {
            textBlocks.push(strMatch[1]);
          }
        }
      }

      // Decode common PDF escape sequences
      extractedText = textBlocks
        .map((t) =>
          t
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\\(/g, '(')
            .replace(/\\\)/g, ')')
            .replace(/\\\\/g, '\\')
        )
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!extractedText) {
        extractedText = '(No extractable text found. This PDF may contain only images or use an encoding that requires OCR.)';
      }

      setText(extractedText);
      setStats({
        pages: pageCount,
        characters: extractedText.length,
        words: extractedText.split(/\s+/).filter(Boolean).length,
      });
    } catch (err) {
      setError('Failed to extract text. The PDF may be corrupted or password-protected.');
      console.error(err);
    } finally {
      setExtracting(false);
    }
  }, []);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name || 'extracted').replace('.pdf', '') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
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
      <h1>PDF to Text</h1>
      <p className="description">
        Extract text content from PDF files. Supports most text-based PDFs. 100% browser-based — no server upload required.
      </p>

      <div className="tool-container">
        <FileUpload
          accept=".pdf,application/pdf"
          multiple={false}
          maxSize={50 * 1024 * 1024}
          onFiles={handleFiles}
          label="Drop a PDF file here or click to browse"
          sublabel="Supports PDFs up to 50MB"
        />

        {file && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            background: 'var(--bg)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            marginTop: '1rem',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{file.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatSize(file.size)}</div>
            </div>
          </div>
        )}

        {extracting && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
            <p>Extracting text...</p>
          </div>
        )}

        {stats && (
          <div className="stats-grid" style={{ marginTop: '1rem' }}>
            <div className="stat-card">
              <div className="value">{stats.pages}</div>
              <div className="label">Pages</div>
            </div>
            <div className="stat-card">
              <div className="value">{stats.words.toLocaleString()}</div>
              <div className="label">Words</div>
            </div>
            <div className="stat-card">
              <div className="value">{stats.characters.toLocaleString()}</div>
              <div className="label">Characters</div>
            </div>
          </div>
        )}

        {text && (
          <>
            <div className="btn-group" style={{ marginTop: '1rem' }}>
              <button onClick={copyText} className="btn btn-primary">
                {copied ? '✓ Copied!' : 'Copy Text'}
              </button>
              <button onClick={downloadText} className="btn btn-secondary">
                Download as .txt
              </button>
            </div>
            <div className="result-box" style={{ marginTop: '0.75rem', maxHeight: '400px', overflow: 'auto' }}>
              {text}
            </div>
          </>
        )}

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.75rem' }}>{error}</p>
        )}
      </div>
    </div>
  );
}
