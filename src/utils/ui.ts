// ============================================================================
// UI Utilities — formatting and display helpers
// ============================================================================

import { FIELD_METADATA, PatientState, FieldStatus } from '@/types';

export function getFieldStatus(state: PatientState, field: keyof PatientState): FieldStatus {
  // Check if there's an unresolved contradiction
  const contradiction = state.contradictions.find(
    (c) => c.field === field && !c.resolved
  );
  if (contradiction) return 'CONTRADICTORY';

  // Check if the field was changed (resolved contradiction)
  const resolvedContradiction = state.contradictions.find(
    (c) => c.field === field && c.resolved
  );
  if (resolvedContradiction) return 'CHANGED';

  // Check if the field has data
  const value = state[field];
  if (value === null || value === undefined) return 'MISSING';
  if (Array.isArray(value) && value.length === 0) return 'MISSING';
  return 'KNOWN';
}

export function formatFieldValue(state: PatientState, field: keyof PatientState): string {
  const meta = FIELD_METADATA.find((m) => m.key === field);
  const value = state[field];

  if (value === null || value === undefined) return '—';
  if (Array.isArray(value)) {
    if (value.length === 0) return '—';
    return value.join(', ');
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (meta?.unit && typeof value === 'number') return `${value} ${meta.unit}`;
  return String(value);
}

export function getFieldLabel(field: keyof PatientState): string {
  const meta = FIELD_METADATA.find((m) => m.key === field);
  return meta?.label ?? String(field);
}

export function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const STATUS_BADGE_STYLES: Record<FieldStatus, { bg: string; text: string; label: string }> = {
  KNOWN: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Known' },
  MISSING: { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Missing' },
  CHANGED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Changed' },
  CONTRADICTORY: { bg: 'bg-red-100', text: 'text-red-700', label: 'Contradictory' },
};
