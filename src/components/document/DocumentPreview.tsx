'use client';
import React from 'react';
import { usePlanStore } from '@/lib/store';
import ToothChart from '@/components/tooth-chart/ToothChart';
import {
  applyDiscount,
  calcSubtotal,
  formatCurrency,
  formatDate,
} from '@/lib/utils';

export default function DocumentPreview() {
  const clinic = usePlanStore(s => s.clinic);
  const plan = usePlanStore(s => s.plan);

  const subtotal = calcSubtotal(plan.items);
  const finalTotal = applyDiscount(
    subtotal,
    plan.discountType,
    plan.discountValue,
  );
  const showDiscount = plan.discountType !== 'none' && plan.discountValue > 0;

  return (
    <div className="doc-page bg-white text-black mx-auto shadow-lg print:shadow-none">
      <header className="flex items-start justify-between border-b-2 border-gray-800 pb-3">
        <div className="text-[10pt] text-gray-700 leading-snug">
          {clinic.addressLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          {clinic.tel && <div>Tel: {clinic.tel}</div>}
          {clinic.fax && <div>Fax: {clinic.fax}</div>}
        </div>
        <div className="text-right">
          <div className="font-bold italic text-[15pt] text-gray-900">
            {clinic.name}
          </div>
        </div>
      </header>

      <h1 className="text-center font-bold underline text-[14pt] mt-5 mb-4">
        Treatment Plan and Consent Form
      </h1>

      <section className="grid grid-cols-2 gap-x-8 gap-y-1 text-[10pt] mb-4">
        <div>
          <span className="font-semibold">Patient Name:</span>{' '}
          {plan.patientTitle} {plan.patientName || '___________________'}
        </div>
        <div>
          <span className="font-semibold">Ref No.:</span>{' '}
          {plan.refNo || '________'}
        </div>
        <div>
          <span className="font-semibold">Provider:</span>{' '}
          {plan.provider || '________'}
        </div>
        <div>
          <span className="font-semibold">Date:</span>{' '}
          {formatDate(plan.planDate)}
        </div>
      </section>

      <p className="text-center italic text-[10pt] mb-3">
        Thank you for choosing our practice. The treatment recommended for you
        is shown below.
      </p>

      <div className="flex justify-center mb-4">
        <ToothChart selected={plan.selectedTeeth} readOnly size="doc" />
      </div>

      <table className="w-full text-[9.5pt] border-collapse mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-500 px-2 py-1 text-left w-[14%]">
              Tooth No.
            </th>
            <th className="border border-gray-500 px-2 py-1 text-left">
              Treatment Description
            </th>
            <th className="border border-gray-500 px-2 py-1 text-right w-[14%]">
              Priced
            </th>
            <th className="border border-gray-500 px-2 py-1 text-left w-[18%]">
              Provider
            </th>
            <th className="border border-gray-500 px-2 py-1 text-left w-[14%]">
              Date Completed
            </th>
          </tr>
        </thead>
        <tbody>
          {plan.items.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="border border-gray-500 px-2 py-4 text-center text-gray-400 italic"
              >
                No treatments added
              </td>
            </tr>
          ) : (
            plan.items.map(item => (
              <tr key={item.id}>
                <td className="border border-gray-500 px-2 py-1 align-top">
                  {item.teeth.length > 0 ? item.teeth.join(', ') : '—'}
                </td>
                <td className="border border-gray-500 px-2 py-1 align-top">
                  {item.description}
                  {item.quantity > 1 && (
                    <span className="text-gray-500">
                      {' '}
                      ({formatCurrency(item.unitPrice, clinic.currency)} ×{' '}
                      {item.quantity})
                    </span>
                  )}
                </td>
                <td className="border border-gray-500 px-2 py-1 text-right tabular-nums align-top">
                  {formatCurrency(item.unitPrice * item.quantity, clinic.currency)}
                </td>
                <td className="border border-gray-500 px-2 py-1 align-top">
                  {item.provider}
                </td>
                <td className="border border-gray-500 px-2 py-1 align-top">
                  {formatDate(item.dateCompleted)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-end mb-5">
        <div className="text-[10pt] w-[55%]">
          <div className="flex justify-between py-1 border-t border-gray-400">
            <span className="font-semibold">Total Treatment Cost</span>
            <span className="tabular-nums">
              {formatCurrency(subtotal, clinic.currency)}
            </span>
          </div>
          {showDiscount && (
            <div className="flex justify-between py-1 border-t border-gray-400 font-bold underline">
              <span>Total After {plan.discountLabel}</span>
              <span className="tabular-nums">
                {formatCurrency(finalTotal, clinic.currency)}
              </span>
            </div>
          )}
        </div>
      </div>

      {plan.consentText && (
        <section className="text-[9.5pt] leading-relaxed text-justify space-y-2 mb-5">
          <h2 className="font-bold underline text-[10pt]">Consent</h2>
          {plan.consentText.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </section>
      )}

      <section className="text-[9.5pt] mt-6 space-y-4 page-break-before">
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          <SignatureLine label="Patient Signature" value={`${plan.patientTitle} ${plan.patientName}`.trim()} />
          <SignatureLine label="Date" value={formatDate(plan.planDate)} />
          <SignatureLine label="Guardian (if minor)" value={plan.guardianName} />
          <SignatureLine label="Witness" value={plan.witnessName} />
          <SignatureLine label="Provider Signature" value={plan.provider} />
          <SignatureLine label="Date" value={formatDate(plan.planDate)} />
        </div>
      </section>

      <footer className="mt-8 pt-3 border-t border-gray-400 text-[8.5pt] text-gray-600 text-center italic">
        This treatment plan and fee estimate is valid for {clinic.validityMonths}{' '}
        months from the date above and is subject to change thereafter.
        <div className="mt-1 not-italic font-semibold">{clinic.name}</div>
      </footer>
    </div>
  );
}

function SignatureLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="border-b border-dotted border-gray-700 h-6 flex items-end pb-0.5 px-1 text-[10pt]">
        {value || ''}
      </div>
      <div className="text-[8.5pt] text-gray-600 mt-0.5">{label}</div>
    </div>
  );
}
