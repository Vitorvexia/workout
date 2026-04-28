'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

type Props = {
  min: number
  max: number
  current: number
  onLog: (weight: number) => Promise<void>
}

export function WeightSlider({ min, max, current, onLog }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [dragWeight, setDragWeight] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const progress = Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100))
  const displayWeight = dragWeight ?? current
  const displayProgress = Math.min(100, Math.max(0, ((displayWeight - min) / (max - min)) * 100))

  const weightFromX = useCallback((clientX: number): number => {
    if (!trackRef.current) return current
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const raw = min + ratio * (max - min)
    return Math.round(raw * 10) / 10
  }, [min, max, current])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
    setDragWeight(weightFromX(e.clientX))
  }, [weightFromX])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setDragging(true)
    setDragWeight(weightFromX(e.touches[0].clientX))
  }, [weightFromX])

  useEffect(() => {
    if (!dragging) return

    const onMouseMove = (e: MouseEvent) => setDragWeight(weightFromX(e.clientX))
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      setDragWeight(weightFromX(e.touches[0].clientX))
    }

    const onMouseUp = async () => {
      setDragging(false)
      if (dragWeight !== null && dragWeight !== current) {
        setSaving(true)
        await onLog(dragWeight)
        setSaving(false)
      }
      setDragWeight(null)
    }
    const onTouchEnd = async () => {
      setDragging(false)
      if (dragWeight !== null && dragWeight !== current) {
        setSaving(true)
        await onLog(dragWeight)
        setSaving(false)
      }
      setDragWeight(null)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [dragging, dragWeight, current, onLog, weightFromX])

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}kg (início)</span>
        <span className={`font-semibold ${dragging ? 'text-foreground' : 'text-foreground'}`}>
          {displayWeight.toFixed(1)}kg {dragging ? '(arrastando...)' : saving ? '(salvando...)' : 'atual'}
        </span>
        <span>{max}kg (meta)</span>
      </div>

      <div
        ref={trackRef}
        className="relative h-2 w-full rounded-full bg-secondary select-none"
        style={{ cursor: dragging ? 'grabbing' : 'default' }}
      >
        {/* Filled track */}
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-foreground transition-none"
          style={{ width: `${displayProgress}%` }}
        />
        {/* Ball — draggable */}
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-foreground border-2 border-background shadow-lg transition-none"
          style={{
            left: `${displayProgress}%`,
            cursor: dragging ? 'grabbing' : 'grab',
            touchAction: 'none',
          }}
          title={`${displayWeight.toFixed(1)}kg — arraste para registrar`}
        />
        {/* Target marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-foreground bg-background pointer-events-none"
          style={{ left: '100%' }}
          title={`Meta: ${max}kg`}
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>+{(displayWeight - min).toFixed(1)}kg ganhos</span>
        <span>{displayProgress.toFixed(0)}% da meta</span>
        <span>{Math.max(0, max - displayWeight).toFixed(1)}kg restantes</span>
      </div>
    </div>
  )
}
