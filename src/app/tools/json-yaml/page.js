'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

// Lightweight YAML serializer/parser (no external dependency)
function jsonToYaml(obj, indent = 0) {
  const pad = '  '.repeat(indent);
  if (obj === null) return 'null';
  if (obj === undefined) return 'null';
  if (typeof obj === 'boolean') return String(obj);
  if (typeof obj === 'number') return String(obj);
  if (typeof obj === 'string') {
    if (obj.includes('\n')) return `|\n${obj.split('\n').map((l) => pad + '  ' + l).join('\n')}`;
    if (/[:#\[\]{}&*!|>'"@`]/.test(obj) || obj === '' || obj === 'true' || obj === 'false' || obj === 'null' || !isNaN(obj)) {
      return `"${obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj.map((item) => {
      const val = jsonToYaml(item, indent + 1);
      if (typeof item === 'object' && item !== null) {
        return `${pad}- ${val.trim().split('\n').map((l, i) => i === 0 ? l : pad + '  ' + l).join('\n')}`;
      }
      return `${pad}- ${val}`;
    }).join('\n');
  }
  if (typeof obj === 'object') {
    const entries = Object.entries(obj);
    if (entries.length === 0) return '{}';
    return entries.map(([key, val]) => {
      const yamlVal = jsonToYaml(val, indent + 1);
      const safeKey = /[:#\[\]{}&*!|>'"@`\s]/.test(key) ? `"${key}"` : key;
      if (typeof val === 'object' && val !== null && !Array.isArray(val) && Object.keys(val).length > 0) {
        return `${pad}${safeKey}:\n${yamlVal}`;
      }
      if (Array.isArray(val) && val.length > 0) {
        return `${pad}${safeKey}:\n${yamlVal}`;
      }
      return `${pad}${safeKey}: ${yamlVal}`;
    }).join('\n');
  }
  return String(obj);
}

function yamlToJson(yaml) {
  // Simple YAML parser for common cases
  const lines = yaml.split('\n');
  const root = {};
  const stack = [{ obj: root, indent: -1 }];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indent = line.search(/\S/);
    const content = line.trim();

    // Pop stack to find parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1];

    // Array item
    if (content.startsWith('- ')) {
      const val = content.slice(2).trim();
      if (!Array.isArray(parent.obj)) {
        // Convert parent to hold array at current key
        const lastKey = parent.lastKey;
        if (lastKey && typeof parent.obj === 'object') {
          parent.obj[lastKey] = parent.obj[lastKey] || [];
          if (!Array.isArray(parent.obj[lastKey])) parent.obj[lastKey] = [];
          parent.obj[lastKey].push(parseYamlValue(val));
          stack.push({ obj: parent.obj[lastKey], indent, lastKey: parent.obj[lastKey].length - 1 });
        }
      } else {
        parent.obj.push(parseYamlValue(val));
      }
      continue;
    }

    // Key: value
    const colonIdx = content.indexOf(':');
    if (colonIdx > 0) {
      let key = content.slice(0, colonIdx).trim();
      if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);
      const val = content.slice(colonIdx + 1).trim();

      if (typeof parent.obj === 'object' && !Array.isArray(parent.obj)) {
        if (val === '' || val === '|' || val === '>') {
          parent.obj[key] = {};
          parent.lastKey = key;
          stack.push({ obj: parent.obj, indent, lastKey: key });
        } else {
          parent.obj[key] = parseYamlValue(val);
          parent.lastKey = key;
          stack.push({ obj: parent.obj, indent, lastKey: key });
        }
      }
    }
  }
  return root;
}

function parseYamlValue(val) {
  if (val === '' || val === 'null' || val === '~') return null;
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (/^-?\d+$/.test(val)) return parseInt(val, 10);
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1);
  }
  if (val.startsWith('[') && val.endsWith(']')) {
    try { return JSON.parse(val); } catch { return val; }
  }
  if (val.startsWith('{') && val.endsWith('}')) {
    try { return JSON.parse(val); } catch { return val; }
  }
  return val;
}

export default function JsonYaml() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState('json-to-yaml');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  const convert = () => {
    setError('');
    setOutput('');
    if (!input.trim()) return;

    try {
      if (direction === 'json-to-yaml') {
        const parsed = JSON.parse(input);
        setOutput(jsonToYaml(parsed));
      } else {
        const parsed = yamlToJson(input);
        setOutput(JSON.stringify(parsed, null, indent));
      }
    } catch (e) {
      setError(`Conversion error: ${e.message}`);
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const loadSample = () => {
    if (direction === 'json-to-yaml') {
      setInput(JSON.stringify({
        server: { host: 'localhost', port: 8080, ssl: true },
        database: { driver: 'postgres', host: 'db.example.com', port: 5432, name: 'myapp', credentials: { username: 'admin', password: 'secret' } },
        features: ['auth', 'logging', 'cache'],
        logging: { level: 'info', format: 'json' },
      }, null, 2));
    } else {
      setInput(`server:
  host: localhost
  port: 8080
  ssl: true
database:
  driver: postgres
  host: db.example.com
  port: 5432
  name: myapp
features:
  - auth
  - logging
  - cache
logging:
  level: info
  format: json`);
    }
  };

  return (
    <PremiumGate toolName="JSON ↔ YAML Converter">
      <div className="tool-page">
        <Link href="/" className="back-link">&larr; All Tools</Link>
        <h1>JSON ↔ YAML Converter</h1>
        <p className="description">Convert between JSON and YAML formats. Handles nested objects, arrays, and special characters.</p>

        <div className="tool-container">
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'end', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Direction</label>
              <select value={direction} onChange={(e) => { setDirection(e.target.value); setOutput(''); setError(''); }} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <option value="json-to-yaml">JSON → YAML</option>
                <option value="yaml-to-json">YAML → JSON</option>
              </select>
            </div>
            {direction === 'yaml-to-json' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Indent</label>
                <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={0}>Compact</option>
                </select>
              </div>
            )}
            <button className="btn btn-primary" onClick={convert}>Convert</button>
            <button className="btn btn-secondary" onClick={loadSample}>Load Sample</button>
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>
                {direction === 'json-to-yaml' ? 'JSON Input' : 'YAML Input'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={direction === 'json-to-yaml' ? '{\n  "key": "value"\n}' : 'key: value\nnested:\n  child: data'}
                rows={16}
                style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {direction === 'json-to-yaml' ? 'YAML Output' : 'JSON Output'}
                </label>
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
