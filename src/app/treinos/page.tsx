import { supabase } from '@/lib/supabase'
import { TreinosClient } from '@/components/treinos/treinos-client'
import { FichaCompletion } from '@/lib/types'

export const revalidate = 0

export default async function TreinosPage() {
  const today = new Date().toISOString().split('T')[0]

  const [{ data: exercises }, { data: recentSets }, { data: todayCompletions }] = await Promise.all([
    supabase.from('exercises').select('*').order('muscle_group').order('name'),
    supabase
      .from('workout_sets')
      .select('*, exercise:exercises(*)')
      .order('logged_at', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(30),
    supabase
      .from('ficha_completions')
      .select('*')
      .eq('completed_at', today),
  ])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Treinos</h1>
        <p className="text-sm text-muted-foreground mt-1">Ficha de treino e registro de cargas</p>
      </div>
      <TreinosClient
        exercises={exercises ?? []}
        initialSets={recentSets ?? []}
        todayCompletions={(todayCompletions ?? []) as FichaCompletion[]}
      />
    </div>
  )
}
