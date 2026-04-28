'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select'
import { Exercise, WorkoutSet } from '@/lib/types'

type Props = {
  exercises: Exercise[]
  onLogged: (set: WorkoutSet) => void
}

export function ExerciseForm({ exercises, onLogged }: Props) {
  const [exerciseId, setExerciseId] = useState('')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [sets, setSets] = useState('3')
  const [lastWeight, setLastWeight] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const grouped = exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
    const key = ex.muscle_group ?? 'Outros'
    if (!acc[key]) acc[key] = []
    acc[key].push(ex)
    return acc
  }, {})

  const ORDER = ['Peito', 'Costas', 'Bíceps', 'Tríceps', 'Perna', 'Ombro', 'Abs', 'Outros']
  const sortedGroups = ORDER.filter((g) => grouped[g])

  useEffect(() => {
    if (!exerciseId) return
    fetch(`/api/treinos?exercise_id=${exerciseId}`)
      .then((r) => r.json())
      .then((data: WorkoutSet[]) => {
        if (data.length > 0) setLastWeight(Number(data[0].weight_kg))
        else setLastWeight(null)
      })
  }, [exerciseId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!exerciseId || !weight || !reps) return
    setLoading(true)
    const res = await fetch('/api/treinos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exercise_id: exerciseId,
        weight_kg: parseFloat(weight),
        reps: parseInt(reps),
        sets: parseInt(sets),
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) onLogged(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Registrar Série
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Exercício</Label>
            <Select value={exerciseId} onValueChange={(v) => setExerciseId(v ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar exercício" />
              </SelectTrigger>
              <SelectContent>
                {sortedGroups.map((group) => (
                  <SelectGroup key={group}>
                    <SelectLabel className="text-xs text-muted-foreground">{group}</SelectLabel>
                    {grouped[group].map((ex) => (
                      <SelectItem key={ex.id} value={ex.id}>
                        {ex.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            {lastWeight !== null && (
              <p className="text-xs text-muted-foreground">
                Último peso: <span className="text-foreground font-medium">{lastWeight}kg</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Peso (kg)</Label>
              <Input type="number" step="0.5" placeholder="60" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Reps</Label>
              <Input type="number" placeholder="12" value={reps} onChange={(e) => setReps(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Séries</Label>
              <Input type="number" placeholder="3" value={sets} onChange={(e) => setSets(e.target.value)} />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Registrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
