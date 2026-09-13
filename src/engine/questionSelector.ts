

import { PatientState, Question } from '@/types';
import { findMatchingSymptoms } from '@/data/symptomCatalog';



export const QUESTION_BANK: Question[] = [
  {
    id: 'q_name',
    category: 'demographics',
    field: 'patient_name',
    label: 'Patient Name',
    prompt: 'What is the patient\'s name?',
    answerType: 'text',
    priority: 100,
    placeholder: 'e.g. John Smith',
  },
  {
    id: 'q_age',
    category: 'demographics',
    field: 'age',
    label: 'Age',
    prompt: 'What is the patient\'s age?',
    answerType: 'numeric',
    unit: 'years',
    priority: 95,
    min: 0,
    max: 120,
    placeholder: 'e.g. 45',
  },
  {
    id: 'q_symptoms',
    category: 'symptoms',
    field: 'symptoms',
    label: 'Symptoms',
    prompt: 'What symptoms is the patient experiencing?',
    answerType: 'text',
    priority: 90,
    placeholder: 'e.g. chest pain, shortness of breath',
  },
  {
    id: 'q_symptom_severity',
    category: 'symptom_detail',
    field: 'symptom_severity',
    label: 'Symptom Severity',
    prompt: 'How severe are the symptoms overall?',
    answerType: 'choice',
    priority: 70,
    options: [
      { label: 'Mild', value: 'MILD' },
      { label: 'Moderate', value: 'MODERATE' },
      { label: 'Severe', value: 'SEVERE' },
    ],
  },
  {
    id: 'q_symptom_duration',
    category: 'symptom_detail',
    field: 'symptom_duration',
    label: 'Symptom Duration',
    prompt: 'How long have the symptoms been present?',
    answerType: 'text',
    priority: 45,
    placeholder: 'e.g. 2 hours, 3 days',
  },
  {
    id: 'q_chest_pain',
    category: 'symptom_detail',
    field: 'chest_pain',
    label: 'Chest Pain',
    prompt: 'Is the patient experiencing chest pain?',
    answerType: 'choice',
    priority: 80,
    options: [
      { label: 'No', value: 'false' },
      { label: 'Yes', value: 'true' },
    ],
  },
  {
    id: 'q_breathing_difficulty',
    category: 'symptom_detail',
    field: 'breathing_difficulty',
    label: 'Breathing Difficulty',
    prompt: 'Is the patient having difficulty breathing?',
    answerType: 'choice',
    priority: 85,
    options: [
      { label: 'None', value: 'NONE' },
      { label: 'Mild', value: 'MILD' },
      { label: 'Moderate', value: 'MODERATE' },
      { label: 'Severe', value: 'SEVERE' },
    ],
  },
  {
    id: 'q_bleeding',
    category: 'symptom_detail',
    field: 'bleeding',
    label: 'Bleeding',
    prompt: 'Is there any active bleeding?',
    answerType: 'choice',
    priority: 75,
    options: [
      { label: 'None', value: 'NONE' },
      { label: 'Minor', value: 'MINOR' },
      { label: 'Moderate', value: 'MODERATE' },
      { label: 'Severe', value: 'SEVERE' },
    ],
  },
  {
    id: 'q_consciousness',
    category: 'vitals',
    field: 'consciousness',
    label: 'Consciousness Level',
    prompt: 'What is the patient\'s level of consciousness?',
    answerType: 'choice',
    priority: 88,
    options: [
      { label: 'Alert', value: 'ALERT' },
      { label: 'Drowsy', value: 'DROWSY' },
      { label: 'Confused', value: 'CONFUSED' },
      { label: 'Unresponsive', value: 'UNRESPONSIVE' },
    ],
  },
  {
    id: 'q_heart_rate',
    category: 'vitals',
    field: 'heart_rate',
    label: 'Heart Rate',
    prompt: 'What is the patient\'s heart rate?',
    answerType: 'numeric',
    unit: 'bpm',
    priority: 65,
    min: 0,
    max: 300,
    placeholder: 'e.g. 72',
  },
  {
    id: 'q_respiratory_rate',
    category: 'vitals',
    field: 'respiratory_rate',
    label: 'Respiratory Rate',
    prompt: 'What is the patient\'s respiratory rate?',
    answerType: 'numeric',
    unit: '/min',
    priority: 60,
    min: 0,
    max: 80,
    placeholder: 'e.g. 16',
  },
  {
    id: 'q_oxygen_saturation',
    category: 'vitals',
    field: 'oxygen_saturation',
    label: 'Oxygen Saturation',
    prompt: 'What is the patient\'s oxygen saturation (SpO₂)?',
    answerType: 'numeric',
    unit: '%',
    priority: 60,
    min: 0,
    max: 100,
    placeholder: 'e.g. 98',
  },
  {
    id: 'q_temperature',
    category: 'vitals',
    field: 'temperature',
    label: 'Temperature',
    prompt: 'What is the patient\'s temperature?',
    answerType: 'numeric',
    unit: '°C',
    priority: 55,
    min: 25,
    max: 45,
    placeholder: 'e.g. 37.0',
  },
  {
    id: 'q_systolic_bp',
    category: 'vitals',
    field: 'systolic_blood_pressure',
    label: 'Systolic Blood Pressure',
    prompt: 'What is the patient\'s systolic blood pressure?',
    answerType: 'numeric',
    unit: 'mmHg',
    priority: 58,
    min: 0,
    max: 300,
    placeholder: 'e.g. 120',
  },
  {
    id: 'q_diastolic_bp',
    category: 'vitals',
    field: 'diastolic_blood_pressure',
    label: 'Diastolic Blood Pressure',
    prompt: 'What is the patient\'s diastolic blood pressure?',
    answerType: 'numeric',
    unit: 'mmHg',
    priority: 57,
    min: 0,
    max: 200,
    placeholder: 'e.g. 80',
  },
  {
    id: 'q_medical_history',
    category: 'history',
    field: 'medical_history',
    label: 'Medical History',
    prompt: 'Does the patient have any relevant medical history?',
    answerType: 'text',
    priority: 35,
    placeholder: 'e.g. hypertension, diabetes',
  },
  {
    id: 'q_medications',
    category: 'history',
    field: 'medications',
    label: 'Medications',
    prompt: 'Is the patient taking any medications?',
    answerType: 'text',
    priority: 30,
    placeholder: 'e.g. metoprolol, insulin',
  },
  {
    id: 'q_allergies',
    category: 'history',
    field: 'allergies',
    label: 'Allergies',
    prompt: 'Does the patient have any known allergies?',
    answerType: 'text',
    priority: 25,
    placeholder: 'e.g. penicillin, none',
  },
];

// --- Priority boosting based on symptoms / current risk ---

function getPriorityBoost(question: Question, state: PatientState): number {
  let boost = 0;

  const matchedSymptoms = findMatchingSymptoms(state.symptoms);
  const hasChestPain = matchedSymptoms.some((symptom) => symptom.id === 'chest-pain');
  const hasBreathingIssue =
    matchedSymptoms.some((symptom) => symptom.id === 'breathing-difficulty') ||
    state.breathing_difficulty !== null;

  // If chest pain is reported, prioritize oxygen, heart rate, breathing
  if (hasChestPain || state.chest_pain === true) {
    if (question.field === 'oxygen_saturation') boost += 30;
    if (question.field === 'heart_rate') boost += 25;
    if (question.field === 'breathing_difficulty') boost += 20;
    if (question.field === 'systolic_blood_pressure') boost += 15;
  }

  // If breathing difficulty is reported, prioritize respiratory vitals
  if (hasBreathingIssue || state.breathing_difficulty === 'MODERATE' || state.breathing_difficulty === 'SEVERE') {
    if (question.field === 'oxygen_saturation') boost += 30;
    if (question.field === 'respiratory_rate') boost += 25;
    if (question.field === 'chest_pain') boost += 20;
    if (question.field === 'consciousness') boost += 15;
  }

  // If consciousness is impaired, prioritize all vitals
  if (state.consciousness === 'DROWSY' || state.consciousness === 'CONFUSED' || state.consciousness === 'UNRESPONSIVE') {
    if (question.category === 'vitals') boost += 15;
  }

  // If bleeding is reported, prioritize vitals
  if (state.bleeding === 'MODERATE' || state.bleeding === 'SEVERE') {
    if (question.field === 'systolic_blood_pressure') boost += 25;
    if (question.field === 'diastolic_blood_pressure') boost += 20;
    if (question.field === 'heart_rate') boost += 15;
  }

  // If risk is already HIGH/CRITICAL, prioritize remaining vitals
  if (state.risk_level === 'HIGH' || state.risk_level === 'CRITICAL') {
    if (question.category === 'vitals') boost += 10;
  }

  // Symptoms is re-askable so new symptoms can be added later, but once at
  // least one symptom has already been recorded we don't want it repeatedly
  // jumping the queue ahead of genuinely unanswered fields. Discount it
  // instead of locking it out entirely.
  if (question.field === 'symptoms' && state.symptoms.length > 0) {
    boost -= 60;
  }

  return boost;
}

// --- Main selection logic ---

export function selectNextQuestion(state: PatientState): Question | null {
  // Don't ask more questions if interview is complete
  if (state.interview_complete) return null;

  // Get unanswered questions
  const answeredFields = new Set(
    state.answers_received.map((a) => a.field)
  );

  const candidates = QUESTION_BANK.filter((q) => {
    // Symptoms is additive — always keep it eligible so new symptoms can be
    // reported later in the interview, even after it's been answered once.
    if (q.field === 'symptoms') return true;

    // Skip already-answered fields (unless there's an unresolved contradiction needing clarification)
    if (answeredFields.has(q.field)) {
      const hasUnresolvedContradiction = state.contradictions.some(
        (c) => c.field === q.field && !c.resolved
      );
      return hasUnresolvedContradiction;
    }
    return true;
  });

  if (candidates.length === 0) return null;

  // Sort by effective priority (base + boost)
  const scored = candidates.map((q) => ({
    question: q,
    effectivePriority: q.priority + getPriorityBoost(q, state),
  }));

  scored.sort((a, b) => b.effectivePriority - a.effectivePriority);

  return scored[0].question;
}

// --- Missing information detection ---

export function getMissingInformation(state: PatientState): string[] {
  const answeredFields = new Set(state.answers_received.map((a) => a.field));
  return QUESTION_BANK
    .filter((q) => !answeredFields.has(q.field))
    .map((q) => q.label);
}

// --- Check if we should stop early ---

export function shouldStopEarly(state: PatientState): boolean {
  // Critical conditions that warrant immediate routing
  if (state.risk_level === 'CRITICAL') return true;

  if (state.consciousness === 'UNRESPONSIVE') return true;

  if (state.bleeding === 'SEVERE') return true;

  if (state.oxygen_saturation !== null && state.oxygen_saturation <= OXYGEN_CRITICAL) return true;

  return false;
}

const OXYGEN_CRITICAL = 88;

// --- Total question count ---

export const TOTAL_QUESTIONS = QUESTION_BANK.length;