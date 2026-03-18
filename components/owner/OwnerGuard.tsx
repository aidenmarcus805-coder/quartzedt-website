"use client";

import { useEffect, useState } from "react";
import { generateFingerprint } from "@/lib/owner/fingerprint";
import { useSession } from "next-auth/react";
import { isOwnerEmail } from "@/lib/owner/config";

export default function OwnerGuard({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading" || isVerified) return;

    const verifyIdentity = async () => {
      // 1. Instant check via NextAuth session
      if (session?.user?.email && isOwnerEmail(session.user.email)) {
          console.log("Owner session detected. Verifying...");
          setIsVerified(true);
          return;
      }

      // 2. Hardware Fingerprint fallback
      try {
        const hash = await generateFingerprint();
        const response = await fetch('/api/owner/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hash })
        });

        if (response.ok) {
          const { isOwner } = await response.json();
          if (isOwner) {
            setIsVerified(true);
            return;
          }
        }
      } catch {
        console.error("Owner verification failed.");
      }
    };

    verifyIdentity();
  }, [session, status, isVerified]);

  // Loading State (Prevents returning undefined or staying blank too long)
  if (status === "loading" || (!isVerified && status === "authenticated")) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Authenticating Signature...</p>
            </div>
        </div>
      );
  }

  // Final Gate
  if (!isVerified) {
    return (
       <div className="min-h-screen bg-white flex items-center justify-center p-8">
           <div className="text-center">
               <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">!</span>
               </div>
               <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-2 uppercase tracking-tighter">Unauthorized Signature</h2>
               <p className="text-[11px] text-slate-400 max-w-[200px] leading-relaxed">
                   Hardware fingerprint mismatch. Access is strictly limited to authorized devices.
               </p>
           </div>
       </div>
    );
  }

  // Once verified, animate in
  return (
    <div className="animate-in fade-in duration-150">
      {children}
    </div>
  );
}
