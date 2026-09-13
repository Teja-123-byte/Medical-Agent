import { describe, it, expect } from 'vitest';
import { createInitialState, processAnswer, parseAnswer, resolveContradiction } from '@/engine/triageAgent';
import { selectNextQuestion } from '@/engine/questionSelector';
import { calculateRisk } from '@/engine/riskEngine';
import { determineRouting } from '@/engine/routing';
import { SCENARIOS } from '@/engine/scenarios';
import { PatientState } from '@/types';

function runScenario(scenarioId: string): PatientState {
  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;
  return createInitialState('p1', 's1', scenario.initialState);
}

describe('Scenario Outcomes', () => {
  it('low-risk patient routes to SELF_CARE', () => {
    const state = runScenario('low-risk');
    const risk = calculateRisk(state);
    const routing = determineRouting({
      riskLevel: risk.level,
      riskScore: risk.score,
      contradictions: [],
      confidence: risk.confidence,
      interviewComplete: true,
    });
    expect(risk.level).toBe('LOW');
    expect(routing).toBe('SELF_CARE');
  });

  it('moderate-risk patient routes to ROUTINE_CLINIC', () => {
    const state = runScenario('moderate-risk');
    const risk = calculateRisk(state);
    const routing = determineRouting({
      riskLevel: risk.level,
      riskScore: risk.score,
      contradictions: [],
      confidence: risk.confidence,
      interviewComplete: true,
    });
    expect(risk.level).toBe('MODERATE');
    expect(routing).toBe('ROUTINE_CLINIC');
  });

  it('high-risk patient routes to URGENT_CLINIC', () => {
    const state = runScenario('high-risk');
    const risk = calculateRisk(state);
    const routing = determineRouting({
      riskLevel: risk.level,
      riskScore: risk.score,
      contradictions: [],
      confidence: risk.confidence,
      interviewComplete: true,
    });
    expect(risk.level).toBe('HIGH');
    expect(routing).toBe('URGENT_CLINIC');
  });

  it('critical patient routes to EMERGENCY', () => {
    const state = runScenario('critical-risk');
    const risk = calculateRisk(state);
    const routing = determineRouting({
      riskLevel: risk.level,
      riskScore: risk.score,
      contradictions: [],
      confidence: risk.confidence,
      interviewComplete: true,
    });
    expect(risk.level).toBe('CRITICAL');
    expect(routing).toBe('EMERGENCY');
  });
});

describe('Risk Recalculation After State Update', () => {
  it('recalculates risk when new vital is added', () => {
    const state = createInitialState('p1', 's1', {});
    const initialScore = state.risk_score;

    // Answer the age question with an elderly value
    const question = selectNextQuestion(state)!;
    const answer = parseAnswer(question, '75');
    const updated = processAnswer(state, question, answer);

    const newScore = updated.risk_score;
    expect(newScore).toBeGreaterThanOrEqual(initialScore);
  });

  it('recalculates risk when worsening vitals are provided', () => {
    const state = createInitialState('p1', 's1', {
      symptoms: ['shortness of breath'],
      breathing_difficulty: 'MODERATE',
    });
    const initialScore = state.risk_score;

    // Answer a question that adds a risk factor
    const question = selectNextQuestion(state)!;
    if (question.field === 'oxygen_saturation') {
      const answer = parseAnswer(question, '88');
      const updated = processAnswer(state, question, answer);
      expect(updated.risk_score).toBeGreaterThan(initialScore);
    }
  });
});

describe('Contradictory Answer Handling', () => {
  it('detects and records contradiction when severity changes', () => {
    const state = createInitialState('p1', 's1', {
      symptom_severity: 'MILD',
    });
    // Simulate that symptom_severity was already answered
    state.answers_received.push({
      questionId: 'q_symptom_severity',
      field: 'symptom_severity',
      value: 'MILD',
      displayValue: 'Mild',
      timestamp: new Date().toISOString(),
    });

    // Now answer with SEVERE
    const answer = {
      questionId: 'q_symptom_severity',
      field: 'symptom_severity' as const,
      value: 'SEVERE',
      displayValue: 'Severe',
      timestamp: new Date().toISOString(),
    };
    const updated = processAnswer(state, {
      id: 'q_symptom_severity',
      category: 'symptom_detail' as const,
      field: 'symptom_severity' as const,
      label: 'Symptom Severity',
      prompt: 'How severe?',
      answerType: 'choice' as const,
      priority: 70,
      options: [],
    }, answer);

    expect(updated.contradictions.length).toBeGreaterThan(0);
    expect(updated.contradictions[0].previousDisplay).toBe('Mild');
    expect(updated.contradictions[0].currentDisplay).toBe('Severe');
  });

  it('resolves contradiction and recalculates risk', () => {
    const state = createInitialState('p1', 's1', {
      symptom_severity: 'MILD',
    });
    // Add two answers to simulate a contradiction
    state.answers_received.push({
      questionId: 'q_symptom_severity',
      field: 'symptom_severity',
      value: 'MILD',
      displayValue: 'Mild',
      timestamp: new Date().toISOString(),
    });
    state.answers_received.push({
      questionId: 'q_symptom_severity',
      field: 'symptom_severity',
      value: 'SEVERE',
      displayValue: 'Severe',
      timestamp: new Date().toISOString(),
    });
    state.symptom_severity = 'SEVERE';
    state.contradictions.push({
      id: 'c1',
      field: 'symptom_severity',
      fieldLabel: 'Symptom Severity',
      previousValue: 'Mild',
      currentValue: 'Severe',
      previousDisplay: 'Mild',
      currentDisplay: 'Severe',
      resolved: false,
      timestamp: new Date().toISOString(),
      clarificationAsked: false,
    });

    const resolved = resolveContradiction(state, 'c1', 'previous');
    expect(resolved.contradictions[0].resolved).toBe(true);
    expect(resolved.symptom_severity).toBe('MILD');
  });
});

describe('Audit Trail', () => {
  it('logs session start and state initialization', () => {
    const state = createInitialState('p1', 's1', { age: 40 });
    expect(state.audit_log.length).toBeGreaterThan(0);
    expect(state.audit_log.some((e) => e.action === 'SESSION_STARTED')).toBe(true);
    expect(state.audit_log.some((e) => e.action === 'STATE_INITIALIZED')).toBe(true);
    expect(state.audit_log.some((e) => e.action === 'RISK_CALCULATED')).toBe(true);
  });

  it('logs answer received and risk recalculated', () => {
    const state = createInitialState('p1', 's1', {});
    const question = selectNextQuestion(state)!;
    const answer = parseAnswer(question, '75');
    const updated = processAnswer(state, question, answer);

    expect(updated.audit_log.some((e) => e.action === 'ANSWER_RECEIVED')).toBe(true);
    expect(updated.audit_log.some((e) => e.action === 'STATE_UPDATED')).toBe(true);
    expect(updated.audit_log.some((e) => e.action === 'RISK_RECALCULATED')).toBe(true);
  });
});
