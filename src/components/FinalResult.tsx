import { CheckCircle2, FileText, MessageSquare, AlertTriangle, Lightbulb, Lock } from 'lucide-react';
import { PatientState, RiskResult } from '@/types';
import { ROUTING_LABELS, RISK_LEVEL_COLORS } from '@/engine/routing';

interface FinalResultProps {
  state: PatientState;
  riskResult: RiskResult;
  onRestart: () => void;
}

export function FinalResult({ state, riskResult, onRestart }: FinalResultProps) {
  const colors = RISK_LEVEL_COLORS[riskResult.level];
  const knownFields = 17 - state.missing_information.length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-3">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Triage Complete</h2>
        <p className="text-sm text-slate-500">Synthetic simulation result — not a medical diagnosis</p>
      </div>

      {/* Main result card */}
      <div className={`bg-white border-2 ${colors.border} rounded-xl shadow-sm overflow-hidden`}>
        <div className={`${colors.bg} px-6 py-4 border-b ${colors.border}`}>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${colors.dot}`} />
            <h3 className={`font-bold uppercase tracking-wide text-sm ${colors.text}`}>
              Triage Result
            </h3>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Risk level and score */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-xs text-slate-400 font-medium uppercase mb-1">Risk Level</p>
              <p className={`text-2xl font-bold ${colors.text}`}>{riskResult.level}</p>
            </div>
            <div className="text-center bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-xs text-slate-400 font-medium uppercase mb-1">Risk Score</p>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{riskResult.score}</p>
            </div>
          </div>

          {/* Routing */}
          <div className={`rounded-lg p-4 border-2 ${colors.border} ${colors.bg} text-center`}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Recommended Routing
            </p>
            <p className={`text-xl font-bold ${colors.text}`}>
              {ROUTING_LABELS[state.routing_decision]}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <FileText className="w-4 h-4 text-slate-400" />
              <p className="text-lg font-bold text-slate-900 tabular-nums">{knownFields}</p>
              <p className="text-xs text-slate-400">Fields Gathered</p>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <p className="text-lg font-bold text-slate-900 tabular-nums">{state.questions_asked.length}</p>
              <p className="text-xs text-slate-400">Questions Asked</p>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <AlertTriangle className="w-4 h-4 text-slate-400" />
              <p className="text-lg font-bold text-slate-900 tabular-nums">{state.contradictions.length}</p>
              <p className="text-xs text-slate-400">Contradictions</p>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <Lightbulb className="w-4 h-4 text-slate-400" />
              <p className="text-lg font-bold text-slate-900 tabular-nums">{state.confidence}%</p>
              <p className="text-xs text-slate-400">Confidence</p>
            </div>
          </div>

          {/* Reasoning summary */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Reasoning Summary
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {generateReasoningSummary(state, riskResult)}
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 justify-center pt-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-500">Decision finalized</span>
          </div>
        </div>
      </div>

      {/* Restart */}
      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-semibold text-sm hover:bg-teal-700 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Start New Simulation
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <p className="text-xs text-red-800 leading-relaxed">
          This result is a synthetic simulation outcome and is not a medical diagnosis.
          The risk scores and routing decisions use synthetic demonstration rules that are
          not clinically validated. Do not use this system for real-world medical decisions.
        </p>
      </div>
    </div>
  );
}

function generateReasoningSummary(state: PatientState, riskResult: RiskResult): string {
  const parts: string[] = [];

  if (riskResult.factors.length === 0) {
    return 'No significant risk factors were detected from the patient\'s reported symptoms and vital signs. The patient appears stable based on available information.';
  }

  const topFactors = riskResult.factors.slice(0, 3).map((f) => f.factor.toLowerCase());
  parts.push(`${riskResult.level.toLowerCase()} risk was determined based on ${topFactors.join(', ')}${riskResult.factors.length > 3 ? ', and other factors' : ''}.`);

  if (state.contradictions.length > 0) {
    parts.push(`During the interview, ${state.contradictions.length} contradiction${state.contradictions.length > 1 ? 's were' : ' was'} detected and ${state.contradictions.every((c) => c.resolved) ? 'resolved' : 'require resolution'}.`);
  }

  if (state.routing_decision === 'HUMAN_REVIEW') {
    parts.push('Due to conflicting or uncertain high-risk information, the case has been escalated for human review.');
  } else if (state.routing_decision === 'EMERGENCY') {
    parts.push('Critical indicators warrant immediate emergency routing.');
  }

  return parts.join(' ');
}
