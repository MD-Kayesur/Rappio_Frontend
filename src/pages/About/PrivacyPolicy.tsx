import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-6">
                <Shield className="w-8 h-8 text-[#FACC15]" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
            </div>

            <div className="h-[600px] overflow-y-auto rounded-md border p-6 bg-white dark:bg-gray-950 no-scrollbar">
                <div className="space-y-6 text-gray-600 dark:text-gray-400">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">1. Personal Data Collection</h2>
                        <p>
                            We collect basic account information and data related to your preferences. This helps us tailor our casino recommendations and offer alerts specifically to your interests.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">2. Marketing & Communication</h2>
                        <p>
                            By signing up, you may receive updates about the latest casino bonuses and exclusive Rappio offers. You can opt-out of these communications at any time via your account settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">3. Third-Party Redirection</h2>
                        <p>
                            When you click an offer link on Rappio, you are redirected to a third-party site. We do not control their privacy practices and encourage you to review the policies of any casino you visit through our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">4. Data Protection</h2>
                        <p>
                            We use advanced encryption and security protocols to ensure that your interaction with Rappio remains private and secure from unauthorized access.
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

export default PrivacyPolicy;
