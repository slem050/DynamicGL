import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DynamicGL - GPU-Accelerated Charting Framework',
  description: 'High-performance, real-time charts for live and streaming data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

