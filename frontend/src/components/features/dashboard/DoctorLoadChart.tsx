'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { axisTick, CHART_COLORS, tooltipStyle } from './chart-theme';

export default function DoctorLoadChart({ data }: { data: { name: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke={CHART_COLORS.grid} />
        <XAxis type="number" allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" width={112} tick={axisTick} tickLine={false} axisLine={false} interval={0} />
        <Tooltip {...tooltipStyle} cursor={{ fill: '#f3f4f6' }} />
        <Bar dataKey="count" name="Patients" fill={CHART_COLORS.patients} radius={[0, 4, 4, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
