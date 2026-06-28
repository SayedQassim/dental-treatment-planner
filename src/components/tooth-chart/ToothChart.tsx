'use client';
import React from 'react';
import { UPPER_TEETH, LOWER_TEETH } from '@/lib/dental-data';
import { cn } from '@/lib/utils';

interface ToothChartProps {
  selected: number[];
  onToggle?: (num: number) => void;
  readOnly?: boolean;
  /** "editor" = interactive size, "doc" = compact for the printed document */
  size?: 'editor' | 'doc';
}

const SELECTED_FILL = '#fde047';
const SELECTED_STROKE = '#a16207';
const DEFAULT_FILL = '#ffffff';
const DEFAULT_STROKE = '#374151';

function Tooth({
  num,
  isSelected,
  onClick,
  readOnly,
}: {
  num: number;
  isSelected: boolean;
  onClick?: () => void;
  readOnly?: boolean;
}) {
  const isUpper = num >= 11 && num <= 28;
  const pos = num % 10;
  const fill = isSelected ? SELECTED_FILL : DEFAULT_FILL;
  const stroke = isSelected ? SELECTED_STROKE : DEFAULT_STROKE;

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

  const interactive = !readOnly && onClick;
  const inner = (
    <>
      {renderShape()}
      <span
        className={cn(
          'text-[9px] font-medium tabular-nums leading-none',
          isSelected ? 'text-amber-700' : 'text-gray-500',
        )}
      >
        {num}
      </span>
    </>
  );
  if (!interactive) {
    return (
      <div
        className="flex flex-col items-center gap-0.5"
        aria-hidden="true"
      >
        {inner}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 group transition-transform cursor-pointer hover:scale-110"
      title={`Tooth ${num}${isSelected ? ' (selected)' : ''}`}
      aria-pressed={isSelected}
      aria-label={`Tooth ${num}`}
    >
      {inner}
    </button>
  );
}

export default function ToothChart({
  selected,
  onToggle,
  readOnly,
  size = 'editor',
}: ToothChartProps) {
  const toothSize = size === 'editor' ? 'w-7 h-10 sm:w-8 sm:h-12' : 'w-6 h-9';
  const gap = size === 'editor' ? 'gap-0.5 sm:gap-1' : 'gap-0.5';

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
              isSelected={selected.includes(num)}
              onClick={onToggle ? () => onToggle(num) : undefined}
              readOnly={readOnly}
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
              isSelected={selected.includes(num)}
              onClick={onToggle ? () => onToggle(num) : undefined}
              readOnly={readOnly}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
