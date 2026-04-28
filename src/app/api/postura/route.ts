import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { did_exercises, back_pain_level, notes, logged_at } = body

  if (back_pain_level === undefined || back_pain_level < 0 || back_pain_level > 10) {
    return NextResponse.json({ error: 'Nível de dor deve ser entre 0 e 10' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('posture_logs')
    .insert({
      did_exercises: Boolean(did_exercises),
      back_pain_level: Number(back_pain_level),
      notes,
      logged_at,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET() {
  const { data, error } = await supabase
    .from('posture_logs')
    .select('*')
    .order('logged_at', { ascending: false })
    .limit(30)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
