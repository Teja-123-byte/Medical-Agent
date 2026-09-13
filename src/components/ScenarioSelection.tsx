import { UserPlus, FlaskConical, ArrowRight } from 'lucide-react';
import { SCENARIOS } from '@/engine/scenarios';
import { RISK_LEVEL_COLORS } from '@/engine/routing';
import { ScenarioTemplate } from '@/types';

interface ScenarioSelectionProps {
  onSelectScenario: (scenario: ScenarioTemplate) => void;
  onStartCustom: () => void;
  savedScenarios?: ScenarioTemplate[];
}

export function ScenarioSelection({ onSelectScenario, onStartCustom, savedScenarios = [] }: ScenarioSelectionProps) {
  const scenarios = [...savedScenarios, ...SCENARIOS.filter((s) => s.id !== 'custom')];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Start a Triage Simulation</h2>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto">
          Choose a seeded patient scenario to observe the adaptive agent in action,
          or start a new simulation with a custom patient.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {scenarios.map((scenario) => {
          const colors = RISK_LEVEL_COLORS[scenario.expectedRiskLevel];
          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className="group text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                  <span className={`text-xs font-semibold uppercase tracking-wide ${colors.text}`}>
                    {scenario.expectedRiskLevel}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{scenario.name}</h3>
              <p className="text-sm font-medium text-teal-700 mb-2">
                {scenario.initialState.patient_name ?? 'Unnamed synthetic patient'}
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">{scenario.description}</p>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">Expected routing: </span>
                <span className="text-xs font-medium text-slate-700">
                  {scenario.expectedRouting.replace(/_/g, ' ')}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onStartCustom}
        className="w-full group flex items-center justify-center gap-3 bg-teal-600 text-white rounded-xl p-5 hover:bg-teal-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-sm"
      >
        <FlaskConical className="w-5 h-5" />
        <span className="font-semibold">New Simulation</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-sm">
        <UserPlus className="w-4 h-4" />
        <span>Load Synthetic Patient</span>
      </div>
    </div>
  );
}
