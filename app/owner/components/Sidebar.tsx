"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Activity,
  Server,
  Workflow,
  MessageSquare,
  Lightbulb,
  FileOutput,
  Code,
  Bot,
  Import,
  Settings,
  Search,
  User
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Overview', href: '/owner', icon: LayoutDashboard },
  { name: 'Customers', href: '/owner/customers', icon: Users },
  { name: 'Revenue', href: '/owner/revenue', icon: DollarSign },
  { name: 'Product Usage', href: '/owner/product-usage', icon: Activity },
  { name: 'Operations', href: '/owner/operations', icon: Server },
  { name: 'Pipelines', href: '/owner/pipelines', icon: Workflow },
  { name: 'OpenClaw Chat', href: '/owner/chat', icon: MessageSquare },
  { name: 'Suggestions', href: '/owner/suggestions', icon: Lightbulb },
  { name: 'Outputs', href: '/owner/outputs', icon: FileOutput },
  { name: 'Code Refinements', href: '/owner/code-refinements', icon: Code },
  { name: 'Bot Management', href: '/owner/bots', icon: Bot },
  { name: 'Import Bot', href: '/owner/import', icon: Import },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar container */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 h-full w-[240px] flex flex-col bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Global Search */}
        <div className="p-4 border-b border-gray-100">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border-none rounded-md leading-5 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black sm:text-sm h-9"
                    placeholder="Search (Cmd+K)"
                />
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/owner'
                ? pathname === item.href
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out",
                  isActive
                    ? "bg-gray-100 text-black"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}
              >
                <item.icon
                  className={clsx(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive ? "text-black" : "text-gray-400 group-hover:text-gray-500"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Global Actions (Profile/Settings) */}
        <div className="border-t border-gray-200 p-4">
          <Link
            href="/owner/settings"
            className={clsx(
                "group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out",
                pathname === '/owner/settings'
                    ? "bg-gray-100 text-black"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
            onClick={() => {
                if (window.innerWidth < 768) {
                  onClose();
                }
            }}
          >
             <div className="mr-3 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <User className="h-5 w-5" />
             </div>
             <span className="flex-1 text-left">Settings</span>
             <Settings className="ml-auto h-4 w-4 text-gray-400 group-hover:text-gray-500" />
          </Link>
        </div>
      </aside>
    </>
  );
}
