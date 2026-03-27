// src/modules/manager/components/ProgramStats.tsx

import { Card } from '../../../shared/components/Common/Card';
import type { Program } from '../types/manager.types';

interface ProgramStatsProps {
  program: Program;
}

export const ProgramStats = ({ program }: ProgramStatsProps) => {
  const percentUsed = ((program.totalBudget - program.remainingBudget) / program.totalBudget) * 100;
  const percentBeneficiaries = (program.beneficiariesReached / (program.totalBudget / program.amountPerPerson)) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="text-sm text-gray-500">Budget Used</div>
        <div className="text-2xl font-bold">${(program.totalBudget - program.remainingBudget).toLocaleString()}</div>
        <div className="text-sm text-gray-500">of ${program.totalBudget.toLocaleString()}</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentUsed}%` }} />
        </div>
        <div className="text-xs text-gray-500 mt-1">{percentUsed.toFixed(0)}% used</div>
      </Card>

      <Card className="p-4">
        <div className="text-sm text-gray-500">Beneficiaries</div>
        <div className="text-2xl font-bold">{program.beneficiariesReached.toLocaleString()}</div>
        <div className="text-sm text-gray-500">of {Math.floor(program.totalBudget / program.amountPerPerson).toLocaleString()}</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percentBeneficiaries}%` }} />
        </div>
        <div className="text-xs text-gray-500 mt-1">{percentBeneficiaries.toFixed(0)}% reached</div>
      </Card>

      <Card className="p-4">
        <div className="text-sm text-gray-500">Amount Per Person</div>
        <div className="text-2xl font-bold">${program.amountPerPerson}</div>
        <div className="text-sm text-gray-500">per distribution</div>
        <div className="mt-2 text-xs text-gray-500">
          Status: {program.isActive ? '🟢 Active' : '🔴 Inactive'}
        </div>
      </Card>
    </div>
  );
};