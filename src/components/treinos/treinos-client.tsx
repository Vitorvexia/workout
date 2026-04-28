'use client'

import { useState } from 'react'
import { ExerciseForm } from './exercise-form'
import { ExerciseHistory } from './exercise-history'
import { Exercise, WorkoutSet } from '@/lib/types'

type Props = {
  exercises: Exercise[]
  initialSets: WorkoutSet[]
}

export function TreinosClient({ exercises, initialSets }: Props) {
  const [sets, setSets] = useState(initialSets)

  function handleLogged(newSet: WorkoutSet) {
    setSets((prev) => [newSet, ...prev])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ExerciseForm exercises={exercises} onLogged={handleLogged} />
      <ExerciseHistory sets={sets} />
    </div>
  )
}
