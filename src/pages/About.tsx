import { Info, Briefcase, Users, ShieldCheck } from "lucide-react";

const About = () => {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Info className="w-10 h-10 text-[#FACC15]" />
          About Rappio
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          The ultimate hub for high-stakes entertainment. We connect the world's most passionate players with elite casino offers, exclusive rewards, and a premium community experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 overflow-hidden">
          <div className="p-6 pb-2">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Briefcase className="w-5 h-5 text-[#FACC15]" />
              Company Information
            </h3>
          </div>
          <div className="p-6 pt-0 text-gray-600 dark:text-gray-400 space-y-4">
            <p>
              Rappio is a premier digital media platform dedicated to the gaming and casino industry. We serve as a high-performance bridge between international gaming operators and selective enthusiasts, providing curated access to the best offers in the market.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-200">Registered Name:</span>
                <span>Rappio Media Group Ltd.</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-200">Headquarters:</span>
                <span>London, United Kingdom</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900 dark:text-gray-200">Founded:</span>
                <span>January 2024</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900 overflow-hidden">
          <div className="p-6 pb-2">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Users className="w-5 h-5 text-[#FACC15]" />
              Ownership Details
            </h3>
          </div>
          <div className="p-6 pt-0 text-gray-600 dark:text-gray-400 space-y-4">
            <p>
              Rappio operates under a clear, compliant affiliate model. We are independently owned and operated, ensuring that our recommendations remain objective and focused on providing maximum value to our community.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-200">Structure:</span>
                <span>Private Limited Company</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-200">CEO:</span>
                <span>John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900 dark:text-gray-200">Primary Investors:</span>
                <span>Global Tech Ventures, Apex Capital</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-none shadow-lg bg-[#FACC15]/10 dark:bg-[#FACC15]/5 overflow-hidden">
        <div className="p-6 pb-2">
          <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <ShieldCheck className="w-5 h-5 text-[#FACC15]" />
            Our Vision
          </h3>
        </div>
        <div className="p-6 pt-0 text-gray-700 dark:text-gray-300 italic text-center text-lg py-6">
          "To redefine the digital casino experience by creating the world's most transparent, engaging, and exclusive affiliate platform for the global gaming community."
        </div>
      </div>
    </div>
  );
};

export default About;
