
const TopCasinos = () => {
    return (
        <div className="p-6 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <h1 className="text-3xl font-extrabold mb-4 tracking-tight">Top Casinos</h1>
            <p className="text-gray-600 dark:text-gray-400">Discover reaching destinations and trending locations.</p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="px-8 py-5 font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Rank</th>
                            <th className="px-8 py-5 font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Casino Name</th>
                            <th className="px-8 py-5 font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Rating</th>
                            <th className="px-8 py-5 font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-8 py-6 font-mono text-blue-500 dark:text-blue-400 font-bold">#{i}</td>
                                <td className="px-8 py-6">
                                    <div className="text-lg font-bold uppercase tracking-tight text-gray-800 dark:text-gray-200">Casino Royale {i}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">Las Vegas, NV</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex text-amber-500 gap-0.5">
                                        {"★".repeat(4)}{"☆".repeat(1)}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">Open Now</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopCasinos;
