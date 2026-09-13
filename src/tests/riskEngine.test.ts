import { describe, it, expect } from 'vitest';
import { calculateRisk, classifyRisk } from '@/engine/riskEngine';
import { createInitialState } from '@/engine/triageAgent';
import { PatientState } from '@/types';

function makeState(overrides: Partial<PatientState>): PatientState {
  return createInitialState('p1', 's1', overrides);
}

describe('Risk Scoring', () => {
  it('scores zero for completely normal vitals', () => {
    const state = makeState({
      age: 30,
      heart_rate: 72,
      respiratory_rate: 16,
      oxygen_saturation: 98,
      temperature: 36.8,
      systolic_blood_pressure: 120,
      diastolic_blood_pressure: 80,
      consciousness: 'ALERT',
      chest_pain: false,
      breathing_difficulty: 'NONE',
      bleeding: 'NONE',
      symptom_severity: 'MILD',
    });
    const result = calculateRisk(state);
    expect(result.score).toBe(3); // only mild symptom severity
  });

  it('scores high for critical oxygen saturation', () => {
    const state = makeState({ oxygen_saturation: 85 });
    const result = calculateRisk(state);
    expect(result.score).toBeGreaterThanOrEqual(30);
    expect(result.level).toBe('CRITICAL');
  });

  it('scores moderate for slightly low oxygen', () => {
    const state = makeState({ oxygen_saturation: 93 });
    const result = calculateRisk(state);
    expect(result.score).toBe(10);
    expect(result.level).toBe('MODERATE');
  });

  it('scores for severe symptom severity', () => {
    const state = makeState({ symptom_severity: 'SEVERE' });
    const result = calculateRisk(state);
    expect(result.score).toBeGreaterThanOrEqual(20);
  });

  it('scores for chest pain', () => {
    const state = makeState({ chest_pain: true });
    const result = calculateRisk(state);
    expect(result.score).toBe(15);
  });

  it('scores for severe breathing difficulty', () => {
    const state = makeState({ breathing_difficulty: 'SEVERE' });
    const result = calculateRisk(state);
    expect(result.score).toBe(20);
  });

  it('scores for unresponsive consciousness', () => {
    const state = makeState({ consciousness: 'UNRESPONSIVE' });
    const result = calculateRisk(state);
    expect(result.score).toBe(35);
    expect(result.level).toBe('HIGH');
  });

  it('scores for elderly age factor', () => {
    const state = makeState({ age: 75 });
    const result = calculateRisk(state);
    expect(result.score).toBeGreaterThanOrEqual(10);
  });

  it.each([
    { field: 'heart_rate' as const, value: 40, points: 25 },
    { field: 'heart_rate' as const, value: 140, points: 25 },
    { field: 'respiratory_rate' as const, value: 8, points: 25 },
    { field: 'respiratory_rate' as const, value: 35, points: 25 },
    { field: 'temperature' as const, value: 40, points: 20 },
    { field: 'systolic_blood_pressure' as const, value: 80, points: 25 },
    { field: 'systolic_blood_pressure' as const, value: 180, points: 25 },
  ])('scores the configured critical boundary for $field=$value', ({ field, value, points }) => {
    const result = calculateRisk(makeState({ [field]: value }));
    expect(result.factors.find((factor) => factor.field === field)?.points).toBe(points);
  });
});

describe('Risk Classification', () => {
  it('classifies score 0 as LOW', () => {
    expect(classifyRisk(0)).toBe('LOW');
  });

  it('classifies score 14 as LOW', () => {
    expect(classifyRisk(14)).toBe('LOW');
  });

  it('classifies score 15 as MODERATE', () => {
    expect(classifyRisk(15)).toBe('MODERATE');
  });

  it('classifies score 39 as MODERATE', () => {
    expect(classifyRisk(39)).toBe('MODERATE');
  });

  it('classifies score 40 as HIGH', () => {
    expect(classifyRisk(40)).toBe('HIGH');
  });

  it('classifies score 69 as HIGH', () => {
    expect(classifyRisk(69)).toBe('HIGH');
  });

  it('classifies score 70 as CRITICAL', () => {
    expect(classifyRisk(70)).toBe('CRITICAL');
  });

  it('classifies score 100 as CRITICAL', () => {
    expect(classifyRisk(100)).toBe('CRITICAL');
  });

  it.each([
    [14, 'LOW'],
    [15, 'MODERATE'],
    [39, 'MODERATE'],
    [40, 'HIGH'],
    [69, 'HIGH'],
    [70, 'CRITICAL'],
  ] as const)('keeps the exact score boundary %i in %s', (score, expectedLevel) => {
    expect(classifyRisk(score)).toBe(expectedLevel);
  });
});
