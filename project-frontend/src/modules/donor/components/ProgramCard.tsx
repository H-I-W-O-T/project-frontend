import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { Progress } from '../../../shared/components/Common/Progress';
import { StatusBadge } from '../../../shared/components/Common/StatusBadge';
import type { Program } from '../types/donor.types';

interface ProgramCardProps {
  program: Program;
  onViewDetails: (programId: string) => void;
}

export const ProgramCard = ({ program, onViewDetails }: ProgramCardProps) => {
  const percentageUsed = ((program.totalBudget - program.remainingBudget) / program.totalBudget) * 100;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { status: 'success', label: 'Active' };
      case 'completed':
        return { status: 'info', label: 'Completed' };
      case 'paused':
        return { status: 'warning', label: 'Paused' };
      default:
        return { status: 'info', label: status };
    }
  };

  const statusConfig = getStatusConfig(program.status);

  return (
    <Card className="hover-lift">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">{program.name}</h3>
            <p className="text-xs text-gray-500 font-mono mt-1">
              ID: {program.programId.slice(0, 12)}...
            </p>
          </div>
          <StatusBadge status={statusConfig.status as any} label={statusConfig.label} />
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Budget Used</span>
            <span className="font-medium text-gray-900">
              ${(program.totalBudget - program.remainingBudget).toLocaleString()} / ${program.totalBudget.toLocaleString()}
            </span>
          </div>
          <Progress value={percentageUsed} size="sm" color="primary" />

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <p className="text-xs text-gray-500">Amount Per Person</p>
              <p className="font-medium text-gray-900">${program.amountPerPerson} USDC</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Beneficiaries Reached</p>
              <p className="font-medium text-primary">{program.beneficiariesReached.toLocaleString()}</p>
            </div>
          </div>

          <div className="pt-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => onViewDetails(program.programId)}
            >
              View Details →
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};