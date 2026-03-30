import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { Input } from '../../../shared/components/Forms/Input';
import { useStellar } from '../../../contexts/StellarContext';
import { useToast } from '../../../shared/components/Common/ToastContainer';
import { 
  Package, 
  Truck, 
  AlertTriangle, 
  History, 
  Plus, 
  ChevronRight,
  ClipboardList,
  MapPin
} from 'lucide-react';
import { parseScVal } from '../../../shared/api/contracts/utils';

export const SupplyManagement = () => {
  const { clients, publicKey } = useStellar();
  const toast = useToast();
  
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);
  const [batchHistory, setBatchHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { description: '', quantity: 100 }
  });

  // Inside SupplyManagement.tsx
  const loadData = async () => {
    setLoading(true);
    try {
        const rawBatches = await clients.supply.getAllBatches();
        
        // The SDK returns an ScVal. We need to convert it to a Native JS Array
        // then parse each individual batch within that array.
        const nativeBatches = parseScVal(rawBatches);
        
        // If the contract returns a Vec<Batch>, nativeBatches will be an array
        setBatches(Array.isArray(nativeBatches) ? nativeBatches : []);
    } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to sync with ledger");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [clients]);

  const onCreateBatch = async (data: any) => {
    setSubmitting(true);
    try {
      const batchId = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, "0")).join("");
      
      await clients.supply.createBatch(publicKey, batchId, data.description, data.quantity, batchId);
      toast.success("Batch successfully recorded");
      reset();
      loadData();
    } catch (err) {
      toast.error("Contract call failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewHistory = async (batch: any) => {
  // Clear old history while loading new
  setBatchHistory([]); 
  setSelectedBatch(batch);

  console.log("Requesting history for ID:", batch.batch_id);
  console.log("ID Length:", batch.batch_id.length); // Should be 64 for hex

  try {
    // 1. Get the raw response from the client
    const response = await clients.supply.getBatchHistory(batch.batch_id);
    
    // 2. Log it to see exactly what Soroban is sending back
    console.log("Raw History Response:", response);

    // 3. Parse the value. 
    // If the contract returns Result::Ok(Vec), native will be an array.
    const native = parseScVal(response);
    
    if (native && Array.isArray(native)) {
      setBatchHistory(native);
    } else {
      // If it's an empty Vec, it's not an error, just no history yet.
      setBatchHistory([]);
    }
  } catch (err) {
    // If you get here with NO console error, 'err' might be an empty object
    console.error("Caught History Error:", err); 
    toast.error("Could not retrieve audit trail");
  }
};

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 pb-20">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">H.I.W.O.T Supply</h1>
        <p className="text-gray-500">Immutable chain-of-custody for humanitarian assets</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Creation Section */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card 
            variant="bordered"
            header={<h2 className="font-bold flex items-center gap-2"><Plus size={18}/> New Entry</h2>}
          >
            <form onSubmit={handleSubmit(onCreateBatch)} className="space-y-4">
              <Input label="Description" {...register('description', { required: true })} />
              <Input label="Quantity" type="number" {...register('quantity', { required: true })} />
              <Button type="submit" variant="primary" className="w-full" loading={submitting}>
                Initialize on Stellar
              </Button>
            </form>
          </Card>

          {selectedBatch && (
            <Card 
              variant="gradient" 
              padding="lg"
              footer={
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => {/* Trigger Damage Logic */}}
                >
                  <AlertTriangle size={16} className="mr-2" /> Record Damage
                </Button>
              }
            >
              <h3 className="text-xs font-bold opacity-70 uppercase tracking-widest mb-1">In Custody</h3>
              <p className="text-xl font-bold truncate">{selectedBatch.description}</p>
              <div className="mt-4 flex justify-between items-end">
                <span className="text-3xl font-black">{selectedBatch.remaining}</span>
                <span className="text-xs opacity-80 pb-1">Units Remaining</span>
              </div>
            </Card>
          )}
        </div>

        {/* List Section */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {batches.map((batch) => (
            <Card 
              key={batch.batch_id} 
              hoverable 
              variant={selectedBatch?.batch_id === batch.batch_id ? 'elevated' : 'bordered'}
              className={selectedBatch?.batch_id === batch.batch_id ? 'ring-2 ring-primary border-transparent' : ''}
              onClick={() => handleViewHistory(batch)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                    <Package size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{batch.description}</h4>
                    <p className="text-[10px] font-mono text-gray-400 mt-1">HASH: {batch.batch_id.slice(0,12)}...</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">{batch.remaining}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Qty</p>
                  </div>
                  <ChevronRight size={20} className={`text-gray-300 transition-transform ${selectedBatch?.batch_id === batch.batch_id ? 'rotate-90 text-primary' : ''}`} />
                </div>
              </div>

              {/* Nested History using your md padding */}
              {selectedBatch?.batch_id === batch.batch_id && (
                <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-6 relative pl-4">
                    <div className="absolute left-1 top-1 bottom-1 w-0.5 bg-gray-100" />
                    {batchHistory.map((event, idx) => (
                      <div key={idx} className="relative pl-6">
                        <div className="absolute left-[-1.15rem] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-white" />
                        <div className="flex justify-between">
                          <p className="text-sm font-bold text-gray-800">
                            {event.event_type === 0 ? "Created" : event.event_type === 2 ? "Damage" : "Activity"}
                          </p>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(Number(event.timestamp) * 1000).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 italic mt-0.5">{event.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};