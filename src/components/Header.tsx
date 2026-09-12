import { AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-600 text-white shadow-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
                Adaptive Emergency Triage Agent
              </h1>
              <p className="text-xs text-slate-500 leading-tight">
                Autonomous risk assessment and adaptive questioning simulation
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs text-amber-800 font-medium">
              Synthetic simulation — not for real medical use
            </span>
          </div>
        </div>
        <div className="sm:hidden pb-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-xs text-amber-800 font-medium">
              Synthetic simulation — not for real medical use
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export function DisclaimerBanner() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <p className="text-sm text-red-800 leading-relaxed">
        <span className="font-semibold">Important:</span> This system is a synthetic
        research simulation and is not a substitute for professional medical care. In
        a real emergency, contact appropriate emergency services or a qualified
        healthcare professional. All patient data shown is fictional.
      </p>
    </div>
  );
}
