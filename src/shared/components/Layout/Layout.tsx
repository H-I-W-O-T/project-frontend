import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  userType: 'donor' | 'manager' | 'agent';
  userName: string;
  userAvatar?: string;
  onLogout?: () => void;
  showFooter?: boolean;
}

export const Layout = ({
  children,
  userType,
  userName,
  userAvatar,
  onLogout,
  showFooter = true,
}: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        userType={userType}
        userName={userName}
        userAvatar={userAvatar}
        onMenuClick={toggleSidebar}
        onLogout={onLogout}
      />

      <div className="flex flex-1">
        <Sidebar
          userType={userType}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        <main className="flex-1 overflow-x-auto">
          <div className="container-padding py-6">
            {children}
          </div>
        </main>
      </div>

      {showFooter && <Footer />}
    </div>
  );
};