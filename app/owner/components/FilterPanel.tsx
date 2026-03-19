import React from 'react';

interface FilterPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterPanel({ children, className }: FilterPanelProps) {
  return (
    <div className={`flex flex-wrap items-center gap-4 p-4 ${className || ''}`}>
      {children}
    </div>
  );
}
