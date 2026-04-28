import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { logged_at, supplement, count } = body

  const VALID = ['creatina', 'whey', 'hipercalorico', 'hipercalorico_manha', 'hipercalorico_noite', 'hipercalorico_tarde']
  if (!supplement || !VALID.includes(supplement)) {
    return NextResponse.json({ error: 'Suplemento inválido' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('supplement_weekly')
    .upsert(
      { logged_at: logged_at ?? new Date().toISOString().split('T')[0], supplement, count: Number(count ?? 1) },
      { onConflict: 'logged_at,supplement' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const body = await req.json()
  const { logged_at, supplement } = body

  const { error } = await supabase
    .from('supplement_weekly')
    .delete()
    .eq('logged_at', logged_at)
    .eq('supplement', supplement)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  let query = supabase.from('supplement_weekly').select('*').order('logged_at', { ascending: true })
  if (from) query = query.gte('logged_at', from)
  if (to) query = query.lte('logged_at', to)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
