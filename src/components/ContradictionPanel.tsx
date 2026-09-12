import { AlertTriangle, Check, RotateCcw, ArrowRightLeft } from 'lucide-react';
import { ContradictionEntry } from '@/types';

interface ContradictionPanelProps {
  contradictions: ContradictionEntry[];
  onResolve: (contradictionId: string, keepValue: 'previous' | 'current') => void;
}

export function ContradictionPanel({ contradictions, onResolve }: ContradictionPanelProps) {
  if (contradictions.length === 0) return null;

  return (
    <div className="bg-white border-2 border-red-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-red-200 bg-red-50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <h3 className="font-bold text-red-800 text-sm">Detected Contradictions</h3>
          <span className="text-xs text-red-500 font-medium bg-red-100 px-2 py-0.5 rounded-full">
            {contradictions.length}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {contradictions.map((c) => (
          <div
            key={c.id}
            className={`rounded-lg border p-3 ${
              c.resolved
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-800">{c.fieldLabel}</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  c.resolved
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {c.resolved ? 'RESOLVED' : 'REASSESSMENT REQUIRED'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-white rounded-md p-2 border border-slate-200">
                <p className="text-xs text-slate-400 font-medium mb-0.5">Previous</p>
                <p className="text-sm font-semibold text-slate-700">{c.previousDisplay}</p>
              </div>
              <div className="bg-white rounded-md p-2 border border-slate-200">
                <p className="text-xs text-slate-400 font-medium mb-0.5">Current</p>
                <p className="text-sm font-semibold text-slate-700">{c.currentDisplay}</p>
              </div>
            </div>

            {!c.resolved && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onResolve(c.id, 'previous')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Keep Previous
                </button>
                <button
                  onClick={() => onResolve(c.id, 'current')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Keep Current
                </button>
                <button
                  onClick={() => onResolve(c.id, 'current')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors ml-auto"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  Resolve / Clarify
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
