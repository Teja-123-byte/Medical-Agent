// ============================================================================
// Adaptive Emergency Triage Agent — Type Definitions
// SYNTHETIC RESEARCH SIMULATION — NOT FOR REAL-WORLD MEDICAL USE
// ============================================================================

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';

export type RoutingDecision =
  | 'SELF_CARE'
  | 'ROUTINE_CLINIC'
  | 'URGENT_CLINIC'
  | 'EMERGENCY'
  | 'HUMAN_REVIEW'
  | 'PENDING';

export type ConsciousnessLevel =
  | 'ALERT'
  | 'DROWSY'
  | 'CONFUSED'
  | 'UNRESPONSIVE';

export type FieldStatus = 'KNOWN' | 'MISSING' | 'CHANGED' | 'CONTRADICTORY';

export type QuestionCategory =
  | 'demographics'
  | 'symptoms'
  | 'symptom_detail'
  | 'vitals'
  | 'history'
  | 'contradiction_clarification';

export type AnswerType = 'choice' | 'numeric' | 'text' | 'boolean';

export interface ChoiceOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  field: keyof PatientState;
  label: string;
  prompt: string;
  answerType: AnswerType;
  unit?: string;
  options?: ChoiceOption[];
  priority: number;
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface Answer {
  questionId: string;
  field: keyof PatientState;
  value: string | number | boolean | string[];
  displayValue: string;
  timestamp: string;
}

export interface RiskFactorContribution {
  factor: string;
  points: number;
  field: keyof PatientState;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  factors: RiskFactorContribution[];
  confidence: number;
}

export interface ContradictionEntry {
  id: string;
  field: keyof PatientState;
  fieldLabel: string;
  previousValue: string;
  currentValue: string;
  previousDisplay: string;
  currentDisplay: string;
  resolved: boolean;
  timestamp: string;
  clarificationAsked: boolean;
}

export type AuditAction =
  | 'SESSION_STARTED'
  | 'STATE_INITIALIZED'
  | 'MISSING_INFO_DETECTED'
  | 'RISK_CALCULATED'
  | 'RISK_RECALCULATED'
  | 'QUESTION_SELECTED'
  | 'ANSWER_RECEIVED'
  | 'STATE_UPDATED'
  | 'CONTRADICTION_DETECTED'
  | 'ROUTING_REASSESSED'
  | 'ROUTING_FINALIZED'
  | 'INTERVIEW_COMPLETE'
  | 'CLARIFICATION_REQUESTED'
  | 'EARLY_TERMINATION_HIGH_RISK';

export interface AuditEvent {
  id: string;
  timestamp: string;
  sessionId: string;
  action: AuditAction;
  reason: string;
  stateChange?: {
    field?: string;
    before?: string;
    after?: string;
  };
  riskScoreBefore?: number;
  riskScoreAfter?: number;
  routingBefore?: RoutingDecision;
  routingAfter?: RoutingDecision;
  questionId?: string;
  answerValue?: string;
}

export interface PatientState {
  // Session metadata
  patient_id: string;
  session_id: string;
  timestamp: string;

  // Demographics
  patient_name: string | null;
  age: number | null;

  // Symptoms
  symptoms: string[];
  symptom_severity: 'MILD' | 'MODERATE' | 'SEVERE' | null;
  symptom_duration: string | null;

  // Vitals
  heart_rate: number | null;
  respiratory_rate: number | null;
  oxygen_saturation: number | null;
  temperature: number | null;
  systolic_blood_pressure: number | null;
  diastolic_blood_pressure: number | null;

  // Clinical observations
  consciousness: ConsciousnessLevel | null;
  chest_pain: boolean | null;
  breathing_difficulty: 'NONE' | 'MILD' | 'MODERATE' | 'SEVERE' | null;
  bleeding: 'NONE' | 'MINOR' | 'MODERATE' | 'SEVERE' | null;

  // History
  medical_history: string | null;
  medications: string | null;
  allergies: string | null;

  // Agent state
  questions_asked: string[];
  answers_received: Answer[];
  missing_information: string[];
  contradictions: ContradictionEntry[];

  // Risk
  risk_score: number;
  risk_level: RiskLevel;
  routing_decision: RoutingDecision;
  confidence: number;

  // Audit
  audit_log: AuditEvent[];

  // Interview state
  interview_complete: boolean;
}

export interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  expectedRouting: RoutingDecision;
  expectedRiskLevel: RiskLevel;
  initialState: Partial<PatientState>;
}

// Field metadata for the patient state panel
export interface FieldMeta {
  key: keyof PatientState;
  label: string;
  category: 'demographics' | 'symptoms' | 'vitals' | 'clinical' | 'history';
  unit?: string;
  format?: (value: unknown) => string;
}

export const FIELD_METADATA: FieldMeta[] = [
  { key: 'patient_name', label: 'Patient Name', category: 'demographics' },
  { key: 'age', label: 'Age', category: 'demographics', unit: 'years' },
  { key: 'symptoms', label: 'Symptoms', category: 'symptoms', format: (v) => Array.isArray(v) ? v.join(', ') : String(v) },
  { key: 'symptom_severity', label: 'Symptom Severity', category: 'symptoms' },
  { key: 'symptom_duration', label: 'Symptom Duration', category: 'symptoms' },
  { key: 'heart_rate', label: 'Heart Rate', category: 'vitals', unit: 'bpm' },
  { key: 'respiratory_rate', label: 'Respiratory Rate', category: 'vitals', unit: '/min' },
  { key: 'oxygen_saturation', label: 'Oxygen Saturation', category: 'vitals', unit: '%' },
  { key: 'temperature', label: 'Temperature', category: 'vitals', unit: '°C' },
  { key: 'systolic_blood_pressure', label: 'Systolic BP', category: 'vitals', unit: 'mmHg' },
  { key: 'diastolic_blood_pressure', label: 'Diastolic BP', category: 'vitals', unit: 'mmHg' },
  { key: 'consciousness', label: 'Consciousness', category: 'clinical' },
  { key: 'chest_pain', label: 'Chest Pain', category: 'clinical' },
  { key: 'breathing_difficulty', label: 'Breathing Difficulty', category: 'clinical' },
  { key: 'bleeding', label: 'Bleeding', category: 'clinical' },
  { key: 'medical_history', label: 'Medical History', category: 'history' },
  { key: 'medications', label: 'Medications', category: 'history' },
  { key: 'allergies', label: 'Allergies', category: 'history' },
];