import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer as supabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const date = body.logged_at ?? new Date().toISOString().split('T')[0]

  // Insert a minimal ficha_completion to mark the day as "went to gym"
  const { error } = await supabase
    .from('ficha_completions')
    .upsert(
      { day_letter: 'A', exercise_name: 'manual', completed_at: date },
      { onConflict: 'completed_at,exercise_name' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const body = await req.json()
  const { logged_at } = body
  if (!logged_at) return NextResponse.json({ error: 'logged_at obrigatório' }, { status: 400 })

  const { error } = await supabase
    .from('ficha_completions')
    .delete()
    .eq('completed_at', logged_at)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
