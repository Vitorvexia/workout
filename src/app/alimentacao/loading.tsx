export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 w-48 bg-secondary rounded" />
      <div className="h-28 bg-secondary rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-secondary rounded-lg" />
        ))}
      </div>
    </div>
  )
}
