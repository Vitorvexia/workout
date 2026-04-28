'use client'

import { useState } from 'react'
import { PostureForm } from './posture-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PostureLog } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = { initialLogs: PostureLog[] }

export function PostureClient({ initialLogs }: Props) {
  const [logs, setLogs] = useState(initialLogs)

  function handleLogged(log: PostureLog) {
    setLogs((prev) => [log, ...prev])
  }

  function painColor(level: number) {
    if (level <= 2) return 'text-green-400'
    if (level <= 5) return 'text-yellow-400'
    if (level <= 7) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <PostureForm onLogged={handleLogged} />
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Histórico
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum registro ainda
            </p>
          ) : (
            <div className="space-y-2">
              {logs.slice(0, 20).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(log.logged_at), 'dd MMM', { locale: ptBR })}
                    </span>
                    {log.did_exercises && (
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                        Exercícios ✓
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-bold ${painColor(log.back_pain_level)}`}>
                    Dor: {log.back_pain_level}/10
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
