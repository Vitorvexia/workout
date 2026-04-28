import { supabase } from '@/lib/supabase'
import { SupplementClient } from '@/components/suplementos/supplement-client'
import { SupplementWeekly } from '@/lib/types'
import { format, startOfWeek, endOfWeek } from 'date-fns'

export const revalidate = 0

export default async function SupplementosPage() {
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')

  const { data: weekLogs } = await supabase
    .from('supplement_weekly')
    .select('*')
    .gte('logged_at', weekStart)
    .lte('logged_at', weekEnd)
    .order('logged_at', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Suplementação</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Creatina 5g · Whey 1×/dia · Hipercalórico 2–3×/dia
        </p>
      </div>
      <SupplementClient weekLogs={(weekLogs ?? []) as SupplementWeekly[]} />
    </div>
  )
}
