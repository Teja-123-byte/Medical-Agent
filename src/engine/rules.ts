// ============================================================================
// Configurable Risk Rules — SYNTHETIC DEMONSTRATION RULES
// These thresholds are NOT clinically validated. They are synthetic
// demonstration values for a research simulation only.
// ============================================================================

import { PatientState } from '@/types';
import {
  BLOOD_PRESSURE_THRESHOLDS,
  HEART_RATE_THRESHOLDS,
  OXYGEN_THRESHOLDS,
  RESPIRATORY_RATE_THRESHOLDS,
  RISK_WEIGHTS,
  TEMPERATURE_THRESHOLDS,
} from '@/data/riskConfig';

export {
  BLOOD_PRESSURE_THRESHOLDS,
  HEART_RATE_THRESHOLDS,
  OXYGEN_THRESHOLDS,
  RESPIRATORY_RATE_THRESHOLDS,
  RISK_THRESHOLDS,
  RISK_WEIGHTS,
  TEMPERATURE_THRESHOLDS,
} from '@/data/riskConfig';

export interface RiskRule {
  field: keyof PatientState;
  factorName: string;
  // Returns risk points (0 if condition not met)
  evaluate: (state: PatientState) => number;
}

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
