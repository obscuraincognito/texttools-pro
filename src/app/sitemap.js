export default function sitemap() {
  const baseUrl = 'https://texttools-pro.vercel.app';

  const tools = [
    'word-counter',
    'password-generator',
    'case-converter',
    'find-replace',
    'url-encoder',
    'base64-tool',
    'html-entities',
    'hash-generator',
    'lorem-generator',
    'json-formatter',
    'regex-tester',
    'csv-to-json',
    'sql-formatter',
    'color-converter',
    'markdown-preview',
    'text-diff',
    'qr-generator',
    'uuid-generator',
    'timestamp-converter',
    'word-frequency',
    'jwt-decoder',
    'cron-generator',
    'json-yaml',
    'code-minifier',
  ];

  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...toolPages,
  ];
}
