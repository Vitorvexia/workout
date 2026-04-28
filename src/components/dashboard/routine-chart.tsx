'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { startOfWeek, format, eachWeekOfInterval, parseISO, endOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = {
  postureDates: string[]
  workoutDates: string[]
  supplementDates: string[]
}

function countInWeek(dates: string[], weekStart: Date): number {
  const start = format(weekStart, 'yyyy-MM-dd')
  const end = format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd')
  return [...new Set(dates)].filter((d) => d >= start && d <= end).length
}

export function RoutineChart({ postureDates, workoutDates, supplementDates }: Props) {
  // Find earliest date across all logs
  const allDates = [...postureDates, ...workoutDates, ...supplementDates]
  if (allDates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Histórico de Rotina
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum registro ainda
          </p>
        </CardContent>
      </Card>
    )
  }

  const earliest = allDates.reduce((a, b) => (a < b ? a : b))
  const weekStart = startOfWeek(parseISO(earliest), { weekStartsOn: 1 })
  const weeks = eachWeekOfInterval(
    { start: weekStart, end: new Date() },
    { weekStartsOn: 1 }
  )

  const data = weeks.map((w) => ({
    week: format(w, 'dd/MM', { locale: ptBR }),
    Postura: countInWeek(postureDates, w),
    Academia: countInWeek(workoutDates, w),
    Suplementos: countInWeek(supplementDates, w),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Histórico de Rotina
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <XAxis
              dataKey="week"
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 7]}
              ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
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
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
            <Line
              type="monotone"
              dataKey="Postura"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Academia"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Suplementos"
              stroke="#f472b6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
