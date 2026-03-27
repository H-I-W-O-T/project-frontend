import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Program } from '../types/manager.types';

interface DistributionChartProps {
  programs: Program[];
}

export const DistributionChart = ({ programs }: DistributionChartProps) => {
  // Mock data - replace with real data from API
  const data = [
    { date: 'Mar 1', distributions: 45 },
    { date: 'Mar 2', distributions: 52 },
    { date: 'Mar 3', distributions: 48 },
    { date: 'Mar 4', distributions: 61 },
    { date: 'Mar 5', distributions: 73 },
    { date: 'Mar 6', distributions: 82 },
    { date: 'Mar 7', distributions: 68 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="distributions" stroke="#10b981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};
