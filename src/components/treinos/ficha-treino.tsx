'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FichaCompletion } from '@/lib/types'

const FICHA: Record<string, { label: string; muscles: string; exercises: string[] }> = {
  A: {
    label: 'A — Segunda',
    muscles: 'Peito + Abs',
    exercises: [
      'Supino Inclinado',
      'Supino Declinado',
      'Crucifixo',
      'Abdominal Infra',
      'Abdominal Supra',
      'Prancha',
    ],
  },
  B: {
    label: 'B — Terça',
    muscles: 'Costas',
    exercises: [
      'Pulley Frente',
      'Remada Unilateral',
      'Remada Baixa no Triângulo',
      'Puxada com Pegada Supinada',
      'Pulôver',
    ],
  },
  C: {
    label: 'C — Quarta',
    muscles: 'Pernas + Abs',
    exercises: [
      'Agachamento Livre',
      'Leg Press 45',
      'Cadeira Extensora',
      'Stiff',
      'Mesa Flexora',
      'Abdominal Infra',
      'Abdominal Supra',
      'Prancha',
    ],
  },
  D: {
    label: 'D — Quinta',
    muscles: 'Ombro',
    exercises: [
      'Desenvolvimento',
      'Elevação Lateral',
      'Elevação Frontal',
      'Crucifixo Inverso',
      'Remada Alta (Pegada Fechada)',
    ],
  },
  E: {
    label: 'Sexta',
    muscles: 'Braço + Abs',
    exercises: [
      'Rosca Direta (Barra)',
      'Rosca Scott',
      'Rosca 45 Graus',
      'Extensão de Tríceps no Cabo',
      'Tríceps Pulley',
      'Tríceps Testa',
      'Abdominal Infra',
      'Abdominal Supra',
      'Prancha',
    ],
  },
}

// Weight input that persists to localStorage
function WeightInput({ exercise }: { exercise: string }) {
  const key = `ficha_weight_${exercise}`
  const [value, setValue] = useState('')
  const loaded = useRef(false)

  useEffect(() => {
    if (!loaded.current) {
      const stored = localStorage.getItem(key)
      if (stored) setValue(stored)
      loaded.current = true
    }
  }, [key])

  function handleChange(v: string) {
    setValue(v)
    if (v) localStorage.setItem(key, v)
    else localStorage.removeItem(key)
  }

  return (
    <div className="flex items-center gap-1.5 mt-1.5" onClick={(e) => e.stopPropagation()}>
      <Input
        type="number"
        step="0.5"
        placeholder="kg"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="h-6 w-16 text-xs px-2"
      />
      <span className="text-[10px] text-muted-foreground">kg usados</span>
    </div>
  )
}

type Props = {
  todayCompletions: FichaCompletion[]
}

export function FichaTreino({ todayCompletions }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [activeDay, setActiveDay] = useState<string>('A')
  const [completed, setCompleted] = useState<Set<string>>(
    new Set(todayCompletions.map((c) => `${c.day_letter}::${c.exercise_name}`))
  )
  const [loading, setLoading] = useState<string | null>(null)

  async function toggle(day: string, exercise: string) {
    const key = `${day}::${exercise}`
    const isDone = completed.has(key)
    setLoading(key)

    if (isDone) {
      await fetch('/api/treino-completions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day_letter: day, exercise_name: exercise, completed_at: today }),
      })
      setCompleted((prev) => { const next = new Set(prev); next.delete(key); return next })
    } else {
      await fetch('/api/treino-completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day_letter: day, exercise_name: exercise, completed_at: today }),
      })
      setCompleted((prev) => new Set([...prev, key]))
    }
    setLoading(null)
  }

  const current = FICHA[activeDay]
  const doneCount = current.exercises.filter((ex) => completed.has(`${activeDay}::${ex}`)).length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Ficha de Treino
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {doneCount}/{current.exercises.length}
          </Badge>
        </div>
        <div className="flex gap-1 mt-3 flex-wrap">
          {Object.entries(FICHA).map(([key, val]) => {
            const dayDone = val.exercises.filter((ex) => completed.has(`${key}::${ex}`)).length
            const allDone = dayDone === val.exercises.length
            return (
              <button
                key={key}
                onClick={() => setActiveDay(key)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeDay === key
                    ? 'bg-foreground text-background'
                    : allDone
                    ? 'bg-secondary text-green-400'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {key}
                {allDone && ' ✓'}
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <span className="text-sm font-semibold">{current.label}</span>
          <span className="text-xs text-muted-foreground ml-2">— {current.muscles}</span>
        </div>
        <div className="space-y-2">
          {current.exercises.map((exercise) => {
            const key = `${activeDay}::${exercise}`
            const done = completed.has(key)
            const isLoading = loading === key
            return (
              <div
                key={exercise}
                className={`w-full px-3 py-2.5 rounded-lg border transition-colors ${
                  done
                    ? 'border-foreground/30 bg-foreground/5'
                    : 'border-border hover:border-foreground/30'
                }`}
              >
                <button
                  className="w-full flex items-center gap-3 text-left"
                  onClick={() => toggle(activeDay, exercise)}
                  disabled={isLoading}
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                      done ? 'bg-foreground border-foreground' : 'border-border'
                    }`}
                  >
                    {done && (
                      <svg className="w-2.5 h-2.5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${done ? 'line-through text-muted-foreground' : ''}`}>
                    {exercise}
                  </span>
                  {isLoading && <span className="ml-auto text-xs text-muted-foreground">...</span>}
                </button>
                <WeightInput exercise={exercise} />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
