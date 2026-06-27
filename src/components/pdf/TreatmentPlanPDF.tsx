'use client';
import React from 'react';
import {
  Document, Page, Text, View, StyleSheet, Font, Svg,
  Path, Rect, Line, Ellipse, G,
} from '@react-pdf/renderer';
import type { TreatmentPlan, Clinic } from '@/lib/types';
import { calcTotal, calcDiscounted, formatDate } from '@/lib/utils';
import { UPPER_TEETH, LOWER_TEETH } from '@/lib/dental-data';

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: { padding: '28 36', fontFamily: 'Times-Roman', fontSize: 10, color: '#111' },

  // Header
  headerClinicName:  { fontFamily: 'Times-BoldItalic', fontSize: 18, textAlign: 'right' },
  headerAddress:     { fontFamily: 'Times-Italic', fontSize: 9, textAlign: 'right' },

  // Title
  title: { fontFamily: 'Times-Bold', fontSize: 14, textAlign: 'center', textDecoration: 'underline', marginTop: 14 },

  // Patient info row
  infoRow: { flexDirection: 'row', marginTop: 8, gap: 4 },
  infoLabel: { fontFamily: 'Times-Roman', fontSize: 10, width: 54 },
  infoValue: { fontFamily: 'Times-Bold', fontSize: 10, flex: 1 },
  infoRefLabel: { fontFamily: 'Times-Roman', fontSize: 10 },
  infoRefValue: { fontFamily: 'Times-Bold', fontSize: 10 },

  // Tagline
  tagline: { fontFamily: 'Times-Italic', fontSize: 10, textAlign: 'center', marginTop: 10, marginBottom: 6 },

  // Dental chart
  chartContainer: { marginVertical: 8, paddingHorizontal: 4 },
  chartRow: { flexDirection: 'row', justifyContent: 'center', gap: 1 },
  chartBoxRow: { flexDirection: 'row', justifyContent: 'center', gap: 1, marginVertical: 2 },
  chartBox: { width: 16, height: 10, border: '0.5 solid #aaa' },
  chartBoxSelected: { width: 16, height: 10, border: '0.5 solid #3b82f6', backgroundColor: '#dbeafe' },

  // Table
  table: { marginTop: 10, border: '1 solid #333' },
  tableHeader: { flexDirection: 'row', borderBottom: '1 solid #333', backgroundColor: '#f5f5f5' },
  tableRow: { flexDirection: 'row', borderBottom: '0.5 solid #ccc' },
  tableLastRow: { flexDirection: 'row' },
  thTooth:       { width: '18%', padding: '4 6', fontFamily: 'Times-Bold', fontSize: 9, textAlign: 'center', borderRight: '0.5 solid #ccc' },
  thTreatment:   { width: '34%', padding: '4 6', fontFamily: 'Times-Bold', fontSize: 9, textAlign: 'center', borderRight: '0.5 solid #ccc' },
  thPrice:       { width: '18%', padding: '4 6', fontFamily: 'Times-Bold', fontSize: 9, textAlign: 'center', borderRight: '0.5 solid #ccc' },
  thProvider:    { width: '18%', padding: '4 6', fontFamily: 'Times-Bold', fontSize: 9, textAlign: 'center', borderRight: '0.5 solid #ccc' },
  thDate:        { width: '12%', padding: '4 6', fontFamily: 'Times-Bold', fontSize: 9, textAlign: 'center' },
  tdTooth:       { width: '18%', padding: '4 6', fontSize: 9, textAlign: 'center', borderRight: '0.5 solid #eee' },
  tdTreatment:   { width: '34%', padding: '4 6', fontSize: 9, textAlign: 'center', borderRight: '0.5 solid #eee' },
  tdPrice:       { width: '18%', padding: '4 6', fontSize: 9, textAlign: 'center', borderRight: '0.5 solid #eee' },
  tdProvider:    { width: '18%', padding: '4 6', fontSize: 9, textAlign: 'center', borderRight: '0.5 solid #eee' },
  tdDate:        { width: '12%', padding: '4 6', fontSize: 9, textAlign: 'center' },

  // Totals
  totalRow:    { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6 },
  totalLabel:  { fontSize: 10, fontFamily: 'Times-Roman' },
  totalValue:  { fontSize: 10, fontFamily: 'Times-Bold', marginLeft: 4 },
  discountRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  discountLabel: { fontSize: 10, fontFamily: 'Times-Bold', textDecoration: 'underline' },
  discountValue: { fontSize: 10, fontFamily: 'Times-Bold', textDecoration: 'underline', marginLeft: 4 },

  // Consent
  consentTitle: { fontFamily: 'Times-Bold', fontSize: 11, textDecoration: 'underline', marginTop: 16, marginBottom: 8 },
  consentText:  { fontFamily: 'Times-Roman', fontSize: 9.5, lineHeight: 1.55, marginBottom: 6 },

  // Page 2 signature
  sigSection: { marginTop: 24 },
  sigLine:    { fontFamily: 'Times-Roman', fontSize: 10, marginBottom: 14 },

  // Divider
  divider: { borderBottom: '0.5 solid #ccc', marginVertical: 8 },
});

// ─── Tiny tooth SVGs for the PDF chart ────────────────────────────────────
function PDFTooth({ num, selected, isUpper }: { num: number; selected: boolean; isUpper: boolean }) {
  const fill = selected ? '#93c5fd' : '#fefce8';
  const stroke = selected ? '#1d4ed8' : '#9ca3af';
  const toothPos = num % 10;
  const isMolar = toothPos >= 6;
  const isPremolar = toothPos === 4 || toothPos === 5;
  const isCanine = toothPos === 3;

  if (isUpper) {
    if (isMolar) return (
      <Svg width={14} height={22} viewBox="0 0 32 48">
        <Path d="M 8 14 Q 8 2 11 2 Q 14 2 13 14" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <Path d="M 19 14 Q 18 2 21 2 Q 24 2 24 14" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <Rect x="4" y="14" width="24" height="20" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <Line x1="16" y1="14" x2="16" y2="34" stroke={stroke} strokeWidth="0.8" />
      </Svg>
    );
    if (isPremolar) return (
      <Svg width={13} height={20} viewBox="0 0 28 46">
        <Path d="M 7 14 Q 7 2 10 2 Q 13 2 13 14" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <Path d="M 15 14 Q 15 2 18 2 Q 21 2 21 14" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <Rect x="3" y="14" width="22" height="17" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
      </Svg>
    );
    if (isCanine) return (
      <Svg width={11} height={20} viewBox="0 0 24 48">
        <Path d="M 12 2 L 12 18" stroke={stroke} strokeWidth="1.5" />
        <Ellipse cx="12" cy="26" rx="9" ry="9" fill={fill} stroke={stroke} strokeWidth="1.5" />
      </Svg>
    );
    return (
      <Svg width={10} height={20} viewBox="0 0 22 48">
        <Path d="M 11 2 L 11 16" stroke={stroke} strokeWidth="1.5" />
        <Rect x="2" y="16" width="18" height="16" rx="3" fill={fill} stroke={stroke} strokeWidth="1.5" />
      </Svg>
    );
  } else {
    if (isMolar) return (
      <Svg width={14} height={22} viewBox="0 0 32 48">
        <Rect x="4" y="4" width="24" height="20" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <Line x1="16" y1="4" x2="16" y2="24" stroke={stroke} strokeWidth="0.8" />
        <Path d="M 8 24 Q 8 38 11 38 Q 14 38 13 24" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <Path d="M 19 24 Q 18 38 21 38 Q 24 38 24 24" fill={fill} stroke={stroke} strokeWidth="1.5" />
      </Svg>
    );
    if (isPremolar) return (
      <Svg width={13} height={20} viewBox="0 0 28 46">
        <Rect x="3" y="4" width="22" height="17" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <Path d="M 7 21 Q 7 35 10 35 Q 13 35 13 21" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <Path d="M 15 21 Q 15 35 18 35 Q 21 35 21 21" fill={fill} stroke={stroke} strokeWidth="1.5" />
      </Svg>
    );
    if (isCanine) return (
      <Svg width={11} height={20} viewBox="0 0 24 48">
        <Ellipse cx="12" cy="14" rx="9" ry="9" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <Path d="M 12 23 L 12 40" stroke={stroke} strokeWidth="1.5" />
      </Svg>
    );
    return (
      <Svg width={10} height={20} viewBox="0 0 22 48">
        <Rect x="2" y="4" width="18" height="16" rx="3" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <Path d="M 11 20 L 11 38" stroke={stroke} strokeWidth="1.5" />
      </Svg>
    );
  }
}

function PDFToothChart({ selected }: { selected: string[] }) {
  const selNums = selected.map(Number);
  return (
    <View style={styles.chartContainer}>
      {/* Upper teeth */}
      <View style={styles.chartRow}>
        {UPPER_TEETH.map(n => (
          <View key={n} style={{ alignItems: 'center', width: 15 }}>
            <PDFTooth num={n} selected={selNums.includes(n)} isUpper={true} />
            <Text style={{ fontSize: 6, color: selNums.includes(n) ? '#1d4ed8' : '#6b7280', marginTop: 1 }}>{n}</Text>
          </View>
        ))}
      </View>

      {/* Charting boxes upper */}
      <View style={styles.chartBoxRow}>
        {UPPER_TEETH.map(n => (
          <View key={n} style={selNums.includes(n) ? styles.chartBoxSelected : styles.chartBox} />
        ))}
      </View>

      {/* Charting boxes lower */}
      <View style={styles.chartBoxRow}>
        {LOWER_TEETH.map(n => (
          <View key={n} style={selNums.includes(n) ? styles.chartBoxSelected : styles.chartBox} />
        ))}
      </View>

      {/* Lower teeth */}
      <View style={styles.chartRow}>
        {LOWER_TEETH.map(n => (
          <View key={n} style={{ alignItems: 'center', width: 15 }}>
            <Text style={{ fontSize: 6, color: selNums.includes(n) ? '#1d4ed8' : '#6b7280', marginBottom: 1 }}>{n}</Text>
            <PDFTooth num={n} selected={selNums.includes(n)} isUpper={false} />
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Consent text split helper ─────────────────────────────────────────────
function splitConsent(text: string) {
  const paragraphs = text.split('\n').filter(p => p.trim());
  const half = Math.ceil(paragraphs.length / 2);
  return [paragraphs.slice(0, half), paragraphs.slice(half)];
}

// ─── Page header (repeats on page 2) ──────────────────────────────────────
function ClinicHeader({ clinic }: { clinic: Clinic }) {
  return (
    <View>
      <Text style={styles.headerClinicName}>{clinic.name}</Text>
      <Text style={styles.headerAddress}>{clinic.address}</Text>
      <Text style={styles.headerAddress}>Tel: {clinic.tel}{clinic.fax ? `   Fax: ${clinic.fax}` : ''}</Text>
    </View>
  );
}

// ─── Main document ──────────────────────────────────────────────────────────
interface Props { plan: TreatmentPlan; clinic: Clinic }

export default function TreatmentPlanPDF({ plan, clinic }: Props) {
  const total = calcTotal(plan.items);
  const discounted = calcDiscounted(total, plan.discountType, plan.discountValue);
  const hasDiscount = plan.discountType !== 'none';
  const cur = clinic.currency;

  // Collect all selected tooth numbers from items
  const selectedTeeth = [...new Set(plan.items.flatMap(i => i.toothNumbers))];

  const [consentPart1, consentPart2] = splitConsent(plan.consentText);

  const priceLabel = (item: TreatmentPlan['items'][number]) => {
    const unit = `${cur}${item.unitPrice.toFixed(0)}`;
    const total = `${cur}${(item.unitPrice * item.quantity).toFixed(0)}`;
    if (item.quantity > 1) return `${unit} x ${item.quantity}\n(${total})`;
    return unit;
  };

  return (
    <Document title={`Treatment Plan — ${plan.patientName}`} author={clinic.name}>
      {/* PAGE 1 */}
      <Page size="A4" style={styles.page}>
        <ClinicHeader clinic={clinic} />
        <Text style={styles.title}>Treatment Plan and Consent Form</Text>

        {/* Patient info */}
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <View style={{ flexDirection: 'row', gap: 4, marginBottom: 2 }}>
                <Text style={styles.infoLabel}>Patient:</Text>
                <Text style={styles.infoValue}>{plan.patientTitle} {plan.patientName}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 4, marginBottom: 2 }}>
                <Text style={styles.infoLabel}>Provider:</Text>
                <Text style={styles.infoValue}>{plan.providerName}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                <Text style={styles.infoLabel}>Date:</Text>
                <Text style={styles.infoValue}>{formatDate(plan.planDate)}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                <Text style={styles.infoRefLabel}>Ref No.:</Text>
                <Text style={styles.infoRefValue}>{plan.refNo}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.tagline}>
          Thank you for choosing and trusting {clinic.name} for your treatment.
        </Text>

        <PDFToothChart selected={selectedTeeth} />

        {/* Treatment table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.thTooth}>Tooth Number</Text>
            <Text style={styles.thTreatment}>Treatment{'\n'}Description</Text>
            <Text style={styles.thPrice}>Priced</Text>
            <Text style={styles.thProvider}>Provider{'\n'}Name</Text>
            <Text style={styles.thDate}>Date{'\n'}Completed</Text>
          </View>
          {plan.items.map((item, i) => {
            const isLast = i === plan.items.length - 1;
            const rowStyle = isLast ? styles.tableLastRow : styles.tableRow;
            return (
              <View key={item.id} style={rowStyle}>
                <Text style={styles.tdTooth}>{item.toothNumbers.join(',\n')}</Text>
                <Text style={styles.tdTreatment}>{item.treatmentName}</Text>
                <Text style={styles.tdPrice}>{priceLabel(item)}</Text>
                <Text style={styles.tdProvider}>{item.providerName}</Text>
                <Text style={styles.tdDate}>{item.dateCompleted ?? ''}</Text>
              </View>
            );
          })}
        </View>

        {/* Totals */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Treatment Cost:</Text>
          <Text style={styles.totalValue}>{cur}{total.toFixed(2)}</Text>
        </View>
        {hasDiscount && (
          <View style={styles.discountRow}>
            <Text style={styles.discountLabel}>
              Total Treatment Cost After {plan.discountLabel}:
            </Text>
            <Text style={styles.discountValue}> {cur}{discounted.toFixed(2)}</Text>
          </View>
        )}

        {/* Consent part 1 */}
        <Text style={styles.consentTitle}>INFORMED CONSENT:</Text>
        {consentPart1.map((para, i) => (
          <Text key={i} style={styles.consentText}>{para}</Text>
        ))}
      </Page>

      {/* PAGE 2 */}
      <Page size="A4" style={styles.page}>
        <ClinicHeader clinic={clinic} />
        <View style={{ marginTop: 14 }}>
          {consentPart2.map((para, i) => (
            <Text key={i} style={styles.consentText}>{para}</Text>
          ))}
        </View>

        {/* Signature block */}
        <View style={styles.sigSection}>
          <Text style={styles.sigLine}>
            Patient Name: <Text style={{ fontFamily: 'Times-Bold' }}>{plan.patientTitle} {plan.patientName}</Text>
            {'          '}Date: ……. /……. /…………..
          </Text>
          <Text style={styles.sigLine}>
            Parent or Guardian Name (If Applicable):……………………………………………………………
          </Text>
          <Text style={styles.sigLine}>
            Signature:……………………………………………………………………………………………..
          </Text>
          <Text style={styles.sigLine}>
            Witness Name: ………………………………………………{'  '}Signature:…………………………..
          </Text>
          <Text style={styles.sigLine}>
            Provider&apos;s Signature:………………………………………………………………………………….
          </Text>
        </View>
      </Page>
    </Document>
  );
}
