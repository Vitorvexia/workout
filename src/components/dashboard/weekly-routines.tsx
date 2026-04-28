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
  const [chartWorkout, setChartWorkout] = useState(workoutAllDates)

  async function handleAcademiaToggle(date: string) {
    const res = await fetch('/api/academia-day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logged_at: date }),
    })
    if (!res.ok) throw new Error('failed')
    setChartWorkout((prev) => [...new Set([...prev, date])].sort())
  }

  async function handleAcademiaUnmark(date: string) {
    const res = await fetch('/api/academia-day', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logged_at: date }),
    })
    if (!res.ok) throw new Error('failed')
    setChartWorkout((prev) => prev.filter((d) => d !== date))
  }

  async function handleSupplementToggle(date: string) {
    const res = await fetch('/api/suplementos-day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logged_at: date }),
    })
    if (!res.ok) throw new Error('failed')
    setChartSupplement((prev) => [...new Set([...prev, date])].sort())
  }

  async function handleSupplementUnmark(date: string) {
    const res = await fetch('/api/suplementos-day', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logged_at: date }),
    })
    if (!res.ok) throw new Error('failed')
    setChartSupplement((prev) => prev.filter((d) => d !== date))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RoutineTracker
          title="Academia"
          loggedDates={workoutDates}
          onToggle={handleAcademiaToggle}
          onUnmark={handleAcademiaUnmark}
        />
        <RoutineTracker
          title="Alimentação + Suplementos"
          loggedDates={supplementDates}
          onToggle={handleSupplementToggle}
          onUnmark={handleSupplementUnmark}
        />
      </div>
      <RoutineChart
        workoutDates={chartWorkout}
        supplementDates={chartSupplement}
      />
    </div>
  )
}
