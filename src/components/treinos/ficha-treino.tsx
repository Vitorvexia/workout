'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FichaCompletion, ExerciseWeight } from '@/lib/types'
import { getToday } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

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

type WeightHistory = {
  last: number | null
  record: number | null
}

function WeightInput({ exercise }: { exercise: string }) {
  const lsKey = `ficha_weight_${exercise}`
  const today = getToday()
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<WeightHistory>({ last: null, record: null })
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    // seed from localStorage as instant visual cache
    const cached = localStorage.getItem(lsKey)
    if (cached) setValue(cached)

    // fetch history from Supabase
    fetch(`/api/exercise-weights?name=${encodeURIComponent(exercise)}`)
      .then((r) => r.json())
      .then((data: ExerciseWeight[]) => {
        if (!data.length) return
        const weights = data.map((d) => Number(d.weight_kg))
        const record = Math.max(...weights)
        // last = most recent entry that is NOT today
        const lastEntry = data.find((d) => d.logged_at !== today)
        setHistory({ last: lastEntry ? Number(lastEntry.weight_kg) : null, record })
        // show today's value if already saved
        const todayEntry = data.find((d) => d.logged_at === today)
        if (todayEntry) {
          const v = String(todayEntry.weight_kg)
          setValue(v)
          localStorage.setItem(lsKey, v)
        }
      })
      .catch(() => {/* best effort */})
  }, [exercise, lsKey, today])

  async function handleBlur() {
    if (!value) return
    const kg = parseFloat(value)
    if (isNaN(kg) || kg <= 0) return

    localStorage.setItem(lsKey, value)

    try {
      await fetch('/api/exercise-weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercise_name: exercise, weight_kg: kg, logged_at: today }),
      })
      setHistory((prev) => ({
        last: prev.last,
        record: prev.record !== null ? Math.max(prev.record, kg) : kg,
      }))
    } catch {/* best effort */}
  }

  const isRecord = history.record !== null && parseFloat(value) >= history.record && parseFloat(value) > 0
  const isProgress = history.last !== null && parseFloat(value) > history.last

  return (
    <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
      <Input
        type="number"
        step="0.5"
        min="0"
        placeholder="kg"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        className="h-9 w-20 text-sm px-2"
        inputMode="decimal"
      />
      <div className="flex items-center gap-1.5 text-xs">
        {history.last !== null && (
          <span className="text-muted-foreground">último: {history.last}kg</span>
        )}
        {history.record !== null && (
          <span className="text-muted-foreground">| rec: {history.record}kg</span>
        )}
        {isProgress && (
          <span className="text-green-400 flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" /> PR
          </span>
        )}
        {isRecord && !isProgress && (
          <span className="text-yellow-400">🏆</span>
        )}
      </div>
    </div>
  )
}

type Props = {
  todayCompletions: FichaCompletion[]
}

export function FichaTreino({ todayCompletions }: Props) {
  const today = getToday()
  const [activeDay, setActiveDay] = useState<string>('A')
  const [completed, setCompleted] = useState<Set<string>>(
    new Set(todayCompletions.map((c) => `${c.day_letter}::${c.exercise_name}`))
  )
  const [loading, setLoading] = useState<string | null>(null)

  const toggle = useCallback(async (day: string, exercise: string) => {
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
  }, [completed, today])

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
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
                className={`w-full px-3 py-3 rounded-lg border transition-colors ${
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
