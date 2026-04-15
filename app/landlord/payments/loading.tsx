export default function LandlordPaymentsLoading() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="h-9 w-48 bg-muted animate-pulse rounded mb-2" />
        <div className="h-5 w-96 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6">
            <div className="h-4 w-32 bg-muted animate-pulse rounded mb-3" />
            <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
      <div className="h-96 bg-card border border-border rounded-lg animate-pulse" />
    </div>
  )
}
