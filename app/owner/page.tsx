import React from 'react';
import { PageHeader } from './components/PageHeader';
import { MetricCard } from './components/MetricCard';
import { OperationalIssue } from './components/OperationalIssue';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

export default function OverviewPage() {
  // Dummy data
  const metrics = [
    { label: 'Revenue (MRR)', value: '$24,500', change: '12%', trend: 'up' as const, trendLabel: 'vs last month' },
    { label: 'Active Pipelines', value: '142', change: '5%', trend: 'up' as const, trendLabel: 'Currently processing' },
    { label: 'Churn Rate', value: '2.4%', change: '0.1%', trend: 'down' as const, trendLabel: 'vs last month' },
    { label: 'Total Users', value: '1,204', change: '8%', trend: 'up' as const, trendLabel: '+96 this month' },
  ];

  const alerts = [
    { severity: 'critical' as const, message: 'High error rate detected in video processing cluster (us-east-1).' },
    { severity: 'warning' as const, message: 'Database storage approaching 80% capacity.' },
  ];

  const quickLinks = [
    { name: 'View Customers', href: '/owner/customers' },
    { name: 'Manage Bots', href: '/owner/bots' },
    { name: 'Review Suggestions', href: '/owner/suggestions' },
    { name: 'Check Pipelines', href: '/owner/pipelines' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Overview"
        actions={
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            <Calendar className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
            Last 30 Days
          </button>
        }
      />

      {/* Primary Area: Key Metrics */}
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">Key Metrics</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      {/* Secondary Area: Recent Alerts */}
      <section aria-labelledby="alerts-heading">
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 id="alerts-heading" className="text-lg leading-6 font-medium text-gray-900">
                    System Alerts
                </h3>
            </div>
            <div className="p-6 space-y-4">
                {alerts.length > 0 ? (
                    alerts.map((alert, index) => (
                        <OperationalIssue key={index} {...alert} />
                    ))
                ) : (
                    <p className="text-gray-500">System optimal. No active alerts.</p>
                )}
            </div>
        </div>
      </section>

      {/* Tertiary Area: Quick Links */}
      <section aria-labelledby="quick-links-heading">
        <h3 id="quick-links-heading" className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-black"
            >
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{link.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
