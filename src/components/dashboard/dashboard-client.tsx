'use client'

import { useState } from 'react'
import { WeightCard } from './weight-card'
import { WeightChart } from './weight-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { WeightLog, DayScore, Streaks, CheckSemanal } from '@/lib/types'
import { cn } from '@/lib/utils'
import { AlertTriangle, Flame, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const LS_KEY = 'workout_target_weight'
const DEFAULT_TARGET = 68

type TodayStatus = {
  treino: boolean
  alimentacao: number
  suplementos: {
    creatina: boolean
    whey: boolean
    hipercalorico: boolean
    hipercalorico_manha: boolean
    hipercalorico_noite: boolean
  }
  postura: boolean
}

type Props = {
  latest: WeightLog | null
  logs: WeightLog[]
  dayScore: DayScore
  streaks: Streaks
  checkSemanal: CheckSemanal
  alertas: string[]
  todayStatus: TodayStatus
}

const scoreColor = (score: number) =>
  score >= 90 ? 'text-green-400'
  : score >= 70 ? 'text-blue-400'
  : score >= 40 ? 'text-yellow-400'
  : 'text-red-400'

const scoreBarColor = (score: number) =>
  score >= 90 ? 'bg-green-500'
  : score >= 70 ? 'bg-blue-500'
  : score >= 40 ? 'bg-yellow-500'
  : 'bg-red-500'

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <div className={cn('w-2 h-2 rounded-full flex-shrink-0', ok ? 'bg-green-400' : 'bg-red-400/60')} />
  )
}

function StreakBadge({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1">
        <Flame className={cn('w-4 h-4', count > 0 ? 'text-orange-400' : 'text-muted-foreground/30')} />
        <span className={cn('text-xl font-bold tabular-nums', count > 0 ? 'text-foreground' : 'text-muted-foreground/50')}>
          {count}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  )
}

export function DashboardClient({
  latest: initialLatest,
  logs: initialLogs,
  dayScore,
  streaks,
  checkSemanal,
  alertas,
  todayStatus,
}: Props) {
  const [logs, setLogs] = useState(initialLogs)
  const [latest, setLatest] = useState<WeightLog | null>(initialLatest)
  const [target, setTarget] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LS_KEY)
      if (stored) return parseFloat(stored)
    }
    return DEFAULT_TARGET
  })

  function handleAdded(newLog: WeightLog) {
    setLatest(newLog)
    setLogs((prev) => {
      const updated = [...prev, newLog]
      updated.sort((a, b) => a.logged_at.localeCompare(b.logged_at))
      return updated
    })
  }

  function handleTargetChange(t: number) {
    setTarget(t)
    localStorage.setItem(LS_KEY, String(t))
  }

  const { score, label } = dayScore

  return (
    <div className="space-y-4">
      {/* Alertas */}
      {alertas.length > 0 && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                {alertas.map((a, i) => (
                  <p key={i} className="text-sm text-yellow-200/80">{a}</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status do Dia + Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status do Dia */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Status do Dia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-center gap-2">
              <StatusDot ok={todayStatus.treino} />
              <span className="text-sm">Treino</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {todayStatus.treino ? 'Feito' : 'Pendente'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <StatusDot ok={todayStatus.alimentacao >= 6} />
              <span className="text-sm">Alimentação</span>
              <span className="ml-auto text-xs text-muted-foreground">{todayStatus.alimentacao}/6</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusDot ok={todayStatus.suplementos.creatina} />
              <span className="text-sm text-muted-foreground">Creatina</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusDot ok={todayStatus.suplementos.hipercalorico_manha} />
              <span className="text-sm text-muted-foreground">Hipercalórico manhã</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusDot ok={todayStatus.suplementos.whey} />
              <span className="text-sm text-muted-foreground">Whey</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusDot ok={todayStatus.suplementos.hipercalorico_noite} />
              <span className="text-sm text-muted-foreground">Hipercalórico noite</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusDot ok={todayStatus.postura} />
              <span className="text-sm">Postura</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {todayStatus.postura ? 'Feita' : 'Pendente'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Score do Dia */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Score do Dia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-2">
              <span className={cn('text-5xl font-bold tabular-nums', scoreColor(score))}>{score}</span>
              <span className="text-muted-foreground mb-1">/100</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', scoreBarColor(score))}
                style={{ width: `${score}%` }}
              />
            </div>
            <p className={cn('text-sm font-medium', scoreColor(score))}>{label}</p>
          </CardContent>
        </Card>
      </div>

      {/* Streaks */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Sequências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <StreakBadge count={streaks.alimentacao} label="Alimentação" />
            <StreakBadge count={streaks.treino} label="Treino" />
            <StreakBadge count={streaks.suplementos} label="Suplementos" />
            <StreakBadge count={streaks.geral} label="Geral" />
          </div>
        </CardContent>
      </Card>

      {/* Peso + Gráfico */}
      <WeightCard
        latest={latest}
        target={target}
        onAdded={handleAdded}
        onTargetChange={handleTargetChange}
      />
      <WeightChart logs={logs} target={target} />

      {/* Check Semanal */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Check Semanal
            </CardTitle>
            <span
              className={cn(
                'text-xs font-semibold px-2 py-0.5 rounded-full',
                checkSemanal.resultado === 'Excelente' ? 'bg-green-500/20 text-green-400'
                : checkSemanal.resultado === 'Boa' ? 'bg-blue-500/20 text-blue-400'
                : 'bg-red-500/20 text-red-400'
              )}
            >
              {checkSemanal.resultado}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Variação de Peso</p>
              {checkSemanal.difPeso !== null ? (
                <div className="flex items-center gap-1">
                  {checkSemanal.difPeso > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                  ) : checkSemanal.difPeso < 0 ? (
                    <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                  <span className={cn(
                    'text-sm font-semibold',
                    checkSemanal.difPeso > 0 ? 'text-green-400' : checkSemanal.difPeso < 0 ? 'text-red-400' : 'text-muted-foreground'
                  )}>
                    {checkSemanal.difPeso > 0 ? '+' : ''}{checkSemanal.difPeso}kg
                  </span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>

            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Refeições</p>
              <p className="text-sm font-semibold">{checkSemanal.refeicoes}/42</p>
              <Progress value={(checkSemanal.refeicoes / 42) * 100} className="h-1 mt-1" />
            </div>

            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Treinos</p>
              <p className="text-sm font-semibold">{checkSemanal.treinos}/7</p>
              <Progress value={(checkSemanal.treinos / 7) * 100} className="h-1 mt-1" />
            </div>

            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Postura</p>
              <p className="text-sm font-semibold">{checkSemanal.postura}/7</p>
              <Progress value={(checkSemanal.postura / 7) * 100} className="h-1 mt-1" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Score médio semanal</span>
            <span className={cn('text-sm font-bold', scoreColor(checkSemanal.scoreMedia))}>
              {checkSemanal.scoreMedia}/100
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
