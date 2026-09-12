// ============================================================================
// Routing Policy — DETERMINISTIC
// Converts the risk engine's result into a routing decision.
// Separate from the LLM / agent layer.
// ============================================================================

import { RiskLevel, RoutingDecision, ContradictionEntry } from '@/types';

export interface RoutingContext {
  riskLevel: RiskLevel;
  riskScore: number;
  contradictions: ContradictionEntry[];
  confidence: number;
  interviewComplete: boolean;
}

export function determineRouting(ctx: RoutingContext): RoutingDecision {
  const { riskLevel, contradictions, confidence, interviewComplete } = ctx;

  // If interview not complete, routing is still pending
  if (!interviewComplete && riskLevel === 'UNKNOWN') {
    return 'PENDING';
  }

  // Escalate to human review when there are unresolved contradictions
  // in HIGH or CRITICAL cases
  const unresolvedContradictions = contradictions.filter((c) => !c.resolved);
  if (unresolvedContradictions.length > 0 && (riskLevel === 'HIGH' || riskLevel === 'CRITICAL')) {
    return 'HUMAN_REVIEW';
  }

  // Low confidence on high risk → human review
  if (riskLevel === 'HIGH' && confidence < 40) {
    return 'HUMAN_REVIEW';
  }

  switch (riskLevel) {
    case 'LOW':
      return 'SELF_CARE';
    case 'MODERATE':
      return 'ROUTINE_CLINIC';
    case 'HIGH':
      return 'URGENT_CLINIC';
    case 'CRITICAL':
      return 'EMERGENCY';
    case 'UNKNOWN':
      return 'PENDING';
    default:
      return 'PENDING';
  }
}

export const ROUTING_LABELS: Record<RoutingDecision, string> = {
  SELF_CARE: 'SELF-CARE / MONITOR',
  ROUTINE_CLINIC: 'ROUTINE CLINIC',
  URGENT_CLINIC: 'URGENT CLINIC',
  EMERGENCY: 'EMERGENCY',
  HUMAN_REVIEW: 'HUMAN REVIEW',
  PENDING: 'ASSESSING…',
};

export const RISK_LEVEL_COLORS: Record<RiskLevel, { bg: string; text: string; border: string; dot: string }> = {
  LOW: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  MODERATE: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  HIGH: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
  },
  CRITICAL: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  UNKNOWN: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
};
