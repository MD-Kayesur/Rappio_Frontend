import { LayoutDashboard } from "lucide-react";

const Overview = () => {
    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <LayoutDashboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back to your dashboard command center.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Users", value: "1,234", change: "+12%", color: "blue" },
                    { label: "Active Revenue", value: "$12,450", change: "+5%", color: "green" },
                    { label: "New Signups", value: "48", change: "+18%", color: "purple" },
                    { label: "Conversion Rate", value: "3.2%", change: "-2%", color: "orange" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                        <div className="flex items-end justify-between mt-2">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+')
                                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 min-h-[400px]">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Platform Growth</h2>
                <div className="flex items-center justify-center h-[300px] text-gray-400 italic">
                    Performance visualization would be here
                </div>
            </div>
        </div>
    );
};

export default Overview;
