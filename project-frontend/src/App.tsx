import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './shared/components/Common/ToastContainer';
import { Layout } from './shared/components/Layout/Layout';
import { DonorModule } from './modules/donor';
import AgentModule from './modules/agent';
import { ManagerModule } from './modules/manager';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { WalletProvider } from './contexts/Wallet';
import { AuthModal } from './shared/components/Auth/AuthModal';
import { useAuth } from './shared/hooks/useAuth';




// InnerApp component to access auth context values
const InnerApp = () => {
  const { user, logout } = useAuth();
  const userType = user?.role || 'donor';
  const userName = user?.fullName || 'Guest';

  return (
    <>
      <AuthModal />
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              userType={userType}
              userName={userName}
              onLogout={logout}
            />
          }
        >
          <Route path="donor/*" element={<DonorModule />} />
          <Route path="agent/*" element={<AgentModule />} />
          <Route path="manager/*" element={<ManagerModule />} />
          {/* Default: redirect to dashboard for user type */}
          <Route index element={<Navigate to={`/${userType}/dashboard`} />} />
        </Route>
        {/* Fallback: redirect unknown routes to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <ToastProvider>
          <BrowserRouter>
            <InnerApp />
          </BrowserRouter>
        </ToastProvider>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;