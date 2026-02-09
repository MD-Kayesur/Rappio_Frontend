
const All = () => {
    return (
        <div className="p-6 min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <h1 className="text-3xl font-extrabold mb-4 tracking-tight">All Items</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome to your dashboard overview. Here you can see a summary of all your content.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform">
                    <h3 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-300">Total Videos</h3>
                    <p className="text-5xl font-black text-blue-500">24</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform">
                    <h3 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-300">Total Photos</h3>
                    <p className="text-5xl font-black text-emerald-500">142</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform">
                    <h3 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-300">Favorites</h3>
                    <p className="text-5xl font-black text-rose-500">12</p>
                </div>
            </div>
        </div>
    );
};

export default All;
