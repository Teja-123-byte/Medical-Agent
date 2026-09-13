import { useState, useCallback, useMemo } from 'react';
import { Header, DisclaimerBanner } from '@/components/Header';
import { ScenarioSelection } from '@/components/ScenarioSelection';
import { InterviewPanel } from '@/components/InterviewPanel';
import { RiskDashboard } from '@/components/RiskDashboard';
import { PatientStatePanel } from '@/components/PatientStatePanel';
import { AgentTracePanel } from '@/components/AgentTracePanel';
import { ContradictionPanel } from '@/components/ContradictionPanel';
import { FinalResult } from '@/components/FinalResult';
import { createInitialState, processAnswer, agentSelectNextQuestion, getCurrentRisk, resolveContradiction } from '@/engine/triageAgent';
import { TOTAL_QUESTIONS } from '@/engine/questionSelector';
import { SCENARIOS } from '@/engine/scenarios';
import { PatientState, Question, Answer, ScenarioTemplate } from '@/types';
import { generateId } from '@/utils/ui';

type AppState = 'selection' | 'interview' | 'complete';

export default function App() {
  const [appState, setAppState] = useState<AppState>('selection');
  const [patientState, setPatientState] = useState<PatientState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answersHistory, setAnswersHistory] = useState<{ question: Question; answer: Answer }[]>([]);
  const [savedScenarios, setSavedScenarios] = useState<ScenarioTemplate[]>([]);

  const riskResult = useMemo(() => {
    if (!patientState) return null;
    return getCurrentRisk(patientState);
  }, [patientState]);

  const handleSelectScenario = useCallback((scenario: ScenarioTemplate) => {
    const patientId = generateId('patient');
    const sessionId = generateId('session');

    const state = createInitialState(patientId, sessionId, scenario.initialState);
    setPatientState(state);

    // Select first question
    const { state: stateWithQuestion, question } = agentSelectNextQuestion(state);
    setPatientState(stateWithQuestion);
    setCurrentQuestion(question);
    setAnswersHistory([]);
    setAppState('interview');
  }, []);

  const handleStartCustom = useCallback(() => {
    const customScenario = SCENARIOS.find((s) => s.id === 'custom')!;
    handleSelectScenario(customScenario);
  }, [handleSelectScenario]);

  const handleSubmitAnswer = useCallback(
    (answer: Answer) => {
      if (!patientState || !currentQuestion) return;

      // Process the answer
      const updatedState = processAnswer(patientState, currentQuestion, answer);
      setAnswersHistory((prev) => [...prev, { question: currentQuestion, answer }]);

      // Select next question
      const { state: stateWithNextQuestion, question: nextQuestion } = agentSelectNextQuestion(updatedState);
      setPatientState(stateWithNextQuestion);
      setCurrentQuestion(nextQuestion);

      // Check if interview is complete
      if (stateWithNextQuestion.interview_complete) {
        setAppState('complete');
      }
    },
    [patientState, currentQuestion]
  );

  const handleResolveContradiction = useCallback(
    (contradictionId: string, keepValue: 'previous' | 'current') => {
      if (!patientState) return;
      const updated = resolveContradiction(patientState, contradictionId, keepValue);
      setPatientState(updated);
    },
    [patientState]
  );

  const handleRestart = useCallback(() => {
    if (patientState) {
      const savedScenario = createSavedScenario(patientState);
      setSavedScenarios((previous) => [
        savedScenario,
        ...previous.filter((scenario) => scenario.id !== savedScenario.id),
      ]);
    }
    setAppState('selection');
    setPatientState(null);
    setCurrentQuestion(null);
    setAnswersHistory([]);
  }, [patientState]);

  // --- Render ---

  if (appState === 'selection') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <DisclaimerBanner />
        </div>
        <ScenarioSelection
          onSelectScenario={handleSelectScenario}
          onStartCustom={handleStartCustom}
          savedScenarios={savedScenarios}
        />
      </div>
    );
  }

  if (appState === 'complete' && patientState && riskResult) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <DisclaimerBanner />
        </div>
        <FinalResult state={patientState} riskResult={riskResult} onRestart={handleRestart} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <AgentTracePanel auditLog={patientState.audit_log} />
        </div>
      </div>
    );
  }

  // Interview view
  if (appState === 'interview' && patientState && riskResult) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <DisclaimerBanner />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          {/* Agent decision loop indicator */}
          <div className="mb-6 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="text-slate-400 uppercase tracking-wide mr-1">Agent Cycle:</span>
              {['Observe', 'Reason', 'Ask', 'Update', 'Detect', 'Recalculate', 'Reassess', 'Route'].map((step, idx) => (
                <span key={step} className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full ${idx < getActiveStep(patientState) ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>
                    {step}
                  </span>
                  {idx < 7 && <span className="text-slate-300">→</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left/center: Interview */}
            <div className="lg:col-span-2 space-y-6">
              <InterviewPanel
                currentQuestion={currentQuestion}
                answersHistory={answersHistory}
                onSubmitAnswer={handleSubmitAnswer}
                interviewComplete={patientState.interview_complete}
                totalQuestions={TOTAL_QUESTIONS}
                questionsAsked={patientState.questions_asked.length}
              />
              <AgentTracePanel auditLog={patientState.audit_log} />
            </div>

            {/* Right: Risk + State + Contradictions */}
            <div className="space-y-6">
              <RiskDashboard
                riskResult={riskResult}
                routingDecision={patientState.routing_decision}
                confidence={patientState.confidence}
                interviewComplete={patientState.interview_complete}
              />
              <ContradictionPanel
                contradictions={patientState.contradictions}
                onResolve={handleResolveContradiction}
              />
              <PatientStatePanel state={patientState} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <DisclaimerBanner />
      </div>
    </div>
  );
}

function getActiveStep(state: PatientState): number {
  // Rough mapping of state to active step
  if (state.interview_complete) return 8;
  if (state.contradictions.some((c) => !c.resolved)) return 5;
  if (state.answers_received.length > 0) return 3;
  return 2;
}

function createSavedScenario(state: PatientState): ScenarioTemplate {
  const clinicalFields: (keyof PatientState)[] = [
    'patient_name',
    'age',
    'symptoms',
    'symptom_severity',
    'symptom_duration',
    'heart_rate',
    'respiratory_rate',
    'oxygen_saturation',
    'temperature',
    'systolic_blood_pressure',
    'diastolic_blood_pressure',
    'consciousness',
    'chest_pain',
    'breathing_difficulty',
    'bleeding',
    'medical_history',
    'medications',
    'allergies',
  ];
  const initialState = Object.fromEntries(
    clinicalFields.map((field) => [field, state[field]])
  ) as Partial<PatientState>;
  const patientName = state.patient_name?.trim() || 'Unnamed Synthetic Patient';

  return {
    id: `saved-${state.patient_id}`,
    name: `${patientName}'s Simulation`,
    description: 'Saved from a completed patient questionnaire.',
    expectedRouting: state.routing_decision,
    expectedRiskLevel: state.risk_level,
    initialState,
  };
}
