'use client';
import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Settings, Stethoscope } from 'lucide-react';
import PlanEditor from '@/components/editor/PlanEditor';
import DocumentPreview from '@/components/document/DocumentPreview';
import SettingsDrawer from '@/components/settings/SettingsDrawer';
import { usePlanStore } from '@/lib/store';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewOpenMobile, setPreviewOpenMobile] = useState(false);
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
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Stethoscope className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 leading-none truncate">
                Dental Treatment Planner
              </div>
              <div className="text-xs text-gray-500 leading-tight mt-0.5 truncate">
                {clinicName}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setPreviewOpenMobile(v => !v)}
              className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 border border-gray-300 hover:bg-gray-50"
              aria-label={previewOpenMobile ? 'Hide preview' : 'Show preview'}
            >
              {previewOpenMobile ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 sm:px-3 py-2 sm:py-1.5 text-sm text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-4 sm:py-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 sm:gap-5 print:block print:p-0 print:max-w-none print:gap-0">
        <div
          className={
            'bg-white rounded-lg border border-gray-200 p-4 sm:p-5 print:hidden ' +
            (previewOpenMobile ? 'hidden lg:block' : 'block')
          }
        >
          <PlanEditor />
        </div>
        <div
          className={
            'lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto print:overflow-visible ' +
            (previewOpenMobile ? 'block' : 'hidden lg:block')
          }
        >
          <div className="rounded-lg overflow-hidden print:overflow-visible">
            <DocumentPreview />
          </div>
        </div>
      </main>

      <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
