import { supabase } from '@/lib/supabase'
import { PostureClient } from '@/components/postura/posture-client'
import { PostureChecklist } from '@/lib/types'

export const revalidate = 0

export default async function PosturaPage() {
  const today = new Date().toISOString().split('T')[0]

  const [{ data: todayData }, { data: history }] = await Promise.all([
    supabase.from('posture_checklist').select('*').eq('logged_at', today).single(),
    supabase.from('posture_checklist').select('*').order('logged_at', { ascending: false }).limit(30),
  ])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ficha de Postura</h1>
        <p className="text-sm text-muted-foreground mt-1">Rotina diária de exercícios posturais</p>
      </div>
      <PostureClient
        todayChecklist={(todayData as PostureChecklist | null)}
        history={(history ?? []) as PostureChecklist[]}
      />
    </div>
  )
}
