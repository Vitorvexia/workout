'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProgressPhoto } from '@/lib/types'

type Props = { onUploaded: (photo: ProgressPhoto) => void }

export function PhotoUpload({ onUploaded }: Props) {
  const [angle, setAngle] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !angle) return
    setLoading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('angle', angle)
    fd.append('taken_at', new Date().toISOString().split('T')[0])
    const res = await fetch('/api/fotos', { method: 'POST', body: fd })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      onUploaded(data)
      setFile(null)
      setPreview(null)
      setAngle('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Adicionar Foto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Ângulo</Label>
            <Select value={angle} onValueChange={setAngle}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar ângulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frente">Frente</SelectItem>
                <SelectItem value="lado">Lado</SelectItem>
                <SelectItem value="costas">Costas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Foto</Label>
            <label className="block border border-border border-dashed rounded-md p-6 cursor-pointer hover:border-muted-foreground transition-colors text-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="max-h-40 mx-auto rounded object-cover"
                />
              ) : (
                <span className="text-sm text-muted-foreground">
                  Clique para selecionar
                </span>
              )}
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !file || !angle}
          >
            {loading ? 'Enviando...' : 'Fazer Upload'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
