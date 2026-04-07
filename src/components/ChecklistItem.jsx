export default function ChecklistItem({ text, checked, onChange, index }) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(index)}
        className="mt-0.5 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
      />
      <span className={`text-sm leading-relaxed ${checked ? "check-done text-slate-400" : "text-slate-700"}`}>
        {text}
      </span>
    </label>
  );
}
