'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PostureLog } from '@/lib/types'

type Props = { onLogged: (log: PostureLog) => void }

export function PostureForm({ onLogged }: Props) {
  const [didExercises, setDidExercises] = useState(false)
  const [painLevel, setPainLevel] = useState(0)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/postura', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        did_exercises: didExercises,
        back_pain_level: painLevel,
        logged_at: new Date().toISOString().split('T')[0],
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      onLogged(data)
      setPainLevel(0)
      setDidExercises(false)
    }
  }

  const painColors: Record<number, string> = {
    0: 'text-green-400', 1: 'text-green-400', 2: 'text-green-400',
    3: 'text-yellow-400', 4: 'text-yellow-400', 5: 'text-yellow-400',
    6: 'text-orange-400', 7: 'text-orange-400',
    8: 'text-red-400', 9: 'text-red-400', 10: 'text-red-400',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Registro Diário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setDidExercises(!didExercises)}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                didExercises ? 'bg-foreground border-foreground' : 'border-border'
              }`}
            >
              {didExercises && (
                <svg
                  className="w-3 h-3 text-background"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm select-none">Fiz exercícios posturais</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Dor na coluna</Label>
              <span className={`text-lg font-bold ${painColors[painLevel]}`}>
                {painLevel}/10
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className="w-full accent-foreground"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Sem dor</span>
              <span>Dor intensa</span>
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
