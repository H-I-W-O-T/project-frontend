import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './shared/components/Common/ToastContainer';
import { Layout } from './shared/components/Layout/Layout';
import { DonorModule } from './modules/donor';
import AgentModule from './modules/agent';
import { ManagerModule } from './modules/manager';
import { TestFlow } from './debug/TestFlow';

function App() {
  // For demo, we'll set user as donor
  const userType = 'donor';
  const userName = 'Humanitarian Foundation';

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <Layout 
                userType={userType} 
                userName={userName} 
              />
            }
          >
            <Route path="donor/*" element={<DonorModule />} />
            <Route index element={<Navigate to="/donor/dashboard" />} />
            <Route path="agent/*" element={<AgentModule />} />
            <Route index element={<Navigate to="/agent/dashboard" />} />
            <Route path="manager/*" element={<ManagerModule />} />
            <Route index element={<Navigate to="/manager/dashboard" />} />
            <Route path="/test" element={<TestFlow />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;