import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { day_letter, exercise_name, completed_at } = body

  const { data, error } = await supabase
    .from('ficha_completions')
    .insert({ day_letter, exercise_name, completed_at: completed_at ?? new Date().toISOString().split('T')[0] })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const body = await req.json()
  const { day_letter, exercise_name, completed_at } = body

  const { error } = await supabase
    .from('ficha_completions')
    .delete()
    .eq('day_letter', day_letter)
    .eq('exercise_name', exercise_name)
    .eq('completed_at', completed_at)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('ficha_completions')
    .select('*')
    .eq('completed_at', date)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
