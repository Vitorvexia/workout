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
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = {
  scoreHistory: { date: string; score: number }[]
}

export function ScoreChart({ scoreHistory }: Props) {
  const data = scoreHistory.map((d) => ({
    dia: format(parseISO(d.date), 'dd/MM', { locale: ptBR }),
    score: d.score,
  }))

  const avg = data.length > 0
    ? Math.round(data.reduce((s, d) => s + d.score, 0) / data.length)
    : 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Score Diário — Últimos 30 dias
          </CardTitle>
          {data.length > 0 && (
            <span className="text-xs text-muted-foreground">
              Média: <span className="font-semibold text-foreground">{avg}/100</span>
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {data.length < 2 ? (
          <div className="py-8 text-center space-y-1">
            <p className="text-sm text-muted-foreground">
              {data.length === 0
                ? 'Nenhum dado ainda. Use o app por alguns dias.'
                : 'Precisa de pelo menos 2 dias de dados para mostrar o gráfico.'}
            </p>
            <p className="text-xs text-muted-foreground/50">O gráfico aparecerá automaticamente.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <XAxis
                dataKey="dia"
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: 12,
                }}
                formatter={(v) => [`${v}/100`, 'Score']}
              />
              <ReferenceLine
                y={70}
                stroke="var(--muted-foreground)"
                strokeDasharray="3 3"
                strokeOpacity={0.3}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--foreground)"
                strokeWidth={2}
                dot={{ fill: 'var(--foreground)', r: 2.5 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
