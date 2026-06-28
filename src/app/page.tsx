'use client';
import React, { useEffect, useState } from 'react';
import { Settings, Stethoscope } from 'lucide-react';
import PlanEditor from '@/components/editor/PlanEditor';
import DocumentPreview from '@/components/document/DocumentPreview';
import SettingsDrawer from '@/components/settings/SettingsDrawer';
import { usePlanStore } from '@/lib/store';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const clinicName = usePlanStore(s => s.clinic.name);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-screen-2xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-sm font-semibold text-gray-900 leading-none">
                Dental Treatment Planner
              </div>
              <div className="text-xs text-gray-500 leading-tight mt-0.5">
                {clinicName}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 py-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-5 print:block print:p-0 print:max-w-none">
        <div className="bg-white rounded-lg border border-gray-200 p-5 print:hidden">
          <PlanEditor />
        </div>
        <div className="lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto print:overflow-visible">
          <div className="rounded-lg overflow-hidden print:overflow-visible">
            <DocumentPreview />
          </div>
        </div>
      </main>

      <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
