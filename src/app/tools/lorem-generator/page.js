'use client';

import { useState } from 'react';
import Link from 'next/link';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
];

function randomWord() {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(minWords = 6, maxWords = 14) {
  const count = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));
  const words = Array.from({ length: count }, randomWord);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function generateParagraph(sentenceCount = 4) {
  return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ');
}

export default function LoremGenerator() {
  const [count, setCount] = useState(3);
  const [mode, setMode] = useState('paragraphs');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let result = '';
    if (mode === 'paragraphs') {
      result = Array.from({ length: count }, () => generateParagraph()).join('\n\n');
    } else if (mode === 'sentences') {
      result = Array.from({ length: count }, () => generateSentence()).join(' ');
    } else {
      result = Array.from({ length: count }, randomWord).join(' ');
    }
    setOutput(result);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-page">
      <Link href="/" className="back-link">
        &larr; All Tools
      </Link>
      <h1>Lorem Ipsum Generator</h1>
      <p className="description">Generate placeholder text for your designs and layouts.</p>

      <div className="tool-container">
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <label>Generate</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
            style={{ width: '80px' }}
          />
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{ padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
          <button className="btn btn-primary" onClick={generate}>
            Generate
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
      </div>
    </div>
  );
}
