// // // src/modules/agent/index.tsx

// // import { Routes, Route } from 'react-router-dom';
// // import { Dashboard } from './pages/Dashboard';
// // import { Register } from './pages/Register';
// // import { Verify } from './pages/Verify';
// // import { Distribute } from './pages/Distribute';
// // import { ScanBatch } from './pages/ScanBatch';
// // import { History } from './pages/History';
// // import { OfflineQueue } from './pages/OfflineQueue';
// // import { Settings } from './pages/Settings';

// // export const AgentModule = () => {
// //   return (
// //     <Routes>
// //       <Route index element={<Dashboard />} />
// //       <Route path="dashboard" element={<Dashboard />} />
// //       <Route path="register" element={<Register />} />
// //       <Route path="verify" element={<Verify />} />
// //       <Route path="distribute" element={<Distribute />} />
// //       <Route path="scan-batch" element={<ScanBatch />} />
// //       <Route path="history" element={<History />} />
// //       <Route path="offline-queue" element={<OfflineQueue />} />
// //       <Route path="settings" element={<Settings />} />
// //     </Routes>
// //   );
// // };

// // export default AgentModule;


// // index.tsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
// import Register from './pages/Register';
// import Verify from './pages/Verify';
// import Distribute from './pages/Distribute';
// import ScanBatch from './pages/ScanBatch';
// import History from './pages/History';
// import OfflineQueue from './pages/OfflineQueue';
// import Settings from './pages/Settings';
// import { OfflineIndicator } from './components/OfflineIndicator';
// // import { SyncProgress } from './components/SyncProgress';

// const AgentModule: React.FC = () => {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         {/* Navigation */}
//         <nav className="bg-white shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between h-16">
//               <div className="flex">
//                 <div className="flex-shrink-0 flex items-center">
//                   <h1 className="text-xl font-bold text-gray-900">Agent Dashboard</h1>
//                 </div>
//                 <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
//                   <Link to="/agent/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
//                     Dashboard
//                   </Link>
//                   <Link to="/agent/register" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
//                     Register
//                   </Link>
//                   <Link to="/agent/verify" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
//                     Verify
//                   </Link>
//                   <Link to="/agent/distribute" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
//                     Distribute
//                   </Link>
//                   <Link to="/agent/scan" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
//                     Scan Batch
//                   </Link>
//                   <Link to="/agent/history" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
//                     History
//                   </Link>
//                   <Link to="/agent/offline" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
//                     Offline Queue
//                   </Link>
//                   <Link to="/agent/settings" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
//                     Settings
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </nav>

//         {/* Main Content */}
//         <div className="py-6">
//           <Routes>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/verify" element={<Verify />} />
//             <Route path="/distribute" element={<Distribute />} />
//             <Route path="/scan" element={<ScanBatch />} />
//             <Route path="/history" element={<History />} />
//             <Route path="/offline" element={<OfflineQueue />} />
//             <Route path="/settings" element={<Settings />} />
//             <Route path="/" element={<Dashboard />} />
//           </Routes>
//         </div>

//         {/* Global Components */}
//         <OfflineIndicator />
//         {/* <SyncProgress progress={0} total={0} status="syncing" /> */}
//       </div>
//     </Router>
//   );
// };

// export default AgentModule;



// modules/agent/index.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // ✅ Remove BrowserRouter import
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Distribute from './pages/Distribute';
import ScanBatch from './pages/ScanBatch';
import History from './pages/History';
import OfflineQueue from './pages/OfflineQueue';
import Settings from './pages/Settings';
import { OfflineIndicator } from './components/OfflineIndicator';

const AgentModule: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Agent Dashboard</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  to="/agent/dashboard" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/agent/register" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Register
                </Link>
                <Link 
                  to="/agent/verify" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Verify
                </Link>
                <Link 
                  to="/agent/distribute" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Distribute
                </Link>
                <Link 
                  to="/agent/scan" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Scan Batch
                </Link>
                <Link 
                  to="/agent/history" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  History
                </Link>
                <Link 
                  to="/agent/offline" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Offline Queue
                </Link>
                <Link 
                  to="/agent/settings" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Routes are relative to /agent/* */}
      <div className="py-6">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="register" element={<Register />} />
          <Route path="verify" element={<Verify />} />
          <Route path="distribute" element={<Distribute />} />
          <Route path="scan" element={<ScanBatch />} />
          <Route path="history" element={<History />} />
          <Route path="offline" element={<OfflineQueue />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>

      {/* Global Components */}
      <OfflineIndicator />
    </div>
  );
};

export default AgentModule;