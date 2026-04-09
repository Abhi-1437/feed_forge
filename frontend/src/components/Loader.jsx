export default function Loader({ message = 'Loading...', cards = 3 }) {
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-[28px] p-6">
        <div className="mb-3 h-4 w-32 rounded-full shimmer" />
        <div className="mb-3 h-8 w-56 rounded-full shimmer" />
        <div className="h-4 w-72 max-w-full rounded-full shimmer" />
        <p className="mt-5 text-sm text-slate-400">{message}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <div key={index} className="glass-card rounded-[28px] p-5">
            <div className="mb-4 aspect-[16/10] rounded-[24px] shimmer" />
            <div className="mb-3 h-5 w-3/4 rounded-full shimmer" />
            <div className="mb-2 h-4 w-full rounded-full shimmer" />
            <div className="mb-5 h-4 w-5/6 rounded-full shimmer" />
            <div className="h-10 w-28 rounded-2xl shimmer" />
          </div>
        ))}
      </div>
    </div>
  )
}
