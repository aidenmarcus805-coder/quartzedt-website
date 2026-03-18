import OwnerGuard from "@/components/owner/OwnerGuard";
import { OwnerKeyboardShortcuts } from "@/components/owner/OwnerKeyboardShortcuts";
import { OwnerSidebar } from "@/components/owner/OwnerSidebar";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <OwnerGuard>
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <OwnerSidebar />

        <div className="relative lg:pl-[240px]">
          <main className="min-h-screen px-4 pb-20 pt-4 sm:px-6 lg:px-10 lg:pt-8">
            <div className="mx-auto max-w-[1380px] space-y-8">{children}</div>
          </main>
        </div>

        <OwnerKeyboardShortcuts />
      </div>
    </OwnerGuard>
  );
}
