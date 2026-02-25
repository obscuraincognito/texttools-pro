import './globals.css';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExitIntent from '../components/ExitIntent';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: {
    default: 'TextTools Pro - Free Online Text Utilities & Developer Tools',
    template: '%s | TextTools Pro',
  },
  description: 'Free online text, PDF, and image tools: word counter, password generator, PDF merge, image compress, JSON formatter, and more. 34 tools that run 100% in your browser. No data collection, no sign-up required.',
  keywords: 'text tools, word counter, password generator, pdf merge, pdf split, image compress, image resize, QR code generator, UUID generator, JSON formatter, JWT decoder, online tools, developer tools, free tools',
  authors: [{ name: 'TextTools Pro' }],
  creator: 'TextTools Pro',
  metadataBase: new URL('https://texttools-pro.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://texttools-pro.vercel.app',
    siteName: 'TextTools Pro',
    title: 'TextTools Pro - Free Online Text Utilities & Developer Tools',
    description: 'A collection of 34 fast, privacy-friendly text, PDF, and image utilities. Word counter, password generator, JSON formatter, regex tester, and more. 100% browser-based.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TextTools Pro - Free Online Text Utilities',
    description: 'A collection of 34 fast, privacy-friendly text, PDF, and image utilities. 100% browser-based, no data collection.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here after setting it up
    // google: 'your-verification-code',
  },
};

// Inline script to prevent theme flash on page load
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('tt_theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch(e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Header />
        <main className="main-content">{children}</main>
        <Footer />
        <ExitIntent />
        <Analytics />
      </body>
    </html>
  );
}
