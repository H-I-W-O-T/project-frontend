import { BarChart, LineChart, PieChart } from './shared/components/Charts';
import { useState } from 'react';
import { Button } from './shared/components/Common';

// Sample data with proper typing
const barData = [
  { name: 'Jan', donors: 4000, beneficiaries: 2400 },
  { name: 'Feb', donors: 3000, beneficiaries: 1398 },
  { name: 'Mar', donors: 2000, beneficiaries: 9800 },
  { name: 'Apr', donors: 2780, beneficiaries: 3908 },
  { name: 'May', donors: 1890, beneficiaries: 4800 },
  { name: 'Jun', donors: 2390, beneficiaries: 3800 },
];

const lineData = [
  { name: 'Week 1', value: 400 },
  { name: 'Week 2', value: 600 },
  { name: 'Week 3', value: 800 },
  { name: 'Week 4', value: 1200 },
  { name: 'Week 5', value: 1500 },
  { name: 'Week 6', value: 1800 },
];

const pieData = [
  { name: 'Amhara', value: 89234, color: '#006666' },
  { name: 'Oromia', value: 67891, color: '#009999' },
  { name: 'Tigray', value: 45678, color: '#00CCCC' },
  { name: 'Somali', value: 23456, color: '#00FFFF' },
];

const areaData = [
  { name: 'Jan', distributed: 4000, target: 5000 },
  { name: 'Feb', distributed: 4500, target: 5000 },
  { name: 'Mar', distributed: 4800, target: 5000 },
  { name: 'Apr', distributed: 5200, target: 5000 },
  { name: 'May', distributed: 5800, target: 6000 },
  { name: 'Jun', distributed: 6200, target: 6000 },
];

export const App = () => {
  const [chartType, setChartType] = useState('bar');

  return (
    <div className="p-6 space-y-8">
      <div className="flex gap-2 flex-wrap">
        <Button variant={chartType === 'bar' ? 'primary' : 'outline'} onClick={() => setChartType('bar')}>
          Bar Chart
        </Button>
        <Button variant={chartType === 'line' ? 'primary' : 'outline'} onClick={() => setChartType('line')}>
          Line Chart
        </Button>
        <Button variant={chartType === 'pie' ? 'primary' : 'outline'} onClick={() => setChartType('pie')}>
          Pie Chart
        </Button>
        <Button variant={chartType === 'donut' ? 'primary' : 'outline'} onClick={() => setChartType('donut')}>
          Donut Chart
        </Button>
        <Button variant={chartType === 'area' ? 'primary' : 'outline'} onClick={() => setChartType('area')}>
          Area Chart
        </Button>
      </div>

      {chartType === 'bar' && (
        <BarChart
          data={barData as any[]}
          series={[
            { name: 'Donors', dataKey: 'donors', color: '#006666' },
            { name: 'Beneficiaries', dataKey: 'beneficiaries', color: '#00CCCC' },
          ]}
          title="Monthly Donations & Beneficiaries"
          description="Comparison of donor contributions vs beneficiaries reached"
          stacked={false}
          showValues={true}
          valueFormatter={(v) => `$${v.toLocaleString()}`}
        />
      )}

      {chartType === 'line' && (
        <LineChart
          data={lineData as any[]}
          series={[
            { name: 'Beneficiaries', dataKey: 'value', color: '#006666' },
          ]}
          title="Weekly Beneficiary Growth"
          description="Number of beneficiaries reached over time"
          showDots={true}
          showArea={true}
          smooth={true}
          valueFormatter={(v) => v.toLocaleString()}
        />
      )}

      {chartType === 'pie' && (
        <PieChart
          data={pieData as any[]}
          title="Beneficiaries by Region"
          description="Distribution of aid recipients across Ethiopian regions"
          donut={false}
          showPercentage={true}
          valueFormatter={(v) => v.toLocaleString()}
        />
      )}

      {chartType === 'donut' && (
        <PieChart
          data={pieData as any[]}
          title="Beneficiaries by Region"
          description="Distribution of aid recipients across Ethiopian regions"
          donut={true}
          showPercentage={true}
          valueFormatter={(v) => v.toLocaleString()}
        />
      )}

      {chartType === 'area' && (
        <LineChart
          data={areaData as any[]}
          series={[
            { name: 'Distributed', dataKey: 'distributed', color: '#006666' },
            { name: 'Target', dataKey: 'target', color: '#00CCCC' },
          ]}
          title="Distribution vs Target"
          description="Monthly aid distribution compared to targets"
          showArea={true}
          showDots={true}
          valueFormatter={(v) => v.toLocaleString()}
        />
      )}
    </div>
  );
};

export default App;