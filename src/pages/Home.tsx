import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CommonWrapper from "@/common/CommonWrapper";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/Vector.svg";
import bgImage from "@/assets/home.jpg";

const Home = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Start the transition after the logo animation duration
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 2500); // Adjust timing based on logo animation duration

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showWelcome) {
      const redirectTimer = setTimeout(() => {
        navigate("/user/all");
      }, 5000);

      return () => clearTimeout(redirectTimer);
    }
  }, [showWelcome, navigate]);

  return (
    <CommonWrapper
      className="bg-cover bg-center overflow-hidden min-h-screen flex items-center justify-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay for better text readability if needed */}
      <div className="absolute inset-0 bg-black/30 bg-opacity-30"></div>
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
              <img src={logo} alt="Logo" className="w-32 h-32 md:w-48 md:h-48" />
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Welcome to Rappio
              </h1>
              <p className="text-xl text-gray-200">
                Your journey starts here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CommonWrapper>
  );
};

export default Home;




