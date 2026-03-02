import React from 'react';
import { Outlet } from 'react-router-dom';
// import homeBg from '../assets/home.jpg';




const Layout: React.FC = () => {
  return (
    <div
      className="flex flex-col h-screen overflow-hidden bg-background"
    >



      <main className="flex-grow">
        <Outlet />
      </main>


    </div >
  );
};

export default Layout;























// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import homeBg from '../assets/home.jpg';





// const Layout: React.FC = () => {
//   return (
//     <div
//       className="flex flex-col h-screen overflow-hidden"
//       style={{
//         backgroundImage: `url(${homeBg})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//         backgroundAttachment: 'fixed',
//         backgroundColor: '#1a1a1a'
//       }}
//     >



//       <main className="flex-grow backdrop-blur-lg">
//         <Outlet />
//       </main>


//     </div >
//   );
// };

// export default Layout;







