// src/modules/manager/index.tsx
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProgramDetails from './pages/ProgramDetails';
import GeofenceMap from './pages/GeofenceMap';
import Analytics from './pages/Analytics';
import Agents from './pages/Agents';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';

export const ManagerModule = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="programs/:programId" element={<ProgramDetails />} />
      <Route path="geofence" element={<GeofenceMap />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="agents" element={<Agents />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="settings" element={<Settings />} />
      <Route index element={<Dashboard />} />
    </Routes>
  );
};

export default ManagerModule;