// ============================================================================
// Contradiction Detector
// Identifies when new information conflicts with previously recorded values.
// ============================================================================

import { PatientState, ContradictionEntry, Answer, FieldMeta } from '@/types';

const FIELD_LABELS: Partial<Record<keyof PatientState, string>> = {
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
  'symptoms',
];

// Fields where a change beyond a tolerance is a contradiction (vitals)
const VITAL_TOLERANCES: Partial<Record<keyof PatientState, number>> = {
  heart_rate: 15,
  respiratory_rate: 5,
  oxygen_saturation: 3,
  temperature: 1.0,
  systolic_blood_pressure: 20,
  diastolic_blood_pressure: 15,
  age: 0, // any change in age is a contradiction
};

export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

export function detectContradiction(
  prevState: PatientState,
  answer: Answer,
  existingContradictions: ContradictionEntry[]
): ContradictionEntry | null {
  const { field, value } = answer;
  const prevValue = prevState[field];

  // Only detect contradictions for fields that were previously set
  if (prevValue === null || prevValue === undefined) return null;

  const prevStr = formatValue(prevValue);
  const newStr = formatValue(value);

  if (prevStr === newStr) return null;

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
