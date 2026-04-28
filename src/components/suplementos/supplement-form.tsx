'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SupplementWeekly } from '@/lib/types'
import { format, startOfWeek, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, Minus } from 'lucide-react'

type SupKey = 'creatina' | 'whey' | 'hipercalorico'

const SUPPLEMENTS: { key: SupKey; label: string; sublabel: string; max: number }[] = [
  { key: 'creatina', label: 'Creatina', sublabel: '5g/dia', max: 1 },
  { key: 'whey', label: 'Whey', sublabel: '1×/dia', max: 1 },
  { key: 'hipercalorico', label: 'Hipercal.', sublabel: '2-3×/dia', max: 3 },
]

type DayData = Record<SupKey, number>

type Props = {
  weekLogs: SupplementWeekly[]
}

export function SupplementForm({ weekLogs }: Props) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStart, i)
    return format(d, 'yyyy-MM-dd')
  })
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const initialData: Record<string, DayData> = {}
  days.forEach((d) => {
    initialData[d] = { creatina: 0, whey: 0, hipercalorico: 0 }
  })
  weekLogs.forEach((log) => {
    if (initialData[log.logged_at]) {
      initialData[log.logged_at][log.supplement as SupKey] = log.count
    }
  })

  const [data, setData] = useState(initialData)
  const [saving, setSaving] = useState<string | null>(null)

  async function setCount(date: string, sup: SupKey, newCount: number) {
    const key = `${date}::${sup}`
    setSaving(key)
    const maxVal = SUPPLEMENTS.find((s) => s.key === sup)!.max
    const clamped = Math.max(0, Math.min(maxVal, newCount))

    if (clamped === 0) {
      await fetch('/api/suplementos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logged_at: date, supplement: sup }),
      })
    } else {
      await fetch('/api/suplementos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logged_at: date, supplement: sup, count: clamped }),
      })
    }

    setData((prev) => ({
      ...prev,
      [date]: { ...prev[date], [sup]: clamped },
    }))
    setSaving(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Suplementos — Semana Atual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 pr-3 text-xs text-muted-foreground font-medium w-16">Dia</th>
                {SUPPLEMENTS.map((s) => (
                  <th key={s.key} className="text-center py-2 px-2 text-xs text-muted-foreground font-medium">
                    <div>{s.label}</div>
                    <div className="text-[10px] font-normal">{s.sublabel}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((date) => {
                const isFuture = date > todayStr
                const isToday = date === todayStr
                const dayLabel = format(new Date(date + 'T12:00:00'), 'EEE dd', { locale: ptBR })
                return (
                  <tr
                    key={date}
                    className={`border-t border-border ${isToday ? 'bg-accent/10' : ''}`}
                  >
                    <td className={`py-2 pr-3 text-xs ${isToday ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                      {dayLabel}
                    </td>
                    {SUPPLEMENTS.map((sup) => {
                      const count = data[date]?.[sup.key] ?? 0
                      const key = `${date}::${sup.key}`
                      const isLoading = saving === key
                      const isBinary = sup.max === 1
                      return (
                        <td key={sup.key} className="py-2 px-2 text-center">
                          {isFuture ? (
                            <span className="text-muted-foreground/30">—</span>
                          ) : isBinary ? (
                            <button
                              disabled={isLoading}
                              onClick={() => setCount(date, sup.key, count === 0 ? 1 : 0)}
                              className={`mx-auto w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                                count > 0
                                  ? 'bg-foreground text-background'
                                  : 'bg-secondary hover:bg-accent'
                              }`}
                            >
                              {count > 0 ? (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">+</span>
                              )}
                            </button>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                disabled={isLoading || count === 0}
                                onClick={() => setCount(date, sup.key, count - 1)}
                                className="w-5 h-5 rounded flex items-center justify-center bg-secondary hover:bg-accent disabled:opacity-30"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className={`w-4 text-center text-xs font-medium ${count >= 2 ? 'text-green-400' : count === 1 ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                                {count}
                              </span>
                              <button
                                disabled={isLoading || count >= sup.max}
                                onClick={() => setCount(date, sup.key, count + 1)}
                                className="w-5 h-5 rounded flex items-center justify-center bg-secondary hover:bg-accent disabled:opacity-30"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
