'use client'

import { useRef } from 'react'

type Props = {
  min: number          // baseline weight (e.g. 58)
  max: number          // target weight (e.g. 68)
  current: number      // actual current weight from DB
}

export function WeightSlider({ min, max, current }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const progress = Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100))

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}kg (início)</span>
        <span className="font-semibold text-foreground">{current}kg atual</span>
        <span>{max}kg (meta)</span>
      </div>
      <div
        ref={trackRef}
        className="relative h-2 w-full rounded-full bg-secondary"
      >
        {/* Filled track */}
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-foreground transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        {/* Current weight ball */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-foreground border-2 border-background shadow-lg cursor-default"
          style={{ left: `${progress}%` }}
          title={`${current}kg`}
        />
        {/* Target marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-foreground bg-background"
          style={{ left: '100%' }}
          title={`Meta: ${max}kg`}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>+{(current - min).toFixed(1)}kg ganhos</span>
        <span>{progress.toFixed(0)}% da meta</span>
        <span>{Math.max(0, max - current).toFixed(1)}kg restantes</span>
      </div>
    </div>
  )
}
