import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { exercise_id, weight_kg, reps, sets, notes, logged_at } = body

  if (!exercise_id || !weight_kg || !reps) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('workout_sets')
    .insert({
      exercise_id,
      weight_kg: Number(weight_kg),
      reps: Number(reps),
      sets: Number(sets ?? 1),
      notes,
      logged_at,
    })
    .select('*, exercise:exercises(*)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const exercise_id = searchParams.get('exercise_id')

  let query = supabase
    .from('workout_sets')
    .select('*, exercise:exercises(*)')
    .order('logged_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)

  if (exercise_id) query = query.eq('exercise_id', exercise_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
