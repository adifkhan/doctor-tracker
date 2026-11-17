'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_COLORS, OTHER_COLOR, tooltipStyle } from './chart-theme';

const colorFor = (condition: string, index: number) =>
  condition === 'Other' ? OTHER_COLOR : CATEGORY_COLORS[index % CATEGORY_COLORS.length];

export default function ConditionChart({ data }: { data: { condition: string; count: number }[] }) {
  return (
    <div className="flex size-full flex-col items-center gap-4 sm:flex-row">
      <div className="h-40 w-full sm:h-full sm:w-1/2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="condition" innerRadius="60%" outerRadius="90%" paddingAngle={2} strokeWidth={0}>
              {data.map((d, i) => (
                <Cell key={d.condition} fill={colorFor(d.condition, i)} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full space-y-1.5 overflow-y-auto text-sm sm:w-1/2">
        {data.map((d, i) => (
          <li key={d.condition} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: colorFor(d.condition, i) }} />
            <span className="truncate">{d.condition}</span>
            <span className="ml-auto text-muted-foreground">{d.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
