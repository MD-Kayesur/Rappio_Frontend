
const Photos = () => {
    return (
        <div className="p-6 min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <h1 className="text-3xl font-extrabold mb-4 tracking-tight">Photos</h1>
            <p className="text-gray-600 dark:text-gray-400">Browse your photo gallery.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 animate-pulse hover:animate-none hover:shadow-2xl transition-all cursor-pointer overflow-hidden" />
                ))}
            </div>
        </div>
    );
};

export default Photos;
