export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050504]">
      <img
        src="/logoAnimated.gif"
        alt="Loading…"
        className="h-16 w-auto"
      />
    </div>
  );
}
