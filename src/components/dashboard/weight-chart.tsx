'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

type Props = { logs: WeightLog[] }

export function WeightChart({ logs }: Props) {
  const data = logs.map((l) => ({
    date: format(parseISO(l.logged_at), 'dd/MM', { locale: ptBR }),
    peso: Number(l.weight_kg),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Evolução de Peso
        </CardTitle>
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
                y={68}
                stroke="var(--muted-foreground)"
                strokeDasharray="3 3"
                label={{ value: 'Meta', fontSize: 10, fill: 'var(--muted-foreground)' }}
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
