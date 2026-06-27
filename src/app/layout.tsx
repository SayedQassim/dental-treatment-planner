import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Stethoscope, Settings, PlusCircle, LayoutDashboard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dental Treatment Planner',
  description: 'Generate professional dental treatment plans and consent forms',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <Link href="/" className="flex items-center gap-2 font-bold text-blue-700 text-lg">
            <Stethoscope className="h-5 w-5" />
            DentalPlan
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link href="/new" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <PlusCircle className="h-4 w-4" /> New Plan
            </Link>
            <Link href="/settings" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
