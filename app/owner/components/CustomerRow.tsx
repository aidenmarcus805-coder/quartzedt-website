import React from 'react';
import clsx from 'clsx';

export interface Customer {
  id: string;
  name: string;
  email: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Inactive' | 'Churned';
  joinedDate: string;
}

interface CustomerRowProps {
  customer: Customer;
  onClick?: () => void;
}

export function CustomerRow({ customer, onClick }: CustomerRowProps) {
  return (
    <tr 
      onClick={onClick}
      className="group hover:bg-gray-50 cursor-pointer transition-colors duration-150 ease-in-out border-b border-gray-200 last:border-0"
      style={{ height: '56px' }}
    >
      <td className="px-4 py-2 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{customer.name}</span>
          <span className="text-sm text-gray-500">{customer.email}</span>
        </div>
      </td>
      <td className="px-4 py-2 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {customer.plan}
        </span>
      </td>
      <td className="px-4 py-2 whitespace-nowrap">
        <span className={clsx(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          customer.status === 'Active' ? "bg-green-100 text-green-800" :
          customer.status === 'Inactive' ? "bg-gray-100 text-gray-800" :
          "bg-red-100 text-red-800"
        )}>
          {customer.status}
        </span>
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
        {customer.joinedDate}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
        <span className="text-blue-600 hover:text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
      </td>
    </tr>
  );
}
