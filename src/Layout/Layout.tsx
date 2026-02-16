
import React from 'react';
import { Outlet } from 'react-router-dom';





const Layout: React.FC = () => {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: 'url(/src/assets/home.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundColor: '#1a1a1a'
      }}
    >



      <main className="flex-grow backdrop-blur-lg">
        <Outlet />
      </main>


    </div>
  );
};

export default Layout;







