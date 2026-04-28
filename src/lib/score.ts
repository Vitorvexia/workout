import { DayScore, Streaks, CheckSemanal, WeightLog } from './types'

type DailyData = {
  date: string
  mealCount: number        // 0-6
  treino: boolean
  supCount: number         // creatina+whey+hipercalorico present (0-3)
  postura: boolean
}

export function computeDayScore(d: Omit<DailyData, 'date'>): DayScore {
  const alimentacaoPts = (d.mealCount / 6) * 35
  const supPts = (d.supCount / 3) * 25
  const treinoPts = d.treino ? 25 : 0
  const posturaPts = d.postura ? 15 : 0
  const score = Math.round(alimentacaoPts + supPts + treinoPts + posturaPts)

  let label: DayScore['label']
  if (score >= 90) label = 'Dia perfeito'
  else if (score >= 70) label = 'Bom dia'
  else if (score >= 40) label = 'Dia médio'
  else label = 'Dia fraco'

  return {
    score,
    label,
    treino: d.treino,
    alimentacao: d.mealCount,
    suplementos: { creatina: false, whey: false, hipercalorico: false },
    postura: d.postura,
  }
}

export function computeStreaks(history: DailyData[]): Streaks {
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date))

  function streak(fn: (d: DailyData) => boolean): number {
    let count = 0
    for (const d of sorted) {
      if (fn(d)) count++
      else break
    }
    return count
  }

  return {
    alimentacao: streak((d) => d.mealCount === 6),
    treino: streak((d) => d.treino),
    suplementos: streak((d) => d.supCount >= 2),
    geral: streak((d) => d.mealCount === 6 && d.treino && d.supCount >= 2 && d.postura),
  }
}

export function computeCheckSemanal(
  history: DailyData[],
  weightLogs: WeightLog[],
  weekStart: string,
  weekEnd: string
): CheckSemanal {
  const weekDays = history.filter((d) => d.date >= weekStart && d.date <= weekEnd)

  const weekWeights = weightLogs.filter(
    (w) => w.logged_at >= weekStart && w.logged_at <= weekEnd
  )
  const pesoInicial = weekWeights.length > 0 ? Number(weekWeights[0].weight_kg) : null
  const pesoAtual = weekWeights.length > 0 ? Number(weekWeights[weekWeights.length - 1].weight_kg) : null
  const difPeso = pesoInicial !== null && pesoAtual !== null ? +(pesoAtual - pesoInicial).toFixed(1) : null

  const scores = weekDays.map((d) =>
    computeDayScore(d).score
  )
  const scoreMedia = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

  let resultado: CheckSemanal['resultado']
  if (scoreMedia >= 85) resultado = 'Excelente'
  else if (scoreMedia >= 65) resultado = 'Boa'
  else resultado = 'Fraca'

  return {
    pesoInicial,
    pesoAtual,
    difPeso,
    refeicoes: weekDays.reduce((a, d) => a + d.mealCount, 0),
    treinos: weekDays.filter((d) => d.treino).length,
    suplementos: weekDays.filter((d) => d.supCount >= 2).length,
    postura: weekDays.filter((d) => d.postura).length,
    resultado,
    scoreMedia,
  }
}
