'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Meal = {
  index: number
  time: string
  title: string
  items: string[]
}

type Props = {
  meal: Meal
  done: boolean
  onToggle: (index: number) => void
}

export function MealCard({ meal, done, onToggle }: Props) {
  return (
    <Card
      className={cn(
        'transition-colors cursor-pointer select-none',
        done && 'border-foreground/30 bg-foreground/5'
      )}
      onClick={() => onToggle(meal.index)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors',
                done ? 'bg-foreground border-foreground' : 'border-border'
              )}
            >
              {done && (
                <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <CardTitle className={cn('text-sm font-semibold', done && 'line-through text-muted-foreground')}>
              {meal.title}
            </CardTitle>
          </div>
          <span className="text-xs text-muted-foreground font-mono">{meal.time}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {meal.items.map((item, i) => (
            <li key={i} className={cn('text-xs text-muted-foreground flex items-start gap-1.5', done && 'opacity-50')}>
              <span className="mt-0.5 w-1 h-1 rounded-full bg-muted-foreground/50 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
