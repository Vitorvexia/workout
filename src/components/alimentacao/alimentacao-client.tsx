'use client'

import { useState } from 'react'
import { MealCard } from './meal-card'
import { Progress } from '@/components/ui/progress'
import { apiFetch, getToday } from '@/lib/utils'
import { MealCompletion } from '@/lib/types'

const MEALS = [
  {
    index: 0,
    time: '05:45',
    title: 'Pré-Treino',
    items: [
      '1 banana',
      '2 fatias de pão',
      '1 colher de pasta de amendoim',
      '1 copo de leite ou café com leite',
    ],
  },
  {
    index: 1,
    time: '08:00',
    title: 'Pós-Treino',
    items: [
      '2 doses de hipercalórico',
      '500ml de leite integral',
      '1 banana grande',
      '2 colheres de pasta de amendoim',
      '3 colheres de aveia',
      '2 colheres de Neston ou farinha láctea',
      '5g de creatina',
    ],
  },
  {
    index: 2,
    time: '11:00',
    title: 'Almoço',
    items: [
      'Carboidrato: arroz, macarrão ou pão',
      'Proteína: carne, frango ou ovo',
      'Gordura: azeite, maionese ou queijo',
    ],
  },
  {
    index: 3,
    time: '15:00',
    title: 'Lanche da Tarde',
    items: [
      '2 a 3 pães',
      'Recheio: ovo, carne ou pasta de amendoim',
      '1 copo de leite',
      'Opcional: shake simples com hipercalórico + leite',
    ],
  },
  {
    index: 4,
    time: '18:00',
    title: 'Café da Tarde',
    items: [
      'Carboidrato: arroz, pão ou macarrão',
      'Proteína: ovo, frango ou carne',
      'Gordura: azeite, maionese ou queijo',
    ],
  },
  {
    index: 5,
    time: '21:00',
    title: 'Shake Noturno',
    items: [
      '1 dose de hipercalórico',
      '500ml de leite integral',
      '1 banana grande',
      '2 colheres de pasta de amendoim',
      '3 colheres de aveia',
      '2 colheres de Neston ou farinha láctea',
      '1 scoop de whey',
    ],
  },
]

type Props = {
  todayCompletions: MealCompletion[]
}

export function AlimentacaoClient({ todayCompletions }: Props) {
  const today = getToday()
  const [done, setDone] = useState<Set<number>>(
    new Set(todayCompletions.map((m) => m.meal_index))
  )

  async function toggle(index: number) {
    const isDone = done.has(index)

    setDone((prev) => {
      const next = new Set(prev)
      if (isDone) next.delete(index)
      else next.add(index)
      return next
    })

    try {
      if (isDone) {
        await apiFetch('/api/alimentacao', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: today, meal_index: index }),
        })
      } else {
        await apiFetch('/api/alimentacao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: today, meal_index: index }),
        })
      }
    } catch {
      // revert on error
      setDone((prev) => {
        const next = new Set(prev)
        if (isDone) next.add(index)
        else next.delete(index)
        return next
      })
    }
  }

  const count = done.size
  const pct = Math.round((count / 6) * 100)

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{count}/6 refeições concluídas</span>
          <span className="text-muted-foreground">{pct}%</span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

      <div className="grid gap-3">
        {MEALS.map((meal) => (
          <MealCard
            key={meal.index}
            meal={meal}
            done={done.has(meal.index)}
            onToggle={toggle}
          />
        ))}
      </div>
    </div>
  )
}
