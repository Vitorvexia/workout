import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { weight_kg, notes, logged_at } = body

  if (!weight_kg || isNaN(Number(weight_kg))) {
    return NextResponse.json({ error: 'Peso inválido' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('weight_logs')
    .insert({
      weight_kg: Number(weight_kg),
      notes: notes ?? null,
      logged_at: logged_at ?? new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET() {
  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .order('logged_at', { ascending: true })
    .limit(120)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
