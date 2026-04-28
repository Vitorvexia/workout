'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WeightLog } from '@/lib/types'
import { WeightSlider } from './weight-slider'
import { Pencil, Check, X } from 'lucide-react'

const INITIAL_WEIGHT = 58
const DEFAULT_TARGET = 68
const LS_KEY = 'workout_target_weight'

type Props = {
  latest: WeightLog | null
  onAdded: (newLog: WeightLog) => void
}

export function WeightCard({ latest, onAdded }: Props) {
  const [weight, setWeight] = useState('')
  const [loading, setLoading] = useState(false)
  const [target, setTarget] = useState(DEFAULT_TARGET)
  const [editingTarget, setEditingTarget] = useState(false)
  const [targetInput, setTargetInput] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY)
    if (stored) setTarget(parseFloat(stored))
  }, [])

  const current = latest ? Number(latest.weight_kg) : INITIAL_WEIGHT

  function saveTarget() {
    const val = parseFloat(targetInput)
    if (!isNaN(val) && val > current) {
      setTarget(val)
      localStorage.setItem(LS_KEY, String(val))
    }
    setEditingTarget(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!weight) return
    setLoading(true)
    const res = await fetch('/api/peso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weight_kg: parseFloat(weight) }),
    })
    const newLog: WeightLog = await res.json()
    setWeight('')
    setLoading(false)
    if (res.ok) onAdded(newLog)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Peso Atual
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Meta:</span>
            {editingTarget ? (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  step="0.5"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="h-6 w-20 text-xs px-2"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveTarget()
                    if (e.key === 'Escape') setEditingTarget(false)
                  }}
                />
                <span className="text-xs">kg</span>
                <button onClick={saveTarget} className="hover:opacity-70">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setEditingTarget(false)} className="text-muted-foreground hover:opacity-70">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                className="flex items-center gap-1 group"
                onClick={() => { setTargetInput(String(target)); setEditingTarget(true) }}
              >
                <span className="text-sm font-semibold">{target}kg</span>
                <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold tracking-tight">{current}</span>
          <span className="text-xl text-muted-foreground mb-1">kg</span>
        </div>

        <WeightSlider min={INITIAL_WEIGHT} max={target} current={current} />

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="number"
            step="0.1"
            placeholder="Registrar peso"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="h-8 text-sm"
          />
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? '...' : 'Salvar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
