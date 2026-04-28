import { supabaseServer as supabase } from '@/lib/supabase-server'
import { TreinosClient } from '@/components/treinos/treinos-client'
import { FichaCompletion } from '@/lib/types'

export const revalidate = 0

export default async function TreinosPage() {
  const today = new Date().toISOString().split('T')[0]

  const { data: todayCompletions } = await supabase
    .from('ficha_completions')
    .select('*')
    .eq('completed_at', today)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ficha de Treino</h1>
        <p className="text-sm text-muted-foreground mt-1">Selecione o dia e marque os exercícios concluídos</p>
      </div>
      <TreinosClient
        todayCompletions={(todayCompletions ?? []) as FichaCompletion[]}
      />
    </div>
  )
}
