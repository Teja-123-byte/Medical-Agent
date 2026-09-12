import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, CheckCircle2, Loader2 } from 'lucide-react';
import { Question, Answer } from '@/types';
import { parseAnswer } from '@/engine/triageAgent';

interface InterviewPanelProps {
  currentQuestion: Question | null;
  answersHistory: { question: Question; answer: Answer }[];
  onSubmitAnswer: (answer: Answer) => void;
  interviewComplete: boolean;
  totalQuestions: number;
  questionsAsked: number;
}

export function InterviewPanel({
  currentQuestion,
  answersHistory,
  onSubmitAnswer,
  interviewComplete,
  totalQuestions,
  questionsAsked,
}: InterviewPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [answersHistory, currentQuestion]);

  // Reset input when question changes
  useEffect(() => {
    setInputValue('');
  }, [currentQuestion?.id]);

  const handleSubmit = () => {
    if (!currentQuestion || !inputValue.trim()) return;

    // Validate numeric input
    if (currentQuestion.answerType === 'numeric') {
      const num = parseFloat(inputValue);
      if (isNaN(num)) return;
      if (currentQuestion.min !== undefined && num < currentQuestion.min) return;
      if (currentQuestion.max !== undefined && num > currentQuestion.max) return;
    }

    const answer = parseAnswer(currentQuestion, inputValue.trim());
    onSubmitAnswer(answer);
  };

  const handleChoiceSelect = (value: string) => {
    if (!currentQuestion) return;
    const answer = parseAnswer(currentQuestion, value);
    onSubmitAnswer(answer);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentQuestion?.answerType !== 'choice') {
      handleSubmit();
    }
  };

  const progress = totalQuestions > 0 ? (questionsAsked / totalQuestions) * 100 : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-900 text-sm">Patient Interview</h3>
          <span className="text-xs text-slate-400 font-medium">
            {questionsAsked} / {totalQuestions} questions
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[300px] max-h-[500px]">
        {answersHistory.map((entry, idx) => (
          <div key={idx} className="space-y-2">
            {/* Question bubble */}
            <div className="flex items-start gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-100 text-teal-700 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg rounded-tl-sm px-3.5 py-2.5 max-w-[80%]">
                <p className="text-sm text-slate-700">{entry.question.prompt}</p>
              </div>
            </div>
            {/* Answer bubble */}
            <div className="flex items-start gap-2.5 justify-end">
              <div className="bg-teal-600 text-white rounded-lg rounded-tr-sm px-3.5 py-2.5 max-w-[80%]">
                <p className="text-sm font-medium">{entry.answer.displayValue}</p>
              </div>
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-500 shrink-0">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}

        {/* Current question */}
        {currentQuestion && !interviewComplete && (
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-100 text-teal-700 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg rounded-tl-sm px-3.5 py-2.5 max-w-[80%]">
                <p className="text-sm text-slate-700">{currentQuestion.prompt}</p>
              </div>
            </div>

            {/* Answer input area */}
            <div className="pl-9 space-y-3">
              {currentQuestion.answerType === 'choice' && currentQuestion.options ? (
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleChoiceSelect(opt.value)}
                      className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type={currentQuestion.answerType === 'numeric' ? 'number' : 'text'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={currentQuestion.placeholder ?? ''}
                    min={currentQuestion.min}
                    max={currentQuestion.max}
                    autoFocus
                    className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!inputValue.trim()}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Submit</span>
                  </button>
                </div>
              )}
              {currentQuestion.unit && currentQuestion.answerType === 'numeric' && (
                <p className="text-xs text-slate-400">Unit: {currentQuestion.unit}</p>
              )}
            </div>
          </div>
        )}

        {/* Interview complete */}
        {interviewComplete && (
          <div className="flex items-center justify-center gap-2 py-6">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600">Interview complete</span>
          </div>
        )}

        {!currentQuestion && !interviewComplete && answersHistory.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-12 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Initializing agent…</span>
          </div>
        )}
      </div>
    </div>
  );
}
