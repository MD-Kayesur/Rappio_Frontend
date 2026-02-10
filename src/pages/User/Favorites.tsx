
const Favorites = () => {
    return (
        <div className="p-6 min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <h1 className="text-3xl font-extrabold mb-4 tracking-tight">Favorites</h1>
            <p className="text-gray-600 dark:text-gray-400">Your most liked content in one place.</p>

            <div className="mt-8 flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex items-center gap-6 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors cursor-pointer">
                        <div className="h-20 w-20 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center text-rose-500 font-bold text-3xl shadow-inner shadow-rose-200/50 dark:shadow-none">
                            ♥
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200">Favorite Item {i}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Added on Feb 09, 2026 • Collection X</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Favorites;
