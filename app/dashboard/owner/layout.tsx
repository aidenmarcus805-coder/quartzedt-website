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
      <div className="min-h-screen bg-white text-slate-900 font-sans flex antialiased">
        
        {/* Flat Minimalist Sidebar */}
        <div className="fixed left-0 top-0 h-full w-[260px] bg-[#F9F9F9] border-r border-slate-200 flex flex-col z-50">
           
           <div className="p-6 pb-2">
              <div>
                <h1 className="font-display font-bold text-xl tracking-tight text-slate-900">Quartz Owner</h1>
                <div className="flex items-center gap-2 mt-2">
                   <span className="relative flex h-1.5 w-1.5">
                     <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                   </span>
                   <span className="text-[11px] font-medium text-slate-500 tracking-wider">SYSTEM ACTIVE</span>
                </div>
              </div>
           </div>

           <div className="px-3 py-6 flex-1 flex flex-col gap-1">
             <div className="text-[11px] font-semibold text-slate-400 px-3 pb-2 tracking-wider">PIPELINES</div>
             {PIPELINES.map((p) => (
                <div key={p.id}>
                    {/* Minimalist Tab */}
                    <a href={p.href} className="group flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-200/50 transition-colors">
                      <span className="font-medium text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors">{p.name}</span>
                    </a>
                </div>
             ))}
             
             <div className="mt-4 px-3">
                 <button className="text-[13px] font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
                     + New Pipeline
                 </button>
             </div>
           </div>
           
           <div className="p-4 mt-auto">
              <button 
                  className="w-full text-left px-3 py-2 text-[13px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-md transition-colors" 
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
