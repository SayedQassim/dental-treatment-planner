export type ConsentCategory =
  | 'Restorative'
  | 'Crown & Bridge'
  | 'Endodontics'
  | 'Extractions'
  | 'Periodontics'
  | 'Cosmetic'
  | 'Implants'
  | 'Prosthodontics'
  | 'Orthodontics'
  | 'Preventive & Diagnostic'
  | 'General';

export const CONSENT_TEXTS: Record<ConsentCategory, string> = {
  Restorative: `I have been advised of and understand that treatment of dental conditions requiring cosmetic fillings, involves certain risks and possible unsuccessful results, including the possibility of failure, there are no promises or guarantees of anticipated results or predict longevity of cosmetic fillings.

Kindly note that tooth-coloured composite fillings are prone to breakage upon eating hard food and can change overtime with coloured food and beverage.

It is a patient's responsibility to seek attention from the dentist should any undue or unexpected problems occur. The patient must diligently follow any and all instruction, including the scheduling of and attendance at all appointments.

The fee(s) for these services have been explained to me and thoroughly.

I actively participated in the treatment process by selecting the preferred shade and smile design, ensuring the final result aligns with my personal aesthetic preferences.

I understand that I have only one chance to adjust my cosmetic fillings in one visit within the month I get treated. Fees will be applied for the next visits or adjustments.

I understand that it is my responsibility to notify this office should any undue or unexpected problems occur or if I experience any problems relating to the treatment rendered or the services performed. I have been given the opportunity to ask any questions regarding the nature and purpose of composite fillings and have received answers to my satisfaction.

By signing this document, I am freely giving my consent to allow and authorize the dental centre to render any treatment necessary and/or advisable to my dental conditions, including the prescribing and administering of any medications and/or anesthetics deemed necessary to my treatment.

I understand that variations to this treatment plan may occur during any course of treatment, as a result of the clinical condition.

The dental centre retains the right to amend this treatment plan.

I agree to have these treatments carried out.

• This treatment plan is valid only for 3 months. And subjected for price changes if signed after that.`,

  'Crown & Bridge': `I have been advised of and understand that treatment requiring crowns and/or bridges involves certain risks including, but not limited to: sensitivity of the tooth/teeth, need for root canal treatment, fracture of the restoration, and failure requiring replacement.

I understand that natural teeth prepared for crowns or bridges are permanently altered and cannot be reversed. Temporary restorations are placed during the treatment period and I should take care to avoid hard or sticky foods.

The longevity of crowns and bridges depends on proper oral hygiene, regular dental visits, and avoidance of habits such as clenching and grinding. No guarantees have been made regarding the lifespan of these restorations.

The fee(s) for these services have been explained to me thoroughly.

By signing this document, I am freely giving my consent to allow and authorize the dental centre to render any treatment necessary and/or advisable to my dental conditions.

I understand that variations to this treatment plan may occur during any course of treatment, as a result of the clinical condition. The dental centre retains the right to amend this treatment plan.

• This treatment plan is valid only for 3 months and is subject to price changes if signed after that.`,

  Endodontics: `I have been advised of and understand that root canal treatment (endodontic therapy) involves certain risks including, but not limited to: instrument separation within the canal, perforation, incomplete treatment due to unusual anatomy, post-operative pain and swelling, and the possibility that the treatment may not be successful, requiring extraction.

I understand that root canal treated teeth are more brittle and susceptible to fracture, and that a crown is often recommended following root canal treatment to protect the tooth.

I understand there is no guarantee that root canal treatment will save my tooth and that retreatment or extraction may be required in the future.

The fee(s) for these services have been explained to me thoroughly. I have been given the opportunity to ask questions and have received answers to my satisfaction.

By signing this document, I am freely giving my consent to allow and authorize the dental centre to render any treatment necessary and/or advisable to my dental conditions, including the prescribing and administering of any medications and/or anesthetics deemed necessary.

• This treatment plan is valid only for 3 months and is subject to price changes if signed after that.`,

  Extractions: `I have been advised of and understand that tooth extraction involves certain risks including, but not limited to: pain and swelling, dry socket (alveolar osteitis), damage to adjacent teeth or restorations, nerve injury causing temporary or permanent numbness or tingling, sinus involvement (upper teeth), post-operative bleeding, and infection.

I have been informed about the consequences of tooth loss including shifting of adjacent teeth, bone loss, and changes in bite. Tooth replacement options have been discussed with me.

For surgical extractions (including wisdom teeth), I understand additional risks may include: prolonged recovery, need for stitches, and in rare cases, jaw fracture.

I must follow all post-operative instructions carefully, including diet restrictions, no smoking, and oral hygiene practices. I should not drive or operate machinery if sedation is used.

By signing this document, I freely give consent to the extraction(s) and any treatment necessary during the procedure, including the administering of local anesthetics.

• This treatment plan is valid only for 3 months and is subject to price changes if signed after that.`,

  Periodontics: `I have been advised of and understand that periodontal (gum) treatment involves certain risks including, but not limited to: temporary or permanent tooth sensitivity, gum recession, tooth mobility, and the possibility that treatment may not completely resolve the condition.

I understand that periodontal disease is a chronic condition that requires ongoing maintenance and that home care compliance is critical for the success of treatment. Regular periodontal maintenance visits will be recommended following active treatment.

I have been informed that untreated periodontal disease can lead to tooth loss and may be associated with systemic conditions.

By signing this document, I freely give my consent to allow and authorize the dental centre to render the recommended periodontal treatments.

• This treatment plan is valid only for 3 months and is subject to price changes if signed after that.`,

  Cosmetic: `I have been advised of and understand that cosmetic dental treatment involves certain risks and possible unsuccessful results, including the possibility of failure, there are no promises or guarantees of anticipated results or predicted longevity of cosmetic restorations.

I actively participated in the treatment planning process by selecting the preferred shade and smile design, ensuring the final result aligns with my personal aesthetic preferences. I understand that the final outcome may vary from mock-ups, photographs, or digital previews shown during consultation.

I understand that cosmetic restorations may require periodic maintenance, replacement, or adjustment over time. Habits such as smoking, coffee, tea, and red wine consumption may affect the colour of restorations.

The fee(s) for these services have been explained to me thoroughly. I have been given the opportunity to ask questions regarding the nature and purpose of the planned cosmetic treatment and have received answers to my satisfaction.

By signing this document, I am freely giving my consent to proceed with the planned cosmetic dental treatment.

• This treatment plan is valid only for 3 months and is subject to price changes if signed after that.`,

  Implants: `I have been advised of and understand that dental implant treatment involves certain risks including, but not limited to: failure of osseointegration (implant not fusing with bone), infection, nerve injury causing numbness or altered sensation, sinus involvement (upper jaw implants), implant fracture, and need for additional procedures such as bone grafting.

I understand that implant success depends on factors including bone quality and quantity, oral hygiene, smoking status, and medical conditions such as diabetes. No guarantees of long-term implant success have been made.

I understand that the implant process typically requires multiple appointments over several months and that temporary restorations may be used during the healing period. I will follow all post-operative instructions strictly.

The fee(s) for these services have been explained to me thoroughly. I have had the opportunity to ask questions and receive answers to my satisfaction.

By signing this document, I freely give my consent to proceed with implant treatment and any associated procedures.

• This treatment plan is valid only for 3 months and is subject to price changes if signed after that.`,

  Prosthodontics: `I have been advised of and understand that removable prosthetic treatment (dentures) involves certain risks including, but not limited to: soreness and discomfort during the adjustment period, speech difficulties initially, limitations in chewing function compared to natural teeth, need for periodic adjustments and relining, and continued bone resorption under the denture base.

I understand that dentures may require adjustments and that immediate dentures in particular will need relining after initial healing. Regular follow-up appointments are essential.

I have been informed about proper denture care and hygiene. Dentures should be removed at night and kept moist when not worn.

By signing this document, I freely give my consent to proceed with the planned prosthetic treatment.

• This treatment plan is valid only for 3 months and is subject to price changes if signed after that.`,

  Orthodontics: `I have been advised of and understand that orthodontic treatment involves certain risks including, but not limited to: temporary discomfort when appliances are first placed or adjusted, decalcification or cavities if oral hygiene is poor, root resorption (shortening of roots), relapse if retainers are not worn as instructed, and the total treatment time may vary from the estimated duration.

I understand that orthodontic treatment requires my full cooperation including wearing appliances as instructed, attending all scheduled appointments, maintaining excellent oral hygiene, and following dietary restrictions (avoiding hard, sticky, or chewy foods with braces).

I understand that retainers must be worn as directed after active treatment is complete to maintain results. Failure to wear retainers may result in relapse of tooth movement.

The fee(s) for orthodontic treatment have been explained to me thoroughly and the payment schedule has been discussed.

By signing this document, I freely give my consent to proceed with orthodontic treatment as planned.

• This treatment plan is valid only for 3 months and is subject to price changes if signed after that.`,

  'Preventive & Diagnostic': `I have been advised of and understand the nature and purpose of the preventive and/or diagnostic procedures recommended for me.

I understand that dental radiographs (X-rays) involve minimal radiation exposure and are taken only when clinically necessary for diagnosis. Protective measures (lead apron) will be used.

I have been informed of the importance of regular professional cleanings and preventive care in maintaining good oral health and preventing more serious dental problems.

By signing this document, I freely give my consent to proceed with the recommended preventive and diagnostic procedures.

• This treatment plan is valid only for 3 months and is subject to price changes if signed after that.`,

  General: `I have been advised of and understand the nature and purpose of the proposed dental treatment. The risks, benefits, and alternatives to the recommended treatment have been explained to me. I have been given the opportunity to ask questions and have received answers to my satisfaction.

The fee(s) for these services have been explained to me thoroughly.

I understand that it is my responsibility to notify this office should any undue or unexpected problems occur or if I experience any problems relating to the treatment rendered or the services performed.

By signing this document, I am freely giving my consent to allow and authorize the dental centre to render any treatment necessary and/or advisable to my dental conditions, including the prescribing and administering of any medications and/or anesthetics deemed necessary to my treatment.

I understand that variations to this treatment plan may occur during any course of treatment, as a result of the clinical condition. The dental centre retains the right to amend this treatment plan.

I agree to have these treatments carried out.

• This treatment plan is valid only for 3 months and is subject to price changes if signed after that.`,
};

export function getConsentText(categories: string[]): string {
  if (categories.length === 0) return CONSENT_TEXTS.General;
  // Pick the most specific / first-priority category
  const priority: ConsentCategory[] = [
    'Implants', 'Orthodontics', 'Endodontics', 'Extractions',
    'Crown & Bridge', 'Cosmetic', 'Restorative', 'Periodontics',
    'Prosthodontics', 'Preventive & Diagnostic',
  ];
  for (const p of priority) {
    if (categories.includes(p)) return CONSENT_TEXTS[p];
  }
  return CONSENT_TEXTS.General;
}
