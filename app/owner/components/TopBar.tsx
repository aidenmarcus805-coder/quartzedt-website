"use client";

import React from 'react';
import { Menu } from 'lucide-react';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="md:hidden flex items-center h-16 px-4 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
      <button
        type="button"
        className="-ml-2 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="ml-4 font-semibold text-lg text-gray-900">
        Quartz Editor Owner
      </div>
    </header>
  );
}
