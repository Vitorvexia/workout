import { supabase } from '@/lib/supabase'
import { AlimentacaoClient } from '@/components/alimentacao/alimentacao-client'
import { MealCompletion } from '@/lib/types'

export const revalidate = 0

export default async function AlimentacaoPage() {
  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('meal_completions')
    .select('*')
    .eq('date', today)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alimentação</h1>
        <p className="text-sm text-muted-foreground mt-1">6 refeições diárias para ganho de peso</p>
      </div>
      <AlimentacaoClient todayCompletions={(data ?? []) as MealCompletion[]} />
    </div>
  )
}
