"use client";

import OwnerGuard from "@/components/owner/OwnerGuard";
import { GlassCard } from "@/components/owner/GlassCard";
import { OwnerKeyboardShortcuts } from "@/components/owner/OwnerKeyboardShortcuts";
import { OwnerVoiceCommander } from "@/components/owner/OwnerVoiceCommander";
import Link from "next/navigation";
import { Activity } from "lucide-react";

// The pipelines configuration mirroring the exact implementation plan
const PIPELINES = [
  { id: 'marketing', name: 'Marketing', color: 'bg-owner-marketing', href: '/dashboard/owner/marketing' },
  { id: 'code', name: 'Code', color: 'bg-owner-code', href: '/dashboard/owner/code' },
  { id: 'social', name: 'Social', color: 'bg-owner-social', href: '/dashboard/owner/social' },
  { id: 'product', name: 'Product', color: 'bg-owner-product', href: '/dashboard/owner/product' },
  { id: 'seo', name: 'SEO', color: 'bg-owner-seo', href: '/dashboard/owner/seo' },
  { id: 'experiments', name: 'Experiments', color: 'bg-owner-experiments', href: '/dashboard/owner/experiments' },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <OwnerGuard>
      <div className="min-h-screen bg-[linear-gradient(135deg,#f5f7fa_0%,#c3cfe2_100%)] text-slate-800 font-sans flex">
        
        {/* Fixed Glass Sidebar */}
        <div className="fixed left-0 top-0 h-full w-[280px] backdrop-blur-md bg-white/80 border-r border-white/20 shadow-xl flex flex-col z-50">
           
           <div className="p-6 border-b border-white/30 flex items-center justify-between">
              <div>
                <h1 className="font-display font-semibold text-lg tracking-tight">Owner Dashboard</h1>
                <div className="flex items-center gap-2 mt-1">
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                   </span>
                   <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Live</span>
                </div>
              </div>
           </div>

           <div className="p-4 flex-1 flex flex-col gap-2">
             <div className="text-xs font-semibold text-slate-400 px-3 pb-2 uppercase tracking-widest">Pipelines</div>
             {PIPELINES.map((p) => (
                <div key={p.id}>
                    {/* Native a-tag used purely for mapping simplicity. In a real environment, Link from Next is preferable. */}
                    <a href={p.href} className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors">
                      <div className={`w-3 h-3 rounded-full ${p.color} shadow-sm border border-black/5`}></div>
                      <span className="font-medium text-sm text-slate-700 group-hover:text-black transition-colors">{p.name}</span>
                    </a>
                </div>
             ))}
             
             <div className="mt-4 px-3">
                 <button className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
                     + New Pipeline
                 </button>
             </div>
           </div>
           
           <div className="p-4 border-t border-white/30 text-center">
              <button className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors" onClick={() => {
                   // Clear indexedDB or local logic in advanced forms
                   window.location.href = "/";
              }}>
                 Logout / Zero Frame
              </button>
           </div>
        </div>

        {/* Dynamic Canvas Area */}
        <main className="ml-[280px] flex-1 p-8 text-slate-900 bg-transparent flex flex-col gap-6 w-full max-w-[1400px]">
           {children}
        </main>

        <OwnerKeyboardShortcuts />
        <OwnerVoiceCommander />

      </div>
    </OwnerGuard>
  );
}
