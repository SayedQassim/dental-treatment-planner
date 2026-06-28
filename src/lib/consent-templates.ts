import type { ConsentTemplate } from './types';

export const DEFAULT_CONSENT_TEMPLATES: ConsentTemplate[] = [
  {
    id: 'cosmetic_filling',
    category: 'Restorative',
    label: 'Composite / Cosmetic Filling',
    body:
      'I understand that composite (tooth-coloured) fillings are placed for aesthetic and ' +
      'functional reasons. The shade is selected at the time of treatment and minor variation ' +
      'from the surrounding tooth structure may occur. Composite restorations may chip or fracture ' +
      'on hard or sticky food. One free adjustment is offered within two weeks of placement; ' +
      'subsequent repairs or replacements will be charged at the prevailing rate.',
  },
  {
    id: 'crown_bridge',
    category: 'Crown & Bridge',
    label: 'Crown / Bridge',
    body:
      'I understand that the tooth (or teeth) will be reduced to receive an indirect restoration ' +
      '(crown or bridge). A temporary restoration will be placed while the laboratory fabricates ' +
      'the definitive prosthesis. There is a small risk of post-operative sensitivity, the need ' +
      'for root canal treatment, or fracture under unusual loads. Shade and contour are reviewed ' +
      'at the try-in stage before final cementation.',
  },
  {
    id: 'endodontic',
    category: 'Endodontics',
    label: 'Root Canal Treatment',
    body:
      'I understand that root canal treatment removes the infected or inflamed pulp from the ' +
      'tooth and seals the canals. Multiple visits may be required. The success rate is high but ' +
      'not 100%; in rare cases re-treatment, apicoectomy, or extraction may be necessary. The ' +
      'treated tooth will normally require a crown afterwards to prevent fracture.',
  },
  {
    id: 'extraction',
    category: 'Extractions',
    label: 'Extraction',
    body:
      'I understand that extraction carries risks including bleeding, swelling, infection, dry ' +
      'socket, damage to adjacent teeth or restorations, and (for lower wisdom teeth) temporary ' +
      'or permanent altered sensation of the lip, chin, or tongue. Post-operative instructions ' +
      'will be provided and must be followed carefully.',
  },
  {
    id: 'implant',
    category: 'Implants',
    label: 'Dental Implant',
    body:
      'I understand that implant treatment involves the surgical placement of a titanium fixture ' +
      'into the jawbone, followed by a healing period before the prosthetic crown is fitted. ' +
      'Success depends on bone integration, oral hygiene, and avoiding smoking. Risks include ' +
      'infection, failure of integration, and (in the lower jaw) altered sensation of the lip ' +
      'or chin.',
  },
  {
    id: 'orthodontic',
    category: 'Orthodontics',
    label: 'Orthodontic Treatment',
    body:
      'I understand that orthodontic treatment will take many months and requires regular ' +
      'attendance and excellent oral hygiene. Risks include decalcification, root shortening, ' +
      'and relapse if retainers are not worn as instructed. The estimated treatment time is ' +
      'an approximation and may vary.',
  },
  {
    id: 'standard',
    category: 'General',
    label: 'General Authorisation',
    body:
      'I authorise the dentist to carry out the treatment as described above and to administer ' +
      'such local anaesthetic and medications as may be necessary. I have had the opportunity to ' +
      'ask questions and understand that the fee quoted is valid for three months from the date ' +
      'shown and is subject to change thereafter.',
  },
];

export function consentTemplateForCategory(
  category: string,
  templates: ConsentTemplate[],
): ConsentTemplate | undefined {
  return templates.find(t => t.category === category);
}
