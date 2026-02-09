
import React from 'react';
import { Outlet } from 'react-router-dom';
 
 



const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar inside a wrapper */}
      

      {/* Main content area */}
      <main className="flex-grow">
        <Outlet />
      </main>

    
    </div>
  );
};

export default Layout;











// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Navbar from './Navbar'; 
// import CommonWrapper from '@/common/CommonWrapper'; 
// import BilledSmartFooter from './BilledSmartFooter'; 

// // 1. Define the necessary interface (optional if already defined globally)
// interface QuickLink {
//   name: string;
//   href: string;
// }

// // 2. Define the data for the Quick Links
// const footerLinks: QuickLink[] = [
//   { name: 'Features', href: '/features' },
//   { name: 'Pricing', href: '/pricing' },
//   { name: 'Reviews', href: '/reviews' },
//   { name: 'FAQ', href: '/faq' },
// ];

// const Layout: React.FC = () => {
//   return (
//     // Use flex-col and min-h-screen to ensure the footer stays at the bottom
//     <div className="flex flex-col min-h-screen">
      
//       <CommonWrapper className=" "> 
//         <Navbar /> 
//       </CommonWrapper>
      
//       {/* main element with flex-grow pushes the footer down and takes up remaining space */}
//       <main className="flex-grow">
//         <Outlet />
//       </main>
      
//       {/* 3. Render the Footer and pass the required prop */}
//       {/* The footer is a full-width element, so CommonWrapper might not be necessary here 
//           unless you need to constrain the background color/padding. 
//           The BilledSmartFooter component already handles its own content width ( ).
//       */}
//       <BilledSmartFooter
//         quickLinks={[
//           { name: "Features", to: "Features" },
//           { name: "Pricing", to: "Pricing" },
//           { name: "Reviews", to: "Reviews" },
//           { name: "FAQ", to: "FAQ" },
//         ]}
//       />

//     </div>
//   );
// };

// export default Layout;