import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { startOfWeek, format } from 'date-fns'

export async function WeeklyStatus() {
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')

  const [{ count: supplementDays }, { count: postureDays }, { count: workoutDays }] =
    await Promise.all([
      supabase
        .from('supplement_logs')
        .select('*', { count: 'exact', head: true })
        .gte('logged_at', weekStart),
      supabase
        .from('posture_logs')
        .select('*', { count: 'exact', head: true })
        .gte('logged_at', weekStart),
      supabase
        .from('workout_sets')
        .select('logged_at', { count: 'exact', head: true })
        .gte('logged_at', weekStart),
    ])

  const items = [
    { label: 'Dias de suplemento', value: supplementDays ?? 0, max: 7 },
    { label: 'Dias de postura', value: postureDays ?? 0, max: 7 },
    { label: 'Treinos', value: workoutDays ?? 0, max: 5 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Esta semana
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">{item.value}/{item.max}</span>
            </div>
            <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full"
                style={{ width: `${(item.value / item.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
