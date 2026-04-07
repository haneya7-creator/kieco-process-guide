import { useState } from "react";
import { MAKERS } from "../data/makers";

export default function ProjectManager({ projects, activeProjectId, onCreateProject, onSelectProject, onDeleteProject }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", maker: "", customer: "", memo: "" });

  const handleCreate = () => {
    if (!form.name.trim()) return;
    onCreateProject({
      id: `proj-${Date.now()}`,
      name: form.name.trim(),
      maker: form.maker,
      customer: form.customer.trim(),
      memo: form.memo.trim(),
      createdAt: new Date().toISOString(),
    });
    setForm({ name: "", maker: "", customer: "", memo: "" });
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-600">프로젝트</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          + 새 프로젝트
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg space-y-2">
          <input
            type="text"
            placeholder="프로젝트명 *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={form.maker}
            onChange={(e) => setForm({ ...form, maker: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">제조사 선택</option>
            {MAKERS.map((m) => (
              <option key={m.id} value={m.id}>{m.name} ({m.domain})</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="고객사명"
            value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="메모"
            value={form.memo}
            onChange={(e) => setForm({ ...form, memo: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={!form.name.trim()}
              className="flex-1 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              생성
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {projects.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">프로젝트를 생성해주세요</p>
        )}
        {projects.map((p) => {
          const maker = MAKERS.find((m) => m.id === p.maker);
          return (
            <div
              key={p.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                p.id === activeProjectId
                  ? "border-blue-300 bg-blue-50"
                  : "border-transparent hover:bg-slate-50"
              }`}
              onClick={() => onSelectProject(p.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                <p className="text-xs text-slate-500">
                  {maker ? maker.name : ""} {p.customer ? `· ${p.customer}` : ""}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`"${p.name}" 프로젝트를 삭제하시겠습니까?`)) {
                    onDeleteProject(p.id);
                  }
                }}
                className="text-slate-300 hover:text-red-500 transition-colors text-lg"
                title="삭제"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
