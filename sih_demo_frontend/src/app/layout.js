import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'QuARGO — Conversational AI for Ocean Data',
  description:
    'Explore ARGO float data with natural language. Visualize, analyze, and export insights.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-white text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
