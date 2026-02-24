'use client';

import { useState } from 'react';
import Link from 'next/link';

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function toSentenceCase(str) {
  return str.replace(/(^\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase());
}

function toAlternatingCase(str) {
  return str
    .split('')
    .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
    .join('');
}

function toSlugCase(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
}

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = (fn) => {
    setText(fn(text));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">
        &larr; All Tools
      </Link>
      <h1>Case Converter</h1>
      <p className="description">
        Convert your text between different letter cases with one click.
      </p>

      <div className="tool-container">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          rows={8}
        />

        <div className="btn-group">
          <button className="btn btn-primary" onClick={() => convert((t) => t.toUpperCase())}>
            UPPERCASE
          </button>
          <button className="btn btn-primary" onClick={() => convert((t) => t.toLowerCase())}>
            lowercase
          </button>
          <button className="btn btn-primary" onClick={() => convert(toTitleCase)}>
            Title Case
          </button>
          <button className="btn btn-primary" onClick={() => convert(toSentenceCase)}>
            Sentence case
          </button>
          <button className="btn btn-secondary" onClick={() => convert(toAlternatingCase)}>
            aLtErNaTiNg
          </button>
          <button className="btn btn-secondary" onClick={() => convert(toSlugCase)}>
            slug-case
          </button>
          <button className="btn btn-secondary" onClick={() => convert(toCamelCase)}>
            camelCase
          </button>
          <button className="btn btn-secondary" onClick={copyToClipboard}>
            Copy {copied && <span className="copy-feedback">Copied!</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
