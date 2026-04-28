'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  title: string
  loggedDates: string[]
}

export function RoutineTracker({ title, loggedDates }: Props) {
  const loggedSet = new Set(loggedDates)

  // Build last 90 days, padded to start on Monday
  const today = new Date()
  today.setHours(12, 0, 0, 0)

  // Go back 89 days
  const startRaw = new Date(today)
  startRaw.setDate(startRaw.getDate() - 89)

  // Pad back to Monday
  const dayOfWeek = startRaw.getDay() // 0=Sun
  const daysBack = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const start = new Date(startRaw)
  start.setDate(start.getDate() - daysBack)

  // Build grid: array of weeks, each week = [Mon..Sun]
  const weeks: string[][] = []
  const cur = new Date(start)
  while (cur <= today) {
    const week: string[] = []
    for (let d = 0; d < 7; d++) {
      week.push(cur.toISOString().split('T')[0])
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }

  const todayStr = today.toISOString().split('T')[0]
  const DAY_LABELS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

  const totalLogged = loggedDates.filter(d => {
    const startStr = startRaw.toISOString().split('T')[0]
    return d >= startStr && d <= todayStr
  }).length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            {title}
          </CardTitle>
          <span className="text-xs text-muted-foreground">{totalLogged} dias registrados</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {/* Day labels column */}
          <div className="flex flex-col gap-1 mr-1 flex-shrink-0">
            <div className="h-3" /> {/* spacer for week header */}
            {DAY_LABELS.map((l, i) => (
              <div key={i} className="h-3 flex items-center">
                <span className="text-[9px] text-muted-foreground w-2">{i % 2 === 0 ? l : ''}</span>
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1 flex-shrink-0">
              {/* Month label on first week of month */}
              <div className="h-3">
                {(wi === 0 || new Date(week[0] + 'T12:00:00').getDate() <= 7) && (
                  <span className="text-[9px] text-muted-foreground">
                    {new Date(week[0] + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' })}
                  </span>
                )}
              </div>
              {week.map((date) => {
                const logged = loggedSet.has(date)
                const isFuture = date > todayStr
                const isToday = date === todayStr
                return (
                  <div
                    key={date}
                    title={date}
                    className={`w-3 h-3 rounded-sm transition-colors ${
                      isFuture
                        ? 'opacity-0'
                        : logged
                        ? 'bg-foreground'
                        : isToday
                        ? 'border border-muted-foreground bg-transparent'
                        : 'bg-secondary'
                    }`}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-3">
          <span className="text-[10px] text-muted-foreground">Menos</span>
          <div className="w-3 h-3 rounded-sm bg-secondary" />
          <div className="w-3 h-3 rounded-sm bg-foreground/30" />
          <div className="w-3 h-3 rounded-sm bg-foreground/60" />
          <div className="w-3 h-3 rounded-sm bg-foreground" />
          <span className="text-[10px] text-muted-foreground">Mais</span>
        </div>
      </CardContent>
    </Card>
  )
}
