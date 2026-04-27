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

export type PostureLog = {
  id: string
  did_exercises: boolean
  back_pain_level: number
  logged_at: string
  notes: string | null
  created_at: string
}

export type SupplementLog = {
  id: string
  took_hypercaloric: boolean
  took_whey: boolean
  took_creatine: boolean
  logged_at: string
  created_at: string
}
