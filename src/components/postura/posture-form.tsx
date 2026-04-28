'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PostureChecklist } from '@/lib/types'
import { ChevronDown, ChevronUp } from 'lucide-react'

const EXERCISES = [
  {
    num: 1,
    name: 'Extensão de Coluna na Cadeira',
    summary: '1 série · 5 repetições — mobiliza coluna torácica.',
    description: 'Utilize uma cadeira firme e sem rodinhas. Sente-se, coloque as mãos na nuca e leve o tronco para trás sobre o encosto da cadeira, abrindo bem os cotovelos para expandir a caixa torácica. Vá até o seu limite sem forçar excessivamente e retorne devagar.',
  },
  {
    num: 2,
    name: 'Alongamento de Peitoral no Batente da Porta',
    summary: '1 série · 2 repetições cada lado — abre postura fechada.',
    description: 'Posicione o braço esticado ou o antebraço no batente da porta ou em uma parede. Gire o corpo para o lado oposto até sentir o peito alongar. Sustente a posição por 20 segundos de cada lado.',
  },
  {
    num: 3,
    name: 'Fortalecimento "W para Y"',
    summary: '1 série · 12 repetições — fortalece musculatura das costas.',
    description: 'Deite-se de barriga para baixo. Saia da posição de "W" (cotovelos dobrados) e estique os braços à frente formando um "Y". Variação: você também pode apenas elevar os braços lateralmente com os polegares apontados para cima, o que ajuda a queimar e fortalecer a musculatura das costas.',
  },
  {
    num: 4,
    name: 'Mobilidade com Cabo de Vassoura ou Toalha',
    summary: '2 séries · 10 movimentos — abre ombros e reequilibra posterior.',
    description: 'Segure um cabo de vassoura ou uma toalha esticada atrás das costas. Faça movimentos de subida e descida ou leve o bastão para trás, rodando os ombros e estufando o peito. Este movimento ajuda a reequilibrar a musculatura posterior que costuma estar fraca e alongada demais.',
  },
  {
    num: 5,
    name: 'Extensão de Coluna em Prono (Posição de "Cobra")',
    summary: '2 séries · 10 repetições — inverte a corcunda, alonga anterior.',
    description: 'Nível 1: Deitado de barriga para baixo, apoie apenas os antebraços no chão e olhe para cima. Nível 2: Se conseguir avançar, estique os braços completamente, trazendo as mãos mais próximas ao corpo para aumentar a extensão das costas.',
  },
]

type ExKey = 'exercise_1' | 'exercise_2' | 'exercise_3' | 'exercise_4' | 'exercise_5'
const EX_KEYS: ExKey[] = ['exercise_1', 'exercise_2', 'exercise_3', 'exercise_4', 'exercise_5']

type Props = {
  today: PostureChecklist | null
  onSaved: (checklist: PostureChecklist) => void
}

export function PostureForm({ today, onSaved }: Props) {
  const [checked, setChecked] = useState<Record<ExKey, boolean>>({
    exercise_1: today?.exercise_1 ?? false,
    exercise_2: today?.exercise_2 ?? false,
    exercise_3: today?.exercise_3 ?? false,
    exercise_4: today?.exercise_4 ?? false,
    exercise_5: today?.exercise_5 ?? false,
  })
  const [expanded, setExpanded] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  function toggle(key: ExKey) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleSave() {
    setLoading(true)
    const res = await fetch('/api/postura', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...checked,
        logged_at: new Date().toISOString().split('T')[0],
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) onSaved(data)
  }

  const doneCount = Object.values(checked).filter(Boolean).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Exercícios de Hoje</h2>
        <Badge variant={doneCount === 5 ? 'default' : 'secondary'}>{doneCount}/5</Badge>
      </div>

      {EXERCISES.map((ex, i) => {
        const key = EX_KEYS[i]
        const done = checked[key]
        const open = expanded === ex.num

        return (
          <Card key={ex.num} className={done ? 'border-foreground/20' : ''}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggle(key)}
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    done ? 'bg-foreground border-foreground' : 'border-border'
                  }`}
                >
                  {done && (
                    <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <button
                    className="w-full flex items-center justify-between gap-2 text-left"
                    onClick={() => setExpanded(open ? null : ex.num)}
                  >
                    <div>
                      <span className="text-[10px] text-muted-foreground font-medium mr-2">#{ex.num}</span>
                      <span className={`text-sm font-medium ${done ? 'line-through text-muted-foreground' : ''}`}>
                        {ex.name}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">{ex.summary}</p>
                    </div>
                    {open ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  {open && (
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed border-t border-border pt-2">
                      {ex.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      <Button onClick={handleSave} className="w-full" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Progresso'}
      </Button>
    </div>
  )
}
