import { supabaseServer as supabase } from '@/lib/supabase-server'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { WeeklyRoutines } from '@/components/dashboard/weekly-routines'
import { format, startOfWeek, subDays } from 'date-fns'
import { computeDayScore, computeStreaks, computeCheckSemanal } from '@/lib/score'
import { WeightLog, MealCompletion, SupplementWeekly, FichaCompletion, MANDATORY_SUPS } from '@/lib/types'

export const revalidate = 0

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function safeQuery<T>(query: any): Promise<T[]> {
  try {
    const { data } = await query
    return (data ?? []) as T[]
  } catch {
    return []
  }
}

export default async function DashboardPage() {
  const today = new Date().toISOString().split('T')[0]
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  const weekEnd = format(new Date(), 'yyyy-MM-dd')
  const ninetyDaysAgo = format(subDays(new Date(), 90), 'yyyy-MM-dd')

  const [
    weightLogs,
    fichaWeek,
    supplementLogs,
    fichaAll,
    supplementAll,
    todayMeals,
    mealHistory,
    todaySupplements,
    todayFicha,
  ] = await Promise.all([
    safeQuery<WeightLog>(supabase.from('weight_logs').select('*').order('logged_at', { ascending: true }).order('created_at', { ascending: true }).limit(120)),
    safeQuery<{ completed_at: string }>(supabase.from('ficha_completions').select('completed_at').gte('completed_at', weekStart)),
    safeQuery<{ logged_at: string }>(supabase.from('supplement_weekly').select('logged_at').gte('logged_at', weekStart)),
    safeQuery<{ completed_at: string }>(supabase.from('ficha_completions').select('completed_at').order('completed_at', { ascending: true })),
    safeQuery<{ logged_at: string }>(supabase.from('supplement_weekly').select('logged_at').order('logged_at', { ascending: true })),
    safeQuery<MealCompletion>(supabase.from('meal_completions').select('*').eq('date', today)),
    safeQuery<MealCompletion>(supabase.from('meal_completions').select('*').gte('date', ninetyDaysAgo)),
    safeQuery<SupplementWeekly>(supabase.from('supplement_weekly').select('*').eq('logged_at', today)),
    safeQuery<FichaCompletion>(supabase.from('ficha_completions').select('*').eq('completed_at', today)),
  ])

  const logs = weightLogs
  const latest = logs.at(-1) ?? null

  // --- today status ---
  const todayMealCount = todayMeals.length
  const todayTreino = todayFicha.length > 0

  const hasSup = (key: string) => todaySupplements.some((s) => s.supplement === key && s.count > 0)
  const todaySup = {
    creatina: hasSup('creatina'),
    whey: hasSup('whey'),
    hipercalorico: hasSup('hipercalorico_manha') || hasSup('hipercalorico_noite') || hasSup('hipercalorico'),
    hipercalorico_manha: hasSup('hipercalorico_manha'),
    hipercalorico_noite: hasSup('hipercalorico_noite'),
  }
  const supCount = MANDATORY_SUPS.filter((k) => hasSup(k)).length

  // --- score today ---
  const dayScore = computeDayScore({ mealCount: todayMealCount, treino: todayTreino, supCount })
  dayScore.suplementos = todaySup

  // --- build 90-day history ---
  const allFichaDates = new Set(fichaAll.map((r) => r.completed_at))

  const supHistoryRaw = await safeQuery<SupplementWeekly>(
    supabase.from('supplement_weekly').select('*').gte('logged_at', ninetyDaysAgo)
  )
  const supByDate = new Map<string, SupplementWeekly[]>()
  supHistoryRaw.forEach((s) => {
    const arr = supByDate.get(s.logged_at) ?? []
    arr.push(s)
    supByDate.set(s.logged_at, arr)
  })

  const mealByDate = new Map<string, number>()
  mealHistory.forEach((m) => {
    mealByDate.set(m.date, (mealByDate.get(m.date) ?? 0) + 1)
  })

  const allDates = new Set([
    ...Array.from(allFichaDates),
    ...Array.from(supByDate.keys()),
    ...Array.from(mealByDate.keys()),
  ])

  const history = Array.from(allDates).map((date) => {
    const sups = supByDate.get(date) ?? []
    const sc = MANDATORY_SUPS.filter((k) => sups.some((s) => s.supplement === k && s.count > 0)).length
    return {
      date,
      mealCount: mealByDate.get(date) ?? 0,
      treino: allFichaDates.has(date),
      supCount: sc,
    }
  })

  const streaks = computeStreaks(history)
  const checkSemanal = computeCheckSemanal(history, logs, weekStart, weekEnd)

  const scoreHistory = history
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
    .map((d) => ({ date: d.date, score: computeDayScore(d).score }))

  // --- dates for weekly routines ---
  const workoutDates = [...new Set(fichaWeek.map((r) => r.completed_at))]
  const supplementDates = [...new Set(supplementLogs.map((r) => r.logged_at))]
  const workoutAllDates = fichaAll.map((r) => r.completed_at)
  const supplementAllDates = supplementAll.map((r) => r.logged_at)

  // --- alertas ---
  const lastWeight = logs.length >= 2 ? logs[logs.length - 1] : null
  const weekAgoWeight = lastWeight
    ? logs.find((w) => w.logged_at <= format(subDays(new Date(), 7), 'yyyy-MM-dd'))
    : null
  const pesoEstagnado =
    lastWeight && weekAgoWeight
      ? Number(lastWeight.weight_kg) <= Number(weekAgoWeight.weight_kg)
      : false

  const alertas: string[] = []
  if (todayMealCount < 4) alertas.push('Você está comendo pouco hoje.')
  if (!todaySup.hipercalorico) alertas.push('Hipercalórico não registrado.')
  if (pesoEstagnado) alertas.push('Seu peso não subiu essa semana. Aumente calorias.')
  if (!todayTreino) alertas.push('Treino ainda não registrado.')

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhamento de evolução física</p>
      </div>
      <DashboardClient
        latest={latest}
        logs={logs}
        dayScore={dayScore}
        streaks={streaks}
        checkSemanal={checkSemanal}
        alertas={alertas}
        scoreHistory={scoreHistory}
        todayStatus={{
          treino: todayTreino,
          alimentacao: todayMealCount,
          suplementos: todaySup,
        }}
      />
      <WeeklyRoutines
        workoutDates={workoutDates}
        supplementDates={supplementDates}
        workoutAllDates={workoutAllDates}
        supplementAllDates={supplementAllDates}
      />
    </div>
  )
}
