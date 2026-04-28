import { supabase } from '@/lib/supabase'
import { SupplementClient } from '@/components/suplementos/supplement-client'

export const revalidate = 0

export default async function SupplementosPage() {
  const { data: logs } = await supabase
    .from('supplement_logs')
    .select('*')
    .order('logged_at', { ascending: false })
    .limit(30)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Suplementação</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Registre seus suplementos diários
        </p>
      </div>
      <SupplementClient initialLogs={logs ?? []} />
    </div>
  )
}
