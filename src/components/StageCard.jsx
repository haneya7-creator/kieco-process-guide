import ChecklistItem from "./ChecklistItem";
import TipCard from "./TipCard";

export default function StageCard({ stage, checkState, onCheck, onPrev, onNext, hasPrev, hasNext }) {
  const total = stage.checklist.length;
  const done = stage.checklist.filter((_, i) => checkState[`stage${String(stage.id).padStart(2, "0")}-${i}`]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{stage.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Stage {String(stage.id).padStart(2, "0")}: {stage.name}
            </h2>
            <p className="text-sm text-slate-500">{stage.subtitle}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>{done}/{total} 완료</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: stage.color }}
            />
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3">
          ✅ 체크리스트
        </h3>
        <div className="space-y-1">
          {stage.checklist.map((item, i) => (
            <ChecklistItem
              key={i}
              text={item}
              index={i}
              checked={!!checkState[`stage${String(stage.id).padStart(2, "0")}-${i}`]}
              onChange={() => onCheck(stage.id, i)}
            />
          ))}
        </div>
      </div>

      {/* Tips */}
      {stage.tips.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3">
            {"��"} 실무 팁 & 주의사항
          </h3>
          <div className="space-y-3">
            {stage.tips.map((tip, i) => (
              <TipCard key={i} type={tip.type} text={tip.text} />
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← 이전 Stage
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          다음 Stage →
        </button>
      </div>
    </div>
  );
}
