import { supabaseServer as supabase } from '@/lib/supabase-server'
import { AlimentacaoSupplementosClient } from '@/components/alimentacao/alimentacao-suplementos-client'
import { MealCompletion, SupplementWeekly } from '@/lib/types'

export const revalidate = 0

export default async function AlimentacaoPage() {
  const today = new Date().toISOString().split('T')[0]

  const [{ data: meals }, { data: sups }] = await Promise.all([
    supabase.from('meal_completions').select('*').eq('date', today),
    supabase.from('supplement_weekly').select('*').eq('logged_at', today),
  ])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alimentação & Suplementos</h1>
        <p className="text-sm text-muted-foreground mt-1">Roteiro diário de execução</p>
      </div>
      <AlimentacaoSupplementosClient
        todayCompletions={(meals ?? []) as MealCompletion[]}
        todaySupplements={(sups ?? []) as SupplementWeekly[]}
        today={today}
      />
    </div>
  )
}
