

import { PatientState, ContradictionEntry, Answer } from '@/types';

const FIELD_LABELS: Partial<Record<keyof PatientState, string>> = {
  patient_name: 'Patient Name',
  symptom_severity: 'Symptom Severity',
  chest_pain: 'Chest Pain',
  breathing_difficulty: 'Breathing Difficulty',
  bleeding: 'Bleeding',
  consciousness: 'Consciousness Level',
  heart_rate: 'Heart Rate',
  respiratory_rate: 'Respiratory Rate',
  oxygen_saturation: 'Oxygen Saturation',
  temperature: 'Temperature',
  systolic_blood_pressure: 'Systolic Blood Pressure',
  diastolic_blood_pressure: 'Diastolic Blood Pressure',
  age: 'Age',
  symptoms: 'Symptoms',
};

// Fields where a change is always a contradiction (qualitative clinical fields)
const QUALITATIVE_FIELDS: (keyof PatientState)[] = [
  'symptom_severity',
  'chest_pain',
  'breathing_difficulty',
  'bleeding',
  'consciousness',
  // 'symptoms' is intentionally excluded — it's additive, handled separately below.
];

// Fields where a change beyond a tolerance is a contradiction (vitals)
const VITAL_TOLERANCES: Partial<Record<keyof PatientState, number>> = {
  heart_rate: 15,
  respiratory_rate: 5,
  oxygen_saturation: 3,
  temperature: 1.0,
  systolic_blood_pressure: 20,
  diastolic_blood_pressure: 15,
  age: 0, 
};

const VALUE_LABELS: Record<string, string> = {
  MILD: 'Mild',
  MODERATE: 'Moderate',
  SEVERE: 'Severe',
  NONE: 'None',
  MINOR: 'Minor',
  ALERT: 'Alert',
  DROWSY: 'Drowsy',
  CONFUSED: 'Confused',
  UNRESPONSIVE: 'Unresponsive',
};

export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string' && VALUE_LABELS[value]) return VALUE_LABELS[value];
  return String(value);
}

export function detectContradiction(
  prevState: PatientState,
  answer: Answer,
  existingContradictions: ContradictionEntry[]
): ContradictionEntry | null {
  const alreadyRecorded = existingContradictions.some(
    (contradiction) =>
      !contradiction.resolved &&
      contradiction.field === answer.field &&
      contradiction.currentValue === formatValue(answer.value)
  );
  if (alreadyRecorded) return null;

  const { field, value } = answer;
  const prevValue = prevState[field];

 
  if (prevValue === null || prevValue === undefined) return null;

  const prevStr = formatValue(prevValue);
  const newStr = formatValue(value);

  if (prevStr === newStr) return null;

  if (field === 'symptoms' && Array.isArray(prevValue) && Array.isArray(value)) {
    const prevSet = new Set(prevValue as string[]);
    const newSet = new Set(value as string[]);
    const dropped = [...prevSet].filter((s) => !newSet.has(s));

    if (dropped.length === 0) return null;

    return createContradictionEntry(field, prevValue, value, prevStr, newStr);
  }

  const isQualitative = QUALITATIVE_FIELDS.includes(field);

  if (isQualitative) {
    return createContradictionEntry(field, prevValue, value, prevStr, newStr);
  }

  const tolerance = VITAL_TOLERANCES[field];
  if (tolerance !== undefined && typeof prevValue === 'number' && typeof value === 'number') {
    if (Math.abs(prevValue - value) > tolerance) {
      return createContradictionEntry(field, prevValue, value, prevStr, newStr);
    }
  }

  return null;
}

function createContradictionEntry(
  field: keyof PatientState,
  prevValue: unknown,
  newValue: unknown,
  prevStr: string,
  newStr: string
): ContradictionEntry {
  return {
    id: `ctr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    field,
    fieldLabel: FIELD_LABELS[field] ?? String(field),
    previousValue: prevStr,
    currentValue: newStr,
    previousDisplay: prevStr,
    currentDisplay: newStr,
    resolved: false,
    timestamp: new Date().toISOString(),
    clarificationAsked: false,
  };
}