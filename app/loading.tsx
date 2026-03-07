export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        <div className="animate-pulse space-y-8">
          <div className="h-4 w-32 rounded-full bg-black/10" />
          <div className="h-16 max-w-3xl rounded-[2rem] bg-black/10" />
          <div className="grid gap-5 md:grid-cols-3">
            <div className="h-48 rounded-3xl bg-black/5" />
            <div className="h-48 rounded-3xl bg-black/5" />
            <div className="h-48 rounded-3xl bg-black/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
