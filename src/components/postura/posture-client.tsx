'use client'

import { useState } from 'react'
import { PostureForm } from './posture-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PostureChecklist } from '@/lib/types'
import { format, parseISO } from 'date-fns'
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <PostureForm today={today} onSaved={handleSaved} />
      </div>

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
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
