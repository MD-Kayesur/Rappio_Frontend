import { Settings as SettingsIcon, Bell, Shield, Globe, User } from "lucide-react";

const Settings = () => {
    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <SettingsIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400">Configure platform-wide preferences and security.</p>
                </div>
            </div>

            <div className="max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
                    {/* Settings Sidebar */}
                    <div className="p-4 border-r border-gray-100 dark:border-gray-800 space-y-1">
                        {[
                            { icon: User, label: "General", active: true },
                            { icon: Bell, label: "Notifications" },
                            { icon: Shield, label: "Security" },
                            { icon: Globe, label: "Localization" },
                        ].map((item, i) => (
                            <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.active
                                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                                    : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                }`}>
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Settings Content */}
                    <div className="md:col-span-3 p-8">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6">General Settings</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform Name</label>
                                <input
                                    type="text"
                                    defaultValue="Rappio Admin"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 transition-all outline-none dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Support Email</label>
                                <input
                                    type="email"
                                    defaultValue="support@rappio.com"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 transition-all outline-none dark:text-white"
                                />
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                                <button className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
                                    Cancel
                                </button>
                                <button className="px-6 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
