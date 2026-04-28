import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { logged_at, exercise_1, exercise_2, exercise_3, exercise_4, exercise_5 } = body

  const { data, error } = await supabase
    .from('posture_checklist')
    .upsert({
      logged_at: logged_at ?? new Date().toISOString().split('T')[0],
      exercise_1: Boolean(exercise_1),
      exercise_2: Boolean(exercise_2),
      exercise_3: Boolean(exercise_3),
      exercise_4: Boolean(exercise_4),
      exercise_5: Boolean(exercise_5),
    }, { onConflict: 'logged_at' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET() {
  const { data, error } = await supabase
    .from('posture_checklist')
    .select('*')
    .order('logged_at', { ascending: false })
    .limit(90)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
