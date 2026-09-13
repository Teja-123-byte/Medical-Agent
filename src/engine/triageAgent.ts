// ============================================================================
// Triage Agent — Orchestrator
// Coordinates the adaptive decision loop:
//   Observe → Reason → Ask → Update → Detect Contradiction →
//   Recalculate → Reassess → Route
// ============================================================================

import { PatientState, Question, Answer, RiskResult } from '@/types';
import { calculateRisk } from './riskEngine';
import { determineRouting } from './routing';
import { selectNextQuestion, getMissingInformation, shouldStopEarly } from './questionSelector';
import { detectContradiction } from './contradictionDetector';
import { createAuditEvent } from './auditLog';

// --- State initialization ---

export function createInitialState(
  patientId: string,
  sessionId: string,
  initialData: Partial<PatientState>
): PatientState {
  const base: PatientState = {
    patient_id: patientId,
    session_id: sessionId,
    timestamp: new Date().toISOString(),
    age: null,
    symptoms: [],
    symptom_severity: null,
    symptom_duration: null,
    heart_rate: null,
    respiratory_rate: null,
    oxygen_saturation: null,
    temperature: null,
    systolic_blood_pressure: null,
    diastolic_blood_pressure: null,
    consciousness: null,
    chest_pain: null,
    breathing_difficulty: null,
    bleeding: null,
    medical_history: null,
    medications: null,
    allergies: null,
    questions_asked: [],
    answers_received: [],
    missing_information: [],
    contradictions: [],
    risk_score: 0,
    risk_level: 'UNKNOWN',
    routing_decision: 'PENDING',
    confidence: 0,
    audit_log: [],
    interview_complete: false,
  };

  // Merge initial data
  const merged = { ...base, ...initialData };

  // Calculate initial risk
  const risk = calculateRisk(merged);
  merged.risk_score = risk.score;
  merged.risk_level = risk.level;
  merged.confidence = risk.confidence;

  merged.missing_information = getMissingInformation(merged);

  merged.routing_decision = determineRouting({
    riskLevel: merged.risk_level,
    riskScore: merged.risk_score,
    contradictions: merged.contradictions,
    confidence: merged.confidence,
    interviewComplete: merged.interview_complete,
  });

  // Audit: session started
  merged.audit_log.push(
    createAuditEvent(sessionId, 'SESSION_STARTED', 'New triage session initiated')
  );
  merged.audit_log.push(
    createAuditEvent(sessionId, 'STATE_INITIALIZED', 'Patient state initialized with provided data')
  );
  merged.audit_log.push(
    createAuditEvent(sessionId, 'RISK_CALCULATED', `Initial risk calculated: ${risk.score} (${risk.level})`, {
      riskScoreAfter: risk.score,
    })
  );

  if (merged.missing_information.length > 0) {
    merged.audit_log.push(
      createAuditEvent(sessionId, 'MISSING_INFO_DETECTED', `${merged.missing_information.length} fields still need data`)
    );
  }

  return merged;
}

// --- Answer parsing ---

export function parseAnswer(question: Question, rawValue: string): Answer {
  let value: string | number | boolean | string[];
  let displayValue: string;

  switch (question.answerType) {
    case 'numeric': {
      value = parseFloat(rawValue);
      displayValue = `${value}${question.unit ? ` ${question.unit}` : ''}`;
      break;
    }
    case 'boolean': {
      value = rawValue === 'true' || rawValue === 'true' || rawValue === 'yes';
      displayValue = value ? 'Yes' : 'No';
      break;
    }
    case 'choice': {
      value = rawValue;
      const opt = question.options?.find((o) => o.value === rawValue);
      displayValue = opt?.label ?? rawValue;
      break;
    }
    default: {
      // text or symptoms
      if (question.field === 'symptoms') {
        value = rawValue.split(',').map((s) => s.trim()).filter(Boolean);
        displayValue = (value as string[]).join(', ');
      } else {
        value = rawValue;
        displayValue = rawValue;
      }
    }
  }

  return {
    questionId: question.id,
    field: question.field,
    value,
    displayValue,
    timestamp: new Date().toISOString(),
  };
}

// --- Process an answer and update state ---

export function processAnswer(
  prevState: PatientState,
  question: Question,
  answer: Answer
): PatientState {
  const state: PatientState = JSON.parse(JSON.stringify(prevState));
  const riskBefore = state.risk_score;
  const routingBefore = state.routing_decision;

  // Record question asked
  if (!state.questions_asked.includes(question.id)) {
    state.questions_asked.push(question.id);
  }

  // Check for contradiction
  const contradiction = detectContradiction(state, answer, state.contradictions);
  if (contradiction) {
    state.contradictions.push(contradiction);
    state.audit_log.push(
      createAuditEvent(state.session_id, 'CONTRADICTION_DETECTED', `Field "${contradiction.fieldLabel}" changed from "${contradiction.previousDisplay}" to "${contradiction.currentDisplay}"`, {
        stateChange: {
          field: String(contradiction.field),
          before: contradiction.previousDisplay,
          after: contradiction.currentDisplay,
        },
        riskScoreBefore: riskBefore,
      })
    );
  }

  // Update the field
  (state as unknown as Record<string, unknown>)[question.field] = answer.value;

  // Record answer
  state.answers_received.push(answer);
  state.timestamp = new Date().toISOString();

  state.audit_log.push(
    createAuditEvent(state.session_id, 'ANSWER_RECEIVED', `Answer received for "${question.label}": ${answer.displayValue}`, {
      questionId: question.id,
      answerValue: answer.displayValue,
    })
  );
  state.audit_log.push(
    createAuditEvent(state.session_id, 'STATE_UPDATED', `Field "${question.field}" updated`, {
      stateChange: {
        field: String(question.field),
        after: answer.displayValue,
      },
    })
  );

  // Recalculate risk
  const risk = calculateRisk(state);
  state.risk_score = risk.score;
  state.risk_level = risk.level;
  state.confidence = risk.confidence;

  state.audit_log.push(
    createAuditEvent(state.session_id, 'RISK_RECALCULATED', `Risk recalculated: ${risk.score} (${risk.level})`, {
      riskScoreBefore: riskBefore,
      riskScoreAfter: risk.score,
    })
  );

  // Update missing information
  state.missing_information = getMissingInformation(state);

  // Reassess routing
  const routing = determineRouting({
    riskLevel: state.risk_level,
    riskScore: state.risk_score,
    contradictions: state.contradictions,
    confidence: state.confidence,
    interviewComplete: state.interview_complete,
  });
  state.routing_decision = routing;

  if (routing !== routingBefore) {
    state.audit_log.push(
      createAuditEvent(state.session_id, 'ROUTING_REASSESSED', `Routing changed from ${routingBefore} to ${routing}`, {
        routingBefore,
        routingAfter: routing,
      })
    );
  }

  return state;
}

// --- Select next question with audit logging ---

export function agentSelectNextQuestion(state: PatientState): { state: PatientState; question: Question | null } {
  const newState: PatientState = JSON.parse(JSON.stringify(state));

  // Check for early termination
  if (shouldStopEarly(newState)) {
    newState.interview_complete = true;
    const routing = determineRouting({
      riskLevel: newState.risk_level,
      riskScore: newState.risk_score,
      contradictions: newState.contradictions,
      confidence: newState.confidence,
      interviewComplete: true,
    });
    newState.routing_decision = routing;
    newState.audit_log.push(
      createAuditEvent(newState.session_id, 'EARLY_TERMINATION_HIGH_RISK', 'High-risk condition detected — stopping interview and routing immediately', {
        riskScoreAfter: newState.risk_score,
        routingAfter: routing,
      })
    );
    newState.audit_log.push(
      createAuditEvent(newState.session_id, 'ROUTING_FINALIZED', `Final routing decision: ${routing}`, {
        routingAfter: routing,
      })
    );
    newState.audit_log.push(
      createAuditEvent(newState.session_id, 'INTERVIEW_COMPLETE', 'Interview terminated early due to critical findings')
    );
    return { state: newState, question: null };
  }

  const question = selectNextQuestion(newState);

  if (question) {
    newState.audit_log.push(
      createAuditEvent(newState.session_id, 'QUESTION_SELECTED', `Selected question: ${question.label}`, {
        questionId: question.id,
      })
    );
  } else {
    // No more questions — interview complete
    newState.interview_complete = true;
    const routing = determineRouting({
      riskLevel: newState.risk_level,
      riskScore: newState.risk_score,
      contradictions: newState.contradictions,
      confidence: newState.confidence,
      interviewComplete: true,
    });
    newState.routing_decision = routing;
    newState.audit_log.push(
      createAuditEvent(newState.session_id, 'ROUTING_FINALIZED', `Final routing decision: ${routing}`, {
        routingAfter: routing,
      })
    );
    newState.audit_log.push(
      createAuditEvent(newState.session_id, 'INTERVIEW_COMPLETE', 'All necessary information gathered')
    );
  }

  return { state: newState, question };
}

// --- Resolve a contradiction ---

export function resolveContradiction(
  state: PatientState,
  contradictionId: string,
  keepValue: 'previous' | 'current'
): PatientState {
  const newState: PatientState = JSON.parse(JSON.stringify(state));
  const idx = newState.contradictions.findIndex((c) => c.id === contradictionId);
  if (idx === -1) return state;

  const contradiction = newState.contradictions[idx];
  const riskBefore = newState.risk_score;

  // Mark as resolved
  newState.contradictions[idx].resolved = true;

  // If keeping previous, revert the field
  if (keepValue === 'previous') {
    // Find the previous answer for this field and restore it
    const fieldAnswers = newState.answers_received.filter((a) => a.field === contradiction.field);
    if (fieldAnswers.length >= 2) {
      const prevAnswer = fieldAnswers[fieldAnswers.length - 2];
      (newState as unknown as Record<string, unknown>)[contradiction.field] = prevAnswer.value;
    }
  }

  // Recalculate risk
  const risk = calculateRisk(newState);
  newState.risk_score = risk.score;
  newState.risk_level = risk.level;
  newState.confidence = risk.confidence;

  newState.audit_log.push(
    createAuditEvent(newState.session_id, 'RISK_RECALCULATED', `Risk recalculated after contradiction resolution: ${risk.score}`, {
      riskScoreBefore: riskBefore,
      riskScoreAfter: risk.score,
    })
  );

  // Reassess routing
  const routing = determineRouting({
    riskLevel: newState.risk_level,
    riskScore: newState.risk_score,
    contradictions: newState.contradictions,
    confidence: newState.confidence,
    interviewComplete: newState.interview_complete,
  });

  if (routing !== newState.routing_decision) {
    newState.audit_log.push(
      createAuditEvent(newState.session_id, 'ROUTING_REASSESSED', `Routing changed after contradiction resolution: ${routing}`, {
        routingBefore: newState.routing_decision,
        routingAfter: routing,
      })
    );
  }
  newState.routing_decision = routing;

  return newState;
}

// --- Get current risk result ---

export function getCurrentRisk(state: PatientState): RiskResult {
  return calculateRisk(state);
}
