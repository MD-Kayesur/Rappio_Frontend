import { ListOrdered } from "lucide-react";

const FeedOrdering = () => {
    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                    <ListOrdered className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feed Ordering</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage how content appears to your users.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="font-bold text-gray-900 dark:text-white">Active Feed Rules</h2>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                        Add New Rule
                    </button>
                </div>
                <div className="p-0">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Content Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {[
                                { id: 1, type: "Featured Videos", priority: "High" },
                                { id: 2, type: "Sponsored Casinos", priority: "High" },
                                { id: 3, type: "New Photos", priority: "Medium" },
                                { id: 4, type: "Trending Now", priority: "Low" },
                            ].map((rule) => (
                                <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">#{rule.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{rule.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${rule.priority === "High" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                                                rule.priority === "Medium" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                                    "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                            }`}>
                                            {rule.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex gap-3">
                                        <button className="text-gray-400 hover:text-indigo-600 transition-colors text-sm font-medium">Edit</button>
                                        <button className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FeedOrdering;
