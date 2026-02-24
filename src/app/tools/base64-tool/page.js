'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const process = () => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError(mode === 'encode' ? 'Could not encode text.' : 'Invalid Base64 string.');
      setOutput('');
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">
        &larr; All Tools
      </Link>
      <h1>Base64 Encoder / Decoder</h1>
      <p className="description">Encode text to Base64 or decode Base64 back to plain text.</p>

      <div className="tool-container">
        <div className="btn-group" style={{ marginTop: 0 }}>
          <button
            className={`btn ${mode === 'encode' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
          >
            Encode
          </button>
          <button
            className={`btn ${mode === 'decode' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
          >
            Decode
          </button>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
          rows={6}
        />

        <div className="btn-group">
          <button className="btn btn-primary" onClick={process}>
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>
        </div>

        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

        {output && (
          <>
            <div className="result-box">{output}</div>
            <div className="btn-group">
              <button className="btn btn-secondary" onClick={copy}>
                Copy {copied && <span className="copy-feedback">Copied!</span>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
