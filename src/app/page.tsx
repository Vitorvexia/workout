import { supabase } from '@/lib/supabase'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { WeeklyRoutines } from '@/components/dashboard/weekly-routines'
import { subDays, format } from 'date-fns'

export const revalidate = 0

export default async function DashboardPage() {
  const sevenDaysAgo = format(subDays(new Date(), 6), 'yyyy-MM-dd')

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
      .gte('logged_at', sevenDaysAgo),
    supabase
      .from('workout_sets')
      .select('logged_at')
      .gte('logged_at', sevenDaysAgo),
    supabase
      .from('supplement_logs')
      .select('logged_at')
      .gte('logged_at', sevenDaysAgo),
  ])

  const logs = weightLogs ?? []
  const latest = logs.at(-1) ?? null

  // Unique dates only
  const postureDates = [...new Set((postureLogs ?? []).map((r) => r.logged_at))]
  const workoutDates = [...new Set((workoutSets ?? []).map((r) => r.logged_at))]
  const supplementDates = [...new Set((supplementLogs ?? []).map((r) => r.logged_at))]

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
