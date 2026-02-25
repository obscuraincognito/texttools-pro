'use client';

import { useState } from 'react';
import Link from 'next/link';

const entityMap = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  '\u00A0': '&nbsp;', '\u00A9': '&copy;', '\u00AE': '&reg;', '\u2122': '&trade;',
  '\u2013': '&ndash;', '\u2014': '&mdash;', '\u2018': '&lsquo;', '\u2019': '&rsquo;',
  '\u201C': '&ldquo;', '\u201D': '&rdquo;', '\u2026': '&hellip;', '\u00B0': '&deg;',
  '\u00D7': '&times;', '\u00F7': '&divide;', '\u2022': '&bull;',
};

const reverseEntityMap = {};
Object.entries(entityMap).forEach(([char, entity]) => {
  reverseEntityMap[entity] = char;
});

function encodeEntities(text) {
  return text.split('').map((char) => entityMap[char] || char).join('');
}

function decodeEntities(text) {
  let result = text;
  Object.entries(reverseEntityMap).forEach(([entity, char]) => {
    result = result.split(entity).join(char);
  });
  // Handle numeric entities
  result = result.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)));
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  return result;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const COMMON_ENTITIES = [
  { char: '&', entity: '&amp;', name: 'Ampersand' },
  { char: '<', entity: '&lt;', name: 'Less than' },
  { char: '>', entity: '&gt;', name: 'Greater than' },
  { char: '"', entity: '&quot;', name: 'Double quote' },
  { char: "'", entity: '&#39;', name: 'Single quote' },
  { char: '\u00A0', entity: '&nbsp;', name: 'Non-breaking space' },
  { char: '\u00A9', entity: '&copy;', name: 'Copyright' },
  { char: '\u00AE', entity: '&reg;', name: 'Registered' },
  { char: '\u2122', entity: '&trade;', name: 'Trademark' },
  { char: '\u2014', entity: '&mdash;', name: 'Em dash' },
  { char: '\u2022', entity: '&bull;', name: 'Bullet' },
  { char: '\u00B0', entity: '&deg;', name: 'Degree' },
];

export default function HtmlEntities() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [copied, setCopied] = useState(false);

  const process = () => {
    if (mode === 'encode') {
      setOutput(encodeEntities(input));
    } else if (mode === 'decode') {
      setOutput(decodeEntities(input));
    } else {
      setOutput(escapeHtml(input));
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
      <h1>HTML Entity Encoder / Decoder</h1>
      <p className="description">Convert special characters to HTML entities or decode entities back to characters.</p>

      <div className="tool-container">
        <div className="btn-group" style={{ marginTop: 0 }}>
          <button className={`btn ${mode === 'encode' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setMode('encode'); setOutput(''); }}>
            Encode
          </button>
          <button className={`btn ${mode === 'decode' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setMode('decode'); setOutput(''); }}>
            Decode
          </button>
          <button className={`btn ${mode === 'escape' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setMode('escape'); setOutput(''); }}>
            Escape HTML
          </button>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'decode' ? 'Paste HTML entities here...\nExample: &amp;lt;div&amp;gt;Hello&amp;lt;/div&amp;gt;' : 'Paste text or HTML here...\nExample: <div>Hello & goodbye</div>'}
          rows={6}
        />

        <div className="btn-group">
          <button className="btn btn-primary" onClick={process}>
            {mode === 'encode' ? 'Encode' : mode === 'decode' ? 'Decode' : 'Escape'}
          </button>
        </div>

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

        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Common HTML Entities Reference</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
            {COMMON_ENTITIES.map((e) => (
              <div key={e.entity} style={{ background: 'var(--bg)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8125rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{e.name}</span>
                <code style={{ color: 'var(--primary)' }}>{e.entity}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
