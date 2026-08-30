// GitHub-style activity heatmap: one column per week, one cell per day.
const CELL = 12;
const GAP = 3;

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function Heatmap({
  data,
  weeks = 53,
}: {
  data: Record<string, number>; // date -> seconds
  weeks?: number;
}) {
  const today = new Date();
  // Start on the Sunday `weeks` ago
  const start = new Date(today);
  start.setDate(start.getDate() - start.getDay() - (weeks - 1) * 7);

  const columns: { date: Date; seconds: number }[][] = [];
  const monthLabels: { x: number; label: string }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const col: { date: Date; seconds: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      if (date > today) break;
      col.push({ date, seconds: data[dateKey(date)] ?? 0 });
    }
    if (col.length > 0 && col[0].date.getMonth() !== lastMonth) {
      lastMonth = col[0].date.getMonth();
      monthLabels.push({
        x: w * (CELL + GAP),
        label: col[0].date.toLocaleString('en', { month: 'short' }),
      });
    }
    columns.push(col);
  }

  const level = (seconds: number) => {
    const min = seconds / 60;
    if (min === 0) return 0;
    if (min < 5) return 1;
    if (min < 15) return 2;
    if (min < 30) return 3;
    return 4;
  };

  const width = weeks * (CELL + GAP);
  const height = 7 * (CELL + GAP) + 16;
  return (
    <div className="heatmap-scroll">
      <svg width={width} height={height} className="heatmap" role="img" aria-label="Study time heatmap">
        {monthLabels.map((m, i) => (
          <text key={i} x={m.x} y={10} className="heatmap-month">
            {m.label}
          </text>
        ))}
        {columns.map((col, w) =>
          col.map((cell, d) => (
            <rect
              key={`${w}-${d}`}
              x={w * (CELL + GAP)}
              y={16 + d * (CELL + GAP)}
              width={CELL}
              height={CELL}
              rx={2.5}
              className={`heat-cell heat-${level(cell.seconds)}`}
            >
              <title>
                {cell.date.toDateString()}: {Math.round(cell.seconds / 60)} min
              </title>
            </rect>
          ))
        )}
      </svg>
    </div>
  );
}
