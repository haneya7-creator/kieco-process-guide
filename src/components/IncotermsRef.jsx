import { INCOTERMS } from "../data/incoterms";

const GROUP_COLORS = {
  E: "bg-red-100 text-red-700",
  F: "bg-orange-100 text-orange-700",
  C: "bg-blue-100 text-blue-700",
  D: "bg-green-100 text-green-700",
};

export default function IncotermsRef() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Incoterms 2020 퀵 레퍼런스</h2>
      <div className="space-y-3">
        {INCOTERMS.map((term) => (
          <div key={term.code} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${GROUP_COLORS[term.group]}`}>
                {term.code}
              </span>
              <span className="text-sm font-semibold text-slate-800">{term.name}</span>
            </div>
            <p className="text-sm text-slate-600 mb-2">{term.desc}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 rounded p-2">
                <span className="font-bold text-slate-500">매도인</span>
                <p className="text-slate-700 mt-0.5">{term.sellerObligation}</p>
              </div>
              <div className="bg-slate-50 rounded p-2">
                <span className="font-bold text-slate-500">매수인</span>
                <p className="text-slate-700 mt-0.5">{term.buyerObligation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
