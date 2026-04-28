import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')

  if (!name) return NextResponse.json({ error: 'name obrigatório' }, { status: 400 })

  const { data, error } = await supabase
    .from('exercise_weights')
    .select('*')
    .eq('exercise_name', name)
    .order('logged_at', { ascending: false })
    .limit(60)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { exercise_name, weight_kg, logged_at } = body

  if (!exercise_name || weight_kg === undefined) {
    return NextResponse.json({ error: 'exercise_name e weight_kg obrigatórios' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('exercise_weights')
    .upsert(
      {
        exercise_name,
        weight_kg: Number(weight_kg),
        logged_at: logged_at ?? new Date().toISOString().split('T')[0],
      },
      { onConflict: 'exercise_name,logged_at' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
