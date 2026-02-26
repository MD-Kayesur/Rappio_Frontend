import { Cookie } from "lucide-react";

const CookiePolicy = () => {
    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-6">
                <Cookie className="w-8 h-8 text-[#FACC15]" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cookie Policy</h1>
            </div>

            <div className="h-[600px] overflow-y-auto rounded-md border p-6 bg-white dark:bg-gray-950 no-scrollbar">
                <div className="space-y-6 text-gray-600 dark:text-gray-400">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">1. Essential Tracking</h2>
                        <p>
                            We use cookies to ensure that our affiliate links function correctly. This allows us to track your referrals to third-party casino sites and maintain the sustainability of our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">2. Personalization</h2>
                        <p>
                            Cookies help Rappio remember your favorite categories—whether you prefer Slots, Live Casino, or Sportsbook offers—so we can prioritize what you see first.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">3. Analytics</h2>
                        <p>
                            We analyze cookie data to understand which casino offers are the most popular, helping us negotiate better exclusive bonuses for our users.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">4. Disabling Cookies</h2>
                        <p>
                            You can choose to disable cookies through your browser settings, but please note that some parts of our website may not function properly as a result.
                        </p>
                    </section>

                    <p className="text-sm font-medium mt-10 italic">
                        Last updated: February 26, 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
