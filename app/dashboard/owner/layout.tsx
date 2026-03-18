"use client";

import OwnerGuard from "@/components/owner/OwnerGuard";
import { OwnerKeyboardShortcuts } from "@/components/owner/OwnerKeyboardShortcuts";
import { OwnerVoiceCommander } from "@/components/owner/OwnerVoiceCommander";
import Link from "next/link";
import { usePathname } from "next/navigation";

// The pipelines configuration mirroring the exact implementation plan
const PIPELINES = [
  { id: 'marketing', name: 'Marketing', color: 'bg-emerald-500', href: '/dashboard/owner/marketing' },
  { id: 'code', name: 'Code', color: 'bg-blue-500', href: '/dashboard/owner/code' },
  { id: 'social', name: 'Social', color: 'bg-pink-500', href: '/dashboard/owner/social' },
  { id: 'product', name: 'Product', color: 'bg-amber-500', href: '/dashboard/owner/product' },
  { id: 'seo', name: 'SEO', color: 'bg-indigo-500', href: '/dashboard/owner/seo' },
  { id: 'experiments', name: 'Experiments', color: 'bg-purple-500', href: '/dashboard/owner/experiments' },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <OwnerGuard>
      <div className="min-h-screen bg-white text-slate-900 font-sans flex antialiased">
        
        {/* Flat Minimalist Sidebar */}
        <div className="fixed left-0 top-0 h-full w-[260px] bg-[#F9F9F9] border-r border-slate-200 flex flex-col z-50">
           
           <div className="p-6 pb-2">
              <Link href="/dashboard/owner/global">
                <h1 className="font-display font-medium text-lg tracking-tight text-slate-900 hover:text-slate-600 transition-colors">Quartz Owner</h1>
              </Link>
              <div className="flex items-center gap-2 mt-1.5">
                 <span className="relative flex h-1.5 w-1.5">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                 </span>
                 <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">SYSTEM ACTIVE</span>
              </div>
           </div>

           <div className="px-3 py-6 flex-1 flex flex-col gap-1">
             <div className="text-[11px] font-semibold text-slate-400 px-3 pb-2 tracking-wider">PIPELINES</div>
             {PIPELINES.map((p) => {
                const isActive = pathname === p.href;
                return (
                  <div key={p.id}>
                      <Link 
                        href={p.href} 
                        className={`group flex items-center justify-between px-3 py-2 rounded-md transition-all ${
                          isActive ? 'bg-white shadow-sm ring-1 ring-black/5' : 'hover:bg-slate-200/50 text-slate-500'
                        }`}
                      >
                        <span className={`font-medium text-[13px] ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>{p.name}</span>
                        {isActive && <div className={`w-1.5 h-1.5 rounded-full ${p.color}`}></div>}
                      </Link>
                  </div>
                );
             })}
             
             <div className="mt-4 px-3">
                 <button className="text-[13px] font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
                     + New Pipeline
                 </button>
             </div>
           </div>
           
           <div className="p-4 mt-auto">
              <button 
                  className="w-full text-left px-3 py-2 text-[13px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-md transition-colors border border-transparent active:border-slate-200" 
                  onClick={() => { window.location.href = "/"; }}
              >
                 Exit Dashboard
              </button>
           </div>
        </div>

        {/* Pure White Canvas Area */}
        <main className="ml-[260px] flex-1 p-0 text-slate-900 bg-white flex flex-col w-full">
           <div className="max-w-4xl w-full mx-auto px-8 py-10 flex flex-col gap-8">
               {children}
           </div>
        </main>

        <OwnerKeyboardShortcuts />
        <OwnerVoiceCommander />

      </div>
    </OwnerGuard>
  );
}
