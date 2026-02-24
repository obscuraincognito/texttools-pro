'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WordCounter() {
  const [text, setText] = useState('');

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length || (text.trim() ? 1 : 0) : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">
        &larr; All Tools
      </Link>
      <h1>Word Counter</h1>
      <p className="description">
        Paste or type your text below to get instant word, character, sentence, and paragraph counts.
      </p>

      <div className="tool-container">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          rows={10}
        />

        <div className="stats-grid">
          <div className="stat-card">
            <div className="value">{words}</div>
            <div className="label">Words</div>
          </div>
          <div className="stat-card">
            <div className="value">{characters}</div>
            <div className="label">Characters</div>
          </div>
          <div className="stat-card">
            <div className="value">{charactersNoSpaces}</div>
            <div className="label">No Spaces</div>
          </div>
          <div className="stat-card">
            <div className="value">{sentences}</div>
            <div className="label">Sentences</div>
          </div>
          <div className="stat-card">
            <div className="value">{paragraphs}</div>
            <div className="label">Paragraphs</div>
          </div>
          <div className="stat-card">
            <div className="value">{readingTime}m</div>
            <div className="label">Read Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
