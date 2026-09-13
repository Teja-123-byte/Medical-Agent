import { describe, it, expect } from 'vitest';
import { selectNextQuestion, getMissingInformation, shouldStopEarly, QUESTION_BANK } from '@/engine/questionSelector';
import { createInitialState } from '@/engine/triageAgent';
import { PatientState } from '@/types';

function makeState(overrides: Partial<PatientState> = {}): PatientState {
  return createInitialState('p1', 's1', overrides);
}

describe('Adaptive Question Selection', () => {
  it('selects a question when state is mostly empty', () => {
    const state = makeState({});
    const q = selectNextQuestion(state);
    expect(q).not.toBeNull();
    expect(q!.id).toBeDefined();
  });

  it('prioritizes age as first question for empty state', () => {
    const state = makeState({});
    const q = selectNextQuestion(state);
    expect(q!.field).toBe('age');
  });

  it('does not re-ask already answered fields', () => {
    const state = makeState({ age: 40 });
    // Simulate that age was answered
    state.answers_received.push({
      questionId: 'q_age',
      field: 'age',
      value: 40,
      displayValue: '40 years',
      timestamp: new Date().toISOString(),
    });
    const q = selectNextQuestion(state);
    expect(q).not.toBeNull();
    expect(q!.field).not.toBe('age');
  });

  it('prioritizes oxygen saturation when breathing difficulty is reported', () => {
    const state = makeState({
      breathing_difficulty: 'SEVERE',
    });
    // Mark breathing_difficulty as answered so it's not selected again
    state.answers_received.push({
      questionId: 'q_breathing_difficulty',
      field: 'breathing_difficulty',
      value: 'SEVERE',
      displayValue: 'Severe',
      timestamp: new Date().toISOString(),
    });
    const q = selectNextQuestion(state);
    // Should be oxygen_saturation or consciousness (high priority with breathing difficulty)
    expect(['oxygen_saturation', 'consciousness', 'chest_pain']).toContain(q!.field);
  });

  it('prioritizes oxygen and heart rate when chest pain is reported', () => {
    const state = makeState({
      chest_pain: true,
      symptoms: ['chest pain'],
    });
    state.answers_received.push({
      questionId: 'q_chest_pain',
      field: 'chest_pain',
      value: true,
      displayValue: 'Yes',
      timestamp: new Date().toISOString(),
    });
    const q = selectNextQuestion(state);
    expect(['oxygen_saturation', 'heart_rate', 'breathing_difficulty']).toContain(q!.field);
  });

  it('returns null when all questions are answered', () => {
    const state = makeState({});
    // Mark all questions as answered
    QUESTION_BANK.forEach((q) => {
      state.answers_received.push({
        questionId: q.id,
        field: q.field,
        value: 'test',
        displayValue: 'test',
        timestamp: new Date().toISOString(),
      });
    });
    const result = selectNextQuestion(state);
    expect(result).toBeNull();
  });
});

describe('Missing Information', () => {
  it('lists all fields when state is empty', () => {
    const state = makeState({});
    const missing = getMissingInformation(state);
    expect(missing.length).toBe(QUESTION_BANK.length);
  });

  it('reduces missing count as answers are recorded', () => {
    const state = makeState({});
    state.answers_received.push({
      questionId: 'q_age',
      field: 'age',
      value: 40,
      displayValue: '40 years',
      timestamp: new Date().toISOString(),
    });
    const missing = getMissingInformation(state);
    expect(missing.length).toBe(QUESTION_BANK.length - 1);
    expect(missing).not.toContain('Age');
  });

  it('reports only unanswered fields after multiple answers', () => {
    const state = makeState({ age: 40, symptoms: ['headache'] });
    state.answers_received.push(
      {
        questionId: 'q_age',
        field: 'age',
        value: 40,
        displayValue: '40 years',
        timestamp: new Date().toISOString(),
      },
      {
        questionId: 'q_symptoms',
        field: 'symptoms',
        value: ['headache'],
        displayValue: 'headache',
        timestamp: new Date().toISOString(),
      }
    );

    const missing = getMissingInformation(state);
    expect(missing).not.toContain('Age');
    expect(missing).not.toContain('Symptoms');
    expect(missing.length).toBe(QUESTION_BANK.length - 2);
  });

  it('re-asks a field with an unresolved contradiction', () => {
    const state = makeState({ symptom_severity: 'MILD' });
    QUESTION_BANK.forEach((question) => {
      state.answers_received.push({
        questionId: question.id,
        field: question.field,
        value: question.field === 'symptom_severity' ? 'MILD' : 'test',
        displayValue: question.field === 'symptom_severity' ? 'Mild' : 'test',
        timestamp: new Date().toISOString(),
      });
    });
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

    expect(selectNextQuestion(state)?.field).toBe('symptom_severity');
  });
});

describe('Early Termination', () => {
  it('stops early for CRITICAL risk', () => {
    const state = makeState({
      oxygen_saturation: 85,
      consciousness: 'UNRESPONSIVE',
    });
    // Recalculate risk
    state.risk_level = 'CRITICAL';
    expect(shouldStopEarly(state)).toBe(true);
  });

  it('stops early for unresponsive consciousness', () => {
    const state = makeState({ consciousness: 'UNRESPONSIVE' });
    expect(shouldStopEarly(state)).toBe(true);
  });

  it('stops early for severe bleeding', () => {
    const state = makeState({ bleeding: 'SEVERE' });
    expect(shouldStopEarly(state)).toBe(true);
  });

  it('does not stop early for low risk', () => {
    const state = makeState({
      age: 30,
      symptom_severity: 'MILD',
    });
    expect(shouldStopEarly(state)).toBe(false);
  });
});
