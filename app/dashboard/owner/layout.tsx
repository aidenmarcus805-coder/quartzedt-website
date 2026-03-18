import OwnerGuard from "@/components/owner/OwnerGuard";
import { OwnerKeyboardShortcuts } from "@/components/owner/OwnerKeyboardShortcuts";
import { OwnerSidebar } from "@/components/owner/OwnerSidebar";
import { OWNER_SOURCE_LABEL } from "@/lib/owner/config";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <OwnerGuard>
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
        <OwnerSidebar />

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-[1380px] items-center justify-between px-4 sm:px-6 lg:px-10">
              <div className="text-sm font-medium text-slate-900">Quartz owner</div>
              <div className="text-xs font-medium text-slate-500">{OWNER_SOURCE_LABEL}</div>
            </div>
          </header>

          <main className="min-h-[calc(100vh-56px)] px-4 pb-20 pt-6 sm:px-6 lg:px-10 lg:pt-8">
            <div className="mx-auto max-w-[1380px] space-y-8">{children}</div>
          </main>
        </div>

        <OwnerKeyboardShortcuts />
      </div>
    </OwnerGuard>
  );
}
