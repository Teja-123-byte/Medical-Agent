import { TrendingUp, AlertCircle, Activity, ShieldAlert, User } from 'lucide-react';
import { RiskResult, RoutingDecision, PatientState } from '@/types';
import { ROUTING_LABELS, RISK_LEVEL_COLORS } from '@/engine/routing';

interface RiskDashboardProps {
  riskResult: RiskResult;
  routingDecision: RoutingDecision;
  confidence: number;
  interviewComplete: boolean;
  patientState?: PatientState;
}

export function RiskDashboard({ riskResult, routingDecision, confidence, interviewComplete, patientState }: RiskDashboardProps) {
  const colors = RISK_LEVEL_COLORS[riskResult.level];
  const routingColor = getRoutingColor(routingDecision);

  return (
    <div className={`bg-white border-2 rounded-xl overflow-hidden shadow-sm ${colors.border}`}>
      {/* Header with risk level and patient name */}
      <div className={`${colors.bg} px-5 py-4 border-b ${colors.border}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${colors.dot} ${riskResult.level === 'CRITICAL' ? 'animate-pulse' : ''}`} />
            <h3 className="font-bold text-slate-900 text-sm">Risk Dashboard</h3>
          </div>
          <div className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
            {riskResult.level}
          </div>
        </div>
        
        {patientState?.patient_name && (
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t" style={{ borderColor: colors.border === 'border-emerald-200' ? '#a7f3d0' : colors.border === 'border-amber-200' ? '#fcd34d' : colors.border === 'border-orange-200' ? '#fed7aa' : '#fecaca' }}>
            <User className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-semibold text-slate-700">
              {patientState.patient_name}
              {patientState.age && ` • ${patientState.age} yrs`}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Score and routing */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-xs text-slate-400 font-medium mb-1">Risk Score</p>
            <p className="text-3xl font-bold text-slate-900 tabular-nums leading-none">
              {riskResult.score}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-xs text-slate-400 font-medium mb-1">Confidence</p>
            <p className="text-3xl font-bold text-slate-900 tabular-nums leading-none">
              {confidence}<span className="text-lg text-slate-400">%</span>
            </p>
          </div>
        </div>

        {/* Routing decision */}
        <div className={`rounded-lg p-4 border-2 ${routingColor.border} ${routingColor.bg}`}>
          <div className="flex items-center gap-2 mb-1">
            <routingColor.icon className={`w-4 h-4 ${routingColor.text}`} />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {interviewComplete ? 'Recommended Routing' : 'Current Routing'}
            </p>
          </div>
          <p className={`text-lg font-bold ${routingColor.text}`}>
            {ROUTING_LABELS[routingDecision]}
          </p>
        </div>

        {/* Risk factors */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Risk Factors
            </h4>
          </div>
          {riskResult.factors.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-2">No risk factors identified yet</p>
          ) : (
            <div className="space-y-2">
              {riskResult.factors.map((factor, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 px-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-sm text-slate-700 font-medium">{factor.factor}</span>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">
                    +{factor.points}
                  </span>
                </div>
              ))}
              {/* Total */}
              <div className="flex items-center justify-between py-2 px-3 bg-slate-900 rounded-lg mt-2">
                <span className="text-sm font-bold text-white">Total Risk Score</span>
                <span className="text-sm font-bold text-white tabular-nums">{riskResult.score}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getRoutingColor(routing: RoutingDecision) {
  const map: Record<RoutingDecision, { bg: string; border: string; text: string; icon: typeof Activity }> = {
    SELF_CARE: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: Activity },
    ROUTINE_CLINIC: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: AlertCircle },
    URGENT_CLINIC: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: AlertCircle },
    EMERGENCY: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: ShieldAlert },
    HUMAN_REVIEW: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: ShieldAlert },
    PENDING: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-500', icon: Activity },
  };
  return map[routing] ?? map.PENDING;
}