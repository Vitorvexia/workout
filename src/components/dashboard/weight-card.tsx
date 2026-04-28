'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WeightLog } from '@/lib/types'

const INITIAL_WEIGHT = 58
const TARGET_WEIGHT = 68

type Props = {
  latest: WeightLog | null
  onAdded: () => void
}

export function WeightCard({ latest, onAdded }: Props) {
  const [weight, setWeight] = useState('')
  const [loading, setLoading] = useState(false)

  const current = latest ? Number(latest.weight_kg) : INITIAL_WEIGHT
  const gained = current - INITIAL_WEIGHT
  const remaining = TARGET_WEIGHT - current
  const progress = Math.min(100, Math.max(0, (gained / (TARGET_WEIGHT - INITIAL_WEIGHT)) * 100))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!weight) return
    setLoading(true)
    await fetch('/api/peso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weight_kg: parseFloat(weight) }),
    })
    setWeight('')
    setLoading(false)
    onAdded()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Peso Atual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold tracking-tight">{current}</span>
          <span className="text-xl text-muted-foreground mb-1">kg</span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Meta: {TARGET_WEIGHT}kg</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>+{gained.toFixed(1)}kg ganhos</span>
            <span>{remaining.toFixed(1)}kg restantes</span>
          </div>
        </div>

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
