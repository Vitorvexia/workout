import { supabase } from '@/lib/supabase'
import { PostureClient } from '@/components/postura/posture-client'

export const revalidate = 0

export default async function PosturaPage() {
  const { data: logs } = await supabase
    .from('posture_logs')
    .select('*')
    .order('logged_at', { ascending: false })
    .limit(30)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Postura</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe sua rotina postural diária
        </p>
      </div>
      <PostureClient initialLogs={logs ?? []} />
    </div>
  )
}
