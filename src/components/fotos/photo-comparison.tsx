'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProgressPhoto } from '@/lib/types'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'

type Props = { photos: ProgressPhoto[]; onDelete: (id: string) => void }

const ANGLES = ['frente', 'lado', 'costas'] as const

type ViewMode = 'timeline' | 'comparar'

export function PhotoComparison({ photos, onDelete }: Props) {
  const [selectedAngle, setSelectedAngle] = useState<typeof ANGLES[number]>('frente')
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')
  const [compareA, setCompareA] = useState<string | null>(null)
  const [compareB, setCompareB] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(photo: ProgressPhoto) {
    if (!confirm(`Excluir foto de ${format(parseISO(photo.taken_at), "dd 'de' MMM yyyy", { locale: ptBR })}?`)) return
    setDeleting(photo.id)
    const res = await fetch('/api/fotos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: photo.id, photo_url: photo.photo_url }),
    })
    if (res.ok) onDelete(photo.id)
    setDeleting(null)
  }

  const filtered = photos.filter((p) => p.angle === selectedAngle)
  const oldest = filtered[filtered.length - 1] ?? null
  const newest = filtered[0] ?? null

  const photoA = filtered.find((p) => p.id === compareA) ?? oldest
  const photoB = filtered.find((p) => p.id === compareB) ?? newest

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Fotos
          </CardTitle>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              onClick={() => setViewMode('timeline')}
              className="text-xs h-7 px-2"
            >
              Linha do Tempo
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'comparar' ? 'default' : 'outline'}
              onClick={() => setViewMode('comparar')}
              className="text-xs h-7 px-2"
            >
              Comparar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Angle filter */}
        <div className="flex gap-2">
          {ANGLES.map((a) => (
            <Button
              key={a}
              size="sm"
              variant={selectedAngle === a ? 'default' : 'outline'}
              onClick={() => setSelectedAngle(a)}
              className="capitalize text-xs"
            >
              {a}
              <span className="ml-1 text-[10px] opacity-60">
                ({photos.filter((p) => p.angle === a).length})
              </span>
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma foto de {selectedAngle} ainda
          </p>
        ) : viewMode === 'timeline' ? (
          /* Timeline: all photos newest → oldest */
          <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((photo) => (
              <div key={photo.id} className="space-y-1">
                <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-secondary group">
                  <Image
                    src={photo.photo_url}
                    alt={`${photo.angle} ${photo.taken_at}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                    <p className="text-xs text-white font-medium text-center">
                      {format(parseISO(photo.taken_at), "dd 'de' MMM yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(photo)}
                    disabled={deleting === photo.id}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                    title="Excluir foto"
                  >
                    {deleting === photo.id
                      ? <span className="text-[10px] text-white">...</span>
                      : <Trash2 className="w-3.5 h-3.5 text-white" />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Comparar: side-by-side */
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Before */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground text-center font-medium">Antes</p>
                {photoA ? (
                  <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-secondary">
                    <Image
                      src={photoA.photo_url}
                      alt="antes"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                      <p className="text-xs text-white font-medium text-center">
                        {format(parseISO(photoA.taken_at), "dd MMM yy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[3/4] rounded-md bg-secondary flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Sem foto</p>
                  </div>
                )}
              </div>
              {/* After */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground text-center font-medium">Agora</p>
                {photoB ? (
                  <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-secondary">
                    <Image
                      src={photoB.photo_url}
                      alt="agora"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                      <p className="text-xs text-white font-medium text-center">
                        {format(parseISO(photoB.taken_at), "dd MMM yy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[3/4] rounded-md bg-secondary flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Sem foto</p>
                  </div>
                )}
              </div>
            </div>

            {/* Photo selectors */}
            {filtered.length > 1 && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Foto — Antes</p>
                    <select
                      value={compareA ?? ''}
                      onChange={(e) => setCompareA(e.target.value || null)}
                      className="w-full text-xs bg-secondary border border-border rounded px-2 py-1"
                    >
                      <option value="">Mais antiga</option>
                      {filtered.map((p) => (
                        <option key={p.id} value={p.id}>
                          {format(parseISO(p.taken_at), "dd MMM yy", { locale: ptBR })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Foto — Agora</p>
                    <select
                      value={compareB ?? ''}
                      onChange={(e) => setCompareB(e.target.value || null)}
                      className="w-full text-xs bg-secondary border border-border rounded px-2 py-1"
                    >
                      <option value="">Mais recente</option>
                      {filtered.map((p) => (
                        <option key={p.id} value={p.id}>
                          {format(parseISO(p.taken_at), "dd MMM yy", { locale: ptBR })}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
