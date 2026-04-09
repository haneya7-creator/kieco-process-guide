import { PHASES } from "../data/phases";
import { STAGES } from "../data/stages";
import { QUOT_PHASES } from "../data/quotationPhases";
import { QUOT_STAGES } from "../data/quotationStages";

function calcProgress(stages, checkState, keyPrefix) {
  const total = stages.reduce((sum, s) => sum + s.checklist.length, 0);
  const done = stages.reduce(
    (sum, s) =>
      sum + s.checklist.filter((_, i) => checkState[`${keyPrefix}${String(s.id).padStart(2, "0")}-${i}`]).length,
    0
  );
  return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function findNextTodo(stages, checkState, keyPrefix) {
  for (const stage of stages) {
    for (let i = 0; i < stage.checklist.length; i++) {
      if (!checkState[`${keyPrefix}${String(stage.id).padStart(2, "0")}-${i}`]) {
        return { stage, item: stage.checklist[i] };
      }
    }
  }
  return null;
}

function PhaseGrid({ phases, allStages, checkState, keyPrefix }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {phases.map((phase) => {
        const stages = allStages.filter((s) => s.phase === phase.id);
        const { total, done, pct } = calcProgress(stages, checkState, keyPrefix);
        const completedStages = stages.filter((s) =>
          s.checklist.every((_, i) => checkState[`${keyPrefix}${String(s.id).padStart(2, "0")}-${i}`])
        ).length;

        return (
          <div key={phase.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{phase.icon}</span>
              <div>
                <p className="text-xs font-bold" style={{ color: phase.color }}>
                  PHASE {phase.id}
                </p>
                <p className="text-sm font-semibold text-slate-800">{phase.name}</p>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{done}/{total} 항목</span>
                <span>{pct}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: phase.color }}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              {completedStages}/{stages.length} Stage 완료
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function ProgressDashboard({ checkState }) {
  const guide = calcProgress(STAGES, checkState, "stage");
  const quot = calcProgress(QUOT_STAGES, checkState, "quot");
  const totalAll = guide.total + quot.total;
  const doneAll = guide.done + quot.done;
  const pctAll = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0;

  const guideNext = findNextTodo(STAGES, checkState, "stage");
  const quotNext = findNextTodo(QUOT_STAGES, checkState, "quot");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Overall */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">전체 진행률</h2>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1 bg-slate-200 rounded-full h-4">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 transition-all duration-700"
              style={{ width: `${pctAll}%` }}
            />
          </div>
          <span className="text-2xl font-bold text-slate-800">{pctAll}%</span>
        </div>
        <p className="text-sm text-slate-500">{doneAll} / {totalAll} 항목 완료</p>
      </div>

      {/* Guide section */}
      <div>
        <h3 className="text-sm font-bold text-slate-600 mb-3 flex items-center gap-2">
          <span>📋</span> 장비 영업 프로세스 가이드
          <span className="text-xs font-normal text-slate-400">({guide.done}/{guide.total})</span>
        </h3>
        <PhaseGrid phases={PHASES} allStages={STAGES} checkState={checkState} keyPrefix="stage" />
      </div>

      {guideNext && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="text-sm font-bold text-amber-800 mb-2">다음 할 일 (장비 영업)</h3>
          <p className="text-xs text-amber-600 mb-1">
            Stage {String(guideNext.stage.id).padStart(2, "0")}: {guideNext.stage.name}
          </p>
          <p className="text-sm text-amber-900">{guideNext.item}</p>
        </div>
      )}

      {/* Quotation section */}
      <div>
        <h3 className="text-sm font-bold text-slate-600 mb-3 flex items-center gap-2">
          <span>📝</span> 내자견적 작성 프로세스
          <span className="text-xs font-normal text-slate-400">({quot.done}/{quot.total})</span>
        </h3>
        <PhaseGrid phases={QUOT_PHASES} allStages={QUOT_STAGES} checkState={checkState} keyPrefix="quot" />
      </div>

      {quotNext && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <h3 className="text-sm font-bold text-indigo-800 mb-2">다음 할 일 (내자견적)</h3>
          <p className="text-xs text-indigo-600 mb-1">
            Stage {String(quotNext.stage.id).padStart(2, "0")}: {quotNext.stage.name}
          </p>
          <p className="text-sm text-indigo-900">{quotNext.item}</p>
        </div>
      )}
    </div>
  );
}
