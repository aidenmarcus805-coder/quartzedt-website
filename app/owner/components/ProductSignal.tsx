import React from 'react';
import clsx from 'clsx';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface ProductSignalProps {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'flat';
  change?: string;
}

export function ProductSignal({ label, value, trend, change }: ProductSignalProps) {
  return (
    <div className="bg-white overflow-hidden rounded-lg shadow border border-gray-200 p-6 min-h-[120px] flex flex-col justify-between">
      <p className="text-xs font-normal text-gray-500 uppercase tracking-wide">{label}</p>
      
      <div className="mt-4 flex items-end justify-between">
        <div className="text-xl font-medium text-gray-900">
          {value}
        </div>
        
        <div className={clsx(
          "flex items-center text-xs font-medium",
          trend === 'up' ? "text-green-600" : 
          trend === 'down' ? "text-red-600" : 
          "text-gray-500"
        )}>
          {trend === 'up' && <ArrowUpRight className="mr-1 h-3 w-3" />}
          {trend === 'down' && <ArrowDownRight className="mr-1 h-3 w-3" />}
          {trend === 'flat' && <Minus className="mr-1 h-3 w-3" />}
          {change}
        </div>
      </div>
    </div>
  );
}
