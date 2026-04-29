export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 w-24 bg-secondary rounded" />
      <div className="h-32 bg-secondary rounded-lg" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-secondary rounded-md" />
        ))}
      </div>
    </div>
  )
}
