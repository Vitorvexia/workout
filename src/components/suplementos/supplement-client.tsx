'use client'

import { useState } from 'react'
import { SupplementForm } from './supplement-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SupplementLog } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = { initialLogs: SupplementLog[] }

const LABELS: Record<keyof Pick<SupplementLog, 'took_hypercaloric' | 'took_whey' | 'took_creatine'>, string> = {
  took_hypercaloric: 'Hipercal',
  took_whey: 'Whey',
  took_creatine: 'Creatina',
}

export function SupplementClient({ initialLogs }: Props) {
  const [logs, setLogs] = useState(initialLogs)

  function handleLogged(log: SupplementLog) {
    setLogs((prev) => [log, ...prev])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <SupplementForm onLogged={handleLogged} />
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
              {logs.slice(0, 20).map((log) => {
                const taken = (
                  Object.entries(LABELS) as [keyof typeof LABELS, string][]
                )
                  .filter(([key]) => log[key])
                  .map(([, label]) => label)
                const total = taken.length

                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(log.logged_at), 'dd MMM', { locale: ptBR })}
                    </span>
                    <div className="flex items-center gap-2">
                      {taken.map((label) => (
                        <span
                          key={label}
                          className="text-xs bg-secondary px-2 py-0.5 rounded-full"
                        >
                          {label}
                        </span>
                      ))}
                      <span
                        className={`text-xs font-medium ${
                          total === 3
                            ? 'text-green-400'
                            : total === 0
                            ? 'text-red-400'
                            : 'text-yellow-400'
                        }`}
                      >
                        {total}/3
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
