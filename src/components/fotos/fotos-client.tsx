'use client'

import { useState } from 'react'
import { PhotoUpload } from './photo-upload'
import { PhotoComparison } from './photo-comparison'
import { ProgressPhoto } from '@/lib/types'

type Props = { initialPhotos: ProgressPhoto[] }

export function FotosClient({ initialPhotos }: Props) {
  const [photos, setPhotos] = useState(initialPhotos)

  function handleUploaded(photo: ProgressPhoto) {
    setPhotos((prev) => [photo, ...prev])
  }

  return (
    <div className="space-y-6">
      <div className="max-w-sm">
        <PhotoUpload onUploaded={handleUploaded} />
      </div>
      <PhotoComparison photos={photos} />
    </div>
  )
}
