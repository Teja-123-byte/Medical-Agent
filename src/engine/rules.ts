// ============================================================================
// Configurable Risk Rules — SYNTHETIC DEMONSTRATION RULES
// These thresholds are NOT clinically validated. They are synthetic
// demonstration values for a research simulation only.
// ============================================================================

import { PatientState, RiskLevel } from '@/types';

export interface RiskRule {
  field: keyof PatientState;
  factorName: string;
  // Returns risk points (0 if condition not met)
  evaluate: (state: PatientState) => number;
}

export interface RiskThreshold {
  level: RiskLevel;
  minScore: number;
  maxScore: number;
}

// --- Configurable weights and thresholds ---

export const OXYGEN_THRESHOLDS = {
  critical: 88, // SpO2 <= 88 → critical contribution
  severe: 91,   // SpO2 89-91 → high contribution
  moderate: 94, // SpO2 92-94 → moderate contribution
};

export const HEART_RATE_THRESHOLDS = {
  criticalLow: 40,
  criticalHigh: 140,
  highLow: 50,
  highHigh: 120,
  moderateLow: 55,
  moderateHigh: 110,
};

export const RESPIRATORY_RATE_THRESHOLDS = {
  criticalLow: 8,
  criticalHigh: 35,
  highLow: 10,
  highHigh: 28,
  moderateLow: 12,
  moderateHigh: 24,
};

export const TEMPERATURE_THRESHOLDS = {
  criticalHigh: 40.0,
  highHigh: 39.0,
  moderateHigh: 38.0,
  criticalLow: 35.0,
};

export const BLOOD_PRESSURE_THRESHOLDS = {
  criticalHigh: 180,
  highHigh: 160,
  moderateHigh: 140,
  criticalLow: 80,
  highLow: 90,
  moderateLow: 100,
};

export const RISK_WEIGHTS = {
  oxygenSaturation: {
    critical: 30,
    severe: 20,
    moderate: 10,
  },
  heartRate: {
    critical: 25,
    high: 15,
    moderate: 8,
  },
  respiratoryRate: {
    critical: 25,
    high: 15,
    moderate: 8,
  },
  temperature: {
    critical: 20,
    high: 12,
    moderate: 6,
  },
  bloodPressure: {
    critical: 25,
    high: 15,
    moderate: 8,
  },
  consciousness: {
    unresponsive: 35,
    confused: 25,
    drowsy: 10,
  },
  symptomSeverity: {
    SEVERE: 20,
    MODERATE: 10,
    MILD: 3,
  },
  chestPain: 15,
  breathingDifficulty: {
    SEVERE: 20,
    MODERATE: 12,
    MILD: 5,
  },
  bleeding: {
    SEVERE: 30,
    MODERATE: 15,
    MINOR: 5,
  },
  age: {
    elderly: 10, // age >= 70
    veryYoung: 5, // age <= 2
  },
};

export const RISK_THRESHOLDS: RiskThreshold[] = [
  { level: 'CRITICAL', minScore: 70, maxScore: 999 },
  { level: 'HIGH', minScore: 40, maxScore: 69 },
  { level: 'MODERATE', minScore: 15, maxScore: 39 },
  { level: 'LOW', minScore: 0, maxScore: 14 },
];

// --- Risk rules ---

export const RISK_RULES: RiskRule[] = [
  {
    field: 'oxygen_saturation',
    factorName: 'Oxygen Saturation',
    evaluate: (state) => {
      const v = state.oxygen_saturation;
      if (v === null) return 0;
      if (v <= OXYGEN_THRESHOLDS.critical) return RISK_WEIGHTS.oxygenSaturation.critical;
      if (v <= OXYGEN_THRESHOLDS.severe) return RISK_WEIGHTS.oxygenSaturation.severe;
      if (v <= OXYGEN_THRESHOLDS.moderate) return RISK_WEIGHTS.oxygenSaturation.moderate;
      return 0;
    },
  },
  {
    field: 'heart_rate',
    factorName: 'Heart Rate',
    evaluate: (state) => {
      const v = state.heart_rate;
      if (v === null) return 0;
      if (v <= HEART_RATE_THRESHOLDS.criticalLow || v >= HEART_RATE_THRESHOLDS.criticalHigh)
        return RISK_WEIGHTS.heartRate.critical;
      if (v <= HEART_RATE_THRESHOLDS.highLow || v >= HEART_RATE_THRESHOLDS.highHigh)
        return RISK_WEIGHTS.heartRate.high;
      if (v <= HEART_RATE_THRESHOLDS.moderateLow || v >= HEART_RATE_THRESHOLDS.moderateHigh)
        return RISK_WEIGHTS.heartRate.moderate;
      return 0;
    },
  },
  {
    field: 'respiratory_rate',
    factorName: 'Respiratory Rate',
    evaluate: (state) => {
      const v = state.respiratory_rate;
      if (v === null) return 0;
      if (v <= RESPIRATORY_RATE_THRESHOLDS.criticalLow || v >= RESPIRATORY_RATE_THRESHOLDS.criticalHigh)
        return RISK_WEIGHTS.respiratoryRate.critical;
      if (v <= RESPIRATORY_RATE_THRESHOLDS.highLow || v >= RESPIRATORY_RATE_THRESHOLDS.highHigh)
        return RISK_WEIGHTS.respiratoryRate.high;
      if (v <= RESPIRATORY_RATE_THRESHOLDS.moderateLow || v >= RESPIRATORY_RATE_THRESHOLDS.moderateHigh)
        return RISK_WEIGHTS.respiratoryRate.moderate;
      return 0;
    },
  },
  {
    field: 'temperature',
    factorName: 'Temperature',
    evaluate: (state) => {
      const v = state.temperature;
      if (v === null) return 0;
      if (v >= TEMPERATURE_THRESHOLDS.criticalHigh) return RISK_WEIGHTS.temperature.critical;
      if (v >= TEMPERATURE_THRESHOLDS.highHigh) return RISK_WEIGHTS.temperature.high;
      if (v >= TEMPERATURE_THRESHOLDS.moderateHigh) return RISK_WEIGHTS.temperature.moderate;
      if (v <= TEMPERATURE_THRESHOLDS.criticalLow) return RISK_WEIGHTS.temperature.critical;
      return 0;
    },
  },
  {
    field: 'systolic_blood_pressure',
    factorName: 'Blood Pressure (Systolic)',
    evaluate: (state) => {
      const v = state.systolic_blood_pressure;
      if (v === null) return 0;
      if (v >= BLOOD_PRESSURE_THRESHOLDS.criticalHigh || v <= BLOOD_PRESSURE_THRESHOLDS.criticalLow)
        return RISK_WEIGHTS.bloodPressure.critical;
      if (v >= BLOOD_PRESSURE_THRESHOLDS.highHigh || v <= BLOOD_PRESSURE_THRESHOLDS.highLow)
        return RISK_WEIGHTS.bloodPressure.high;
      if (v >= BLOOD_PRESSURE_THRESHOLDS.moderateHigh || v <= BLOOD_PRESSURE_THRESHOLDS.moderateLow)
        return RISK_WEIGHTS.bloodPressure.moderate;
      return 0;
    },
  },
  {
    field: 'consciousness',
    factorName: 'Consciousness',
    evaluate: (state) => {
      const v = state.consciousness;
      if (v === null) return 0;
      if (v === 'UNRESPONSIVE') return RISK_WEIGHTS.consciousness.unresponsive;
      if (v === 'CONFUSED') return RISK_WEIGHTS.consciousness.confused;
      if (v === 'DROWSY') return RISK_WEIGHTS.consciousness.drowsy;
      return 0;
    },
  },
  {
    field: 'symptom_severity',
    factorName: 'Symptom Severity',
    evaluate: (state) => {
      const v = state.symptom_severity;
      if (v === null) return 0;
      return RISK_WEIGHTS.symptomSeverity[v] ?? 0;
    },
  },
  {
    field: 'chest_pain',
    factorName: 'Chest Pain',
    evaluate: (state) => {
      return state.chest_pain === true ? RISK_WEIGHTS.chestPain : 0;
    },
  },
  {
    field: 'breathing_difficulty',
    factorName: 'Breathing Difficulty',
    evaluate: (state) => {
      const v = state.breathing_difficulty;
      if (v === null || v === 'NONE') return 0;
      return RISK_WEIGHTS.breathingDifficulty[v] ?? 0;
    },
  },
  {
    field: 'bleeding',
    factorName: 'Bleeding',
    evaluate: (state) => {
      const v = state.bleeding;
      if (v === null || v === 'NONE') return 0;
      return RISK_WEIGHTS.bleeding[v] ?? 0;
    },
  },
  {
    field: 'age',
    factorName: 'Age Factor',
    evaluate: (state) => {
      const v = state.age;
      if (v === null) return 0;
      if (v >= 70) return RISK_WEIGHTS.age.elderly;
      if (v <= 2) return RISK_WEIGHTS.age.veryYoung;
      return 0;
    },
  },
];
