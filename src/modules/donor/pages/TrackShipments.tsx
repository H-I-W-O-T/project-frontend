import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { StatusBadge } from '../../../shared/components/Common/StatusBadge';
import { Spinner } from '../../../shared/components/Common/Spinner';
import { Input } from '../../../shared/components/Forms/Input';
import { ShipmentTimeline } from '../components/ShipmentTimeline';
import { useShipments } from '../hooks/useShipments';
// import { Shipment } from '../types/donor.types';

export const TrackShipments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { shipments, selectedShipment, loading, fetchShipmentDetails, setSelectedShipment } = useShipments();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const programId = searchParams.get('program');

  console.log(setSearchParams, setSelectedShipment)

  useEffect(() => {
    if (programId && shipments.length > 0) {
      // Find shipment related to program (in mock, just select first)
      if (shipments[0]) {
        fetchShipmentDetails(shipments[0].batchId);
      }
    }
  }, [programId, shipments, fetchShipmentDetails]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return 'pending';
      case 'in-transit': return 'warning';
      case 'in-storage': return 'info';
      case 'distributed': return 'success';
      default: return 'info';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'created': return '📦';
      case 'in-transit': return '🚚';
      case 'in-storage': return '🏢';
      case 'distributed': return '✓';
      default: return '📍';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'created': return 'Created';
      case 'in-transit': return 'In Transit';
      case 'in-storage': return 'In Storage';
      case 'distributed': return 'Distributed';
      default: return status;
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          shipment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || shipment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">Track Shipments</h1>
        <p className="text-gray-600 mt-1">Monitor your funded shipments from port to person.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by batch ID or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<span>🔍</span>}
            clearable
          />
        </div>
        <div className="flex gap-2">
          {['all', 'created', 'in-transit', 'in-storage', 'distributed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === status
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipments List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-semibold text-gray-900 mb-3">
            Your Shipments ({filteredShipments.length})
          </h2>
          
          {filteredShipments.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No shipments found</p>
            </Card>
          ) : (
            filteredShipments.map((shipment) => (
              <div
                key={shipment.batchId}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedShipment?.batchId === shipment.batchId ? 'ring-2 ring-primary shadow-md' : ''
                }`}
                onClick={() => fetchShipmentDetails(shipment.batchId)}
              >
                <Card className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{getStatusIcon(shipment.status)}</span>
                        <p className="font-medium text-gray-900">{shipment.description}</p>
                      </div>
                      <p className="text-xs text-gray-500 font-mono">
                        ID: {shipment.batchId}
                      </p>
                    </div>
                    <StatusBadge status={getStatusColor(shipment.status) as any} size="sm" />
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">Quantity</p>
                      <p className="font-medium text-gray-900">{shipment.quantity.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Remaining</p>
                      <p className="font-medium text-gray-900">{shipment.remaining.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 truncate">
                      📍 {shipment.currentLocation}
                    </p>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="progress-bar h-1">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${((shipment.quantity - shipment.remaining) / shipment.quantity) * 100}%`,
                          backgroundColor: '#006666'
                        }} 
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.round(((shipment.quantity - shipment.remaining) / shipment.quantity) * 100)}% distributed
                    </p>
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>

        {/* Shipment Details */}
        <div className="lg:col-span-2">
          {selectedShipment ? (
            <div className="space-y-4">
              {/* Header Card */}
              <Card className="p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getStatusIcon(selectedShipment.status)}</span>
                      <h2 className="text-xl font-bold text-gray-900">{selectedShipment.description}</h2>
                    </div>
                    <p className="text-sm text-gray-500 font-mono">
                      Batch ID: {selectedShipment.batchId}
                    </p>
                  </div>
                  <StatusBadge status={getStatusColor(selectedShipment.status) as any} />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Total Quantity</p>
                    <p className="text-lg font-bold text-gray-900">{selectedShipment.quantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Remaining</p>
                    <p className="text-lg font-bold text-primary">{selectedShipment.remaining.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Distributed</p>
                    <p className="text-lg font-bold text-green-600">
                      {(selectedShipment.quantity - selectedShipment.remaining).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Location</p>
                    <p className="text-sm font-medium text-gray-700 truncate">{selectedShipment.currentLocation}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Distribution Progress</span>
                    <span className="font-medium">
                      {Math.round(((selectedShipment.quantity - selectedShipment.remaining) / selectedShipment.quantity) * 100)}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${((selectedShipment.quantity - selectedShipment.remaining) / selectedShipment.quantity) * 100}%`,
                        backgroundColor: '#006666'
                      }} 
                    />
                  </div>
                </div>
              </Card>

              {/* Timeline Card */}
              <Card className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📋</span> Chain of Custody
                </h3>
                <ShipmentTimeline events={selectedShipment.timeline} />
              </Card>

              {/* Actions Card */}
              <Card className="p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // In real app, would download PDF report
                      alert('Download report feature coming soon');
                    }}
                  >
                    📄 Download Report
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // In real app, would share link
                      navigator.clipboard.writeText(selectedShipment.batchId);
                      alert('Batch ID copied to clipboard');
                    }}
                  >
                    📋 Copy Batch ID
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // In real app, would open block explorer
                      window.open('https://stellar.expert/explorer/testnet', '_blank');
                    }}
                  >
                    🔗 View on Stellar Explorer
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">🚚</div>
              <p className="text-gray-500 mb-2">Select a shipment to view details</p>
              <p className="text-sm text-gray-400">Click on any shipment from the list to see its complete chain of custody</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};