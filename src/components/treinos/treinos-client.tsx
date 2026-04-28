'use client'

import { FichaTreino } from './ficha-treino'
import { FichaCompletion } from '@/lib/types'

type Props = {
  todayCompletions: FichaCompletion[]
}

export function TreinosClient({ todayCompletions }: Props) {
  return <FichaTreino todayCompletions={todayCompletions} />
}
