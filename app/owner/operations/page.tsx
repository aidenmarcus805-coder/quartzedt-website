import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { RefreshCw, Server, Activity, DollarSign, Power } from 'lucide-react';
import clsx from 'clsx';

export default function OperationsPage() {
  // Dummy data
  const serverStatus = [
    { name: 'us-east-1-proc-01', region: 'US East (N. Virginia)', status: 'operational', load: 45, uptime: '14d 2h' },
    { name: 'us-east-1-proc-02', region: 'US East (N. Virginia)', status: 'operational', load: 62, uptime: '14d 2h' },
    { name: 'us-west-2-proc-01', region: 'US West (Oregon)', status: 'degraded', load: 88, uptime: '3d 5h' },
    { name: 'eu-central-1-proc-01', region: 'EU (Frankfurt)', status: 'operational', load: 34, uptime: '21d 8h' },
    { name: 'ap-northeast-1-proc-01', region: 'Asia Pacific (Tokyo)', status: 'operational', load: 28, uptime: '45d 1h' },
  ];

  const costs = [
    { service: 'EC2 Instances', cost: '$1,240.50', trend: '+12%' },
    { service: 'S3 Storage', cost: '$450.20', trend: '+5%' },
    { service: 'RDS Database', cost: '$320.00', trend: '0%' },
    { service: 'Lambda Functions', cost: '$120.80', trend: '-8%' },
    { service: 'Data Transfer', cost: '$85.40', trend: '+2%' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Operations"
        actions={
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            <RefreshCw className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
            Refresh Status
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Focal Area: Server Status List */}
        <div className="lg:col-span-2 space-y-8">
            <section aria-labelledby="server-status-heading" className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 id="server-status-heading" className="text-lg leading-6 font-medium text-gray-900">
                        Infrastructure Status
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Systems Normal
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Server</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {serverStatus.map((server) => (
                                <tr key={server.name} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center">
                                            <Server className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                            {server.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{server.region}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={clsx(
                                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                            server.status === 'operational' ? "bg-green-100 text-green-800" :
                                            server.status === 'degraded' ? "bg-yellow-100 text-yellow-800" :
                                            "bg-red-100 text-red-800"
                                        )}>
                                            {server.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                                                <div 
                                                    className={clsx("h-1.5 rounded-full", server.load > 80 ? "bg-red-500" : "bg-blue-500")} 
                                                    style={{ width: `${server.load}%` }}
                                                ></div>
                                            </div>
                                            {server.load}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-400 hover:text-gray-900 transition-colors">
                                            <Power className="h-4 w-4" />
                                            <span className="sr-only">Restart {server.name}</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            
            {/* Secondary: Error Rate Chart */}
            <section aria-labelledby="error-rate-heading" className="bg-white shadow rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 id="error-rate-heading" className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                        <Activity className="mr-2 h-5 w-5 text-gray-400" />
                        Error Rate (Last 24h)
                    </h3>
                    <span className="text-sm text-gray-500">0.05% Avg</span>
                </div>
                <div className="h-48 w-full flex items-end space-x-1">
                     {/* Mock Chart */}
                     {[...Array(48)].map((_, i) => {
                         // Simulate random low error rates with occasional spikes
                         const isSpike = Math.random() > 0.95;
                         const height = isSpike ? Math.floor(Math.random() * 60) + 20 : Math.floor(Math.random() * 10) + 2;
                         const color = height > 50 ? 'bg-red-400' : 'bg-gray-300';
                         
                         return (
                            <div key={i} className={`flex-1 ${color} rounded-t-sm`} style={{ height: `${height}%` }}></div>
                         )
                     })}
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>24h ago</span>
                    <span>12h ago</span>
                    <span>Now</span>
                </div>
            </section>
        </div>

        {/* Tertiary: Cost Breakdown */}
        <div className="space-y-6">
            <section aria-labelledby="cost-heading" className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden h-full">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 id="cost-heading" className="text-lg leading-6 font-medium text-gray-900">
                        Monthly Cost
                    </h3>
                     <p className="mt-1 text-2xl font-semibold text-gray-900">$2,216.90</p>
                </div>
                <div className="divide-y divide-gray-200">
                    {costs.map((item) => (
                        <div key={item.service} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                            <div className="flex items-center">
                                <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-900">{item.service}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">{item.cost}</div>
                                <div className={clsx("text-xs", item.trend.startsWith('+') ? "text-red-600" : "text-green-600")}>
                                    {item.trend}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
                    <div className="text-sm">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Download invoice <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>

      </div>
    </div>
  );
}
