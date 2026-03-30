import { useState, useEffect, useCallback } from 'react';
import { useStellar } from '../../../contexts/StellarContext';
import { scValToNative } from '@stellar/stellar-sdk';

export const useShipments = () => {
  const { clients, publicKey } = useStellar();
  const [shipments, setShipments] = useState<any[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Helper: Convert Uint8Array/Buffer to Hex string (prevents .toLowerCase() crashes)
  const formatId = (val: any): string => {
    if (typeof val === 'string') return val;
    if (val instanceof Uint8Array || Buffer.isBuffer(val)) {
      return Array.from(val)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
    // Handle Address objects if they aren't auto-stringified
    if (val?.toString) return val.toString();
    return String(val);
  };

  // Helper: Map Rust Enums to Frontend Strings
  const mapStatus = (statusNum: number) => {
    const statuses = ['created', 'in-transit', 'in-storage', 'distributed'];
    return statuses[statusNum] || 'created';
  };

  const mapEventType = (typeNum: number) => {
    const types = ['create', 'transfer', 'damage', 'distribute'];
    return types[typeNum] || 'transfer';
  };

  // 2. Fetch all batches for the sidebar index
  const fetchShipments = useCallback(async () => {
    if (!clients.supply || !publicKey) return;
    setLoading(true);
    try {
      const result = await clients.supply.getAllBatches();
      if (result) {
        const nativeBatches = scValToNative(result);
        
        const formatted = nativeBatches.map((b: any) => ({
          batchId: formatId(b.batch_id),
          description: b.description.toString(), // Ensure String/Bytes becomes string
          quantity: Number(b.quantity),
          remaining: Number(b.remaining),
          status: mapStatus(b.status),
          currentLocation: `Custodian: ${formatId(b.current_custodian).slice(0, 8)}...`,
        }));
        setShipments(formatted);
      }
    } catch (err) {
      console.error("Ledger Index Fetch Failed:", err);
    } finally {
      setLoading(false);
    }
  }, [clients.supply, publicKey]);

  // 3. Fetch detailed history for the Timeline
  const fetchShipmentDetails = useCallback(async (batchId: string) => {
    if (!clients.supply) return;
    
    try {
      const batchRaw = await clients.supply.getBatch(batchId);
      const historyRaw = await clients.supply.getBatchHistory(batchId);
      
      const batch = scValToNative(batchRaw);
      const history = scValToNative(historyRaw);

      setSelectedShipment({
        batchId: formatId(batch.batch_id),
        description: batch.description.toString(),
        quantity: Number(batch.quantity),
        remaining: Number(batch.remaining),
        status: mapStatus(batch.status),
        currentLocation: formatId(batch.current_custodian),
        timeline: history.map((event: any) => ({
          eventId: formatId(event.event_id),
          eventType: mapEventType(event.event_type),
          // Convert Soroban i64 timestamp to JS Date
          timestamp: new Date(Number(event.timestamp) * 1000).toISOString(),
          location: `Lat: ${event.location[0]}, Lon: ${event.location[1]}`,
          quantity: Math.abs(Number(event.quantity_change)),
          notes: event.notes.toString(),
          from: event.from ? formatId(event.from) : null,
          to: event.to ? formatId(event.to) : null
        }))
      });
    } catch (err) {
      console.error("Error fetching shipment details:", err);
    }
  }, [clients.supply]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  return { 
    shipments, 
    selectedShipment, 
    loading, 
    fetchShipments, 
    fetchShipmentDetails, 
    setSelectedShipment 
  };
};