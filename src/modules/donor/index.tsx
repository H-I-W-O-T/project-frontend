import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { FundProgram } from './pages/FundProgram';
import { TrackShipments } from './pages/TrackShipments';
import { ImpactReports } from './pages/ImpactReports';
import { VerifyProofs } from './pages/VerifyProofs';
import { Settings } from './pages/Settings';

export const DonorModule = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="fund" element={<FundProgram />} />
      <Route path="shipments" element={<TrackShipments />} />
      <Route path="impact" element={<ImpactReports />} />
      <Route path="verify" element={<VerifyProofs />} />
      <Route path="settings" element={<Settings />} />
      <Route index element={<Dashboard />} />
    </Routes>
  );
};

export default DonorModule;