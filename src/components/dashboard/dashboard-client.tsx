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
  const latest = logs.at(-1) ?? initialLatest

  async function refresh() {
    const res = await fetch('/api/peso')
    const data = await res.json()
    setLogs(data)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <WeightCard latest={latest} onAdded={refresh} />
      <div className="lg:col-span-2">
        <WeightChart logs={logs} />
      </div>
    </div>
  )
}
