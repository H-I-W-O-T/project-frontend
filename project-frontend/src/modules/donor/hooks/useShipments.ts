import { useState, useEffect, useCallback } from 'react';
import { donorService } from '../services/donorService';
import type { Shipment } from '../types/donor.types';
import { useToast } from '../../../shared/components/Common/ToastContainer';

export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await donorService.getShipments();
      setShipments(data);
    } catch (err) {
      toast.error('Failed to load shipments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchShipmentDetails = useCallback(async (batchId: string) => {
    try {
      const data = await donorService.getShipment(batchId);
      if (data) {
        setSelectedShipment(data);
      }
      return data;
    } catch (err) {
      toast.error('Failed to load shipment details');
      console.error(err);
    }
  }, [toast]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  return {
    shipments,
    selectedShipment,
    loading,
    fetchShipments,
    fetchShipmentDetails,
    setSelectedShipment,
  };
};