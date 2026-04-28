import { WeeklyStatus } from '@/components/dashboard/weekly-status'
import { supabase } from '@/lib/supabase'
import { DashboardClient } from '@/components/dashboard/dashboard-client'

export const revalidate = 0

export default async function DashboardPage() {
  const { data: weightLogs } = await supabase
    .from('weight_logs')
    .select('*')
    .order('logged_at', { ascending: true })
    .limit(60)

  const logs = weightLogs ?? []
  const latest = logs.at(-1) ?? null

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhamento de evolução física
        </p>
      </div>

      <DashboardClient latest={latest} logs={logs} />

      <WeeklyStatus />
    </div>
  )
}
