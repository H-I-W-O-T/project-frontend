import { useParams, useNavigate } from 'react-router-dom';
import { usePrograms } from '../hooks/usePrograms';
import { ProgramStats } from '../components/ProgramStats';
import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { Spinner } from '../../../shared/components/Common/Spinner';

const ProgramDetails = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { programs, loading, error } = usePrograms();
  
  const program = programs.find(p => p.programId === programId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded">
          {error || 'Program not found'}
        </div>
        <Button 
          onClick={() => navigate('/manager/dashboard')} 
          variant="secondary" 
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button 
            onClick={() => navigate('/manager/dashboard')} 
            variant="secondary" 
            size="sm"
            className="mb-2"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">{program.name}</h1>
        </div>
        <Button 
          onClick={() => navigate(`/manager/geofence?programId=${program.programId}`)} 
          variant="primary"
        >
          Edit Geofence
        </Button>
      </div>

      {/* Program Stats */}
      <ProgramStats program={program} />

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Program Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Program ID:</span>
              <span className="font-mono text-sm">{program.programId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Donor:</span>
              <span>{program.donorName || program.donor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span>{new Date(program.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Distributions:</span>
              <span>{program.distributionsCount?.toLocaleString() || 0}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Geofence Area</h2>
          {program.geofence && program.geofence.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                Polygon with {program.geofence.length} points
              </div>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                {program.geofence.map((point, i) => (
                  <div key={i}>
                    {point[0].toFixed(4)}, {point[1].toFixed(4)}
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => navigate(`/manager/geofence?programId=${program.programId}`)}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                View on Map
              </Button>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">
              No geofence set for this program
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProgramDetails;