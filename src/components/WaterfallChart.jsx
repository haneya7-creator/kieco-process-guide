export default function WaterfallChart({ items, total }) {
  if (!items || items.length === 0) return null;

  const maxVal = total;
  const chartW = 600;
  const chartH = 320;
  const marginL = 10;
  const marginR = 10;
  const marginT = 20;
  const marginB = 80;
  const barW = Math.min(40, (chartW - marginL - marginR) / (items.length + 1) - 8);
  const usableW = chartW - marginL - marginR;
  const usableH = chartH - marginT - marginB;

  let cumulative = 0;
  const bars = items.map((item, i) => {
    const x = marginL + (i / (items.length + 1)) * usableW + barW / 2;
    const val = item.value;
    const h = (val / maxVal) * usableH;
    const y = chartH - marginB - (cumulative / maxVal) * usableH - h;
    const bar = { x, y, w: barW, h, val, label: item.label, color: item.color, cumY: cumulative };
    cumulative += val;
    return bar;
  });

  // Total bar
  const totalBar = {
    x: marginL + (items.length / (items.length + 1)) * usableW + barW / 2,
    y: chartH - marginB - (cumulative / maxVal) * usableH,
    w: barW,
    h: (cumulative / maxVal) * usableH,
    val: cumulative,
    label: "최종 견적가",
    color: "#1e293b",
  };

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ maxHeight: 320 }}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((pct) => (
        <line
          key={pct}
          x1={marginL}
          x2={chartW - marginR}
          y1={chartH - marginB - pct * usableH}
          y2={chartH - marginB - pct * usableH}
          stroke="#e2e8f0"
          strokeWidth={0.5}
        />
      ))}
      {/* Baseline */}
      <line
        x1={marginL}
        x2={chartW - marginR}
        y1={chartH - marginB}
        y2={chartH - marginB}
        stroke="#94a3b8"
        strokeWidth={1}
      />

      {/* Bars */}
      {bars.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={Math.max(b.h, 1)} fill={b.color} rx={3} />
          {/* Connector line */}
          {i < bars.length - 1 && (
            <line
              x1={b.x + b.w}
              x2={bars[i + 1].x}
              y1={b.y}
              y2={b.y}
              stroke="#94a3b8"
              strokeWidth={0.5}
              strokeDasharray="3,2"
            />
          )}
          {/* Value label */}
          {b.val > 0 && (
            <text x={b.x + b.w / 2} y={b.y - 4} textAnchor="middle" fontSize={8} fill="#475569" fontWeight="600">
              {(b.val / 1e6).toFixed(0)}M
            </text>
          )}
          {/* Bottom label */}
          <text
            x={b.x + b.w / 2}
            y={chartH - marginB + 12}
            textAnchor="middle"
            fontSize={7}
            fill="#64748b"
            transform={`rotate(45 ${b.x + b.w / 2} ${chartH - marginB + 12})`}
          >
            {b.label}
          </text>
        </g>
      ))}

      {/* Total bar */}
      <g>
        <rect x={totalBar.x} y={totalBar.y} width={totalBar.w} height={totalBar.h} fill={totalBar.color} rx={3} />
        <text x={totalBar.x + totalBar.w / 2} y={totalBar.y - 4} textAnchor="middle" fontSize={9} fill="#1e293b" fontWeight="700">
          {(totalBar.val / 1e6).toFixed(0)}M
        </text>
        <text
          x={totalBar.x + totalBar.w / 2}
          y={chartH - marginB + 12}
          textAnchor="middle"
          fontSize={7}
          fill="#1e293b"
          fontWeight="600"
          transform={`rotate(45 ${totalBar.x + totalBar.w / 2} ${chartH - marginB + 12})`}
        >
          {totalBar.label}
        </text>
      </g>
    </svg>
  );
}
