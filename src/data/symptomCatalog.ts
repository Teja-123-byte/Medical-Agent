export interface SyntheticSymptomProfile {
  id: string;
  keywords: string[];
  relatedFields: string[];
  priorityBoost: number;
}

// Synthetic reference data used to prioritize follow-up questions.
export const SYNTHETIC_SYMPTOMS: SyntheticSymptomProfile[] = [
  {
    id: 'chest-pain',
    keywords: ['chest pain', 'chest discomfort'],
    relatedFields: ['oxygen_saturation', 'heart_rate', 'breathing_difficulty', 'systolic_blood_pressure'],
    priorityBoost: 30,
  },
  {
    id: 'breathing-difficulty',
    keywords: ['shortness of breath', 'short of breath', 'difficulty breathing', 'breathing difficulty'],
    relatedFields: ['oxygen_saturation', 'respiratory_rate', 'chest_pain', 'consciousness'],
    priorityBoost: 30,
  },
  {
    id: 'bleeding',
    keywords: ['bleeding', 'blood loss'],
    relatedFields: ['systolic_blood_pressure', 'diastolic_blood_pressure', 'heart_rate'],
    priorityBoost: 25,
  },
];

export function findMatchingSymptoms(symptoms: string[]): SyntheticSymptomProfile[] {
  const normalizedSymptoms = symptoms.map((symptom) => symptom.toLowerCase());
  return SYNTHETIC_SYMPTOMS.filter((profile) =>
    profile.keywords.some((keyword) =>
      normalizedSymptoms.some((symptom) => symptom.includes(keyword))
    )
  );
}
