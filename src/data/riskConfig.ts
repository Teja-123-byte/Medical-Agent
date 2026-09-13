import { RiskLevel } from '@/types';

export const OXYGEN_THRESHOLDS = {
  critical: 88,
  severe: 91,
  moderate: 94,
} as const;

export const HEART_RATE_THRESHOLDS = {
  criticalLow: 40,
  criticalHigh: 140,
  highLow: 50,
  highHigh: 120,
  moderateLow: 55,
  moderateHigh: 110,
} as const;

export const RESPIRATORY_RATE_THRESHOLDS = {
  criticalLow: 8,
  criticalHigh: 35,
  highLow: 10,
  highHigh: 28,
  moderateLow: 12,
  moderateHigh: 24,
} as const;

export const TEMPERATURE_THRESHOLDS = {
  criticalHigh: 40,
  highHigh: 39,
  moderateHigh: 38,
  criticalLow: 35,
} as const;

export const BLOOD_PRESSURE_THRESHOLDS = {
  criticalHigh: 180,
  highHigh: 160,
  moderateHigh: 140,
  criticalLow: 80,
  highLow: 90,
  moderateLow: 100,
} as const;

export const RISK_WEIGHTS = {
  oxygenSaturation: { critical: 30, severe: 20, moderate: 10 },
  heartRate: { critical: 25, high: 15, moderate: 8 },
  respiratoryRate: { critical: 25, high: 15, moderate: 8 },
  temperature: { critical: 20, high: 12, moderate: 6 },
  bloodPressure: { critical: 25, high: 15, moderate: 8 },
  consciousness: { unresponsive: 35, confused: 25, drowsy: 10 },
  symptomSeverity: { SEVERE: 20, MODERATE: 10, MILD: 3 },
  chestPain: 15,
  breathingDifficulty: { SEVERE: 20, MODERATE: 12, MILD: 5 },
  bleeding: { SEVERE: 30, MODERATE: 15, MINOR: 5 },
  age: { elderly: 10, veryYoung: 5 },
} as const;

export interface RiskThreshold {
  level: RiskLevel;
  minScore: number;
  maxScore: number;
}

export const RISK_THRESHOLDS: RiskThreshold[] = [
  { level: 'CRITICAL', minScore: 70, maxScore: 999 },
  { level: 'HIGH', minScore: 40, maxScore: 69 },
  { level: 'MODERATE', minScore: 15, maxScore: 39 },
  { level: 'LOW', minScore: 0, maxScore: 14 },
];
