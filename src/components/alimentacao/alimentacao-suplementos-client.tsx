'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { MealCompletion, SupplementWeekly, SupplementKey, MANDATORY_SUPS } from '@/lib/types'
import { CheckCircle2, Circle, Zap, UtensilsCrossed } from 'lucide-react'

// ─── Meal definitions ────────────────────────────────────────────────────────

type SupEntry = { key: SupplementKey; label: string }

type MealDef = {
  index: number
  time: string
  title: string
  foods: string[]
  note?: string
  supplements: SupEntry[]
  optional: SupEntry[]
}

const MEALS: MealDef[] = [
  {
    index: 0,
    time: '05:45',
    title: 'Pré-Treino',
    foods: [
      '1 banana',
      '2 fatias de pão',
      '1 colher de pasta de amendoim',
      '1 copo de leite ou café com leite',
    ],
    supplements: [],
    optional: [],
  },
  {
    index: 1,
    time: '08:00',
    title: 'Pós-Treino',
    foods: [
      '2 doses de hipercalórico',
      '500ml de leite integral',
      '1 banana grande',
      '2 colheres de pasta de amendoim',
      '3 colheres de aveia',
      '2 colheres de Neston ou farinha láctea',
    ],
    supplements: [
      { key: 'creatina', label: 'Creatina (5g)' },
      { key: 'hipercalorico_manha', label: 'Hipercalórico manhã' },
    ],
    optional: [],
  },
  {
    index: 2,
    time: '11:00',
    title: 'Almoço',
    foods: [
      'Carboidrato: arroz, macarrão ou pão',
      'Proteína: carne, frango ou ovo',
      'Gordura: azeite, maionese ou queijo',
    ],
    note: 'Prato cheio, sem economizar.',
    supplements: [],
    optional: [],
  },
  {
    index: 3,
    time: '15:00',
    title: 'Lanche da Tarde',
    foods: [
      '2 a 3 pães',
      'Recheio: ovo, carne ou pasta de amendoim',
      '1 copo de leite',
    ],
    supplements: [],
    optional: [{ key: 'hipercalorico_tarde', label: 'Hipercalórico tarde' }],
  },
  {
    index: 4,
    time: '18:00',
    title: 'Café da Tarde',
    foods: [
      'Carboidrato: arroz, pão ou macarrão',
      'Proteína: ovo, frango ou carne',
      'Gordura: azeite, maionese ou queijo',
    ],
    note: 'Exemplos: arroz + ovo + azeite · 3 pães + ovo + queijo',
    supplements: [],
    optional: [],
  },
  {
    index: 5,
    time: '21:00',
    title: 'Shake Noturno',
    foods: [
      '1 dose de hipercalórico',
      '500ml de leite integral',
      '1 banana grande',
      '2 colheres de pasta de amendoim',
      '3 colheres de aveia',
      '2 colheres de Neston ou farinha láctea',
    ],
    supplements: [
      { key: 'whey', label: 'Whey' },
      { key: 'hipercalorico_noite', label: 'Hipercalórico noite' },
    ],
    optional: [],
  },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  todayCompletions: MealCompletion[]
  todaySupplements: SupplementWeekly[]
  today: string
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckRow({
  done,
  label,
  onToggle,
  variant = 'default',
}: {
  done: boolean
  label: string
  onToggle: () => void
  variant?: 'default' | 'sup' | 'optional'
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'flex items-center gap-2 w-full text-left rounded-md px-2 py-1.5 transition-colors text-sm',
        done
          ? variant === 'optional'
            ? 'text-yellow-300/90 bg-yellow-500/10'
            : variant === 'sup'
            ? 'text-blue-300/90 bg-blue-500/10'
            : 'text-green-300/90 bg-green-500/10'
          : 'text-muted-foreground hover:bg-accent/40'
      )}
    >
      {done ? (
        <CheckCircle2 className={cn('w-4 h-4 flex-shrink-0',
          variant === 'optional' ? 'text-yellow-400' : variant === 'sup' ? 'text-blue-400' : 'text-green-400'
        )} />
      ) : (
        <Circle className="w-4 h-4 flex-shrink-0 opacity-40" />
      )}
      <span className={cn(done && 'line-through opacity-70')}>{label}</span>
    </button>
  )
}

function MealCard({
  meal,
  mealDone,
  supsDone,
  onToggleMeal,
  onToggleSup,
}: {
  meal: MealDef
  mealDone: boolean
  supsDone: Set<string>
  onToggleMeal: () => void
  onToggleSup: (key: SupplementKey) => void
}) {
  const hasSupplements = meal.supplements.length > 0
  const hasOptional = meal.optional.length > 0

  return (
    <Card className={cn(
      'transition-all',
      mealDone ? 'border-green-500/30 bg-green-500/5' : 'border-border'
    )}>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">{meal.time}</span>
              <span className="text-xs text-muted-foreground/50">·</span>
              <span className="text-xs text-muted-foreground">REF {meal.index + 1}</span>
            </div>
            <h3 className="font-semibold text-sm mt-0.5">{meal.title}</h3>
          </div>
          {mealDone && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 flex-shrink-0">
              ✓ Feito
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-3">
        {/* Foods */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1.5 flex items-center gap-1">
            <UtensilsCrossed className="w-3 h-3" /> Alimentos
          </p>
          <ul className="space-y-0.5">
            {meal.foods.map((f, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="opacity-40 mt-0.5">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {meal.note && (
            <p className="text-[11px] text-muted-foreground/50 italic mt-1.5">{meal.note}</p>
          )}
        </div>

        {/* Mandatory supplements */}
        {hasSupplements && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400/60 mb-1.5">
              💊 Suplementos
            </p>
            <div className="space-y-1">
              {meal.supplements.map((s) => (
                <CheckRow
                  key={s.key}
                  done={supsDone.has(s.key)}
                  label={s.label}
                  variant="sup"
                  onToggle={() => onToggleSup(s.key)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Optional */}
        {hasOptional && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-yellow-400/60 mb-1.5 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Turbo (opcional)
            </p>
            <div className="space-y-1">
              {meal.optional.map((s) => (
                <CheckRow
                  key={s.key}
                  done={supsDone.has(s.key)}
                  label={s.label}
                  variant="optional"
                  onToggle={() => onToggleSup(s.key)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Divider + meal checkbox */}
        <div className="pt-1 border-t border-border/50">
          <CheckRow
            done={mealDone}
            label="Refeição concluída"
            onToggle={onToggleMeal}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main client ──────────────────────────────────────────────────────────────

export function AlimentacaoSupplementosClient({ todayCompletions, todaySupplements, today }: Props) {
  const [meals, setMeals] = useState<Set<number>>(
    () => new Set(todayCompletions.map((c) => c.meal_index))
  )
  const [sups, setSups] = useState<Set<string>>(
    () => new Set(todaySupplements.filter((s) => s.count > 0).map((s) => s.supplement))
  )

  // ── Progress ──────────────────────────────────────────────────────────────
  const mealsDone = meals.size
  const mandatorySupsDone = MANDATORY_SUPS.filter((k) => sups.has(k)).length
  const total = mealsDone + mandatorySupsDone // out of 10
  const pct = Math.round((total / 10) * 100)

  // ── Meal toggle ───────────────────────────────────────────────────────────
  const toggleMeal = useCallback(
    async (index: number) => {
      const wasDone = meals.has(index)
      setMeals((prev) => {
        const next = new Set(prev)
        wasDone ? next.delete(index) : next.add(index)
        return next
      })
      try {
        await fetch('/api/alimentacao', {
          method: wasDone ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: today, meal_index: index }),
        })
      } catch {
        setMeals((prev) => {
          const next = new Set(prev)
          wasDone ? next.add(index) : next.delete(index)
          return next
        })
      }
    },
    [meals, today]
  )

  // ── Supplement toggle ─────────────────────────────────────────────────────
  const toggleSup = useCallback(
    async (key: SupplementKey) => {
      const wasDone = sups.has(key)
      setSups((prev) => {
        const next = new Set(prev)
        wasDone ? next.delete(key) : next.add(key)
        return next
      })
      try {
        await fetch('/api/suplementos', {
          method: wasDone ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logged_at: today, supplement: key, count: wasDone ? 0 : 1 }),
        })
      } catch {
        setSups((prev) => {
          const next = new Set(prev)
          wasDone ? next.add(key) : next.delete(key)
          return next
        })
      }
    },
    [sups, today]
  )

  const scoreColor =
    pct >= 90 ? 'text-green-400'
    : pct >= 70 ? 'text-blue-400'
    : pct >= 40 ? 'text-yellow-400'
    : 'text-red-400'

  const barColor =
    pct >= 90 ? 'bg-green-500'
    : pct >= 70 ? 'bg-blue-500'
    : pct >= 40 ? 'bg-yellow-500'
    : 'bg-red-500'

  return (
    <div className="space-y-4">
      {/* Progress block */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums text-foreground">{mealsDone}<span className="text-sm text-muted-foreground font-normal">/6</span></p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Refeições</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums text-foreground">{mandatorySupsDone}<span className="text-sm text-muted-foreground font-normal">/4</span></p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Suplementos</p>
            </div>
            <div className="text-center">
              <p className={cn('text-2xl font-bold tabular-nums', scoreColor)}>{total}<span className="text-sm text-muted-foreground font-normal">/10</span></p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Meta total</p>
            </div>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', barColor)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground text-right mt-1">{pct}% do dia completo</p>
        </CardContent>
      </Card>

      {/* Meal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MEALS.map((meal) => (
          <MealCard
            key={meal.index}
            meal={meal}
            mealDone={meals.has(meal.index)}
            supsDone={sups}
            onToggleMeal={() => toggleMeal(meal.index)}
            onToggleSup={toggleSup}
          />
        ))}
      </div>
    </div>
  )
}
