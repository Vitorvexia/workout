'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SupplementLog } from '@/lib/types'

type SupplementKey = keyof Pick<SupplementLog, 'took_hypercaloric' | 'took_whey' | 'took_creatine'>

const SUPPLEMENTS: { key: SupplementKey; label: string; description: string }[] = [
  { key: 'took_hypercaloric', label: 'Hipercalórico', description: 'Ganho de massa' },
  { key: 'took_whey', label: 'Whey Protein', description: 'Recuperação muscular' },
  { key: 'took_creatine', label: 'Creatina', description: 'Força e performance' },
]

type Props = { onLogged: (log: SupplementLog) => void }

export function SupplementForm({ onLogged }: Props) {
  const [checked, setChecked] = useState({
    took_hypercaloric: false,
    took_whey: false,
    took_creatine: false,
  })
  const [loading, setLoading] = useState(false)

  function toggle(key: SupplementKey) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/suplementos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...checked,
        logged_at: new Date().toISOString().split('T')[0],
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      onLogged(data)
      setChecked({ took_hypercaloric: false, took_whey: false, took_creatine: false })
    }
  }

  const total = Object.values(checked).filter(Boolean).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Registro Diário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {SUPPLEMENTS.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center gap-4 p-3 rounded-lg border border-border cursor-pointer hover:bg-accent/30 transition-colors select-none"
              onClick={() => toggle(key)}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  checked[key] ? 'bg-foreground border-foreground' : 'border-border'
                }`}
              >
                {checked[key] && (
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
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">{total}/3 tomados hoje</span>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Registrar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
