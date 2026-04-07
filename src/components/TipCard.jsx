const STYLES = {
  tip: {
    bg: "bg-blue-50 border-blue-200",
    icon: "💡",
    label: "실무 팁",
    text: "text-blue-800",
  },
  warn: {
    bg: "bg-red-50 border-red-200",
    icon: "⚠️",
    label: "주의",
    text: "text-red-800",
  },
  kieco: {
    bg: "bg-slate-100 border-slate-300",
    icon: "🏢",
    label: "KIECO",
    text: "text-slate-700",
  },
};

export default function TipCard({ type, text }) {
  const s = STYLES[type] || STYLES.tip;
  return (
    <div className={`${s.bg} border rounded-lg p-3 ${s.text}`}>
      <div className="flex items-start gap-2">
        <span className="text-lg shrink-0">{s.icon}</span>
        <div>
          <span className="text-xs font-bold uppercase tracking-wide opacity-70">{s.label}</span>
          <p className="text-sm mt-0.5 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}
