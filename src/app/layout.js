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
  title: 'TextTools Pro - Free Online Text Utilities',
  description: 'Free online text tools: word counter, case converter, JSON formatter, markdown preview, and more. Premium tools available for power users.',
  keywords: 'text tools, word counter, case converter, JSON formatter, markdown preview, online tools',
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
