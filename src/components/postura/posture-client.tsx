'use client'

import { useState } from 'react'
import { PostureForm } from './posture-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PostureChecklist } from '@/lib/types'
import { format, parseISO, startOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = {
  todayChecklist: PostureChecklist | null
  history: PostureChecklist[]
}

export function PostureClient({ todayChecklist, history }: Props) {
  const [today, setToday] = useState(todayChecklist)
  const [logs, setLogs] = useState(history)

  function handleSaved(checklist: PostureChecklist) {
    setToday(checklist)
    setLogs((prev) => {
      const filtered = prev.filter((l) => l.logged_at !== checklist.logged_at)
      return [checklist, ...filtered]
    })
  }

  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  const weekLogs = logs.filter((l) => l.logged_at >= weekStart)
  const painLogs = weekLogs.filter((l) => l.pain_level > 0)
  const avgPain = painLogs.length > 0
    ? (painLogs.reduce((sum, l) => sum + l.pain_level, 0) / painLogs.length).toFixed(1)
    : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <PostureForm today={today} onSaved={handleSaved} />
      </div>

      <div className="space-y-4">
        {avgPain !== null && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                Dor Média — Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold">{avgPain}</span>
                <span className="text-sm text-muted-foreground mb-1">/10</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {painLogs.length} registro{painLogs.length !== 1 ? 's' : ''} esta semana
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Histórico
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum registro ainda</p>
            ) : (
              <div className="space-y-2">
                {logs.slice(0, 20).map((log) => {
                  const s = [log.exercise_1, log.exercise_2, log.exercise_3, log.exercise_4, log.exercise_5].filter(Boolean).length
                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">
                        {format(parseISO(log.logged_at), "dd 'de' MMM", { locale: ptBR })}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map((n) => (
                            <div
                              key={n}
                              className={`w-3 h-3 rounded-full ${
                                (log as Record<string, unknown>)[`exercise_${n}`] ? 'bg-foreground' : 'bg-secondary'
                              }`}
                            />
                          ))}
                          <span className={`text-xs font-semibold ml-1 ${s === 5 ? 'text-green-400' : s === 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                            {s}/5
                          </span>
                        </div>
                        {log.pain_level > 0 && (
                          <span className="text-xs text-muted-foreground">dor: {log.pain_level}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
