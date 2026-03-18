"use client";

import { useEffect, useState } from "react";
import { generateFingerprint } from "@/lib/owner/fingerprint";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { isOwnerEmail } from "@/lib/owner/config";

export default function OwnerGuard({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    // 2-Second Blank Screen Check Layer
    const verifyIdentity = async () => {
      // Bypass fingerprint if logged in as admin via NextAuth
      if (isOwnerEmail(session?.user?.email)) {
          setIsVerified(true);
          return;
      }

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
            // Trigger 150ms structural fade-in
            setTimeout(() => {
              setIsVerified(true);
            }, 150);
            return;
          }
        }
        
        // Permanent Blank
        console.warn("Unauthorized device signature.");
        
      } catch (error) {
        console.error("Verification error.");
      }
    };

    verifyIdentity();
  }, [router, session, status]);

  // If not verified, stay absolutely blank (Zero-Friction permanent gate)
  if (!isVerified) {
    return <div className="min-h-screen bg-[#f5f7fa]" />;
  }

  // Once verified, animate in
  return (
    <div className="animate-in fade-in duration-150">
      {children}
    </div>
  );
}
