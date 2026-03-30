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
  // Defensive calculation for progress bar
  const total = program?.totalBudget || 1; // Prevent division by zero
  const used = (program?.totalBudget || 0) - (program?.remainingBudget || 0);
  const percentageUsed = Math.min((used / total) * 100, 100);

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return { status: 'success', label: 'Active' };
      case 'completed': return { status: 'info', label: 'Completed' };
      default: return { status: 'warning', label: status || 'Unknown' };
    }
  };

  const statusConfig = getStatusConfig(program.status);

  return (
    <Card className="hover-lift">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
              {program?.name || 'Unnamed Program'}
            </h3>
            <p className="text-xs text-gray-500 font-mono mt-1">
              ID: {program?.programId?.slice(0, 12) || 'N/A'}...
            </p>
          </div>
          <StatusBadge status={statusConfig.status as any} label={statusConfig.label} />
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Budget Used</span>
            <span className="font-medium text-gray-900">
              ${used.toLocaleString()} / ${(program?.totalBudget || 0).toLocaleString()}
            </span>
          </div>
          <Progress value={percentageUsed} size="sm" color="primary" />

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <p className="text-xs text-gray-500">Per Person</p>
              <p className="font-medium text-gray-900">
                ${(program?.amountPerPerson || 0).toLocaleString()} USDC
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Impact</p>
              <p className="font-medium text-primary">
                {(program?.beneficiariesReached || 0).toLocaleString()} Reached
              </p>
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