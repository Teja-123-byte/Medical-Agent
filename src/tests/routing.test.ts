import { describe, it, expect } from 'vitest';
import { determineRouting } from '@/engine/routing';
import { ContradictionEntry } from '@/types';

function makeContradiction(overrides: Partial<ContradictionEntry> = {}): ContradictionEntry {
  return {
    id: 'c1',
    field: 'symptom_severity',
    fieldLabel: 'Symptom Severity',
    previousValue: 'MILD',
    currentValue: 'SEVERE',
    previousDisplay: 'Mild',
    currentDisplay: 'Severe',
    resolved: false,
    timestamp: new Date().toISOString(),
    clarificationAsked: false,
    ...overrides,
  };
}

describe('Routing Policy', () => {
  it('routes LOW to SELF_CARE', () => {
    expect(
      determineRouting({
        riskLevel: 'LOW',
        riskScore: 5,
        contradictions: [],
        confidence: 80,
        interviewComplete: true,
      })
    ).toBe('SELF_CARE');
  });

  it('routes MODERATE to ROUTINE_CLINIC', () => {
    expect(
      determineRouting({
        riskLevel: 'MODERATE',
        riskScore: 20,
        contradictions: [],
        confidence: 80,
        interviewComplete: true,
      })
    ).toBe('ROUTINE_CLINIC');
  });

  it('routes HIGH to URGENT_CLINIC', () => {
    expect(
      determineRouting({
        riskLevel: 'HIGH',
        riskScore: 50,
        contradictions: [],
        confidence: 80,
        interviewComplete: true,
      })
    ).toBe('URGENT_CLINIC');
  });

  it('routes CRITICAL to EMERGENCY', () => {
    expect(
      determineRouting({
        riskLevel: 'CRITICAL',
        riskScore: 80,
        contradictions: [],
        confidence: 80,
        interviewComplete: true,
      })
    ).toBe('EMERGENCY');
  });

  it('routes HIGH with unresolved contradictions to HUMAN_REVIEW', () => {
    expect(
      determineRouting({
        riskLevel: 'HIGH',
        riskScore: 50,
        contradictions: [makeContradiction()],
        confidence: 80,
        interviewComplete: true,
      })
    ).toBe('HUMAN_REVIEW');
  });

  it('routes CRITICAL with unresolved contradictions to HUMAN_REVIEW', () => {
    expect(
      determineRouting({
        riskLevel: 'CRITICAL',
        riskScore: 80,
        contradictions: [makeContradiction()],
        confidence: 80,
        interviewComplete: true,
      })
    ).toBe('HUMAN_REVIEW');
  });

  it('routes HIGH with low confidence to HUMAN_REVIEW', () => {
    expect(
      determineRouting({
        riskLevel: 'HIGH',
        riskScore: 50,
        contradictions: [],
        confidence: 30,
        interviewComplete: true,
      })
    ).toBe('HUMAN_REVIEW');
  });

  it('routes HIGH with resolved contradictions to URGENT_CLINIC', () => {
    expect(
      determineRouting({
        riskLevel: 'HIGH',
        riskScore: 50,
        contradictions: [makeContradiction({ resolved: true })],
        confidence: 80,
        interviewComplete: true,
      })
    ).toBe('URGENT_CLINIC');
  });

  it('returns PENDING for UNKNOWN risk', () => {
    expect(
      determineRouting({
        riskLevel: 'UNKNOWN',
        riskScore: 0,
        contradictions: [],
        confidence: 0,
        interviewComplete: false,
      })
    ).toBe('PENDING');
  });
});
