import { FileText } from "lucide-react";

const TermsOfService = () => {
    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-6">
                <FileText className="w-8 h-8 text-[#FACC15]" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
            </div>

            <div className="h-[600px] overflow-y-auto rounded-md border p-6 bg-white dark:bg-gray-950 no-scrollbar">
                <div className="space-y-6 text-gray-600 dark:text-gray-400">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">1. Eligibility & Age Restriction</h2>
                        <p>
                            You must be at least 18 years of age (or the legal age for gambling in your jurisdiction) to use Rappio. By using our services, you warrant that you meet these eligibility requirements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">2. Affiliate Disclosure</h2>
                        <p>
                            Rappio is a casino affiliate website. We do not provide real-money gambling services on this site. Instead, we provide information and outbound links to third-party casino operators. We may receive commissions when you click these links and perform certain actions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">3. Responsible Gaming</h2>
                        <p>
                            We encourage all our users to play responsibly. Gambling should be treated as entertainment, not a way to make money. If you or someone you know has a gambling problem, please seek help from local resources.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">4. Disclaimers & No Guarantee</h2>
                        <p>
                            While we strive to provide accurate and up-to-date information regarding casino offers and bonuses, Rappio cannot guarantee the accuracy or validity of third-party offers. Always check the specific terms and conditions on the operator's website.
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

export default TermsOfService;
