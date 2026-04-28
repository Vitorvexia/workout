import { supabase } from '@/lib/supabase'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { WeeklyRoutines } from '@/components/dashboard/weekly-routines'
import { format, startOfWeek } from 'date-fns'

export const revalidate = 0

export default async function DashboardPage() {
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')

  const [
    { data: weightLogs },
    { data: postureLogs },
    { data: workoutSets },
    { data: supplementLogs },
    { data: postureAll },
    { data: workoutAll },
    { data: supplementAll },
  ] = await Promise.all([
    supabase.from('weight_logs').select('*').order('logged_at', { ascending: true }).limit(120),
    supabase.from('posture_checklist').select('logged_at').gte('logged_at', weekStart),
    supabase.from('workout_sets').select('logged_at').gte('logged_at', weekStart),
    supabase.from('supplement_weekly').select('logged_at').gte('logged_at', weekStart),
    supabase.from('posture_checklist').select('logged_at').order('logged_at', { ascending: true }),
    supabase.from('workout_sets').select('logged_at').order('logged_at', { ascending: true }),
    supabase.from('supplement_weekly').select('logged_at').order('logged_at', { ascending: true }),
  ])

  const logs = weightLogs ?? []
  const latest = logs.at(-1) ?? null

  const postureDates = [...new Set((postureLogs ?? []).map((r) => r.logged_at as string))]
  const workoutDates = [...new Set((workoutSets ?? []).map((r) => r.logged_at as string))]
  const supplementDates = [...new Set((supplementLogs ?? []).map((r) => r.logged_at as string))]

  const postureAllDates = [...new Set((postureAll ?? []).map((r) => r.logged_at as string))]
  const workoutAllDates = [...new Set((workoutAll ?? []).map((r) => r.logged_at as string))]
  const supplementAllDates = [...new Set((supplementAll ?? []).map((r) => r.logged_at as string))]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhamento de evolução física</p>
      </div>
      <DashboardClient latest={latest} logs={logs} />
      <WeeklyRoutines
        postureDates={postureDates}
        workoutDates={workoutDates}
        supplementDates={supplementDates}
        postureAllDates={postureAllDates}
        workoutAllDates={workoutAllDates}
        supplementAllDates={supplementAllDates}
      />
    </div>
  )
}
