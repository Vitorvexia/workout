'use client'

import { cn } from '@/lib/utils'

export type Period = '7d' | '6m' | 'all'

const OPTIONS: { value: Period; label: string }[] = [
  { value: '7d', label: '7 dias' },
  { value: '6m', label: '6 meses' },
  { value: 'all', label: 'Todo período' },
]

export function cutoffDate(period: Period): string {
  if (period === 'all') return '1970-01-01'
  const days = period === '7d' ? 7 : 180
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

type Props = {
  value: Period
  onChange: (p: Period) => void
}

export function PeriodFilter({ value, onChange }: Props) {
  return (
    <div className="flex gap-1">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'text-[10px] font-medium px-2 py-0.5 rounded transition-colors',
            value === o.value
              ? 'bg-foreground text-background'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
