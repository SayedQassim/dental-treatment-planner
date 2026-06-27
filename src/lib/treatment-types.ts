import type { TreatmentType } from './types';

export const TREATMENT_CATEGORIES = [
  'Restorative',
  'Crown & Bridge',
  'Endodontics',
  'Extractions',
  'Periodontics',
  'Cosmetic',
  'Implants',
  'Prosthodontics',
  'Orthodontics',
  'Preventive & Diagnostic',
] as const;

export type TreatmentCategory = typeof TREATMENT_CATEGORIES[number];

export const TREATMENT_TYPES: TreatmentType[] = [
  // Restorative
  { id: 'composite-small',       category: 'Restorative', name: 'Composite Filling - Small',        defaultPrice: 20 },
  { id: 'composite-medium',      category: 'Restorative', name: 'Composite Filling - Medium',       defaultPrice: 30 },
  { id: 'composite-large',       category: 'Restorative', name: 'Composite Filling - Large',        defaultPrice: 40 },
  { id: 'amalgam-small',         category: 'Restorative', name: 'Amalgam Filling - Small',          defaultPrice: 15 },
  { id: 'amalgam-medium',        category: 'Restorative', name: 'Amalgam Filling - Medium',         defaultPrice: 20 },
  { id: 'amalgam-large',         category: 'Restorative', name: 'Amalgam Filling - Large',          defaultPrice: 25 },
  { id: 'glass-ionomer',         category: 'Restorative', name: 'Glass Ionomer Filling',            defaultPrice: 20 },
  { id: 'inlay-ceramic',         category: 'Restorative', name: 'Inlay - Ceramic',                  defaultPrice: 120 },
  { id: 'inlay-gold',            category: 'Restorative', name: 'Inlay - Gold',                     defaultPrice: 150 },
  { id: 'onlay-ceramic',         category: 'Restorative', name: 'Onlay - Ceramic',                  defaultPrice: 150 },
  { id: 'onlay-gold',            category: 'Restorative', name: 'Onlay - Gold',                     defaultPrice: 180 },

  // Crown & Bridge
  { id: 'crown-zirconia',        category: 'Crown & Bridge', name: 'Crown - Zirconia',              defaultPrice: 180 },
  { id: 'crown-pfm',             category: 'Crown & Bridge', name: 'Crown - Porcelain-Fused-Metal',  defaultPrice: 130 },
  { id: 'crown-all-ceramic',     category: 'Crown & Bridge', name: 'Crown - All Ceramic',           defaultPrice: 200 },
  { id: 'crown-gold',            category: 'Crown & Bridge', name: 'Crown - Gold',                  defaultPrice: 220 },
  { id: 'crown-temporary',       category: 'Crown & Bridge', name: 'Temporary Crown',               defaultPrice: 30 },
  { id: 'bridge-unit',           category: 'Crown & Bridge', name: 'Bridge - Per Unit',             defaultPrice: 180 },
  { id: 'bridge-temporary',      category: 'Crown & Bridge', name: 'Bridge - Temporary (Per Unit)', defaultPrice: 30 },

  // Endodontics
  { id: 'rct-anterior',          category: 'Endodontics', name: 'Root Canal - Anterior (1 Canal)',  defaultPrice: 60 },
  { id: 'rct-premolar',          category: 'Endodontics', name: 'Root Canal - Premolar (2 Canals)', defaultPrice: 80 },
  { id: 'rct-molar',             category: 'Endodontics', name: 'Root Canal - Molar (3-4 Canals)', defaultPrice: 120 },
  { id: 'rct-retreatment',       category: 'Endodontics', name: 'RCT Re-treatment',                defaultPrice: 150 },
  { id: 'pulp-cap-direct',       category: 'Endodontics', name: 'Pulp Capping - Direct',           defaultPrice: 30 },
  { id: 'pulp-cap-indirect',     category: 'Endodontics', name: 'Pulp Capping - Indirect',         defaultPrice: 25 },
  { id: 'apicoectomy',           category: 'Endodontics', name: 'Apicoectomy',                     defaultPrice: 200 },
  { id: 'post-core',             category: 'Endodontics', name: 'Post & Core Build-up',             defaultPrice: 50 },

  // Extractions
  { id: 'extraction-simple',     category: 'Extractions', name: 'Simple Extraction',               defaultPrice: 20 },
  { id: 'extraction-surgical',   category: 'Extractions', name: 'Surgical Extraction',             defaultPrice: 60 },
  { id: 'wisdom-removal',        category: 'Extractions', name: 'Wisdom Tooth Removal (Surgical)', defaultPrice: 120 },
  { id: 'alveoloplasty',         category: 'Extractions', name: 'Alveoloplasty (per quadrant)',    defaultPrice: 80 },

  // Periodontics
  { id: 'scaling-polishing',     category: 'Periodontics', name: 'Scaling & Polishing',            defaultPrice: 25 },
  { id: 'deep-scaling',          category: 'Periodontics', name: 'Deep Scaling (per quadrant)',     defaultPrice: 40 },
  { id: 'root-planing',          category: 'Periodontics', name: 'Root Planing (per quadrant)',     defaultPrice: 50 },
  { id: 'gingival-curettage',    category: 'Periodontics', name: 'Gingival Curettage',             defaultPrice: 60 },
  { id: 'gingivectomy',          category: 'Periodontics', name: 'Gingivectomy (per tooth)',        defaultPrice: 40 },
  { id: 'crown-lengthening',     category: 'Periodontics', name: 'Crown Lengthening (per tooth)',  defaultPrice: 80 },

  // Cosmetic
  { id: 'veneer-porcelain',      category: 'Cosmetic', name: 'Porcelain Veneer',                   defaultPrice: 200 },
  { id: 'veneer-composite',      category: 'Cosmetic', name: 'Composite Veneer',                   defaultPrice: 80 },
  { id: 'whitening-office',      category: 'Cosmetic', name: 'Teeth Whitening - In-Office',        defaultPrice: 100 },
  { id: 'whitening-home',        category: 'Cosmetic', name: 'Teeth Whitening - Take-Home Kit',    defaultPrice: 60 },
  { id: 'smile-design',          category: 'Cosmetic', name: 'Smile Design Consultation',          defaultPrice: 50 },
  { id: 'composite-bonding',     category: 'Cosmetic', name: 'Composite Bonding / Recontouring',  defaultPrice: 50 },

  // Implants
  { id: 'implant-fixture',       category: 'Implants', name: 'Implant Fixture Placement',          defaultPrice: 600 },
  { id: 'implant-abutment',      category: 'Implants', name: 'Implant Abutment',                   defaultPrice: 150 },
  { id: 'implant-crown-zirconia',category: 'Implants', name: 'Implant Crown - Zirconia',           defaultPrice: 250 },
  { id: 'implant-crown-pfm',     category: 'Implants', name: 'Implant Crown - PFM',               defaultPrice: 200 },
  { id: 'bone-graft',            category: 'Implants', name: 'Bone Grafting',                      defaultPrice: 300 },
  { id: 'sinus-lift',            category: 'Implants', name: 'Sinus Lift',                         defaultPrice: 400 },

  // Prosthodontics
  { id: 'denture-complete-upper',category: 'Prosthodontics', name: 'Complete Denture - Upper',     defaultPrice: 350 },
  { id: 'denture-complete-lower',category: 'Prosthodontics', name: 'Complete Denture - Lower',     defaultPrice: 350 },
  { id: 'denture-partial-acrylic',category:'Prosthodontics', name: 'Partial Denture - Acrylic',   defaultPrice: 200 },
  { id: 'denture-partial-chrome', category:'Prosthodontics', name: 'Partial Denture - Chrome Cobalt', defaultPrice: 350 },
  { id: 'denture-reline',        category: 'Prosthodontics', name: 'Denture Reline',               defaultPrice: 80 },
  { id: 'denture-repair',        category: 'Prosthodontics', name: 'Denture Repair',               defaultPrice: 40 },
  { id: 'implant-denture',       category: 'Prosthodontics', name: 'Implant-Supported Denture',    defaultPrice: 1200 },

  // Orthodontics
  { id: 'braces-metal',          category: 'Orthodontics', name: 'Metal Braces (Full)',             defaultPrice: 1200 },
  { id: 'braces-ceramic',        category: 'Orthodontics', name: 'Ceramic Braces (Full)',           defaultPrice: 1600 },
  { id: 'clear-aligners',        category: 'Orthodontics', name: 'Clear Aligners',                  defaultPrice: 2000 },
  { id: 'retainer-fixed',        category: 'Orthodontics', name: 'Fixed Retainer',                  defaultPrice: 80 },
  { id: 'retainer-removable',    category: 'Orthodontics', name: 'Removable Retainer',              defaultPrice: 60 },
  { id: 'ortho-consultation',    category: 'Orthodontics', name: 'Orthodontic Consultation',        defaultPrice: 30 },

  // Preventive & Diagnostic
  { id: 'examination',           category: 'Preventive & Diagnostic', name: 'Examination / Consultation',     defaultPrice: 15 },
  { id: 'xray-periapical',       category: 'Preventive & Diagnostic', name: 'X-ray - Periapical',            defaultPrice: 5 },
  { id: 'xray-panoramic',        category: 'Preventive & Diagnostic', name: 'X-ray - Panoramic (OPG)',       defaultPrice: 30 },
  { id: 'xray-bitewing',         category: 'Preventive & Diagnostic', name: 'X-ray - Bitewing (2 films)',    defaultPrice: 10 },
  { id: 'xray-cephalometric',    category: 'Preventive & Diagnostic', name: 'X-ray - Cephalometric',        defaultPrice: 25 },
  { id: 'sealant',               category: 'Preventive & Diagnostic', name: 'Fissure Sealant (per tooth)',   defaultPrice: 15 },
  { id: 'fluoride',              category: 'Preventive & Diagnostic', name: 'Fluoride Treatment',            defaultPrice: 10 },
  { id: 'study-models',          category: 'Preventive & Diagnostic', name: 'Study Models / Records',        defaultPrice: 25 },
];

export function getTreatmentsByCategory(category: string): TreatmentType[] {
  return TREATMENT_TYPES.filter(t => t.category === category);
}

export function getTreatmentById(id: string): TreatmentType | undefined {
  return TREATMENT_TYPES.find(t => t.id === id);
}

export function getCategoryForTreatment(name: string): string {
  return TREATMENT_TYPES.find(t => t.name === name)?.category ?? 'Restorative';
}
