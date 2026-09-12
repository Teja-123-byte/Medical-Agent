import { Heart, Thermometer, Wind, Droplet, Brain, User, FileText } from 'lucide-react';
import { PatientState, FIELD_METADATA } from '@/types';
import { getFieldStatus, formatFieldValue, STATUS_BADGE_STYLES } from '@/utils/ui';

interface PatientStatePanelProps {
  state: PatientState;
}

const CATEGORY_ICONS = {
  demographics: User,
  symptoms: FileText,
  vitals: Heart,
  clinical: Brain,
  history: FileText,
};

const CATEGORY_LABELS = {
  demographics: 'Demographics',
  symptoms: 'Symptoms',
  vitals: 'Vital Signs',
  clinical: 'Clinical Observations',
  history: 'Medical History',
};

const CATEGORY_ORDER = ['demographics', 'symptoms', 'vitals', 'clinical', 'history'] as const;

export function PatientStatePanel({ state }: PatientStatePanelProps) {
  const missingCount = state.missing_information.length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Patient State</h3>
          {missingCount > 0 && (
            <span className="text-xs text-slate-400 font-medium">
              {missingCount} field{missingCount !== 1 ? 's' : ''} missing
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto">
        {CATEGORY_ORDER.map((category) => {
          const fields = FIELD_METADATA.filter((m) => m.category === category);
          if (fields.length === 0) return null;
          const Icon = CATEGORY_ICONS[category];

          return (
            <div key={category}>
              <div className="flex items-center gap-1.5 mb-2">
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {CATEGORY_LABELS[category]}
                </h4>
              </div>
              <div className="space-y-1">
                {fields.map((meta) => {
                  const status = getFieldStatus(state, meta.key);
                  const value = formatFieldValue(state, meta.key);
                  const badge = STATUS_BADGE_STYLES[status];

                  return (
                    <div
                      key={String(meta.key)}
                      className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm text-slate-600 font-medium shrink-0">
                          {meta.label}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                      <span className="text-sm text-slate-800 font-semibold tabular-nums truncate ml-2 text-right">
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
