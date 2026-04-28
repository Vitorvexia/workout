import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer as supabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const date = body.logged_at ?? new Date().toISOString().split('T')[0]

  const inserts = [
    { logged_at: date, supplement: 'creatina', count: 1 },
    { logged_at: date, supplement: 'whey', count: 1 },
    { logged_at: date, supplement: 'hipercalorico_manha', count: 1 },
    { logged_at: date, supplement: 'hipercalorico_noite', count: 1 },
  ]

  const { error } = await supabase
    .from('supplement_weekly')
    .upsert(inserts, { onConflict: 'logged_at,supplement' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const body = await req.json()
  const { logged_at } = body
  if (!logged_at) return NextResponse.json({ error: 'logged_at obrigatório' }, { status: 400 })

  const { error } = await supabase
    .from('supplement_weekly')
    .delete()
    .eq('logged_at', logged_at)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
