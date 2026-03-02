import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
    return (
        <div className="p-6 pt-6 min-h-full space-y-8 animate-in slide-in-from-bottom-5 duration-500 text-foreground">
            <div className="flex items-center gap-3 border-b border-border pb-6">
                <Shield className="w-8 h-8 text-[#FACC15]" />
                <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
            </div>

            <div className="h-[calc(100vh-200px)] overflow-y-auto rounded-md border border-border p-6 bg-card no-scrollbar">
                <div className="space-y-6 text-muted-foreground">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">1. Personal Data Collection</h2>
                        <p>
                            We collect basic account information and data related to your preferences. This helps us tailor our casino recommendations and offer alerts specifically to your interests.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">2. Marketing & Communication</h2>
                        <p>
                            By signing up, you may receive updates about the latest casino bonuses and exclusive Rappio offers. You can opt-out of these communications at any time via your account settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">3. Third-Party Redirection</h2>
                        <p>
                            When you click an offer link on Rappio, you are redirected to a third-party site. We do not control their privacy practices and encourage you to review the policies of any casino you visit through our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">4. Data Protection</h2>
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
