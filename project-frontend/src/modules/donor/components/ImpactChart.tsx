import { BarChart, LineChart, PieChart } from '../../../shared/components/Charts';
import type { ImpactData } from '../types/donor.types';

interface ImpactChartProps {
  data: ImpactData;
  type: 'region' | 'demographic' | 'trend';
}

export const ImpactChart = ({ data, type }: ImpactChartProps) => {
  if (type === 'region') {
    return (
      <PieChart
        data={data.byRegion}
        title="Beneficiaries by Region"
        description="Distribution across Ethiopian regions"
        donut={false}
        showPercentage={true}
        valueFormatter={(v) => v.toLocaleString()}
      />
    );
  }

  if (type === 'demographic') {
    return (
      <PieChart
        data={data.byDemographic}
        title="Beneficiaries by Demographic"
        description="Breakdown by population group"
        donut={true}
        showPercentage={true}
        valueFormatter={(v) => v.toLocaleString()}
      />
    );
  }

//   if (type === 'trend') {
//     return (
//       <LineChart
//         data={data.monthlyTrend}
//         series={[
//           { name: 'Beneficiaries', dataKey: 'beneficiaries', color: '#006666' },
//         ]}
//         title="Monthly Beneficiary Growth"
//         description="Number of beneficiaries reached over time"
//         showDots={true}
//         showArea={true}
//         smooth={true}
//         valueFormatter={(v) => v.toLocaleString()}
//       />
//     );
//   }

  return null;
};