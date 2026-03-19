'use client';

import { 
    CalendarBlank, 
    ArrowUpRight, 
    ArrowDownRight, 
    WarningCircle, 
    CheckCircle, 
    Info,
    CaretRight,
    Plus,
    RocketLaunch,
    FileText
} from '@phosphor-icons/react';

export default function DashboardOverview() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">System status and key metrics.</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                    <CalendarBlank size={16} />
                    <span>Last 30 Days</span>
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                    title="Total Revenue" 
                    value="$42,500" 
                    change="+12.5%" 
                    trend="up" 
                    secondary="vs. last month"
                />
                <MetricCard 
                    title="Active Pipelines" 
                    value="14" 
                    change="+3" 
                    trend="up" 
                    secondary="currently processing"
                />
                <MetricCard 
                    title="Avg. Processing Time" 
                    value="1m 24s" 
                    change="-8.2%" 
                    trend="down" 
                    secondary="faster than average"
                    goodTrend="down"
                />
                <MetricCard 
                    title="Success Rate" 
                    value="99.8%" 
                    change="+0.2%" 
                    trend="up" 
                    secondary="last 24 hours"
                />
            </div>

            {/* Secondary & Tertiary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Alerts (Span 2) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Recent Alerts</h2>
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm divide-y divide-gray-200">
                        <AlertItem 
                            type="warning"
                            title="High Memory Usage"
                            description="Worker-03 is consuming 85% memory."
                            time="10m ago"
                        />
                        <AlertItem 
                            type="info"
                            title="Deployment Successful"
                            description="New model version v2.4.0 deployed."
                            time="2h ago"
                        />
                        <AlertItem 
                            type="error"
                            title="Pipeline Failure"
                            description="Job #4492 failed due to timeout."
                            time="5h ago"
                            actionLabel="Retry"
                        />
                         <AlertItem 
                            type="success"
                            title="Backup Completed"
                            description="Daily database backup finished successfully."
                            time="1d ago"
                        />
                    </div>
                </div>

                {/* Quick Links (Span 1) */}
                <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-3">
                        <QuickLinkCard 
                            icon={Plus}
                            title="New Pipeline"
                            description="Start a new processing job"
                            href="/dashboard/pipelines"
                        />
                        <QuickLinkCard 
                            icon={RocketLaunch}
                            title="Deploy Bot"
                            description="Configure a new agent"
                            href="/dashboard/bots"
                        />
                         <QuickLinkCard 
                            icon={FileText}
                            title="View Documentation"
                            description="Read the latest guides"
                            href="/docs"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, change, trend, secondary, goodTrend = 'up' }: { 
    title: string; 
    value: string; 
    change: string; 
    trend: 'up' | 'down' | 'neutral'; 
    secondary: string;
    goodTrend?: 'up' | 'down'; 
}) {
    const isPositive = (trend === 'up' && goodTrend === 'up') || (trend === 'down' && goodTrend === 'down');
    const isNeutral = trend === 'neutral';
    
    // Determine color based on "good" direction
    const trendColor = isNeutral 
        ? 'text-gray-500' 
        : isPositive 
            ? 'text-green-600' 
            : 'text-red-600';

    const TrendIcon = trend === 'up' ? ArrowUpRight : (trend === 'down' ? ArrowDownRight : CaretRight); // CaretRight as neutral placeholder

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-gray-900 tracking-tight">{value}</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className={`flex items-center text-sm font-medium ${trendColor}`}>
                    {trend !== 'neutral' && <TrendIcon className="mr-1" size={16} />}
                    {change}
                </div>
                <span className="text-xs text-gray-500">{secondary}</span>
            </div>
        </div>
    );
}

function AlertItem({ type, title, description, time, actionLabel }: { 
    type: 'info' | 'warning' | 'error' | 'success'; 
    title: string; 
    description: string; 
    time: string;
    actionLabel?: string;
}) {
    const icons = {
        info: <Info size={20} className="text-blue-500" />,
        warning: <WarningCircle size={20} className="text-amber-500" />,
        error: <WarningCircle size={20} className="text-red-500" />,
        success: <CheckCircle size={20} className="text-green-500" />
    };

    return (
        <div className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 mt-0.5">
                {icons[type]}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <span className="text-xs text-gray-500">{time}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
            {actionLabel && (
                <button className="ml-4 px-3 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

function QuickLinkCard({ icon: Icon, title, description, href }: { 
    icon: any; 
    title: string; 
    description: string; 
    href: string; 
}) {
    return (
        <a href={href} className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 hover:shadow-md transition-all group">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-md group-hover:bg-gray-100 transition-colors">
                    <Icon size={20} className="text-gray-600 group-hover:text-gray-900" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
                    <p className="text-xs text-gray-500">{description}</p>
                </div>
                <CaretRight size={16} className="ml-auto text-gray-400 group-hover:text-gray-600" />
            </div>
        </a>
    );
}
