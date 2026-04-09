import { useState, useCallback } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { STAGES } from "./data/stages";
import { QUOT_PHASES } from "./data/quotationPhases";
import { QUOT_STAGES } from "./data/quotationStages";
import Layout from "./components/Layout";
import PhaseNav from "./components/PhaseNav";
import StageList from "./components/StageList";
import StageCard from "./components/StageCard";
import ProjectManager from "./components/ProjectManager";
import ProgressDashboard from "./components/ProgressDashboard";
import WaterfallCalc from "./components/WaterfallCalc";
import IncotermsRef from "./components/IncotermsRef";

export default function App() {
  const [projects, setProjects] = useLocalStorage("kieco-projects", []);
  const [activeProjectId, setActiveProjectId] = useLocalStorage("kieco-active-project", null);
  const [allCheckStates, setAllCheckStates] = useLocalStorage("kieco-check-states", {});

  const [currentView, setCurrentView] = useState("dashboard");
  const [activePhase, setActivePhase] = useState(1);
  const [activeStage, setActiveStage] = useState(null);

  // Quotation guide state
  const [activeQuotPhase, setActiveQuotPhase] = useState(1);
  const [activeQuotStage, setActiveQuotStage] = useState(null);

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const checkState = activeProjectId ? (allCheckStates[activeProjectId] || {}) : {};

  const makeCheckHandler = useCallback(
    (prefix) => (stageId, itemIndex) => {
      if (!activeProjectId) return;
      const key = `${prefix}${String(stageId).padStart(2, "0")}-${itemIndex}`;
      setAllCheckStates((prev) => ({
        ...prev,
        [activeProjectId]: {
          ...(prev[activeProjectId] || {}),
          [key]: !(prev[activeProjectId] || {})[key],
        },
      }));
    },
    [activeProjectId, setAllCheckStates]
  );

  const handleCheck = makeCheckHandler("stage");
  const handleQuotCheck = makeCheckHandler("quot");

  const handleCreateProject = (project) => {
    setProjects((prev) => [...prev, project]);
    setActiveProjectId(project.id);
  };

  const handleDeleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProjectId === id) {
      setActiveProjectId(projects.length > 1 ? projects.find((p) => p.id !== id)?.id : null);
    }
    setAllCheckStates((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const stage = activeStage ? STAGES.find((s) => s.id === activeStage) : null;
  const stageIndex = stage ? STAGES.findIndex((s) => s.id === activeStage) : -1;

  const quotStage = activeQuotStage ? QUOT_STAGES.find((s) => s.id === activeQuotStage) : null;
  const quotStageIndex = quotStage ? QUOT_STAGES.findIndex((s) => s.id === activeQuotStage) : -1;

  const renderNoProject = (msg) => (
    <div className="text-center py-12">
      <p className="text-slate-400 text-lg mb-4">{msg || "프로젝트를 선택하거나 생성해주세요"}</p>
      <ProjectManager
        projects={projects}
        activeProjectId={activeProjectId}
        onCreateProject={handleCreateProject}
        onSelectProject={setActiveProjectId}
        onDeleteProject={handleDeleteProject}
      />
    </div>
  );

  const renderGuideContent = () => {
    if (!activeProjectId) return renderNoProject();

    if (activeStage) {
      return (
        <StageCard
          stage={stage}
          checkState={checkState}
          onCheck={handleCheck}
          onPrev={() => stageIndex > 0 && setActiveStage(STAGES[stageIndex - 1].id)}
          onNext={() => stageIndex < STAGES.length - 1 && setActiveStage(STAGES[stageIndex + 1].id)}
          hasPrev={stageIndex > 0}
          hasNext={stageIndex < STAGES.length - 1}
        />
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <PhaseNav
          activePhase={activePhase}
          onSelectPhase={(id) => { setActivePhase(id); setActiveStage(null); }}
          checkState={checkState}
        />
        <StageList
          phaseId={activePhase}
          checkState={checkState}
          onSelectStage={setActiveStage}
        />
      </div>
    );
  };

  const renderQuotationContent = () => {
    if (!activeProjectId) return renderNoProject();

    if (activeQuotStage) {
      return (
        <StageCard
          stage={quotStage}
          checkState={checkState}
          onCheck={handleQuotCheck}
          keyPrefix="quot"
          onPrev={() => quotStageIndex > 0 && setActiveQuotStage(QUOT_STAGES[quotStageIndex - 1].id)}
          onNext={() => quotStageIndex < QUOT_STAGES.length - 1 && setActiveQuotStage(QUOT_STAGES[quotStageIndex + 1].id)}
          hasPrev={quotStageIndex > 0}
          hasNext={quotStageIndex < QUOT_STAGES.length - 1}
        />
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-2">
          <p className="text-sm text-indigo-800 font-semibold">내자견적 작성 프로세스</p>
          <p className="text-xs text-indigo-600 mt-1">Inter-company (유럽 제조사 → Illies GmbH → KIECO → 한국 최종고객) 내자견적 전용</p>
        </div>
        <PhaseNav
          activePhase={activeQuotPhase}
          onSelectPhase={(id) => { setActiveQuotPhase(id); setActiveQuotStage(null); }}
          checkState={checkState}
          phases={QUOT_PHASES}
          stages={QUOT_STAGES}
          keyPrefix="quot"
        />
        <StageList
          phaseId={activeQuotPhase}
          checkState={checkState}
          onSelectStage={setActiveQuotStage}
          stages={QUOT_STAGES}
          keyPrefix="quot"
        />
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return activeProjectId ? (
          <ProgressDashboard checkState={checkState} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-bold text-slate-800 mb-2">KIECO 장비 영업 프로세스 가이드</h2>
              <p className="text-sm text-slate-500 mb-6">
                프로젝트를 생성하여 체크리스트를 시작하세요
              </p>
            </div>
            <ProjectManager
              projects={projects}
              activeProjectId={activeProjectId}
              onCreateProject={handleCreateProject}
              onSelectProject={setActiveProjectId}
              onDeleteProject={handleDeleteProject}
            />
          </div>
        );
      case "guide":
        return renderGuideContent();
      case "quotation":
        return renderQuotationContent();
      case "calc":
        return <WaterfallCalc />;
      case "incoterms":
        return <IncotermsRef />;
      default:
        return null;
    }
  };

  return (
    <Layout
      currentView={currentView}
      onChangeView={(v) => {
        setCurrentView(v);
        if (v === "guide") setActiveStage(null);
        if (v === "quotation") setActiveQuotStage(null);
      }}
      activePhase={activePhase}
      onSelectPhase={(id) => {
        setActivePhase(id);
        setActiveStage(null);
        setCurrentView("guide");
      }}
      activeStage={activeStage}
      onSelectStage={(id) => {
        setActiveStage(id);
        if (id) {
          const s = STAGES.find((s) => s.id === id);
          if (s) setActivePhase(s.phase);
        }
        setCurrentView("guide");
      }}
      checkState={checkState}
      projectName={activeProject?.name}
      activeQuotPhase={activeQuotPhase}
      onSelectQuotPhase={(id) => {
        setActiveQuotPhase(id);
        setActiveQuotStage(null);
        setCurrentView("quotation");
      }}
      activeQuotStage={activeQuotStage}
      onSelectQuotStage={(id) => {
        setActiveQuotStage(id);
        if (id) {
          const s = QUOT_STAGES.find((s) => s.id === id);
          if (s) setActiveQuotPhase(s.phase);
        }
        setCurrentView("quotation");
      }}
    >
      <div className="pb-20 lg:pb-4">{renderContent()}</div>
    </Layout>
  );
}
