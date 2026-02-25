import './globals.css';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
  description: 'Free online text tools: word counter, password generator, QR code generator, JSON formatter, JWT decoder, cron generator, and more. 24 tools that run 100% in your browser. No data collection, no sign-up required.',
  keywords: 'text tools, word counter, password generator, QR code generator, UUID generator, JSON formatter, JWT decoder, cron generator, code minifier, online tools, developer tools, free tools',
  authors: [{ name: 'TextTools Pro' }],
  creator: 'TextTools Pro',
  metadataBase: new URL('https://texttools-pro.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://texttools-pro.vercel.app',
    siteName: 'TextTools Pro',
    title: 'TextTools Pro - Free Online Text Utilities & Developer Tools',
    description: 'A collection of 24 fast, privacy-friendly text utilities. Word counter, password generator, JSON formatter, regex tester, and more. 100% browser-based.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TextTools Pro - Free Online Text Utilities',
    description: 'A collection of 24 fast, privacy-friendly text utilities. 100% browser-based, no data collection.',
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Header />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
