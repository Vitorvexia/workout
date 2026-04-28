import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { took_hypercaloric, took_whey, took_creatine, logged_at } = body

  const { data, error } = await supabase
    .from('supplement_logs')
    .insert({
      took_hypercaloric: Boolean(took_hypercaloric),
      took_whey: Boolean(took_whey),
      took_creatine: Boolean(took_creatine),
      logged_at: logged_at ?? new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET() {
  const { data, error } = await supabase
    .from('supplement_logs')
    .select('*')
    .order('logged_at', { ascending: false })
    .limit(30)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
