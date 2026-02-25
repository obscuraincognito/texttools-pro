'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

function minifyJS(code) {
  let result = code;
  // Remove single-line comments (but not URLs with //)
  result = result.replace(/(?<![:"'])\/\/.*$/gm, '');
  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove leading/trailing whitespace on each line
  result = result.replace(/^\s+/gm, '');
  result = result.replace(/\s+$/gm, '');
  // Collapse multiple spaces to one
  result = result.replace(/\s{2,}/g, ' ');
  // Remove newlines (but be careful with string literals)
  result = result.split('\n').filter((l) => l.trim()).join('');
  // Remove spaces around operators
  result = result.replace(/\s*([{}()=+\-*/<>!&|;:,?])\s*/g, '$1');
  return result.trim();
}

function minifyCSS(code) {
  let result = code;
  // Remove comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove whitespace
  result = result.replace(/\s+/g, ' ');
  // Remove space around special chars
  result = result.replace(/\s*([{}:;,>~+])\s*/g, '$1');
  // Remove last semicolons before closing brace
  result = result.replace(/;}/g, '}');
  // Remove leading/trailing whitespace
  return result.trim();
}

function minifyHTML(code) {
  let result = code;
  // Remove HTML comments
  result = result.replace(/<!--[\s\S]*?-->/g, '');
  // Collapse whitespace between tags
  result = result.replace(/>\s+</g, '><');
  // Collapse multiple spaces
  result = result.replace(/\s{2,}/g, ' ');
  return result.trim();
}

function beautifyJS(code) {
  let result = '';
  let indent = 0;
  let inString = false;
  let stringChar = '';
  const tab = '  ';

  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    const next = code[i + 1] || '';

    if (inString) {
      result += ch;
      if (ch === stringChar && code[i - 1] !== '\\') inString = false;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringChar = ch;
      result += ch;
      continue;
    }

    if (ch === '{' || ch === '[') {
      indent++;
      result += ch + '\n' + tab.repeat(indent);
    } else if (ch === '}' || ch === ']') {
      indent = Math.max(0, indent - 1);
      result += '\n' + tab.repeat(indent) + ch;
    } else if (ch === ';') {
      result += ';\n' + tab.repeat(indent);
    } else if (ch === ',') {
      result += ',\n' + tab.repeat(indent);
    } else {
      result += ch;
    }
  }
  return result.replace(/\n\s*\n/g, '\n');
}

export default function CodeMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [mode, setMode] = useState('minify');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);

  const process = () => {
    if (!input.trim()) return;
    let result;
    if (mode === 'minify') {
      switch (language) {
        case 'javascript': result = minifyJS(input); break;
        case 'css': result = minifyCSS(input); break;
        case 'html': result = minifyHTML(input); break;
        default: result = input;
      }
    } else {
      // Beautify
      switch (language) {
        case 'javascript': result = beautifyJS(input); break;
        case 'css': result = beautifyJS(input); break; // Reuse JS beautifier for basic formatting
        case 'html': result = input.replace(/></g, '>\n<'); break;
        default: result = input;
      }
    }
    setOutput(result);

    const originalSize = new Blob([input]).size;
    const resultSize = new Blob([result]).size;
    const savings = originalSize > 0 ? ((1 - resultSize / originalSize) * 100).toFixed(1) : 0;
    setStats({ original: originalSize, result: resultSize, savings });
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <PremiumGate toolName="Code Minifier">
      <div className="tool-page">
        <Link href="/" className="back-link">&larr; All Tools</Link>
        <h1>Code Minifier & Beautifier</h1>
        <p className="description">Minify or beautify JavaScript, CSS, and HTML. See file size savings instantly.</p>

        <div className="tool-container">
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'end', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <option value="javascript">JavaScript</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Mode</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <option value="minify">Minify</option>
                <option value="beautify">Beautify</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={process}>
              {mode === 'minify' ? 'Minify Code' : 'Beautify Code'}
            </button>
          </div>

          {stats && (
            <div style={{
              display: 'flex', gap: '1.5rem', marginBottom: '1rem', padding: '0.75rem',
              background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Original</span>
                <div style={{ fontWeight: 700 }}>{formatBytes(stats.original)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Result</span>
                <div style={{ fontWeight: 700 }}>{formatBytes(stats.result)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                  {mode === 'minify' ? 'Savings' : 'Change'}
                </span>
                <div style={{ fontWeight: 700, color: Number(stats.savings) > 0 ? '#22c55e' : 'var(--text)' }}>
                  {stats.savings}%
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Input</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Paste your ${language.toUpperCase()} code here...`}
                rows={16}
                style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600 }}>Output</label>
                {output && <button className="btn btn-secondary" onClick={copyOutput} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>{copied ? '✓ Copied' : 'Copy'}</button>}
              </div>
              <textarea
                value={output}
                readOnly
                rows={16}
                style={{ fontFamily: 'monospace', fontSize: '0.85rem', background: 'var(--bg-secondary)' }}
                placeholder="Output will appear here..."
              />
            </div>
          </div>
        </div>
      </div>
    </PremiumGate>
  );
}
