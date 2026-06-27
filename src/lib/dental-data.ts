import type { ToothInfo, ToothType } from './types';

const toothDefs: Array<{ number: number; type: ToothType; jaw: 'upper' | 'lower'; side: 'right' | 'left'; name: string }> = [
  // Upper right (patient's right) — 18 to 11
  { number: 18, type: 'wisdom',   jaw: 'upper', side: 'right', name: 'Upper Right Third Molar (Wisdom)' },
  { number: 17, type: 'molar',    jaw: 'upper', side: 'right', name: 'Upper Right Second Molar' },
  { number: 16, type: 'molar',    jaw: 'upper', side: 'right', name: 'Upper Right First Molar' },
  { number: 15, type: 'premolar', jaw: 'upper', side: 'right', name: 'Upper Right Second Premolar' },
  { number: 14, type: 'premolar', jaw: 'upper', side: 'right', name: 'Upper Right First Premolar' },
  { number: 13, type: 'canine',   jaw: 'upper', side: 'right', name: 'Upper Right Canine' },
  { number: 12, type: 'incisor',  jaw: 'upper', side: 'right', name: 'Upper Right Lateral Incisor' },
  { number: 11, type: 'incisor',  jaw: 'upper', side: 'right', name: 'Upper Right Central Incisor' },
  // Upper left — 21 to 28
  { number: 21, type: 'incisor',  jaw: 'upper', side: 'left', name: 'Upper Left Central Incisor' },
  { number: 22, type: 'incisor',  jaw: 'upper', side: 'left', name: 'Upper Left Lateral Incisor' },
  { number: 23, type: 'canine',   jaw: 'upper', side: 'left', name: 'Upper Left Canine' },
  { number: 24, type: 'premolar', jaw: 'upper', side: 'left', name: 'Upper Left First Premolar' },
  { number: 25, type: 'premolar', jaw: 'upper', side: 'left', name: 'Upper Left Second Premolar' },
  { number: 26, type: 'molar',    jaw: 'upper', side: 'left', name: 'Upper Left First Molar' },
  { number: 27, type: 'molar',    jaw: 'upper', side: 'left', name: 'Upper Left Second Molar' },
  { number: 28, type: 'wisdom',   jaw: 'upper', side: 'left', name: 'Upper Left Third Molar (Wisdom)' },
  // Lower left — 31 to 38
  { number: 31, type: 'incisor',  jaw: 'lower', side: 'left', name: 'Lower Left Central Incisor' },
  { number: 32, type: 'incisor',  jaw: 'lower', side: 'left', name: 'Lower Left Lateral Incisor' },
  { number: 33, type: 'canine',   jaw: 'lower', side: 'left', name: 'Lower Left Canine' },
  { number: 34, type: 'premolar', jaw: 'lower', side: 'left', name: 'Lower Left First Premolar' },
  { number: 35, type: 'premolar', jaw: 'lower', side: 'left', name: 'Lower Left Second Premolar' },
  { number: 36, type: 'molar',    jaw: 'lower', side: 'left', name: 'Lower Left First Molar' },
  { number: 37, type: 'molar',    jaw: 'lower', side: 'left', name: 'Lower Left Second Molar' },
  { number: 38, type: 'wisdom',   jaw: 'lower', side: 'left', name: 'Lower Left Third Molar (Wisdom)' },
  // Lower right — 48 to 41
  { number: 48, type: 'wisdom',   jaw: 'lower', side: 'right', name: 'Lower Right Third Molar (Wisdom)' },
  { number: 47, type: 'molar',    jaw: 'lower', side: 'right', name: 'Lower Right Second Molar' },
  { number: 46, type: 'molar',    jaw: 'lower', side: 'right', name: 'Lower Right First Molar' },
  { number: 45, type: 'premolar', jaw: 'lower', side: 'right', name: 'Lower Right Second Premolar' },
  { number: 44, type: 'premolar', jaw: 'lower', side: 'right', name: 'Lower Right First Premolar' },
  { number: 43, type: 'canine',   jaw: 'lower', side: 'right', name: 'Lower Right Canine' },
  { number: 42, type: 'incisor',  jaw: 'lower', side: 'right', name: 'Lower Right Lateral Incisor' },
  { number: 41, type: 'incisor',  jaw: 'lower', side: 'right', name: 'Lower Right Central Incisor' },
];

export const TEETH: ToothInfo[] = toothDefs;

// Display order for the dental chart
// Upper row: 18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28
export const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
// Lower row: 48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38
export const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

export const ALL_TOOTH_NUMBERS = [...UPPER_TEETH, ...LOWER_TEETH];

export function getToothInfo(number: number): ToothInfo | undefined {
  return TEETH.find(t => t.number === number);
}
