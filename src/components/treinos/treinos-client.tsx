'use client'

import { useState } from 'react'
import { ExerciseForm } from './exercise-form'
import { ExerciseHistory } from './exercise-history'
import { FichaTreino } from './ficha-treino'
import { Exercise, WorkoutSet, FichaCompletion } from '@/lib/types'

type Props = {
  exercises: Exercise[]
  initialSets: WorkoutSet[]
  todayCompletions: FichaCompletion[]
}

export function TreinosClient({ exercises, initialSets, todayCompletions }: Props) {
  const [sets, setSets] = useState(initialSets)
  const [activeTab, setActiveTab] = useState<'registrar' | 'ficha'>('ficha')

  function handleLogged(newSet: WorkoutSet) {
    setSets((prev) => [newSet, ...prev])
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['ficha', 'registrar'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'bg-foreground text-background'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'ficha' ? 'Ficha de Treino' : 'Registrar Peso'}
          </button>
        ))}
      </div>

      {activeTab === 'ficha' && <FichaTreino todayCompletions={todayCompletions} />}

      {activeTab === 'registrar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ExerciseForm exercises={exercises} onLogged={handleLogged} />
          <ExerciseHistory sets={sets} />
        </div>
      )}
    </div>
  )
}
