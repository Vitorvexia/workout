'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PeriodFilter, Period } from '@/components/ui/period-filter'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = {
  workoutDates: string[]
  supplementDates: string[]
}

function countInWeek(dates: string[], weekStart: Date): number {
  const start = format(weekStart, 'yyyy-MM-dd')
  const end = format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd')
  return [...new Set(dates)].filter((d) => d >= start && d <= end).length
}

// Max weeks per period
const PERIOD_WEEKS: Record<Period, number> = {
  '7d': 1,
  '6m': 26,
  'all': 52,
}

export function RoutineChart({ workoutDates, supplementDates }: Props) {
  const [period, setPeriod] = useState<Period>('all')
  const today = new Date()

  // Start from earliest data week, capped by period
  const allDates = [...workoutDates, ...supplementDates]
  const earliest = allDates.length > 0
    ? allDates.reduce((a, b) => (a < b ? a : b))
    : format(today, 'yyyy-MM-dd')
  const earliestWeek = startOfWeek(new Date(earliest + 'T12:00:00'), { weekStartsOn: 1 })
  const currentWeek = startOfWeek(today, { weekStartsOn: 1 })

  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const weeksFromData = Math.round((currentWeek.getTime() - earliestWeek.getTime()) / msPerWeek) + 1
  const maxWeeks = PERIOD_WEEKS[period]
  const totalWeeks = Math.min(maxWeeks, weeksFromData)

  const weeks = Array.from({ length: totalWeeks }, (_, i) =>
    startOfWeek(subWeeks(currentWeek, totalWeeks - 1 - i), { weekStartsOn: 1 })
  )

  const data = weeks.map((w) => ({
    semana: format(w, 'dd/MM', { locale: ptBR }),
    Academia: countInWeek(workoutDates, w),
    Suplementos: countInWeek(supplementDates, w),
  }))

  const hasAnyData = workoutDates.length > 0 || supplementDates.length > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Histórico de Rotina
          </CardTitle>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>
      </CardHeader>
      <CardContent>
        {!hasAnyData ? (
          <div className="py-8 text-center space-y-1">
            <p className="text-sm text-muted-foreground">Nenhum registro ainda.</p>
            <p className="text-xs text-muted-foreground/50">O gráfico aparecerá conforme você usar o app.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <XAxis
                dataKey="semana"
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                interval={totalWeeks > 12 ? Math.floor(totalWeeks / 8) : 1}
              />
              <YAxis
                domain={[0, 7]}
                ticks={[0, 2, 4, 6, 7]}
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                width={16}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Line
                type="monotone"
                dataKey="Academia"
                stroke="#34d399"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Suplementos"
                stroke="#f472b6"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
