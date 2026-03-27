// hooks/useOffline.ts
import { useState, useEffect } from 'react';
import localforage from 'localforage';
import type { Transaction } from '../types/agent.types';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queue, setQueue] = useState<Transaction[]>([]);
  const [syncing, setSyncing] = useState(false);

  // Initialize localforage
  const storage = localforage.createInstance({
    name: 'agentOffline',
    storeName: 'transactions'
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadQueue();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadQueue = async () => {
    const items: Transaction[] = [];
    await storage.iterate((value, key) => {
      items.push(value as Transaction);
    });
    setQueue(items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
  };

  const addToQueue = async (transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => {
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}-${Math.random()}`,
      ...transaction,
      timestamp: new Date().toISOString(),
      status: 'queued',
      retryCount: 0
    };
    
    await storage.setItem(newTransaction.id, newTransaction);
    await loadQueue();
    return newTransaction;
  };

  const removeFromQueue = async (transactionId: string) => {
    await storage.removeItem(transactionId);
    await loadQueue();
  };

  const updateTransactionStatus = async (transactionId: string, status: Transaction['status']) => {
    const transaction = await storage.getItem<Transaction>(transactionId);
    if (transaction) {
      transaction.status = status;
      if (status === 'synced') {
        transaction.syncedAt = new Date().toISOString();
      }
      await storage.setItem(transactionId, transaction);
      await loadQueue();
    }
  };

  const syncQueue = async (syncFunction: (data: any) => Promise<any>) => {
    if (!isOnline || queue.length === 0) return;
    
    setSyncing(true);
    try {
      for (const transaction of queue) {
        if (transaction.status === 'queued') {
          try {
            await syncFunction(transaction.data);
            await updateTransactionStatus(transaction.id, 'synced');
          } catch (error) {
            await updateTransactionStatus(transaction.id, 'failed');
            console.error('Failed to sync transaction:', transaction.id, error);
          }
        }
      }
    } finally {
      setSyncing(false);
      await loadQueue();
    }
  };

  const clearSynced = async () => {
    const syncedItems = queue.filter(t => t.status === 'synced');
    for (const item of syncedItems) {
      await storage.removeItem(item.id);
    }
    await loadQueue();
  };

  return {
    isOnline,
    queue,
    syncing,
    addToQueue,
    removeFromQueue,
    syncQueue,
    clearSynced,
    queueSize: queue.length,
    pendingCount: queue.filter(t => t.status === 'queued').length
  };
};