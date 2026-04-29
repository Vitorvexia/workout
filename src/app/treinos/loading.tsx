export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 w-48 bg-secondary rounded" />
      <div className="rounded-lg border border-border p-4 space-y-3">
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 w-12 bg-secondary rounded-md" />
          ))}
        </div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 bg-secondary rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
