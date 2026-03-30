import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './shared/components/Common/ToastContainer';
import { Layout } from './shared/components/Layout/Layout';
import { DonorModule } from './modules/donor';
import AgentModule from './modules/agent';
import { ManagerModule } from './modules/manager';
import { TestFlow } from './debug/TestFlow';
import { StellarProvider, useStellar } from './contexts/StellarContext';
import { Login } from './shared/pages/Login'; 
import { Register } from './shared/pages/Register';

// Define the specific string literal types the Layout expects
type UserRoleType = 'donor' | 'manager' | 'agent';

const AppRoutes = () => {
  const { publicKey, userProfile, userRole, isLoaded, needsRegistration, disconnect } = useStellar();

  // 1. Loading State: Prevent UI flicker while checking Freighter/Contract
  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cyan"></div>
        <p className="mt-4 text-gray-600 font-medium">Synchronizing with Stellar...</p>
      </div>
    );
  }

  // 2. Public Logic: If no wallet is connected, they can only see Login
  if (!publicKey) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 3. Identity Logic: Wallet connected but no on-chain profile found
  if (needsRegistration) {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    );
  }

  // 4. Role-Based Logic: Map contract enum (0,1,2) to Layout types
  const roleNames: Record<number, UserRoleType> = { 
    0: 'donor', 
    1: 'manager', 
    2: 'agent' 
  };

  // Ensure userType matches the strict 'donor' | 'manager' | 'agent' type
  const currentUserType: UserRoleType = roleNames[userRole as number] || 'donor';

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Layout 
            userType={currentUserType} 
            userName={userProfile?.name || 'User'} 
            walletAddress={publicKey}
            onLogout={() => {
              disconnect(); // This calls the function we added to useWallet
              window.location.href = '/'; // Refresh to trigger the "needsRegistration" or "Connect" view
            }}
          />
        }
      >
        {/* Automatic Dashboard Routing based on User Role */}
        <Route index element={
          userRole === 0 ? <Navigate to="/donor" replace /> :
          userRole === 1 ? <Navigate to="/manager" replace /> :
          <Navigate to="/agent" replace />
        } />

        {/* Protected Module Routes */}
        <Route 
          path="donor/*" 
          element={userRole === 0 ? <DonorModule /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="manager/*" 
          element={userRole === 1 ? <ManagerModule /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="agent/*" 
          element={userRole === 2 ? <AgentModule /> : <Navigate to="/" replace />} 
        />
        
        {/* Debug/Internal Tools */}
        <Route path="test" element={<TestFlow />} />
      </Route>
      
      {/* Global Catch-all: Send back to role-appropriate index */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <StellarProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </StellarProvider>
  );
}

export default App;