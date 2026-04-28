'use client'

import { useState } from 'react'
import { RoutineTracker } from './routine-tracker'
import { RoutineChart } from './routine-chart'

type Props = {
  workoutDates: string[]
  supplementDates: string[]
  workoutAllDates: string[]
  supplementAllDates: string[]
}

export function WeeklyRoutines({
  workoutDates, supplementDates,
  workoutAllDates, supplementAllDates,
}: Props) {
  const [chartSupplement, setChartSupplement] = useState(supplementAllDates)

  async function handleSupplementToggle(date: string) {
    await fetch('/api/suplementos-day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logged_at: date }),
    })
    setChartSupplement((prev) => [...new Set([...prev, date])].sort())
  }

  async function handleSupplementUnmark(date: string) {
    await fetch('/api/suplementos-day', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logged_at: date }),
    })
    setChartSupplement((prev) => prev.filter((d) => d !== date))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RoutineTracker
          title="Academia"
          loggedDates={workoutDates}
          readOnly
        />
        <RoutineTracker
          title="Alimentação + Suplementos"
          loggedDates={supplementDates}
          onToggle={handleSupplementToggle}
          onUnmark={handleSupplementUnmark}
        />
      </div>
      <RoutineChart
        workoutDates={workoutAllDates}
        supplementDates={chartSupplement}
      />
    </div>
  )
}
