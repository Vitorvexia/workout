import { NextResponse } from 'next/server'

// Academia is now auto-tracked by ficha_completions — this route is deprecated
export async function POST() {
  return NextResponse.json({ ok: true, note: 'deprecated — use ficha_completions' })
}
