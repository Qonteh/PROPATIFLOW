export default function LandlordTenantsLoading() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="h-9 w-48 bg-muted animate-pulse rounded mb-2" />
        <div className="h-5 w-96 bg-muted animate-pulse rounded mb-4" />
        <div className="h-10 w-full bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 h-48 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
