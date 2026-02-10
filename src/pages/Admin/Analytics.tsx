import { BarChart3 } from "lucide-react";

const Analytics = () => {
    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400">Deep dive into user behavior and data trends.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6">User Retention</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 italic text-gray-400">
                        Retention chart visualization
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6">Engagement Metrics</h3>
                    <div className="space-y-4">
                        {[
                            { label: "Avg. Session Duration", value: "4m 32s", pct: 65, color: "bg-blue-500" },
                            { label: "Pages per Session", value: "3.2", pct: 45, color: "bg-purple-500" },
                            { label: "Bounce Rate", value: "24%", pct: 24, color: "bg-green-500" },
                        ].map((metric, i) => (
                            <div key={i}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{metric.value}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                    <div className={`${metric.color} h-2 rounded-full`} style={{ width: `${metric.pct}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
