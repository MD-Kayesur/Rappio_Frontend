import React, { useState } from "react";
import { motion } from "framer-motion";
import img from "../assets/Logo.svg";
import { Link as ScrollLink } from "react-scroll";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar: React.FC = () => {
  const scrollDirection = useScrollDirection();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = ["Features", "Pricing", "Reviews", "FAQ"];

  return (
    <div className="sticky top-0 z-50">
      <motion.nav
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`fixed top-3 left-1/2 -translate-x-1/2 w-full px-5 md:px-0 md:w-[1420px]
        z-[9999] transition-transform duration-500 ease-in-out
        ${scrollDirection === "down" ? "-translate-y-[600px] md:translate-y-0" : "translate-y-0"}`}
      >
        <div className="mx-auto">
          <div className="flex py-4 items-center justify-between px-5 md:px-0 backdrop-blur-3xl bg-[#FDFBF9] rounded-2xl">
            {/* Logo */}
            <div className="flex-shrink-0 py-2 md:pl-15">
              <ScrollLink to="home" smooth={true} duration={500} className="cursor-pointer">
                <img className="w-[186px]" src={img} alt="Logo" />
              </ScrollLink>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10 pr-15">
              {navItems.map((item) => (
                <ScrollLink
                  key={item}
                  to={item}
                  smooth={true}
                  duration={500}
                  offset={item === "FAQ" ? -100 : 0}
                  className="text-[#163A70] text-base font-medium cursor-pointer"
                >
                  {item}
                </ScrollLink>
              ))}

              <ScrollLink
                to="JoinWaitlist"
                smooth={true}
                duration={700}
                className="text-[#163A70] bg-[#B3ED97] rounded-full border-8 border-[#D5F3C5] px-11 py-2 font-medium cursor-pointer"
              >
                Join Waitlist
              </ScrollLink>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                type="button"
                className="text-[#163A70] hover:text-gray-700 focus:outline-none"
              >
                {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden  -mt-2 bg-opacity-90 backdrop-blur-md">
            <div className="px-2 pt-3 bg-[#FDFBF9]  pb-3 space-y-1 sm:px-3 flex flex-col items-start">
              {navItems.map((item) => (
                <ScrollLink
                  key={item}
                  to={item}
                  smooth={true}
                  duration={500}
                  onClick={() => setIsOpen(false)}
                  className=" block  px-3 py-2 rounded-md text-base text-[#163A70]   font-medium cursor-pointer w-full "
                >
                  {item}
                </ScrollLink>
              ))}

              {/* Join Waitlist Button */}
              <ScrollLink
                to="JoinWaitlist"
                smooth={true}
                duration={700}
                onClick={() => setIsOpen(false)}
                className="mt-2 text-[#163A70] bg-[#B3ED97] rounded-full border-8 border-[#D5F3C5] px-11 py-2 font-medium cursor-pointer text-center"
              >
                Join Waitlist
              </ScrollLink>
            </div>
          </div>
        )}
      </motion.nav>
    </div>
  );
};

export default Navbar;
















// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import img from "../assets/Logo.svg";
// import { Link as ScrollLink } from "react-scroll";
// import { useScrollDirection } from "@/hooks/useScrollDirection";

// const Navbar: React.FC = () => {
//   const scrollDirection = useScrollDirection();
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="sticky top-0 z-50">
//       <motion.nav
//         transition={{ duration: 0.5, ease: "easeInOut" }}
//         className={`fixed top-3 left-1/2 -translate-x-1/2 w-full px-5 md:px-0 md:w-[1420px]
//         z-[9999] transition-transform duration-500 ease-in-out
//         ${scrollDirection === "down" ? "-translate-y-[600px] md:translate-y-0" : "translate-y-0"}`}
//       >
//         <div className="mx-auto">
//           <div className="flex py-4 items-center justify-between px-5 md:px-0 backdrop-blur-3xl bg-[#FDFBF9] rounded-2xl">
//             {/* Logo */}
//             <div className="flex-shrink-0 py-2 md:pl-15">
//               <ScrollLink to="home" smooth={true} duration={500} className="cursor-pointer">
//                 <img className="w-[186px]" src={img} alt="Logo" />
//               </ScrollLink>
//             </div>

//             {/* Desktop Menu */}
//             <div className="hidden md:flex items-center space-x-10 pr-15">
//               {["Features", "Pricing", "Reviews", "FAQ"].map((item) => (
//                 <ScrollLink
//                   key={item}
//                   to={item}
//                   smooth={true}
//                   duration={500}
//                   offset={item === "FAQ" ? -100 : 0} // Adjust for sticky navbar
//                   className="text-[#163A70] text-base font-medium cursor-pointer"
//                 >
//                   {item}
//                 </ScrollLink>
//               ))}

//               <ScrollLink
//                 to="JoinWaitlist"
//                 smooth={true}
//                 duration={700}
//                 className="text-[#163A70] bg-[#B3ED97] rounded-full border-8 border-[#D5F3C5] px-11 py-2 font-medium cursor-pointer"
//               >
//                 Join Waitlist
//               </ScrollLink>
//             </div>

//             {/* Mobile Menu Button */}
//             <div className="md:hidden flex items-center">
//               <button onClick={toggleMenu} type="button" className="text-white hover:text-gray-300 focus:outline-none">
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   {isOpen ? (
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   ) : (
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
//                   )}
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isOpen && (
//           <div className="md:hidden bg-[#020712] bg-opacity-90 backdrop-blur-md">
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//               {["home", "Features", "Pricing", "Reviews", "FAQ", "JoinWaitlist"].map((item) => (
//                 <ScrollLink
//                   key={item}
//                   to={item}
//                   smooth={true}
//                   duration={500}
//                   onClick={() => setIsOpen(false)}
//                   className="text-white block hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium cursor-pointer"
//                 >
//                   {item.charAt(0).toUpperCase() + item.slice(1)}
//                 </ScrollLink>
//               ))}
//             </div>
//           </div>
//         )}
//       </motion.nav>
//     </div>
//   );
// };

// export default Navbar;
















 