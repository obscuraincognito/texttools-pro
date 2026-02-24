'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PremiumGate from '../../../components/PremiumGate';

// Simple markdown parser (no dependencies needed)
function parseMarkdown(md) {
  let html = md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px">$1</code>')
    // Headers
    .replace(/^######\s+(.*)$/gm, '<h6>$1</h6>')
    .replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>')
    .replace(/^####\s+(.*)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Unordered lists
    .replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
    // Blockquotes
    .replace(/^>\s+(.*)$/gm, '<blockquote style="border-left:3px solid #cbd5e1;padding-left:1rem;color:#64748b">$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #e2e8f0;margin:1rem 0">')
    // Line breaks to paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap list items
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  // Clean up nested uls
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  return '<p>' + html + '</p>';
}

function MarkdownTool() {
  const [markdown, setMarkdown] = useState('# Hello World\n\nThis is a **markdown** preview tool.\n\n- Item one\n- Item two\n- Item three\n\n> A blockquote example\n\n`inline code` and more text.\n\n```\ncode block here\n```');
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => parseMarkdown(markdown), [markdown]);

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', minHeight: '400px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>
            Markdown
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            style={{ height: '100%', minHeight: '350px', fontFamily: "'Courier New', monospace", fontSize: '0.875rem' }}
          />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>
            Preview
          </div>
          <div
            className="result-box"
            style={{ minHeight: '350px', fontFamily: 'inherit', overflow: 'auto' }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
      <div className="btn-group">
        <button className="btn btn-secondary" onClick={copyHtml}>
          Copy HTML {copied && <span className="copy-feedback">Copied!</span>}
        </button>
      </div>
    </div>
  );
}

export default function MarkdownPreviewPage() {
  return (
    <div className="tool-page">
      <Link href="/" className="back-link">
        &larr; All Tools
      </Link>
      <h1>Markdown Preview <span className="badge badge-premium">Pro</span></h1>
      <p className="description">
        Write Markdown on the left and see a live preview on the right. Export to HTML.
      </p>
      <PremiumGate>
        <MarkdownTool />
      </PremiumGate>
    </div>
  );
}
