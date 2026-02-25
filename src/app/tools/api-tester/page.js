'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

const METHOD_COLORS = {
  GET: '#22c55e',
  POST: '#3b82f6',
  PUT: '#f59e0b',
  DELETE: '#ef4444',
  PATCH: '#a855f7',
};

const PRESET_REQUESTS = [
  {
    name: 'GET - JSON Placeholder Posts',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: [],
    body: '',
  },
  {
    name: 'GET - Random User',
    method: 'GET',
    url: 'https://randomuser.me/api/',
    headers: [],
    body: '',
  },
  {
    name: 'POST - Create Post',
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    headers: [{ key: 'Content-Type', value: 'application/json' }],
    body: JSON.stringify({ title: 'Hello World', body: 'This is a test post.', userId: 1 }, null, 2),
  },
  {
    name: 'PUT - Update Post',
    method: 'PUT',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: [{ key: 'Content-Type', value: 'application/json' }],
    body: JSON.stringify({ id: 1, title: 'Updated Title', body: 'Updated body content.', userId: 1 }, null, 2),
  },
  {
    name: 'DELETE - Remove Post',
    method: 'DELETE',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: [],
    body: '',
  },
];

function ApiTesterTool() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const showBody = ['POST', 'PUT', 'PATCH'].includes(method);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index, field, value) => {
    const updated = [...headers];
    updated[index][field] = value;
    setHeaders(updated);
  };

  const loadPreset = (preset) => {
    setMethod(preset.method);
    setUrl(preset.url);
    setHeaders(preset.headers.length > 0 ? [...preset.headers] : [{ key: '', value: '' }]);
    setBody(preset.body);
    setResponse(null);
    setError('');
  };

  const sendRequest = async () => {
    if (!url.trim()) {
      setError('Please enter a URL.');
      return;
    }

    setLoading(true);
    setResponse(null);
    setError('');

    const startTime = performance.now();

    try {
      const fetchOptions = { method };

      // Build headers object from non-empty header rows
      const headerObj = {};
      headers.forEach((h) => {
        if (h.key.trim() && h.value.trim()) {
          headerObj[h.key.trim()] = h.value.trim();
        }
      });
      if (Object.keys(headerObj).length > 0) {
        fetchOptions.headers = headerObj;
      }

      // Attach body for methods that support it
      if (showBody && body.trim()) {
        fetchOptions.body = body;
      }

      const res = await fetch(url, fetchOptions);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      // Read response headers
      const resHeaders = {};
      res.headers.forEach((value, key) => {
        resHeaders[key] = value;
      });

      // Read response body as text
      let resBody = '';
      try {
        resBody = await res.text();
      } catch {
        resBody = '(Could not read response body)';
      }

      // Attempt to format as JSON
      let formattedBody = resBody;
      try {
        const parsed = JSON.parse(resBody);
        formattedBody = JSON.stringify(parsed, null, 2);
      } catch {
        // Not JSON, keep as-is
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        duration,
        headers: resHeaders,
        body: formattedBody,
        size: new Blob([resBody]).size,
      });
    } catch (e) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      setError(`Request failed: ${e.message}`);
      setResponse({ status: 0, statusText: 'Error', duration, headers: {}, body: '', size: 0 });
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (response?.body) {
      navigator.clipboard.writeText(response.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return '#22c55e';
    if (status >= 300 && status < 400) return '#f59e0b';
    if (status >= 400) return '#ef4444';
    return 'var(--text-light)';
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--text-light)',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
    fontWeight: 600,
  };

  return (
    <div className="tool-container">
      {/* Preset Examples */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>Quick Presets</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {PRESET_REQUESTS.map((preset) => (
            <button
              key={preset.name}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
              onClick={() => loadPreset(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Method + URL */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
        <div style={{ minWidth: '120px' }}>
          <label style={labelStyle}>Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius, 8px)',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: METHOD_COLORS[method],
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Request URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            style={{ fontFamily: "'Courier New', monospace", fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {/* Headers */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Headers</label>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}
            onClick={addHeader}
          >
            + Add Header
          </button>
        </div>
        {headers.map((header, index) => (
          <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.375rem', alignItems: 'center' }}>
            <input
              type="text"
              value={header.key}
              onChange={(e) => updateHeader(index, 'key', e.target.value)}
              placeholder="Header name"
              style={{ flex: 1, fontSize: '0.8125rem', fontFamily: "'Courier New', monospace" }}
            />
            <input
              type="text"
              value={header.value}
              onChange={(e) => updateHeader(index, 'value', e.target.value)}
              placeholder="Header value"
              style={{ flex: 2, fontSize: '0.8125rem', fontFamily: "'Courier New', monospace" }}
            />
            {headers.length > 1 && (
              <button
                onClick={() => removeHeader(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--danger, #ef4444)',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  padding: '0.25rem 0.5rem',
                  lineHeight: 1,
                }}
                title="Remove header"
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Request Body */}
      {showBody && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Request Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
            rows={6}
            style={{ fontFamily: "'Courier New', monospace", fontSize: '0.8125rem' }}
          />
        </div>
      )}

      {/* Send Button */}
      <div className="btn-group">
        <button
          className="btn btn-primary"
          onClick={sendRequest}
          disabled={loading}
          style={{ minWidth: '140px' }}
        >
          {loading ? 'Sending...' : 'Send Request'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setUrl('');
            setMethod('GET');
            setHeaders([{ key: '', value: '' }]);
            setBody('');
            setResponse(null);
            setError('');
          }}
        >
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <p style={{ color: 'var(--danger, #ef4444)', marginTop: '0.75rem', fontSize: '0.875rem' }}>{error}</p>
      )}

      {/* Response */}
      {response && response.status > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Response</h3>

          {/* Stats */}
          <div className="stats-grid" style={{ marginBottom: '1rem' }}>
            <div className="stat-card">
              <div className="value" style={{ color: getStatusColor(response.status) }}>
                {response.status}
              </div>
              <div className="label">{response.statusText}</div>
            </div>
            <div className="stat-card">
              <div className="value">{response.duration} ms</div>
              <div className="label">Response Time</div>
            </div>
            <div className="stat-card">
              <div className="value">
                {response.size < 1024
                  ? `${response.size} B`
                  : `${(response.size / 1024).toFixed(1)} KB`}
              </div>
              <div className="label">Body Size</div>
            </div>
            <div className="stat-card">
              <div className="value">{Object.keys(response.headers).length}</div>
              <div className="label">Headers</div>
            </div>
          </div>

          {/* Response Headers */}
          {Object.keys(response.headers).length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Response Headers</label>
              <div
                className="result-box"
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.75rem',
                  maxHeight: '160px',
                  overflow: 'auto',
                }}
              >
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '0.125rem' }}>
                    <span style={{ color: 'var(--primary, #6366f1)', fontWeight: 600 }}>{key}:</span>{' '}
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Response Body */}
          {response.body && (
            <div>
              <label style={labelStyle}>Response Body</label>
              <div
                className="result-box"
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.8125rem',
                  maxHeight: '400px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {response.body}
              </div>
              <div className="btn-group" style={{ marginTop: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={copyResponse}>
                  Copy Response {copied && <span className="copy-feedback">Copied!</span>}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApiTesterPage() {
  return (
    <div className="tool-page">
      <Link href="/" className="back-link">
        &larr; All Tools
      </Link>
      <h1>API Tester <span className="badge badge-premium">Pro</span></h1>
      <p className="description">
        Build and send HTTP requests to any API endpoint. Inspect response status, headers, timing, and body with formatted output.
      </p>
      <PremiumGate toolName="API Tester">
        <ApiTesterTool />
      </PremiumGate>
    </div>
  );
}
