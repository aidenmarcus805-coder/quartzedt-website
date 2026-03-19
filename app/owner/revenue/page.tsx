"use client";

import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { RevenueRow, RevenueItem } from '../components/RevenueRow';
import { Calendar, TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';

// Dummy data for chart
const chartData = [
  { date: '1', value: 20000 },
  { date: '5', value: 21000 },
  { date: '10', value: 20500 },
  { date: '15', value: 22500 },
  { date: '20', value: 23000 },
  { date: '25', value: 24000 },
  { date: '30', value: 24500 },
];

const transactions: RevenueItem[] = [
  { id: '1', description: 'Enterprise Plan - Annual', amount: '$4,999.00', date: 'Just now', status: 'Charge', customer: 'Acme Corp' },
  { id: '2', description: 'Pro Plan - Monthly', amount: '$49.00', date: '2 hours ago', status: 'Charge', customer: 'Jane Doe' },
  { id: '3', description: 'Pro Plan - Monthly', amount: '$49.00', date: '5 hours ago', status: 'Failed', customer: 'John Smith' },
  { id: '4', description: 'Refund: Pro Plan', amount: '$49.00', date: '1 day ago', status: 'Refund', customer: 'Bob Brown' },
  { id: '5', description: 'Enterprise Plan - Monthly', amount: '$499.00', date: '1 day ago', status: 'Charge', customer: 'Stark Ind' },
];

function SimpleLineChart({ data }: { data: { value: number }[] }) {
  const height = 200;
  const width = 800;
  const padding = 20;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  // Normalize points
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
    const y = range === 0
      ? height / 2
      : height - ((d.value - minValue) / range) * (height - 2 * padding) - padding;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      {/* Grid lines */}
      <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
      <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
      
      {/* The Line */}
      <polyline
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
        points={points}
      />
      
      {/* Area under curve (optional, keeping it simple as per guidelines "Line chart") */}
    </svg>
  );
}

export default function RevenuePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Revenue"
        actions={
           <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
             <Calendar className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
             Last 30 Days
           </button>
        }
      />

      {/* Main Focal Area: MRR and Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Monthly Recurring Revenue</h2>
              <div className="mt-1 flex items-baseline">
                <p className="text-3xl font-semibold text-gray-900">$24,500</p>
                <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" aria-hidden="true" />
                  <span className="sr-only">Increased by</span>
                  12%
                </p>
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <SimpleLineChart data={chartData} />
          </div>
        </div>

        {/* Tertiary Area: Churn & Other Metrics */}
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                        <Users className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Churn Rate</h3>
                        <div className="mt-1 flex items-baseline">
                            <p className="text-2xl font-semibold text-gray-900">2.4%</p>
                            <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                <TrendingDown className="self-center flex-shrink-0 h-4 w-4 text-green-500" aria-hidden="true" />
                                <span className="sr-only">Decreased by</span>
                                0.1%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

             <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">ARPU</h3>
                        <div className="mt-1 flex items-baseline">
                            <p className="text-2xl font-semibold text-gray-900">$42.00</p>
                            <p className="ml-2 flex items-baseline text-sm font-semibold text-gray-500">
                                Flat
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Secondary Area: Recent Transactions */}
      <section aria-labelledby="recent-transactions-heading">
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 id="recent-transactions-heading" className="text-lg leading-6 font-medium text-gray-900">
              Recent Transactions
            </h3>
          </div>
          <div>
            {transactions.map((item) => (
              <RevenueRow key={item.id} item={item} />
            ))}
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                View all transactions<span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
