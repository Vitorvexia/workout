import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const date = body.logged_at ?? new Date().toISOString().split('T')[0]

  const inserts = [
    { logged_at: date, supplement: 'creatina', count: 1 },
    { logged_at: date, supplement: 'whey', count: 1 },
    { logged_at: date, supplement: 'hipercalorico', count: 2 },
  ]

  const { error } = await supabase
    .from('supplement_weekly')
    .upsert(inserts, { onConflict: 'logged_at,supplement' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true }, { status: 201 })
}
