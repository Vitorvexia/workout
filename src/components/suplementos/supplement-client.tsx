'use client'

import { SupplementForm } from './supplement-form'
import { SupplementWeekly } from '@/lib/types'

type Props = { weekLogs: SupplementWeekly[] }

export function SupplementClient({ weekLogs }: Props) {
  return (
    <div className="max-w-2xl">
      <SupplementForm weekLogs={weekLogs} />
    </div>
  )
}
