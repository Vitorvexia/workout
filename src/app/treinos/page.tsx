import { supabase } from '@/lib/supabase'
import { TreinosClient } from '@/components/treinos/treinos-client'

export const revalidate = 0

export default async function TreinosPage() {
  const [{ data: exercises }, { data: recentSets }] = await Promise.all([
    supabase.from('exercises').select('*').order('name'),
    supabase
      .from('workout_sets')
      .select('*, exercise:exercises(*)')
      .order('logged_at', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(30),
  ])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Treinos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Registre séries e acompanhe evolução de carga
        </p>
      </div>
      <TreinosClient exercises={exercises ?? []} initialSets={recentSets ?? []} />
    </div>
  )
}
