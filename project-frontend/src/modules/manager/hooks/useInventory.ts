import { useState, useEffect } from 'react';
import { managerService } from '../services/managerService';
import type { InventoryItem } from '../types/manager.types';

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await managerService.getInventory();
      setInventory(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (itemId: string, quantity: number) => {
    try {
      const updated = await managerService.updateInventory(itemId, quantity);
      setInventory(inventory.map(i => i.itemId === itemId ? updated : i));
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const lowStockItems = inventory.filter(
    item => item.quantity <= item.lowStockThreshold
  );

  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    inventory,
    lowStockItems,
    loading,
    error,
    fetchInventory,
    updateStock,
  };
};