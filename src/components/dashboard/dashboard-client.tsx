'use client'

import { useState, useEffect } from 'react'
import { WeightCard } from './weight-card'
import { WeightChart } from './weight-chart'
import { WeightLog } from '@/lib/types'

const LS_KEY = 'workout_target_weight'
const DEFAULT_TARGET = 68

type Props = {
  latest: WeightLog | null
  logs: WeightLog[]
}

export function DashboardClient({ latest: initialLatest, logs: initialLogs }: Props) {
  const [logs, setLogs] = useState(initialLogs)
  const [latest, setLatest] = useState<WeightLog | null>(initialLatest)
  const [target, setTarget] = useState(DEFAULT_TARGET)

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY)
    if (stored) setTarget(parseFloat(stored))
  }, [])

  function handleAdded(newLog: WeightLog) {
    setLatest(newLog)
    setLogs((prev) => {
      const updated = [...prev, newLog]
      updated.sort((a, b) => a.logged_at.localeCompare(b.logged_at))
      return updated
    })
  }

  function handleTargetChange(t: number) {
    setTarget(t)
    localStorage.setItem(LS_KEY, String(t))
  }

  return (
    <div className="space-y-4">
      <WeightCard
        latest={latest}
        target={target}
        onAdded={handleAdded}
        onTargetChange={handleTargetChange}
      />
      <WeightChart logs={logs} target={target} />
    </div>
  )
}
