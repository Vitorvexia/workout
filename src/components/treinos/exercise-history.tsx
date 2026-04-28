import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WorkoutSet } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = { sets: WorkoutSet[] }

export function ExerciseHistory({ sets }: Props) {
  const grouped = sets.reduce<Record<string, WorkoutSet[]>>((acc, s) => {
    const key = s.exercise?.name ?? s.exercise_id
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {})

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Histórico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(grouped).length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum registro ainda
          </p>
        )}
        {Object.entries(grouped).map(([name, items]) => (
          <div key={name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{name}</span>
              {items[0].exercise?.muscle_group && (
                <Badge variant="secondary" className="text-xs">
                  {items[0].exercise.muscle_group}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              {items.slice(0, 5).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {format(parseISO(s.logged_at), "dd 'de' MMM", { locale: ptBR })}
                  </span>
                  <span className="font-mono text-xs">
                    {s.sets}×{s.reps} @ {s.weight_kg}kg
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
