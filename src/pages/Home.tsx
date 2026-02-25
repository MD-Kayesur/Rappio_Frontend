import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CommonWrapper from "@/common/CommonWrapper";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/bgremovelogo.png";
import bgImage from "@/assets/home.jpg";
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already accepted the disclosure
    const hasAccepted = localStorage.getItem("age-verification-accepted");
    if (hasAccepted) {
      navigate("/user/all");
      return;
    }

    // Start the transition after the logo animation duration
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 2500); // Adjust timing based on logo animation duration

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleContinue = () => {
    localStorage.setItem("age-verification-accepted", "true");
    navigate("/user/all");
  };

  return (
    <CommonWrapper
      className="bg-cover bg-center overflow-hidden min-h-screen flex items-center justify-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay for better text readability if needed */}
      <div className="absolute inset-0 backdrop-blur-lg bg-opacity-30"></div>
      <div className="relative z-10 w-full flex justify-center">
        <AnimatePresence mode="wait">
          {!showWelcome ? (
            <motion.div
              key="logo"
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 1.5, 20] // Zoom in excessively at the end to "vanish"
              }}
              transition={{
                duration: 2.5,
                times: [0, 0.2, 0.8, 1], // Defines the timing for each keyframe
                ease: "easeInOut"
              }}
              exit={{ opacity: 0 }}
            >
              <img src={logo} alt="Logo" className="w-64 md:w-96 h-auto object-contain" />
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="relative max-w-md w-full bg-[#1A1C1D] rounded-2xl shadow-2xl border border-gray-800 p-8 md:p-10"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowWelcome(false)}
                  className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Title */}
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                  18+ Disclosure
                </h2>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-400 text-center leading-relaxed mb-8">
                  This platform promotes casino offers via affiliate links only; no real-money gambling occurs on-site. All outbound links redirect to third-party operators. The following disclosure combines the required elements from your spec (section 6: Compliance & Legal Page)—clear 18+ warning, responsible play messaging, affiliate disclosure, and redirection notice.
                </p>

                {/* Continue Button */}
                <Button
                  onClick={handleContinue}
                  className="w-full h-14 cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg rounded-xl transition-all active:scale-95 shadow-lg shadow-yellow-900/20"
                >
                  Continue
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CommonWrapper>
  );
};

export default Home;




