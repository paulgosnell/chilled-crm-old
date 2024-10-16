import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { UserProfile } from '@/types/user';

interface LayoutProps {
  userProfile: UserProfile | null;
}

const Layout: React.FC<LayoutProps> = ({ userProfile }) => {
  const location = useLocation();

  const getHeaderTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/contacts':
        return 'Contacts';
      case '/companies':
        return 'Companies';
      case '/deals':
        return 'Deals';
      case '/tasks':
        return 'Tasks';
      default:
        return 'ChilledCRM';
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar userProfile={userProfile} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={getHeaderTitle()} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;