import { PHASES } from "../data/phases";
import { STAGES } from "../data/stages";

export default function PhaseNav({ activePhase, onSelectPhase, checkState }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {PHASES.map((phase) => {
        const stages = STAGES.filter((s) => s.phase === phase.id);
        const totalChecks = stages.reduce((sum, s) => sum + s.checklist.length, 0);
        const doneChecks = stages.reduce(
          (sum, s) =>
            sum +
            s.checklist.filter(
              (_, i) => checkState[`stage${String(s.id).padStart(2, "0")}-${i}`]
            ).length,
          0
        );
        const pct = totalChecks > 0 ? Math.round((doneChecks / totalChecks) * 100) : 0;
        const isActive = activePhase === phase.id;

        return (
          <button
            key={phase.id}
            onClick={() => onSelectPhase(phase.id)}
            className={`flex-shrink-0 px-4 py-3 rounded-xl text-left transition-all border-2 ${
              isActive
                ? "shadow-lg scale-[1.02]"
                : "border-transparent hover:border-slate-200 bg-white"
            }`}
            style={
              isActive
                ? { borderColor: phase.color, backgroundColor: `${phase.color}10` }
                : undefined
            }
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{phase.icon}</span>
              <span className="text-xs font-bold" style={{ color: phase.color }}>
                PHASE {phase.id}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800 whitespace-nowrap">{phase.name}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-16 bg-slate-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: phase.color }}
                />
              </div>
              <span className="text-xs text-slate-500">{pct}%</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
