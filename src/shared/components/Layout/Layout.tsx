import { useState } from 'react';
import { useOutlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface LayoutProps {
  userType: 'donor' | 'manager' | 'agent';
  userName: string;
  userAvatar?: string;
  walletAddress?: string; // Add this to match App.tsx
  onLogout?: () => void;
  showFooter?: boolean;
}

export const Layout = ({
  userType,
  userName,
  userAvatar,
  walletAddress, // Destructure the new prop
  onLogout,
  showFooter = true,
}: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const outlet = useOutlet();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Default logout handler if none is provided via props
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Clear session logic or redirect
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header now receives all required props including walletAddress */}
      <Header
        userType={userType}
        userName={userName}
        userAvatar={userAvatar}
        walletAddress={walletAddress}
        onMenuClick={toggleSidebar}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 relative">
        <Sidebar
          userType={userType}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        {/* Backdrop for mobile sidebar interaction */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-sm transition-all" 
            onClick={closeSidebar}
          />
        )}

        <main className="flex-1 overflow-x-auto">
          <div className="container-padding py-6 max-w-7xl mx-auto">
            {/* outlet renders the children routes (DonorModule, AgentModule, etc.) */}
            {outlet}
          </div>
        </main>
      </div>

      {showFooter && <Footer />}
    </div>
  );
};