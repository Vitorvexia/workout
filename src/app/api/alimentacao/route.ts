import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer as supabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')

  let query = supabase.from('meal_completions').select('*').order('meal_index')
  if (date) query = query.eq('date', date)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { date, meal_index } = body

  if (meal_index === undefined || meal_index < 0 || meal_index > 5) {
    return NextResponse.json({ error: 'meal_index inválido' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('meal_completions')
    .upsert(
      { date: date ?? new Date().toISOString().split('T')[0], meal_index: Number(meal_index) },
      { onConflict: 'date,meal_index' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const body = await req.json()
  const { date, meal_index } = body

  const { error } = await supabase
    .from('meal_completions')
    .delete()
    .eq('date', date)
    .eq('meal_index', Number(meal_index))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
