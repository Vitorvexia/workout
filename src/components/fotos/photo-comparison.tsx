'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProgressPhoto } from '@/lib/types'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = { photos: ProgressPhoto[] }

const ANGLES = ['frente', 'lado', 'costas'] as const

export function PhotoComparison({ photos }: Props) {
  const [selectedAngle, setSelectedAngle] = useState<string>('frente')

  const filtered = photos.filter((p) => p.angle === selectedAngle)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Comparação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma foto de {selectedAngle} ainda
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.slice(0, 4).map((photo) => (
              <div key={photo.id} className="space-y-1">
                <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-secondary">
                  <Image
                    src={photo.photo_url}
                    alt={`${photo.angle} ${photo.taken_at}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {format(parseISO(photo.taken_at), 'dd MMM yyyy', { locale: ptBR })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
