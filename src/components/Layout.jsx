import { useState } from "react";
import { PHASES } from "../data/phases";
import { STAGES } from "../data/stages";

const NAV_ITEMS = [
  { id: "dashboard", label: "대시보드", icon: "📊" },
  { id: "guide", label: "프로세스 가이드", icon: "📋" },
  { id: "calc", label: "마진 계산기", icon: "💰" },
  { id: "incoterms", label: "Incoterms", icon: "🌍" },
];

export default function Layout({
  children,
  currentView,
  onChangeView,
  activePhase,
  onSelectPhase,
  activeStage,
  onSelectStage,
  checkState,
  projectName,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 text-white px-4 py-3 flex items-center gap-3 z-50 shadow-lg shrink-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden text-xl"
        >
          ☰
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">KIECO</span>
          <span className="hidden sm:inline text-sm text-slate-400">· 장비 영업 프로세스 가이드</span>
        </div>
        {projectName && (
          <span className="ml-auto text-xs bg-slate-700 px-3 py-1 rounded-full">{projectName}</span>
        )}
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 shadow-lg transform transition-transform lg:relative lg:translate-x-0 lg:shadow-none pt-14 lg:pt-0 overflow-y-auto ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/30 lg:hidden z-[-1]"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="p-4 space-y-4">
            {/* Nav items */}
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onChangeView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    currentView === item.id
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Phase / Stage tree (only in guide view) */}
            {currentView === "guide" && (
              <div className="border-t border-slate-200 pt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stages</p>
                {PHASES.map((phase) => {
                  const stages = STAGES.filter((s) => s.phase === phase.id);
                  const isActive = activePhase === phase.id;

                  return (
                    <div key={phase.id} className="mb-3">
                      <button
                        onClick={() => {
                          onSelectPhase(phase.id);
                          onSelectStage(null);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs font-bold transition-colors ${
                          isActive ? "text-white" : "text-slate-600 hover:bg-slate-50"
                        }`}
                        style={isActive ? { backgroundColor: phase.color } : undefined}
                      >
                        P{phase.id} {phase.name}
                      </button>
                      {isActive && (
                        <div className="mt-1 ml-2 space-y-0.5">
                          {stages.map((stage) => {
                            const total = stage.checklist.length;
                            const done = stage.checklist.filter(
                              (_, i) => checkState[`stage${String(stage.id).padStart(2, "0")}-${i}`]
                            ).length;
                            const isStageActive = activeStage === stage.id;
                            const isComplete = done === total;

                            return (
                              <button
                                key={stage.id}
                                onClick={() => {
                                  onSelectStage(stage.id);
                                  setSidebarOpen(false);
                                }}
                                className={`w-full text-left px-2 py-1 rounded text-xs flex items-center gap-1.5 transition-colors ${
                                  isStageActive
                                    ? "bg-slate-100 font-semibold text-slate-900"
                                    : "text-slate-500 hover:bg-slate-50"
                                }`}
                              >
                                {isComplete ? (
                                  <span className="text-green-500">✓</span>
                                ) : (
                                  <span className="text-slate-300">○</span>
                                )}
                                <span className="truncate">{String(stage.id).padStart(2,"0")}. {stage.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex z-40">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`flex-1 py-3 text-center text-xs ${
              currentView === item.id ? "text-blue-600 font-semibold" : "text-slate-500"
            }`}
          >
            <div className="text-lg">{item.icon}</div>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
