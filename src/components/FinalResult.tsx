import { CheckCircle2, FileText, MessageSquare, AlertTriangle, Lightbulb, Lock, User, Heart, Thermometer, Activity } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-3">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Triage Assessment Complete</h2>
        <p className="text-sm text-slate-500">Synthetic simulation result — not a medical diagnosis</p>
      </div>

      {/* Patient Header with Name */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-600 text-white">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Patient</p>
            <h3 className="text-2xl font-bold text-slate-900">{state.patient_name || 'N/A'}</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase mb-1">Age</p>
            <p className="text-lg font-bold text-slate-900">{state.age ? `${state.age} yrs` : '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase mb-1">Session ID</p>
            <p className="text-sm font-mono text-slate-600">{state.session_id?.slice(0, 8)}…</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase mb-1">Assessment Time</p>
            <p className="text-sm font-medium text-slate-700">{new Date(state.timestamp).toLocaleTimeString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase mb-1">Confidence</p>
            <p className="text-lg font-bold text-teal-600">{state.confidence}%</p>
          </div>
        </div>
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

      {/* Patient Data Summary */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            Complete Patient Data
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Demographics */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Demographics
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <DataField label="Name" value={state.patient_name || '—'} />
              <DataField label="Age" value={state.age ? `${state.age} years` : '—'} />
            </div>
          </div>

          {/* Symptoms */}
          {(state.symptoms.length > 0 || state.symptom_severity || state.symptom_duration) && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Symptoms
              </h4>
              <div className="space-y-3">
                {state.symptoms.length > 0 && (
                  <DataField label="Reported Symptoms" value={state.symptoms.join(', ')} />
                )}
                {state.symptom_severity && (
                  <DataField label="Severity" value={state.symptom_severity} />
                )}
                {state.symptom_duration && (
                  <DataField label="Duration" value={state.symptom_duration} />
                )}
                {state.chest_pain !== null && (
                  <DataField label="Chest Pain" value={state.chest_pain ? 'Yes' : 'No'} />
                )}
                {state.breathing_difficulty !== null && (
                  <DataField label="Breathing Difficulty" value={state.breathing_difficulty} />
                )}
                {state.bleeding !== null && (
                  <DataField label="Bleeding" value={state.bleeding} />
                )}
              </div>
            </div>
          )}

          {/* Vital Signs */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              Vital Signs
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <DataField label="Heart Rate" value={state.heart_rate ? `${state.heart_rate} bpm` : '—'} />
              <DataField label="Respiratory Rate" value={state.respiratory_rate ? `${state.respiratory_rate} /min` : '—'} />
              <DataField label="Oxygen Saturation" value={state.oxygen_saturation ? `${state.oxygen_saturation}%` : '—'} />
              <DataField label="Temperature" value={state.temperature ? `${state.temperature}°C` : '—'} />
              <DataField label="Systolic BP" value={state.systolic_blood_pressure ? `${state.systolic_blood_pressure} mmHg` : '—'} />
              <DataField label="Diastolic BP" value={state.diastolic_blood_pressure ? `${state.diastolic_blood_pressure} mmHg` : '—'} />
              {state.consciousness && (
                <DataField label="Consciousness" value={state.consciousness} />
              )}
            </div>
          </div>

          {/* Medical History */}
          {(state.medical_history || state.medications || state.allergies) && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Medical History
              </h4>
              <div className="space-y-3">
                {state.medical_history && (
                  <DataField label="Past Medical History" value={state.medical_history} />
                )}
                {state.medications && (
                  <DataField label="Current Medications" value={state.medications} />
                )}
                {state.allergies && (
                  <DataField label="Known Allergies" value={state.allergies} />
                )}
              </div>
            </div>
          )}

          {/* Risk Factors */}
          {riskResult.factors.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Risk Factors Contributing to Assessment
              </h4>
              <div className="space-y-2">
                {riskResult.factors.map((factor, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 px-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-sm text-slate-700 font-medium">{factor.factor}</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">+{factor.points}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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

interface DataFieldProps {
  label: string;
  value: string;
}

function DataField({ label, value }: DataFieldProps) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
      <p className="text-xs text-slate-400 font-medium uppercase mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-800 break-words">{value}</p>
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