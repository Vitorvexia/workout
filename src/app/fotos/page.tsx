import { supabaseServer as supabase } from '@/lib/supabase-server'
import { FotosClient } from '@/components/fotos/fotos-client'

export const revalidate = 0

export default async function FotosPage() {
  const { data: photos } = await supabase
    .from('progress_photos')
    .select('*')
    .order('taken_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fotos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe sua evolução visual
        </p>
      </div>
      <FotosClient initialPhotos={photos ?? []} />
    </div>
  )
}
