import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dental Treatment Planner',
  description:
    'Generate dental treatment plans and consent forms in a fraction of the time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
