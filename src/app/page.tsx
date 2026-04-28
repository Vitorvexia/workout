import { supabase } from '@/lib/supabase'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { WeeklyRoutines } from '@/components/dashboard/weekly-routines'

export const revalidate = 0

export default async function DashboardPage() {
  const [
    { data: weightLogs },
    { data: postureLogs },
    { data: workoutSets },
    { data: supplementLogs },
  ] = await Promise.all([
    supabase
      .from('weight_logs')
      .select('*')
      .order('logged_at', { ascending: true })
      .limit(120),
    supabase
      .from('posture_logs')
      .select('logged_at')
      .order('logged_at', { ascending: true }),
    supabase
      .from('workout_sets')
      .select('logged_at')
      .order('logged_at', { ascending: true }),
    supabase
      .from('supplement_logs')
      .select('logged_at')
      .order('logged_at', { ascending: true }),
  ])

  const logs = weightLogs ?? []
  const latest = logs.at(-1) ?? null

  const postureDates = [...new Set((postureLogs ?? []).map((r) => r.logged_at as string))]
  const workoutDates = [...new Set((workoutSets ?? []).map((r) => r.logged_at as string))]
  const supplementDates = [...new Set((supplementLogs ?? []).map((r) => r.logged_at as string))]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhamento de evolução física
        </p>
      </div>

      <DashboardClient latest={latest} logs={logs} />

      <WeeklyRoutines
        postureDates={postureDates}
        workoutDates={workoutDates}
        supplementDates={supplementDates}
      />
    </div>
  )
}
