import { PatientState } from '@/types';

export function generateId(prefix: string): string {
  const randomId = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${prefix}-${randomId}`;
}

export type FieldStatus = 'COMPLETE' | 'MISSING' | 'UNKNOWN';

export const STATUS_BADGE_STYLES: Record<FieldStatus, { bg: string; text: string; label: string }> = {
  COMPLETE: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    label: 'Complete',
  },
  MISSING: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    label: 'Missing',
  },
  UNKNOWN: {
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    label: 'Unknown',
  },
};

export function getFieldStatus(state: PatientState, field: keyof PatientState): FieldStatus {
  const value = state[field];

  // Handle different field types
  if (value === null || value === undefined) {
    return 'MISSING';
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? 'COMPLETE' : 'MISSING';
  }

  if (typeof value === 'string') {
    return value.length > 0 ? 'COMPLETE' : 'MISSING';
  }

  if (typeof value === 'number') {
    return 'COMPLETE';
  }

  if (typeof value === 'boolean') {
    return 'COMPLETE';
  }

  return value ? 'COMPLETE' : 'MISSING';
}

export function formatFieldValue(state: PatientState, field: keyof PatientState): string {
  const value = state[field];

  if (value === null || value === undefined) {
    return '—';
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    // Add units to specific fields
    if (field === 'age') {
      return value ? `${value} yrs` : '—';
    }
    if (field === 'heart_rate') {
      return value ? `${value} bpm` : '—';
    }
    if (field === 'respiratory_rate') {
      return value ? `${value} /min` : '—';
    }
    if (field === 'oxygen_saturation') {
      return value ? `${value}%` : '—';
    }
    if (field === 'temperature') {
      return value ? `${value}°C` : '—';
    }
    if (field === 'systolic_blood_pressure') {
      return value ? `${value} mmHg` : '—';
    }
    if (field === 'diastolic_blood_pressure') {
      return value ? `${value} mmHg` : '—';
    }

    // Format label-style values
    const labels: Record<string, string> = {
      MILD: 'Mild',
      MODERATE: 'Moderate',
      SEVERE: 'Severe',
      NONE: 'None',
      MINOR: 'Minor',
      ALERT: 'Alert',
      DROWSY: 'Drowsy',
      CONFUSED: 'Confused',
      UNRESPONSIVE: 'Unresponsive',
      LOW: 'Low',
      HIGH: 'High',
      CRITICAL: 'Critical',
      UNKNOWN: 'Unknown',
    };

    return labels[value] || value;
  }

  return String(value);
}

export function formatTime(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function formatDate(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}