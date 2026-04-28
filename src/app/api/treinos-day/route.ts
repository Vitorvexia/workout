import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const date = body.logged_at ?? new Date().toISOString().split('T')[0]

  const { data: existing } = await supabase
    .from('workout_sets')
    .select('id')
    .eq('logged_at', date)
    .limit(1)

  if (existing && existing.length > 0) {
    return NextResponse.json({ already_logged: true })
  }

  const { data: ex } = await supabase.from('exercises').select('id').limit(1).single()
  if (!ex) return NextResponse.json({ error: 'No exercises' }, { status: 500 })

  const { data, error } = await supabase
    .from('workout_sets')
    .insert({ exercise_id: ex.id, weight_kg: 0, reps: 0, sets: 0, logged_at: date, notes: 'dashboard_toggle' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
