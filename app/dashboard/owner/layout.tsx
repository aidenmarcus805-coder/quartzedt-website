import OwnerGuard from "@/components/owner/OwnerGuard";
import { OwnerKeyboardShortcuts } from "@/components/owner/OwnerKeyboardShortcuts";
import { OwnerSidebar } from "@/components/owner/OwnerSidebar";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <OwnerGuard>
      <div className="min-h-screen bg-[#f5f1ea] text-slate-900 antialiased">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(245,241,234,0.7)_45%,rgba(245,241,234,0.95)_100%)]" />
        <OwnerSidebar />

        <div className="relative lg:pl-[296px]">
          <main className="min-h-screen px-4 pb-20 pt-4 sm:px-6 lg:px-10 lg:pt-8">
            <div className="mx-auto max-w-[1380px] space-y-10">{children}</div>
          </main>
        </div>

        <OwnerKeyboardShortcuts />
      </div>
    </OwnerGuard>
  );
}
