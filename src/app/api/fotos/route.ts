import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer as supabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const angle = formData.get('angle') as string
  const taken_at = formData.get('taken_at') as string

  if (!file || !angle) {
    return NextResponse.json({ error: 'Arquivo e ângulo obrigatórios' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const filename = `${angle}-${taken_at ?? new Date().toISOString().split('T')[0]}-${Date.now()}.${ext}`

  const bytes = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from('progress-photos')
    .upload(filename, bytes, { contentType: file.type, upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: urlData } = supabase.storage.from('progress-photos').getPublicUrl(filename)

  const { data, error } = await supabase
    .from('progress_photos')
    .insert({
      angle,
      photo_url: urlData.publicUrl,
      taken_at: taken_at ?? new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { id, photo_url } = await req.json()
  if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })

  // Extract storage filename from public URL
  // URL format: .../storage/v1/object/public/progress-photos/<filename>
  const filename = photo_url?.split('/progress-photos/').at(1)
  if (filename) {
    await supabase.storage.from('progress-photos').remove([filename])
    // ignore storage error — still delete the DB row
  }

  const { error } = await supabase.from('progress_photos').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const { data, error } = await supabase
    .from('progress_photos')
    .select('*')
    .order('taken_at', { ascending: false })
    .limit(30)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
