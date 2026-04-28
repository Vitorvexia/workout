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

// Posture checklist (replaces PostureLog)
export type PostureChecklist = {
  id: string
  logged_at: string
  exercise_1: boolean
  exercise_2: boolean
  exercise_3: boolean
  exercise_4: boolean
  exercise_5: boolean
  created_at: string
}

// Supplement weekly (per-day, per-supplement with count)
export type SupplementWeekly = {
  id: string
  logged_at: string
  supplement: 'creatina' | 'whey' | 'hipercalorico'
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
