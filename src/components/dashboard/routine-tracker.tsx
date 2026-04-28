'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format, startOfWeek, addDays } from 'date-fns'

type Props = {
  title: string
  loggedDates: string[]
  onToggle?: (date: string) => Promise<void>
  onUnmark?: (date: string) => Promise<void>
  readOnly?: boolean
}

const DAY_ABBR = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

export function RoutineTracker({ title, loggedDates, onToggle, onUnmark, readOnly }: Props) {
  const [logged, setLogged] = useState(new Set(loggedDates))
  const [loading, setLoading] = useState<string | null>(null)

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStart, i)
    return format(d, 'yyyy-MM-dd')
  })

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const total = days.filter((d) => logged.has(d)).length

  async function handleClick(date: string) {
    if (readOnly) return
    if (date > todayStr) return   // no future days
    if (loading) return

    setLoading(date)

    if (logged.has(date)) {
      // unmark
      if (onUnmark) {
        await onUnmark(date)
        setLogged((prev) => {
          const next = new Set(prev)
          next.delete(date)
          return next
        })
      }
    } else {
      // mark
      if (onToggle) {
        await onToggle(date)
        setLogged((prev) => new Set([...prev, date]))
      }
    }

    setLoading(null)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            {title}
          </CardTitle>
          <span className="text-xs text-muted-foreground font-medium">{total}/7</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {DAY_ABBR.map((label) => (
            <div key={label} className="text-center text-[10px] text-muted-foreground mb-1">
              {label}
            </div>
          ))}
          {days.map((date) => {
            const done = logged.has(date)
            const isFuture = date > todayStr
            const isToday = date === todayStr
            const isLoading = loading === date
            const canInteract = !readOnly && !isFuture && (onToggle || onUnmark)

            return (
              <button
                key={date}
                disabled={isFuture || isLoading || readOnly && !done}
                onClick={() => handleClick(date)}
                title={done ? 'Clique para desmarcar' : isFuture ? 'Dia futuro' : 'Clique para marcar'}
                className={`
                  mx-auto w-8 h-8 rounded-md flex items-center justify-center transition-colors text-xs font-medium
                  ${done && canInteract ? 'bg-foreground text-background hover:bg-foreground/80 cursor-pointer' : ''}
                  ${done && !canInteract ? 'bg-foreground text-background cursor-default' : ''}
                  ${!done && canInteract ? 'bg-secondary hover:bg-accent cursor-pointer' : ''}
                  ${!done && !canInteract && !isFuture ? 'bg-secondary cursor-default' : ''}
                  ${isFuture ? 'bg-secondary/40 text-muted-foreground/40 cursor-default' : ''}
                  ${isToday && !done ? 'ring-1 ring-foreground' : ''}
                `}
              >
                {isLoading ? (
                  <span className="text-[10px]">...</span>
                ) : done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(date + 'T12:00:00').getDate()}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {readOnly && (
          <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
            Automático via Ficha de Treino
          </p>
        )}
      </CardContent>
    </Card>
  )
}
