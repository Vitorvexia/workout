'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  title: string
  /** ISO date strings (yyyy-MM-dd) of days that were logged */
  loggedDates: string[]
}

export function RoutineTracker({ title, loggedDates }: Props) {
  // Build last 7 days array (today = day 7, 6 days ago = day 1)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  const loggedSet = new Set(loggedDates)

  const DAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-1">
          {days.map((date, i) => {
            const logged = loggedSet.has(date)
            const isToday = date === new Date().toISOString().split('T')[0]
            const dayOfWeek = new Date(date + 'T12:00:00').getDay()
            return (
              <div key={date} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">
                  {DAY_LABELS[dayOfWeek]}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    logged
                      ? 'bg-foreground'
                      : isToday
                      ? 'border-2 border-muted-foreground'
                      : 'bg-secondary'
                  }`}
                >
                  {logged && (
                    <svg
                      className="w-3.5 h-3.5 text-background"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(date + 'T12:00:00').getDate()}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{loggedDates.filter(d => days.includes(d)).length}/7 esta semana</span>
        </div>
      </CardContent>
    </Card>
  )
}
