'use client';
import React from 'react';
import { UPPER_TEETH, LOWER_TEETH } from '@/lib/dental-data';
import { cn } from '@/lib/utils';

interface ToothChartProps {
  selected: number[];
  onToggle: (num: number) => void;
  readOnly?: boolean;
}

// SVG paths for each tooth type (simplified anatomical shapes)
function ToothSVG({ num, isSelected, onClick, readOnly }: {
  num: number;
  isSelected: boolean;
  onClick: () => void;
  readOnly?: boolean;
}) {
  const isUpper = num >= 11 && num <= 28;
  const toothNum = num % 10; // 1-8 position in jaw
  const isWisdom = toothNum === 8;
  const isMolar = toothNum >= 6;
  const isPremolar = toothNum === 4 || toothNum === 5;
  const isCanine = toothNum === 3;

  const fillColor = isSelected ? '#3b82f6' : '#fefce8';
  const strokeColor = isSelected ? '#1d4ed8' : '#6b7280';

  // Upper teeth: root goes UP, crown faces down
  // Lower teeth: root goes DOWN, crown faces up
  const renderUpper = () => {
    if (isWisdom || isMolar) {
      return (
        <svg viewBox="0 0 32 56" className="w-full h-full">
          {/* Root */}
          <path d="M 8 12 Q 8 2 11 2 Q 14 2 13 12" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 19 12 Q 18 2 21 2 Q 24 2 24 12" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
          {/* Crown */}
          <rect x="4" y="12" width="24" height="22" rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
          <line x1="16" y1="12" x2="16" y2="34" stroke={strokeColor} strokeWidth="0.8" />
        </svg>
      );
    }
    if (isPremolar) {
      return (
        <svg viewBox="0 0 28 52" className="w-full h-full">
          <path d="M 7 14 Q 7 2 10 2 Q 13 2 13 14" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 15 14 Q 15 2 18 2 Q 21 2 21 14" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
          <rect x="3" y="14" width="22" height="18" rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
        </svg>
      );
    }
    if (isCanine) {
      return (
        <svg viewBox="0 0 24 52" className="w-full h-full">
          <path d="M 12 2 L 12 16" stroke={strokeColor} strokeWidth="1.5" />
          <ellipse cx="12" cy="26" rx="9" ry="11" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 12 15 L 12 18" stroke={strokeColor} strokeWidth="1" />
        </svg>
      );
    }
    // Incisor
    return (
      <svg viewBox="0 0 22 50" className="w-full h-full">
        <path d="M 11 2 L 11 16" stroke={strokeColor} strokeWidth="1.5" />
        <rect x="2" y="16" width="18" height="18" rx="4" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
      </svg>
    );
  };

  const renderLower = () => {
    if (isWisdom || isMolar) {
      return (
        <svg viewBox="0 0 32 56" className="w-full h-full">
          {/* Crown */}
          <rect x="4" y="4" width="24" height="22" rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
          <line x1="16" y1="4" x2="16" y2="26" stroke={strokeColor} strokeWidth="0.8" />
          {/* Roots */}
          <path d="M 8 26 Q 8 40 11 40 Q 14 40 13 26" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 19 26 Q 18 40 21 40 Q 24 40 24 26" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
        </svg>
      );
    }
    if (isPremolar) {
      return (
        <svg viewBox="0 0 28 52" className="w-full h-full">
          <rect x="3" y="4" width="22" height="18" rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 7 22 Q 7 36 10 36 Q 13 36 13 22" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 15 22 Q 15 36 18 36 Q 21 36 21 22" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
        </svg>
      );
    }
    if (isCanine) {
      return (
        <svg viewBox="0 0 24 52" className="w-full h-full">
          <ellipse cx="12" cy="18" rx="9" ry="11" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 12 29 L 12 44" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    }
    // Incisor
    return (
      <svg viewBox="0 0 22 50" className="w-full h-full">
        <rect x="2" y="4" width="18" height="18" rx="4" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
        <path d="M 11 22 L 11 40" stroke={strokeColor} strokeWidth="1.5" />
      </svg>
    );
  };

  return (
    <button
      type="button"
      onClick={readOnly ? undefined : onClick}
      className={cn(
        'flex flex-col items-center gap-0.5 group transition-transform',
        !readOnly && 'hover:scale-105 cursor-pointer',
        readOnly && 'cursor-default',
      )}
      title={`Tooth ${num}${isSelected ? ' (selected)' : ''}`}
    >
      <div className={cn(
        'w-7 h-10 sm:w-8 sm:h-12 rounded transition-all duration-150',
        isSelected && !readOnly && 'drop-shadow-md',
      )}>
        {isUpper ? renderUpper() : renderLower()}
      </div>
      <span className={cn(
        'text-[9px] sm:text-[10px] font-medium tabular-nums',
        isSelected ? 'text-blue-600' : 'text-gray-500',
      )}>
        {num}
      </span>
    </button>
  );
}

export default function ToothChart({ selected, onToggle, readOnly }: ToothChartProps) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
      {/* Upper jaw */}
      <div className="flex justify-center gap-0.5 sm:gap-1">
        {UPPER_TEETH.map(num => (
          <ToothSVG
            key={num}
            num={num}
            isSelected={selected.includes(num)}
            onClick={() => onToggle(num)}
            readOnly={readOnly}
          />
        ))}
      </div>

      {/* Divider grid (charting boxes, matching the PDF) */}
      <div className="my-2 flex justify-center gap-0.5 sm:gap-1">
        {UPPER_TEETH.map(num => (
          <div
            key={num}
            className={cn(
              'w-7 sm:w-8 h-5 border border-gray-300 rounded-sm',
              selected.includes(num) && 'bg-blue-100 border-blue-400',
            )}
          />
        ))}
      </div>
      <div className="mb-2 flex justify-center gap-0.5 sm:gap-1">
        {LOWER_TEETH.map(num => (
          <div
            key={num}
            className={cn(
              'w-7 sm:w-8 h-5 border border-gray-300 rounded-sm',
              selected.includes(num) && 'bg-blue-100 border-blue-400',
            )}
          />
        ))}
      </div>

      {/* Lower jaw */}
      <div className="flex justify-center gap-0.5 sm:gap-1">
        {LOWER_TEETH.map(num => (
          <ToothSVG
            key={num}
            num={num}
            isSelected={selected.includes(num)}
            onClick={() => onToggle(num)}
            readOnly={readOnly}
          />
        ))}
      </div>

      {!readOnly && (
        <p className="mt-2 text-center text-xs text-gray-400">
          Click teeth to select / deselect them
        </p>
      )}
    </div>
  );
}
