export type WeightLog = {
  id: string
  weight_kg: number
  logged_at: string
  notes: string | null
  created_at: string
}

export type Exercise = {
  id: string
  name: string
  muscle_group: string | null
  created_at: string
}

export type WorkoutSet = {
  id: string
  exercise_id: string
  exercise?: Exercise
  weight_kg: number
  reps: number
  sets: number
  logged_at: string
  notes: string | null
  created_at: string
}

export type ProgressPhoto = {
  id: string
  angle: 'frente' | 'lado' | 'costas'
  photo_url: string
  taken_at: string
  created_at: string
}

export type SupplementKey =
  | 'creatina'
  | 'whey'
  | 'hipercalorico'
  | 'hipercalorico_manha'
  | 'hipercalorico_noite'
  | 'hipercalorico_tarde'

export const MANDATORY_SUPS: SupplementKey[] = [
  'creatina',
  'hipercalorico_manha',
  'whey',
  'hipercalorico_noite',
]

export type SupplementWeekly = {
  id: string
  logged_at: string
  supplement: SupplementKey
  count: number
  created_at: string
}

export type FichaCompletion = {
  id: string
  day_letter: 'A' | 'B' | 'C' | 'D' | 'E'
  exercise_name: string
  completed_at: string
  created_at: string
}

export type MealCompletion = {
  id: string
  date: string
  meal_index: number
  created_at: string
}

export type ExerciseWeight = {
  id: string
  exercise_name: string
  logged_at: string
  weight_kg: number
  created_at: string
}

export type DayScore = {
  score: number
  label: 'Dia fraco' | 'Dia médio' | 'Bom dia' | 'Dia perfeito'
  treino: boolean
  alimentacao: number
  suplementos: {
    creatina: boolean
    whey: boolean
    hipercalorico: boolean
    hipercalorico_manha: boolean
    hipercalorico_noite: boolean
  }
}

export type Streaks = {
  alimentacao: number
  treino: number
  suplementos: number
  geral: number
}

export type CheckSemanal = {
  pesoInicial: number | null
  pesoAtual: number | null
  difPeso: number | null
  refeicoes: number
  treinos: number
  suplementos: number
  resultado: 'Excelente' | 'Boa' | 'Fraca'
  scoreMedia: number
}
