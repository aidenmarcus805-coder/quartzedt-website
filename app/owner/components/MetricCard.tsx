import React from 'react';
import clsx from 'clsx';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'flat';
  trendLabel?: string;
}

export function MetricCard({ label, value, change, trend, trendLabel }: MetricCardProps) {
  return (
    <div className="bg-white overflow-hidden rounded-lg shadow border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-500 truncate">{label}</p>
      <div className="mt-2 flex items-baseline justify-between md:block lg:flex">
        <div className="flex items-baseline text-2xl font-semibold text-gray-900">
          {value}
        </div>

        {change && (
          <div
            className={clsx(
              "inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0",
              trend === 'up' ? "bg-green-100 text-green-800" : 
              trend === 'down' ? "bg-red-100 text-red-800" : 
              "bg-gray-100 text-gray-800"
            )}
          >
            {trend === 'up' && <ArrowUpRight className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center text-green-500" aria-hidden="true" />}
            {trend === 'down' && <ArrowDownRight className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center text-red-500" aria-hidden="true" />}
            {trend === 'flat' && <Minus className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center text-gray-500" aria-hidden="true" />}
            
            <span className="sr-only">
                {trend === 'up' ? 'Increased by' : trend === 'down' ? 'Decreased by' : 'No change'}
            </span>
            {change}
          </div>
        )}
      </div>
        {trendLabel && (
             <div className="mt-1 text-sm text-gray-500">{trendLabel}</div>
        )}
    </div>
  );
}
