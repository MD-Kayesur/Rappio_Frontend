import { FileText } from "lucide-react";

const TermsOfService = () => {
    return (
        <div className="p-6 pt-6 min-h-full space-y-8 animate-in slide-in-from-bottom-5 duration-500 text-foreground">
            <div className="flex items-center gap-3 border-b border-border pb-6">
                <FileText className="w-8 h-8 text-[#FACC15]" />
                <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
            </div>

            <div className="h-[calc(100vh-200px)] overflow-y-auto rounded-md border border-border p-6 bg-card no-scrollbar">
                <div className="space-y-6 text-muted-foreground">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">1. Eligibility & Age Restriction</h2>
                        <p>
                            You must be at least 18 years of age (or the legal age for gambling in your jurisdiction) to use Rappio. By using our services, you warrant that you meet these eligibility requirements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">2. Affiliate Disclosure</h2>
                        <p>
                            Rappio is a casino affiliate website. We do not provide real-money gambling services on this site. Instead, we provide information and outbound links to third-party casino operators. We may receive commissions when you click these links and perform certain actions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">3. Responsible Gaming</h2>
                        <p>
                            We encourage all our users to play responsibly. Gambling should be treated as entertainment, not a way to make money. If you or someone you know has a gambling problem, please seek help from local resources.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">4. Disclaimers & No Guarantee</h2>
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
