'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const process = () => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError(mode === 'encode' ? 'Could not encode text.' : 'Invalid URL-encoded string.');
      setOutput('');
    }
  };

  const encodeFullUrl = () => {
    setError('');
    try {
      setOutput(encodeURI(input));
    } catch {
      setError('Could not encode URL.');
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
      <Link href="/" className="back-link">&larr; All Tools</Link>
      <h1>URL Encoder / Decoder</h1>
      <p className="description">Encode special characters for URLs or decode URL-encoded strings back to readable text.</p>

      <div className="tool-container">
        <div className="btn-group" style={{ marginTop: 0 }}>
          <button className={`btn ${mode === 'encode' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setMode('encode'); setOutput(''); setError(''); }}>
            Encode
          </button>
          <button className={`btn ${mode === 'decode' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setMode('decode'); setOutput(''); setError(''); }}>
            Decode
          </button>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text or URL to encode...\nExample: hello world & goodbye' : 'Enter URL-encoded text to decode...\nExample: hello%20world%20%26%20goodbye'}
          rows={6}
        />

        <div className="btn-group">
          <button className="btn btn-primary" onClick={process}>
            {mode === 'encode' ? 'Encode Component' : 'Decode'}
          </button>
          {mode === 'encode' && (
            <button className="btn btn-secondary" onClick={encodeFullUrl}>
              Encode Full URL
            </button>
          )}
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
