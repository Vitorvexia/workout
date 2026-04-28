import { NextResponse } from 'next/server'

// Deprecated: workout logging moved to ficha_completions
// These routes are kept as stubs to avoid 404s during transition
export async function GET() {
  return NextResponse.json([])
}

export async function POST() {
  return NextResponse.json({ error: 'Use /api/treino-completions instead' }, { status: 410 })
}
