import { STAGES } from "../data/stages";

export default function StageList({ phaseId, checkState, onSelectStage, stages, keyPrefix = "stage" }) {
  const st = stages || STAGES;
  const phaseStages = st.filter((s) => s.phase === phaseId);

  return (
    <div className="space-y-3">
      {phaseStages.map((stage) => {
        const total = stage.checklist.length;
        const done = stage.checklist.filter(
          (_, i) => checkState[`${keyPrefix}${String(stage.id).padStart(2, "0")}-${i}`]
        ).length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        const isComplete = done === total;

        return (
          <button
            key={stage.id}
            onClick={() => onSelectStage(stage.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all hover:shadow-md ${
              isComplete
                ? "bg-green-50 border-green-200"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stage.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">
                    {String(stage.id).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-800 truncate">{stage.name}</h3>
                  {isComplete && <span className="text-green-500 text-sm">✓</span>}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{stage.subtitle}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isComplete ? "#22c55e" : stage.color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 w-12 text-right">{done}/{total}</span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
