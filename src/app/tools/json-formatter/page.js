'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

function JsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const format = (indent = 2) => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
      setOutput('');
    }
  };

  const minify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
      setOutput('');
    }
  };

  const validate = () => {
    setError('');
    try {
      JSON.parse(input);
      setOutput('Valid JSON!');
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
      setOutput('');
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-container">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Paste your JSON here, e.g. {"name": "John", "age": 30}'
        rows={8}
        style={{ fontFamily: "'Courier New', monospace", fontSize: '0.875rem' }}
      />

      <div className="btn-group">
        <button className="btn btn-primary" onClick={() => format(2)}>
          Format (2 spaces)
        </button>
        <button className="btn btn-primary" onClick={() => format(4)}>
          Format (4 spaces)
        </button>
        <button className="btn btn-secondary" onClick={minify}>
          Minify
        </button>
        <button className="btn btn-secondary" onClick={validate}>
          Validate
        </button>
      </div>

      {error && <p style={{ color: 'var(--danger)', marginTop: '0.5rem' }}>{error}</p>}

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
  );
}

export default function JsonFormatterPage() {
  return (
    <div className="tool-page">
      <Link href="/" className="back-link">
        &larr; All Tools
      </Link>
      <h1>JSON Formatter <span className="badge badge-premium">Pro</span></h1>
      <p className="description">
        Format, validate, and minify JSON data with syntax checking.
      </p>
      <PremiumGate>
        <JsonTool />
      </PremiumGate>
    </div>
  );
}
