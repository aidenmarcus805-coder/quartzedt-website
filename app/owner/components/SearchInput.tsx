import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export function SearchInput({ className, onClear, ...props }: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && onClear) {
      onClear();
    }
    props.onKeyDown?.(e);
  };

  return (
    <div className={`relative ${className || ''}`}>
      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        className="block w-full h-9 pl-10 pr-3 py-2 border-none rounded-md leading-5 bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black sm:text-sm"
        placeholder="Search..."
        onKeyDown={handleKeyDown}
        {...props}
      />
    </div>
  );
}
