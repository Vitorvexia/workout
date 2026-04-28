'use client'

import { useState } from 'react'
import { RoutineTracker } from './routine-tracker'
import { RoutineChart } from './routine-chart'

type Props = {
  postureDates: string[]
  workoutDates: string[]
  supplementDates: string[]
  postureAllDates: string[]
  workoutAllDates: string[]
  supplementAllDates: string[]
}

export function WeeklyRoutines({
  postureDates, workoutDates, supplementDates,
  postureAllDates, workoutAllDates, supplementAllDates,
}: Props) {
  const [chartPosture, setChartPosture] = useState(postureAllDates)
  const [chartWorkout, setChartWorkout] = useState(workoutAllDates)
  const [chartSupplement, setChartSupplement] = useState(supplementAllDates)

  async function handlePosturaToggle(date: string) {
    await fetch('/api/postura-checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logged_at: date, exercise_1: true, exercise_2: true, exercise_3: true, exercise_4: true, exercise_5: true }),
    })
    setChartPosture((prev) => [...new Set([...prev, date])].sort())
  }

  async function handleWorkoutToggle(date: string) {
    await fetch('/api/treinos-day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logged_at: date }),
    })
    setChartWorkout((prev) => [...new Set([...prev, date])].sort())
  }

  async function handleSupplementToggle(date: string) {
    await fetch('/api/suplementos-day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logged_at: date }),
    })
    setChartSupplement((prev) => [...new Set([...prev, date])].sort())
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RoutineTracker title="Exercícios Posturais" loggedDates={postureDates} onToggle={handlePosturaToggle} />
        <RoutineTracker title="Academia" loggedDates={workoutDates} onToggle={handleWorkoutToggle} />
        <RoutineTracker title="Suplementos" loggedDates={supplementDates} onToggle={handleSupplementToggle} />
      </div>
      <RoutineChart
        postureDates={chartPosture}
        workoutDates={chartWorkout}
        supplementDates={chartSupplement}
      />
    </div>
  )
}
