import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'T-0 - Train Smarter, Track Better',
  description: 'Fitness training platform for coaches and trainees',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
