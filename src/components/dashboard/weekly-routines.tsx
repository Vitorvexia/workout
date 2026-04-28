import { RoutineTracker } from './routine-tracker'

type Props = {
  postureDates: string[]
  workoutDates: string[]
  supplementDates: string[]
}

export function WeeklyRoutines({ postureDates, workoutDates, supplementDates }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <RoutineTracker title="Exercícios Posturais" loggedDates={postureDates} />
      <RoutineTracker title="Academia" loggedDates={workoutDates} />
      <RoutineTracker title="Suplementos" loggedDates={supplementDates} />
    </div>
  )
}
