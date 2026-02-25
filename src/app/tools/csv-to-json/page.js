'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

function parseCsv(csv, delimiter = ',') {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, ''));
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const obj = {};
    headers.forEach((header, idx) => {
      let val = values[idx] || '';
      val = val.replace(/^"|"$/g, '');
      // Try to convert numbers
      if (!isNaN(val) && val !== '') {
        obj[header] = Number(val);
      } else if (val.toLowerCase() === 'true') {
        obj[header] = true;
      } else if (val.toLowerCase() === 'false') {
        obj[header] = false;
      } else {
        obj[header] = val;
      }
    });
    results.push(obj);
  }
  return results;
}

function jsonToCsv(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    if (!Array.isArray(data) || data.length === 0) return 'Error: JSON must be an array of objects';

    const headers = Object.keys(data[0]);
    const csvLines = [headers.join(',')];

    data.forEach((row) => {
      const values = headers.map((h) => {
        const val = String(row[h] ?? '');
        return val.includes(',') || val.includes('"') || val.includes('\n')
          ? `"${val.replace(/"/g, '""')}"`
          : val;
      });
      csvLines.push(values.join(','));
    });

    return csvLines.join('\n');
  } catch (e) {
    return 'Error: Invalid JSON - ' + e.message;
  }
}

function CsvJsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('csvToJson');
  const [delimiter, setDelimiter] = useState(',');
  const [copied, setCopied] = useState(false);

  const convert = () => {
    if (mode === 'csvToJson') {
      try {
        const result = parseCsv(input, delimiter);
        setOutput(JSON.stringify(result, null, 2));
      } catch (e) {
        setOutput('Error parsing CSV: ' + e.message);
      }
    } else {
      setOutput(jsonToCsv(input));
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-container">
      <div className="btn-group" style={{ marginTop: 0 }}>
        <button className={`btn ${mode === 'csvToJson' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setMode('csvToJson'); setOutput(''); }}>
          CSV to JSON
        </button>
        <button className={`btn ${mode === 'jsonToCsv' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setMode('jsonToCsv'); setOutput(''); }}>
          JSON to CSV
        </button>
      </div>

      {mode === 'csvToJson' && (
        <div style={{ margin: '0.75rem 0' }}>
          <label style={{ fontSize: '0.875rem', marginRight: '0.5rem' }}>Delimiter:</label>
          <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} style={{ padding: '0.375rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value={'\t'}>Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>
      )}

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'csvToJson' ? 'Paste CSV here...\nname,age,city\nJohn,30,New York\nJane,25,Boston' : 'Paste JSON array here...\n[{"name":"John","age":30},{"name":"Jane","age":25}]'}
        rows={8}
        style={{ fontFamily: "'Courier New', monospace", fontSize: '0.875rem' }}
      />

      <div className="btn-group">
        <button className="btn btn-primary" onClick={convert}>Convert</button>
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
    </div>
  );
}

export default function CsvToJsonPage() {
  return (
    <div className="tool-page">
      <Link href="/" className="back-link">&larr; All Tools</Link>
      <h1>CSV to JSON Converter <span className="badge badge-premium">Pro</span></h1>
      <p className="description">Convert between CSV and JSON formats. Supports custom delimiters and quoted fields.</p>
      <PremiumGate>
        <CsvJsonTool />
      </PremiumGate>
    </div>
  );
}
