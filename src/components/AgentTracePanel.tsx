import { useState } from 'react';
import { ChevronDown, ChevronRight, Terminal, Clock } from 'lucide-react';
import { AuditEvent } from '@/types';
import { formatAuditAction } from '@/engine/auditLog';
import { formatTime } from '@/utils/ui';

interface AgentTracePanelProps {
  auditLog: AuditEvent[];
}

export function AgentTracePanel({ auditLog }: AgentTracePanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Show in reverse order (newest first)
  const events = [...auditLog].reverse();

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-200"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-600" />
          <h3 className="font-bold text-slate-900 text-sm">Agent Trace</h3>
          <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
            {auditLog.length} events
          </span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="max-h-[400px] overflow-y-auto bg-slate-900 p-4 font-mono text-xs">
          {events.length === 0 ? (
            <p className="text-slate-500 italic">No events recorded yet</p>
          ) : (
            <div className="space-y-1">
              {events.map((event) => (
                <div key={event.id} className="flex items-start gap-2 text-slate-300">
                  <span className="text-slate-500 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(event.timestamp)}
                  </span>
                  <span className="text-teal-400 shrink-0 font-semibold">
                    {formatAuditAction(event.action)}
                  </span>
                  {event.reason && (
                    <span className="text-slate-400">— {event.reason}</span>
                  )}
                  {event.riskScoreBefore !== undefined && event.riskScoreAfter !== undefined && (
                    <span className="text-amber-400 shrink-0">
                      [{event.riskScoreBefore} → {event.riskScoreAfter}]
                    </span>
                  )}
                  {event.routingBefore && event.routingAfter && (
                    <span className="text-blue-400 shrink-0">
                      [{event.routingBefore} → {event.routingAfter}]
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
