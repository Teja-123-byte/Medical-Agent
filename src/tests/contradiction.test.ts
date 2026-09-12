import { describe, it, expect } from 'vitest';
import { detectContradiction, formatValue } from '@/engine/contradictionDetector';
import { createInitialState } from '@/engine/triageAgent';
import { Answer, PatientState } from '@/types';

function makeState(overrides: Partial<PatientState> = {}): PatientState {
  return createInitialState('p1', 's1', overrides);
}

function makeAnswer(field: keyof PatientState, value: string | number | boolean, questionId = 'q1'): Answer {
  return {
    questionId,
    field,
    value,
    displayValue: formatValue(value),
    timestamp: new Date().toISOString(),
  };
}

describe('Contradiction Detection', () => {
  it('detects qualitative field change (symptom severity)', () => {
    const state = makeState({ symptom_severity: 'MILD' });
    const answer = makeAnswer('symptom_severity', 'SEVERE');
    const contradiction = detectContradiction(state, answer, []);
    expect(contradiction).not.toBeNull();
    expect(contradiction?.field).toBe('symptom_severity');
    expect(contradiction?.previousDisplay).toBe('Mild');
    expect(contradiction?.currentDisplay).toBe('Severe');
  });

  it('detects vital sign change beyond tolerance (heart rate)', () => {
    const state = makeState({ heart_rate: 70 });
    const answer = makeAnswer('heart_rate', 140);
    const contradiction = detectContradiction(state, answer, []);
    expect(contradiction).not.toBeNull();
  });

  it('does not flag small vital change within tolerance', () => {
    const state = makeState({ heart_rate: 72 });
    const answer = makeAnswer('heart_rate', 78);
    const contradiction = detectContradiction(state, answer, []);
    expect(contradiction).toBeNull();
  });

  it('does not flag identical values', () => {
    const state = makeState({ consciousness: 'ALERT' });
    const answer = makeAnswer('consciousness', 'ALERT');
    const contradiction = detectContradiction(state, answer, []);
    expect(contradiction).toBeNull();
  });

  it('does not flag when field was previously null', () => {
    const state = makeState({ heart_rate: null });
    const answer = makeAnswer('heart_rate', 120);
    const contradiction = detectContradiction(state, answer, []);
    expect(contradiction).toBeNull();
  });

  it('detects chest pain change (false → true)', () => {
    const state = makeState({ chest_pain: false });
    const answer = makeAnswer('chest_pain', true);
    const contradiction = detectContradiction(state, answer, []);
    expect(contradiction).not.toBeNull();
    expect(contradiction?.previousDisplay).toBe('No');
    expect(contradiction?.currentDisplay).toBe('Yes');
  });

  it('detects breathing difficulty escalation', () => {
    const state = makeState({ breathing_difficulty: 'MILD' });
    const answer = makeAnswer('breathing_difficulty', 'SEVERE');
    const contradiction = detectContradiction(state, answer, []);
    expect(contradiction).not.toBeNull();
  });
});
