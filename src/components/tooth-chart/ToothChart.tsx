'use client';
import React from 'react';
import { UPPER_TEETH, LOWER_TEETH } from '@/lib/dental-data';
import { cn } from '@/lib/utils';

interface ToothChartProps {
  /** Teeth currently being picked for the next treatment (bright fill). */
  selected: number[];
  /** Teeth already attached to a line item (soft fill). */
  treated?: number[];
  onToggle?: (num: number) => void;
  readOnly?: boolean;
  /** "editor" = interactive size, "doc" = compact for the printed document */
  size?: 'editor' | 'doc';
}

type ToothState = 'idle' | 'treated' | 'selected' | 'both';

const PALETTE: Record<ToothState, { fill: string; stroke: string; label: string }> = {
  idle:     { fill: '#ffffff', stroke: '#374151', label: 'text-gray-500'  },
  treated:  { fill: '#fef3c7', stroke: '#b45309', label: 'text-amber-800' },
  selected: { fill: '#fde047', stroke: '#a16207', label: 'text-amber-700' },
  both:     { fill: '#facc15', stroke: '#854d0e', label: 'text-amber-900' },
};

function Tooth({
  num,
  state,
  onClick,
}: {
  num: number;
  state: ToothState;
  onClick?: () => void;
}) {
  const isUpper = num >= 11 && num <= 28;
  const pos = num % 10;
  const { fill, stroke, label } = PALETTE[state];

  const renderShape = () => {
    const crown = (
      <rect
        x={4}
        y={isUpper ? 18 : 4}
        width={24}
        height={22}
        rx={5}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.2}
      />
    );
    const rootBaseY = isUpper ? 18 : 26;
    const rootTipY = isUpper ? 4 : 40;
    const roots = pos >= 6
      ? (
        <>
          <path
            d={`M 9 ${rootBaseY} Q 9 ${rootTipY} 13 ${rootTipY} Q 16 ${rootTipY} 14 ${rootBaseY}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={1.2}
          />
          <path
            d={`M 18 ${rootBaseY} Q 16 ${rootTipY} 19 ${rootTipY} Q 23 ${rootTipY} 23 ${rootBaseY}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={1.2}
          />
        </>
      )
      : pos >= 4
      ? (
        <path
          d={`M 12 ${rootBaseY} Q 11 ${rootTipY} 16 ${rootTipY} Q 21 ${rootTipY} 20 ${rootBaseY}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.2}
        />
      )
      : (
        <path
          d={`M 14 ${rootBaseY} Q 14 ${rootTipY} 16 ${rootTipY} Q 18 ${rootTipY} 18 ${rootBaseY}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.2}
        />
      );

    return (
      <svg viewBox="0 0 32 44" className="w-full h-full">
        {isUpper ? roots : crown}
        {isUpper ? crown : roots}
      </svg>
    );
  };

  const inner = (
    <>
      {renderShape()}
      <span
        className={cn(
          'text-[9px] font-medium tabular-nums leading-none',
          label,
        )}
      >
        {num}
      </span>
    </>
  );

  if (!onClick) {
    return (
      <div
        className="flex flex-col items-center gap-0.5"
        aria-hidden="true"
      >
        {inner}
      </div>
    );
  }

  const titleParts: string[] = [`Tooth ${num}`];
  if (state === 'treated') titleParts.push('has treatment');
  if (state === 'selected') titleParts.push('selected for next add');
  if (state === 'both') titleParts.push('has treatment · also selected');
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 group transition-transform cursor-pointer hover:scale-110"
      title={titleParts.join(' · ')}
      aria-pressed={state === 'selected' || state === 'both'}
      aria-label={`Tooth ${num}`}
    >
      {inner}
    </button>
  );
}

function toothState(num: number, selected: number[], treated: number[]): ToothState {
  const isSelected = selected.includes(num);
  const isTreated = treated.includes(num);
  if (isSelected && isTreated) return 'both';
  if (isSelected) return 'selected';
  if (isTreated) return 'treated';
  return 'idle';
}

export default function ToothChart({
  selected,
  treated = [],
  onToggle,
  readOnly,
  size = 'editor',
}: ToothChartProps) {
  const toothSize = size === 'editor' ? 'w-7 h-10 sm:w-8 sm:h-12' : 'w-6 h-9';
  const gap = size === 'editor' ? 'gap-0.5 sm:gap-1' : 'gap-0.5';
  const handler = readOnly ? undefined : onToggle;

  return (
    <div
      className={cn(
        'mx-auto inline-block',
        size === 'editor' && 'p-2',
      )}
      data-tooth-chart
    >
      <div className={cn('flex justify-center', gap)}>
        {UPPER_TEETH.map(num => (
          <div key={num} className={toothSize}>
            <Tooth
              num={num}
              state={toothState(num, selected, treated)}
              onClick={handler ? () => handler(num) : undefined}
            />
          </div>
        ))}
      </div>
      <div className="my-1 h-px bg-gray-300 mx-2" />
      <div className={cn('flex justify-center', gap)}>
        {LOWER_TEETH.map(num => (
          <div key={num} className={toothSize}>
            <Tooth
              num={num}
              state={toothState(num, selected, treated)}
              onClick={handler ? () => handler(num) : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
