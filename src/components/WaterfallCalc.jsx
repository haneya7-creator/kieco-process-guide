import { useState } from "react";
import { MAKERS } from "../data/makers";
import { INCOTERMS } from "../data/incoterms";
import WaterfallChart from "./WaterfallChart";

const DEFAULT = {
  maker: "visiconsult",
  quoteAmount: 100000,
  fxRate: 1450,
  fxBuffer: 3,
  freight: 5000000,
  insurance: 1000000,
  dutyRate: 0,
  withholdingRate: 0,
  grossUp: false,
  margin: 20,
  brokerFee: 0,
  incoterm: "EXW",
  otherCosts: 0,
};

function fmt(n) {
  return new Intl.NumberFormat("ko-KR").format(Math.round(n));
}

export default function WaterfallCalc() {
  const [v, setV] = useState(DEFAULT);

  const maker = MAKERS.find((m) => m.id === v.maker);
  const isFTA = maker && maker.origin === "DE";

  // Calculations
  const baseKRW = v.quoteAmount * v.fxRate;
  const fxBufferAmt = baseKRW * (v.fxBuffer / 100);
  const costWithFx = baseKRW + fxBufferAmt;

  const needsFreight = ["EXW", "FCA", "FAS", "FOB"].includes(v.incoterm);
  const freight = needsFreight ? v.freight : 0;
  const insurance = ["EXW", "FCA", "FAS", "FOB", "CFR", "CPT"].includes(v.incoterm) ? v.insurance : 0;

  const cifValue = costWithFx + freight + insurance;
  const effectiveDutyRate = isFTA ? 0 : v.dutyRate;
  const dutyAmt = cifValue * (effectiveDutyRate / 100);
  const vatBase = cifValue + dutyAmt;
  const vat = vatBase * 0.1;

  let withholdingAmt = 0;
  if (v.withholdingRate > 0) {
    if (v.grossUp) {
      withholdingAmt = (baseKRW / (1 - v.withholdingRate / 100)) * (v.withholdingRate / 100);
    } else {
      withholdingAmt = baseKRW * (v.withholdingRate / 100);
    }
  }

  const totalCost = cifValue + dutyAmt + withholdingAmt + v.otherCosts;
  const marginAmt = totalCost * (v.margin / 100);
  const brokerAmt = v.brokerFee;
  const finalPrice = totalCost + marginAmt + brokerAmt;
  const netMarginPct = finalPrice > 0 ? ((marginAmt - brokerAmt) / finalPrice) * 100 : 0;

  // Health
  let health, healthColor, healthBg;
  if (netMarginPct >= 15) {
    health = "건전"; healthColor = "text-green-700"; healthBg = "bg-green-50 border-green-200";
  } else if (netMarginPct >= 10) {
    health = "주의"; healthColor = "text-yellow-700"; healthBg = "bg-yellow-50 border-yellow-200";
  } else {
    health = "위험"; healthColor = "text-red-700"; healthBg = "bg-red-50 border-red-200";
  }

  // Waterfall items
  const waterfallItems = [
    { label: "제조사 원가", value: baseKRW, color: "#3b82f6" },
    { label: "FX Buffer", value: fxBufferAmt, color: "#6366f1" },
    { label: "운송비", value: freight, color: "#8b5cf6" },
    { label: "보험료", value: insurance, color: "#a78bfa" },
    { label: "관세", value: dutyAmt, color: "#c084fc" },
    { label: "원천세", value: withholdingAmt, color: "#dc2626" },
    { label: "기타 비용", value: v.otherCosts, color: "#94a3b8" },
    { label: "KIECO 마진", value: marginAmt, color: "#059669" },
    { label: "브로커 수수료", value: brokerAmt, color: "#d97706" },
  ].filter((i) => i.value > 0);

  const up = (field, val) => setV((p) => ({ ...p, [field]: val }));

  const InputRow = ({ label, field, suffix, type = "number", step }) => (
    <div className="flex items-center gap-3">
      <label className="text-sm text-slate-600 w-32 shrink-0">{label}</label>
      <div className="flex-1 flex items-center gap-1">
        <input
          type={type}
          value={v[field]}
          step={step}
          onChange={(e) => up(field, type === "number" ? Number(e.target.value) : e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {suffix && <span className="text-xs text-slate-400 shrink-0">{suffix}</span>}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-lg font-bold text-slate-800">마진 워터폴 계산기</h2>

      {/* Inputs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600 w-32 shrink-0">제조사</label>
          <select
            value={v.maker}
            onChange={(e) => up("maker", e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {MAKERS.map((m) => (
              <option key={m.id} value={m.id}>{m.name} ({m.currency})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600 w-32 shrink-0">Incoterms</label>
          <select
            value={v.incoterm}
            onChange={(e) => up("incoterm", e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {INCOTERMS.map((t) => (
              <option key={t.code} value={t.code}>{t.code} — {t.name}</option>
            ))}
          </select>
        </div>

        <InputRow label={`견적금액 (${maker?.currency || "EUR"})`} field="quoteAmount" />
        <InputRow label="환율 (KRW)" field="fxRate" />
        <InputRow label="FX Buffer" field="fxBuffer" suffix="%" step={0.5} />
        <InputRow label="운송비 (KRW)" field="freight" />
        <InputRow label="보험료 (KRW)" field="insurance" />
        <InputRow label="관세율" field="dutyRate" suffix="%" step={0.5} />
        {isFTA && (
          <p className="text-xs text-green-600 ml-35 pl-1">한-EU FTA 적용: 관세 0%</p>
        )}
        <InputRow label="원천세율" field="withholdingRate" suffix="%" step={0.5} />
        {v.withholdingRate > 0 && (
          <div className="flex items-center gap-3 ml-35">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={v.grossUp}
                onChange={(e) => up("grossUp", e.target.checked)}
                className="rounded"
              />
              Gross-up (KIECO 부담)
            </label>
          </div>
        )}
        <InputRow label="KIECO 마진" field="margin" suffix="%" step={0.5} />
        <InputRow label="브로커 수수료 (KRW)" field="brokerFee" />
        <InputRow label="기타 비용 (KRW)" field="otherCosts" />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-600 mb-3">비용 워터폴</h3>
        <WaterfallChart items={waterfallItems} total={finalPrice} />
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-600 mb-3">비용 구조 요약</h3>
        <table className="w-full text-sm">
          <tbody>
            {[
              ["제조사 원가", baseKRW, (baseKRW / finalPrice * 100)],
              ["FX Buffer (" + v.fxBuffer + "%)", fxBufferAmt, (fxBufferAmt / finalPrice * 100)],
              ["운송비", freight, (freight / finalPrice * 100)],
              ["보험료", insurance, (insurance / finalPrice * 100)],
              ["관세 (" + effectiveDutyRate + "%)" + (isFTA ? " [FTA]" : ""), dutyAmt, (dutyAmt / finalPrice * 100)],
              ["원천세" + (v.grossUp ? " (Gross-up)" : ""), withholdingAmt, (withholdingAmt / finalPrice * 100)],
              ["기타 비용", v.otherCosts, (v.otherCosts / finalPrice * 100)],
              ["KIECO 마진 (" + v.margin + "%)", marginAmt, (marginAmt / finalPrice * 100)],
              ["브로커 수수료", brokerAmt, (brokerAmt / finalPrice * 100)],
            ].map(([label, val, pct], i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-2 text-slate-600">{label}</td>
                <td className="py-2 text-right font-mono text-slate-800">₩ {fmt(val)}</td>
                <td className="py-2 text-right text-slate-400 w-16">{pct.toFixed(1)}%</td>
              </tr>
            ))}
            <tr className="border-t-2 border-slate-300 font-bold">
              <td className="py-3 text-slate-800">최종 견적가 (VAT별도)</td>
              <td className="py-3 text-right font-mono text-slate-900">₩ {fmt(finalPrice)}</td>
              <td className="py-3 text-right text-slate-400">100%</td>
            </tr>
            <tr className="text-slate-500">
              <td className="py-2">부가세 (10%)</td>
              <td className="py-2 text-right font-mono">₩ {fmt(vat)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Margin Health */}
      <div className={`rounded-xl border p-4 ${healthBg}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{netMarginPct >= 15 ? "✅" : netMarginPct >= 10 ? "⚠️" : "🚨"}</span>
          <div>
            <p className={`text-sm font-bold ${healthColor}`}>마진 건전성: {health}</p>
            <p className={`text-xs ${healthColor} opacity-80`}>
              순마진율 {netMarginPct.toFixed(1)}%
              {netMarginPct < 10 && " — 마진 재검토 필요"}
              {netMarginPct >= 10 && netMarginPct < 15 && " — 마진 개선 검토"}
              {netMarginPct >= 15 && " — 적정 마진 확보"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
