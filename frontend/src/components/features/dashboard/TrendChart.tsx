'use client';

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatShortDate } from '@/lib/utils';
import { axisTick, CHART_COLORS, tooltipStyle } from './chart-theme';

interface TrendChartProps {
  patients: { date: string; count: number }[];
  doctors: { date: string; count: number }[];
}

export default function TrendChart({ patients, doctors }: TrendChartProps) {
  const data = patients.map((p, i) => ({ date: p.date, patients: p.count, doctors: doctors[i]?.count ?? 0 }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="fillPatients" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.patients} stopOpacity={0.25} />
            <stop offset="100%" stopColor={CHART_COLORS.patients} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
        <XAxis dataKey="date" tickFormatter={formatShortDate} tick={axisTick} tickLine={false} axisLine={false} minTickGap={32} />
        <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} />
        <Tooltip {...tooltipStyle} labelFormatter={(label) => formatShortDate(String(label))} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="patients" name="New patients" stroke={CHART_COLORS.patients} strokeWidth={2} fill="url(#fillPatients)" />
        <Area type="monotone" dataKey="doctors" name="New doctors" stroke={CHART_COLORS.doctors} strokeWidth={2} fill="none" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
