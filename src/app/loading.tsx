export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-36 bg-secondary rounded" />
        <div className="h-4 w-56 bg-secondary rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-secondary rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-secondary rounded-lg" />
      <div className="h-48 bg-secondary rounded-lg" />
    </div>
  )
}
