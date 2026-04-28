'use client'

import { useState } from 'react'
import { WeightCard } from './weight-card'
import { WeightChart } from './weight-chart'
import { WeightLog } from '@/lib/types'

type Props = {
  latest: WeightLog | null
  logs: WeightLog[]
}

export function DashboardClient({ latest: initialLatest, logs: initialLogs }: Props) {
  const [logs, setLogs] = useState(initialLogs)
  const [latest, setLatest] = useState<WeightLog | null>(initialLatest)

  function handleAdded(newLog: WeightLog) {
    setLatest(newLog)
    setLogs((prev) => {
      // Insert maintaining ascending order by logged_at
      const updated = [...prev, newLog]
      updated.sort((a, b) => a.logged_at.localeCompare(b.logged_at))
      return updated
    })
  }

  return (
    <div className="space-y-4">
      <WeightCard latest={latest} onAdded={handleAdded} />
      <WeightChart logs={logs} />
    </div>
  )
}
