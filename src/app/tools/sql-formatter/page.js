'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

const KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'ON', 'AS', 'IS',
  'NULL', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS',
  'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
  'ALTER', 'DROP', 'INDEX', 'VIEW', 'DISTINCT', 'BETWEEN', 'LIKE', 'EXISTS',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'ASC', 'DESC', 'COUNT', 'SUM',
  'AVG', 'MIN', 'MAX', 'WITH', 'RECURSIVE', 'RETURNING', 'CASCADE',
  'CONSTRAINT', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'DEFAULT',
  'CHECK', 'UNIQUE', 'NOT', 'NULL', 'TRUE', 'FALSE', 'IF', 'ELSE',
];

const MAJOR_CLAUSES = [
  'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT',
  'OFFSET', 'UNION', 'UNION ALL', 'INSERT INTO', 'VALUES', 'UPDATE',
  'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
  'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN',
  'CROSS JOIN', 'JOIN', 'ON', 'WITH', 'RETURNING',
];

function formatSql(sql, indent = '  ') {
  // Normalize whitespace
  let formatted = sql.replace(/\s+/g, ' ').trim();

  // Uppercase keywords
  KEYWORDS.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    formatted = formatted.replace(regex, kw);
  });

  // Add newlines before major clauses
  MAJOR_CLAUSES.forEach((clause) => {
    const regex = new RegExp(`\\s+${clause.replace(/\s/g, '\\s+')}\\b`, 'gi');
    formatted = formatted.replace(regex, `\n${clause}`);
  });

  // Handle commas - newline after comma in SELECT
  let inSelect = false;
  const lines = formatted.split('\n');
  const result = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('SELECT')) {
      inSelect = true;
      result.push(trimmed);
    } else if (/^(FROM|WHERE|ORDER|GROUP|HAVING|LIMIT|JOIN|LEFT|RIGHT|INNER|OUTER)/.test(trimmed)) {
      inSelect = false;
      result.push(trimmed);
    } else {
      result.push(trimmed);
    }
  });

  // Re-join and add proper indentation
  formatted = result.join('\n');

  // Add indentation for non-clause lines
  const finalLines = formatted.split('\n');
  const indented = finalLines.map((line, i) => {
    const trimmed = line.trim();
    if (i === 0) return trimmed;

    const isClause = MAJOR_CLAUSES.some((clause) =>
      trimmed.toUpperCase().startsWith(clause)
    );

    if (isClause) return trimmed;
    return indent + trimmed;
  });

  // Split SELECT columns by comma
  const expanded = [];
  indented.forEach((line) => {
    if (line.startsWith('SELECT') && line.includes(',')) {
      const selectPart = 'SELECT';
      const columns = line.slice(6).trim();
      const parts = columns.split(',').map((c) => c.trim());
      expanded.push(selectPart);
      parts.forEach((col, i) => {
        expanded.push(indent + col + (i < parts.length - 1 ? ',' : ''));
      });
    } else {
      expanded.push(line);
    }
  });

  return expanded.join('\n');
}

function minifySql(sql) {
  return sql.replace(/\s+/g, ' ').replace(/\s*([,()])\s*/g, '$1').trim();
}

function SqlTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentStyle, setIndentStyle] = useState('  ');

  const format = () => {
    setOutput(formatSql(input, indentStyle));
  };

  const minify = () => {
    setOutput(minifySql(input));
  };

  const uppercase = () => {
    let result = input;
    KEYWORDS.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      result = result.replace(regex, kw);
    });
    setOutput(result);
  };

  const lowercase = () => {
    let result = input;
    KEYWORDS.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      result = result.replace(regex, kw.toLowerCase());
    });
    setOutput(result);
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
        placeholder="Paste your SQL query here...&#10;&#10;Example: SELECT u.name, u.email, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE o.total > 100 ORDER BY o.total DESC LIMIT 10"
        rows={8}
        style={{ fontFamily: "'Courier New', monospace", fontSize: '0.875rem' }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.75rem 0' }}>
        <label style={{ fontSize: '0.875rem' }}>Indent:</label>
        <select value={indentStyle} onChange={(e) => setIndentStyle(e.target.value)} style={{ padding: '0.375rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <option value="  ">2 spaces</option>
          <option value="    ">4 spaces</option>
          <option value={'\t'}>Tab</option>
        </select>
      </div>

      <div className="btn-group">
        <button className="btn btn-primary" onClick={format}>Format</button>
        <button className="btn btn-secondary" onClick={minify}>Minify</button>
        <button className="btn btn-secondary" onClick={uppercase}>UPPERCASE Keywords</button>
        <button className="btn btn-secondary" onClick={lowercase}>lowercase keywords</button>
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

export default function SqlFormatterPage() {
  return (
    <div className="tool-page">
      <Link href="/" className="back-link">&larr; All Tools</Link>
      <h1>SQL Formatter <span className="badge badge-premium">Pro</span></h1>
      <p className="description">Format, minify, and beautify SQL queries with customizable indentation.</p>
      <PremiumGate>
        <SqlTool />
      </PremiumGate>
    </div>
  );
}
