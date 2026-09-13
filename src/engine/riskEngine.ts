

import { PatientState, RiskLevel, RiskResult, RiskFactorContribution } from '@/types';
import { OXYGEN_THRESHOLDS, RISK_RULES, RISK_THRESHOLDS } from './rules';

export function classifyRisk(score: number): RiskLevel {
  for (const t of RISK_THRESHOLDS) {
    if (score >= t.minScore && score <= t.maxScore) {
      return t.level;
    }
  }
  
  if (score > RISK_THRESHOLDS[0].maxScore) return RISK_THRESHOLDS[0].level;
  return 'LOW';
}

export function calculateRisk(state: PatientState): RiskResult {
  const factors: RiskFactorContribution[] = [];

  for (const rule of RISK_RULES) {
    const points = rule.evaluate(state);
    if (points > 0) {
      factors.push({
        factor: rule.factorName,
        points,
        field: rule.field,
      });
    }
  }

  const score = factors.reduce((sum, f) => sum + f.points, 0);
  const hasCriticalOxygen = state.oxygen_saturation !== null && state.oxygen_saturation <= OXYGEN_THRESHOLDS.critical;
  const hasModerateOxygen = state.oxygen_saturation !== null && state.oxygen_saturation <= OXYGEN_THRESHOLDS.moderate;
  const isUnresponsive = state.consciousness === 'UNRESPONSIVE';
  const level = hasCriticalOxygen
    ? 'CRITICAL'
    : isUnresponsive
      ? 'HIGH'
      : hasModerateOxygen && score < 15
        ? 'MODERATE'
        : score >= 70
          ? 'HIGH'
          : classifyRisk(score);

  
  const fieldsEvaluated = RISK_RULES.length;
  const fieldsWithData = RISK_RULES.filter(
    (r) => state[r.field] !== null && state[r.field] !== undefined
  ).length;
  const confidence = Math.round((fieldsWithData / fieldsEvaluated) * 100);

  
  factors.sort((a, b) => b.points - a.points);

  return { score, level, factors, confidence };
}
