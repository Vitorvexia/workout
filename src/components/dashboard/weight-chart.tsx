'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PeriodFilter, Period, cutoffDate } from '@/components/ui/period-filter'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { WeightLog } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = { logs: WeightLog[]; target: number }

export function WeightChart({ logs, target }: Props) {
  const [period, setPeriod] = useState<Period>('all')
  const cutoff = cutoffDate(period)

  // One point per day — keep latest entry, filtered by period
  const byDay = new Map<string, number>()
  for (const l of logs) {
    if (l.logged_at >= cutoff) byDay.set(l.logged_at, Number(l.weight_kg))
  }
  const data = Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, peso]) => ({
      date: format(parseISO(date), 'dd/MM', { locale: ptBR }),
      peso,
    }))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Evolução de Peso
          </CardTitle>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Nenhum registro ainda
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: 12,
                }}
              />
              <ReferenceLine
                y={target}
                stroke="var(--muted-foreground)"
                strokeDasharray="3 3"
                label={{ value: `Meta ${target}kg`, fontSize: 10, fill: 'var(--muted-foreground)' }}
              />
              <Line
                type="monotone"
                dataKey="peso"
                stroke="var(--foreground)"
                strokeWidth={2}
                dot={{ fill: 'var(--foreground)', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
