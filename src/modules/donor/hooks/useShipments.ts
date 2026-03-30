import { useState, useEffect, useCallback } from 'react';
import { useStellar } from '../../../contexts/StellarContext';
import { CONTRACTS } from '../../../shared/api/contracts/config';
import { scValToNative } from '@stellar/stellar-sdk'; // Import the converter

export interface Shipment {
  batchId: string;
  description: string;
  status: 'created' | 'in-transit' | 'in-storage' | 'distributed';
  quantity: number;
  remaining: number;
  currentLocation: string;
  timeline: any[];
}

export const useShipments = () => {
  const { queryContract, publicKey, isLoaded } = useStellar();
  
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseStatus = (status: any): Shipment['status'] => {
    if (typeof status === 'object' && status !== null) {
      const key = Object.keys(status)[0].toLowerCase();
      if (key.includes('transit')) return 'in-transit';
      if (key.includes('storage')) return 'in-storage';
      if (key.includes('distributed')) return 'distributed';
    }
    return 'created';
  };

  const fetchAllShipments = useCallback(async () => {
    if (!isLoaded || !publicKey) return;
    setLoading(true);
    try {
      const savedBatchIds = JSON.parse(localStorage.getItem(`batches_${publicKey}`) || '[]');
      
      const results = await Promise.all(
        savedBatchIds.map(async (id: string) => {
          try {
            const scValResult = await queryContract({
              contractId: CONTRACTS.SUPPLY,
              method: "get_batch",
              args: [id]
            });

            if (!scValResult) return null;
            
            // --- FIX: Convert ScVal to native JS object ---
            const raw = scValToNative(scValResult);

            return {
              batchId: id,
              description: raw.description || "Supply Batch",
              status: parseStatus(raw.status),
              quantity: Number(raw.quantity),
              remaining: Number(raw.remaining_quantity),
              currentLocation: raw.current_location || "Unknown",
              timeline: []
            };
          } catch (e) {
            return null;
          }
        })
      );
      setShipments(results.filter((s): s is Shipment => s !== null));
    } finally {
      setLoading(false);
    }
  }, [isLoaded, publicKey, queryContract]);

  const fetchShipmentDetails = useCallback(async (batchId: string) => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const scValResult = await queryContract({
        contractId: CONTRACTS.SUPPLY,
        method: "get_batch",
        args: [batchId]
      });

      if (!scValResult) throw new Error("Batch not found");

      // --- FIX: Convert ScVal to native JS object ---
      const raw = scValToNative(scValResult);
      const timelineEvents = [];
      
      timelineEvents.push({
        eventId: `${batchId}-init`,
        eventType: 'create',
        timestamp: new Date(Number(raw.created_at) * 1000).toISOString(),
        location: raw.origin_location || "Source",
        quantity: Number(raw.quantity),
        notes: "Batch initialized on-chain."
      });

      if (raw.custody_history && Array.isArray(raw.custody_history)) {
        raw.custody_history.forEach((h: any, i: number) => {
          timelineEvents.push({
            eventId: `transfer-${i}`,
            eventType: 'transfer',
            timestamp: new Date(Number(h.timestamp) * 1000).toISOString(),
            location: h.location,
            from: h.previous_handler,
            to: h.current_handler,
            quantity: 0,
            notes: h.notes
          });
        });
      }

      if (raw.damage_reports && Array.isArray(raw.damage_reports)) {
        raw.damage_reports.forEach((d: any, i: number) => {
          timelineEvents.push({
            eventId: `damage-${i}`,
            eventType: 'damage',
            timestamp: new Date(Number(d.timestamp) * 1000).toISOString(),
            location: d.location,
            quantity: Number(d.amount),
            notes: d.reason,
            evidenceHash: d.evidence_hash
          });
        });
      }

      setSelectedShipment({
        batchId,
        description: raw.description,
        status: parseStatus(raw.status),
        quantity: Number(raw.quantity),
        remaining: Number(raw.remaining_quantity),
        currentLocation: raw.current_location,
        timeline: timelineEvents.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      });
    } catch (err) {
      setError("Could not retrieve chain of custody.");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, queryContract]);

  useEffect(() => {
    fetchAllShipments();
  }, [fetchAllShipments]);

  return {
    shipments,
    selectedShipment,
    loading,
    error,
    fetchShipmentDetails,
    fetchAllShipments,
    setSelectedShipment
  };
};