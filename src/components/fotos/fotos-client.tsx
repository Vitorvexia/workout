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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <PhotoUpload onUploaded={handleUploaded} />
      <PhotoComparison photos={photos} />
    </div>
  )
}
