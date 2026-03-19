import React from 'react';
import clsx from 'clsx';
import { ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';

export interface RevenueItem {
  id: string;
  description: string;
  amount: string;
  date: string;
  status: 'Charge' | 'Refund' | 'Failed';
  customer: string;
}

interface RevenueRowProps {
  item: RevenueItem;
}

export function RevenueRow({ item }: RevenueRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors duration-150 ease-in-out" style={{ height: '48px' }}>
      <div className="flex items-center min-w-0 gap-3">
        <div className={clsx(
            "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
            item.status === 'Charge' ? "bg-green-100 text-green-600" :
            item.status === 'Refund' ? "bg-gray-100 text-gray-600" :
            "bg-red-100 text-red-600"
        )}>
             {item.status === 'Charge' && <ArrowUpRight className="h-4 w-4" />}
             {item.status === 'Refund' && <ArrowDownLeft className="h-4 w-4" />}
             {item.status === 'Failed' && <AlertCircle className="h-4 w-4" />}
        </div>
        <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
                {item.description}
            </p>
            <p className="text-xs text-gray-500 truncate">
                {item.customer} • {item.date}
            </p>
        </div>
      </div>
      <div className="flex-shrink-0 ml-4">
        <span className={clsx(
            "text-sm font-medium",
            item.status === 'Charge' ? "text-gray-900" :
            item.status === 'Refund' ? "text-gray-500" :
            "text-red-600"
        )}>
            {item.status === 'Refund' ? '-' : ''}{item.amount}
        </span>
      </div>
    </div>
  );
}
