

import { AuditEvent, AuditAction, RoutingDecision } from '@/types';

let eventCounter = 0;

export function createAuditEvent(
  sessionId: string,
  action: AuditAction,
  reason: string,
  opts: {
    stateChange?: { field?: string; before?: string; after?: string };
    riskScoreBefore?: number;
    riskScoreAfter?: number;
    routingBefore?: RoutingDecision;
    routingAfter?: RoutingDecision;
    questionId?: string;
    answerValue?: string;
  } = {}
): AuditEvent {
  eventCounter += 1;
  return {
    id: `audit-${Date.now()}-${eventCounter}`,
    timestamp: new Date().toISOString(),
    sessionId,
    action,
    reason,
    ...opts,
  };
}

export function formatAuditAction(action: AuditAction): string {
  const labels: Record<AuditAction, string> = {
    SESSION_STARTED: 'Session started',
    STATE_INITIALIZED: 'Patient state initialized',
    MISSING_INFO_DETECTED: 'Missing information detected',
    RISK_CALCULATED: 'Risk calculated',
    RISK_RECALCULATED: 'Risk recalculated',
    QUESTION_SELECTED: 'Question selected',
    ANSWER_RECEIVED: 'Patient answer received',
    STATE_UPDATED: 'Patient state updated',
    CONTRADICTION_DETECTED: 'Contradiction detected',
    ROUTING_REASSESSED: 'Routing reassessed',
    ROUTING_FINALIZED: 'Routing finalized',
    INTERVIEW_COMPLETE: 'Interview complete',
    CLARIFICATION_REQUESTED: 'Clarification requested',
    EARLY_TERMINATION_HIGH_RISK: 'Early termination — high-risk condition detected',
  };
  return labels[action] ?? action;
}
