import { useState, useCallback } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { STAGES } from "./data/stages";
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

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const checkState = activeProjectId ? (allCheckStates[activeProjectId] || {}) : {};

  const handleCheck = useCallback(
    (stageId, itemIndex) => {
      if (!activeProjectId) return;
      const key = `stage${String(stageId).padStart(2, "0")}-${itemIndex}`;
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

  const renderGuideContent = () => {
    if (!activeProjectId) {
      return (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg mb-4">프로젝트를 선택하거나 생성해주세요</p>
          <ProjectManager
            projects={projects}
            activeProjectId={activeProjectId}
            onCreateProject={handleCreateProject}
            onSelectProject={setActiveProjectId}
            onDeleteProject={handleDeleteProject}
          />
        </div>
      );
    }

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
          onSelectPhase={(id) => {
            setActivePhase(id);
            setActiveStage(null);
          }}
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
                프로젝트를 생성하여 4 Phase · 32 Stage 체크리스트를 시작하세요
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
    >
      <div className="pb-20 lg:pb-4">{renderContent()}</div>
    </Layout>
  );
}
