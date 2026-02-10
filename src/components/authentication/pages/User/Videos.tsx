
const Videos = () => {
    return (
        <div className="p-6 min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <h1 className="text-3xl font-extrabold mb-4 tracking-tight">Videos</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and browse your video collection here.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-video bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center relative group cursor-pointer overflow-hidden border-2 hover:border-blue-500 transition-all">
                        <div className="absolute inset-0 bg-black/10 dark:bg-black/30 group-hover:bg-black/40 transition-colors" />
                        <div className="h-14 w-14 bg-white/20 dark:bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white relative z-10 group-hover:scale-110 transition-transform shadow-xl">
                            <span className="text-2xl ml-1">▶</span>
                        </div>
                        <div className="absolute bottom-6 left-6 text-white z-10 font-bold tracking-wide">Video Title {i}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Videos;
