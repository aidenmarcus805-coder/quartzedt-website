import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { ProductSignal } from '../components/ProductSignal';
import { Calendar } from 'lucide-react';

export default function ProductUsagePage() {
  // Dummy data
  const signals = [
    { label: 'Weekly Active Users', value: '892', trend: 'up' as const, change: '+12%' },
    { label: 'Feature Adoption Rate', value: '45%', trend: 'up' as const, change: '+5%' },
    { label: 'Avg Session Duration', value: '14m 30s', trend: 'flat' as const, change: '0%' },
    { label: 'Retention (30d)', value: '68%', trend: 'down' as const, change: '-2%' },
  ];

  const topFeatures = [
    { name: 'Auto-Culling', usage: 12500, percentage: 85 },
    { name: 'Audio Sync', usage: 9800, percentage: 67 },
    { name: 'Color Grading', usage: 7500, percentage: 51 },
    { name: 'Export 4K', usage: 5200, percentage: 35 },
    { name: 'AI Captions', usage: 3100, percentage: 21 },
  ];

  const dropOffPoints = [
    { step: 'Import Media', dropOff: '2%', users: 1500 },
    { step: 'Initial Analysis', dropOff: '5%', users: 1470 },
    { step: 'Timeline Edit', dropOff: '12%', users: 1396 },
    { step: 'Export Settings', dropOff: '8%', users: 1228 },
    { step: 'Final Render', dropOff: '1%', users: 1130 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Product Usage"
        actions={
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            <Calendar className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
            Last 30 Days
          </button>
        }
      />

      {/* Primary: Top Features by Usage Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           {/* Signal Cards */}
          <section aria-labelledby="signals-heading" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <h2 id="signals-heading" className="sr-only">Key Usage Signals</h2>
            {signals.map((signal) => (
              <ProductSignal key={signal.label} {...signal} />
            ))}
          </section>

          <section aria-labelledby="features-heading" className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 id="features-heading" className="text-lg leading-6 font-medium text-gray-900">
                Top Features
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Usage volume by feature invocation count.
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-5">
              {topFeatures.map((feature) => (
                <div key={feature.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                    <span className="text-sm text-gray-500">{feature.usage.toLocaleString()} uses</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${feature.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Active User Chart (Mock) */}
          <section aria-labelledby="activity-heading" className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
             <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 id="activity-heading" className="text-lg leading-6 font-medium text-gray-900">
                Active Users
              </h3>
            </div>
            <div className="p-6">
                <div className="h-64 w-full flex items-end justify-between space-x-1">
                    {[...Array(30)].map((_, i) => {
                         const height = Math.floor(Math.random() * (100 - 30 + 1) + 30);
                         return (
                            <div key={i} className="w-full bg-blue-50 hover:bg-blue-100 transition-colors relative group rounded-t-sm" style={{ height: `${height}%` }}>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap">
                                    {height * 10} Users
                                </div>
                            </div>
                         )
                    })}
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>30 days ago</span>
                    <span>Today</span>
                </div>
            </div>
          </section>
        </div>

        {/* Tertiary: Drop-off Points */}
        <div className="space-y-6">
            <section aria-labelledby="dropoff-heading" className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden h-full">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 id="dropoff-heading" className="text-lg leading-6 font-medium text-gray-900">
                        Funnel Drop-off
                    </h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {dropOffPoints.map((point, index) => (
                        <div key={point.step} className="px-4 py-4 sm:px-6">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm font-medium text-gray-900">{index + 1}. {point.step}</span>
                                <span className="text-sm text-gray-500">{point.users} users</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <div className="text-xs text-gray-500">Conversion</div>
                                <div className="text-xs font-medium text-red-600">-{point.dropOff}</div>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
                    <div className="text-sm">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            View full funnel analysis <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
}
