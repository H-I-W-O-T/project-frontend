import { useState, useEffect, useCallback } from 'react';
import { useStellar } from '../../../contexts/StellarContext';
import { parseScVal } from '../../../shared/api/contracts/utils';
import { CONTRACTS } from '../../../shared/api/contracts/config';
import type { DonorStats as DonorStatsType } from '../types/donor.types';

const DECIMALS = 10_000_000;

export const useDonorData = () => {
  const { queryContract, publicKey, isLoaded } = useStellar();
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<any[]>([]);
  
  const [stats, setStats] = useState<DonorStatsType>({
    totalDonated: 0,
    totalDonatedChange: 0,
    activePrograms: 0,
    programsChange: 0,
    beneficiariesReached: 0,
    beneficiariesReachedChange: 0,
    fundsRemaining: 0,
    fundsRemainingChange: 0,
  });

  const fetchData = useCallback(async () => {
    // A. Wait for Context
    if (!isLoaded) return;

    // B. If no wallet, stop loading and show empty state
    if (!publicKey || !queryContract) {
      console.log("⏸️ Wallet not connected - showing empty dashboard.");
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log(`⛓️ Ledger Sync: Loading for address ${publicKey.slice(0, 6)}...`);

    try {
      // 1. DISCOVER IDs
      const storageKey = `funded_programs_${publicKey}`;
      const savedIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // 2. FETCH TOKEN BALANCE
      const rawBalance = await queryContract({
        contractId: CONTRACTS.TOKEN,
        method: "balance",
        args: [publicKey]
      });
      const walletBalance = Number(parseScVal(rawBalance) || 0) / DECIMALS;

      if (savedIds.length === 0) {
        setStats(prev => ({ ...prev, fundsRemaining: walletBalance }));
        setPrograms([]);
        setLoading(false);
        return;
      }

      // 3. FETCH PROGRAM STATES
      const programResults = await Promise.all(
        savedIds.map(async (id: string) => {
          try {
            const rawProgram = await queryContract({
              contractId: CONTRACTS.DISBURSEMENT,
              method: "get_program",
              args: [id]
            });
            
            const onChainData = parseScVal(rawProgram);
            if (!onChainData) return null;

            return {
              programId: id,
              name: onChainData.name || `Program ${id.substring(0, 4)}`,
              status: onChainData.is_active ? 'active' : 'completed',
              totalBudget: Number(onChainData.total_budget || 0) / DECIMALS,
              remainingBudget: Number(onChainData.remaining_budget || 0) / DECIMALS,
              amountPerPerson: Number(onChainData.amount_per_person || 1) / DECIMALS,
              beneficiariesReached: Math.floor(
                (Number(onChainData.total_budget || 0) - Number(onChainData.remaining_budget || 0)) / 
                (Number(onChainData.amount_per_person || 1) || 1)
              ),
            };
          } catch (err) {
            console.warn(`Program ${id} query error:`, err);
            return null;
          }
        })
      );

      const validPrograms = programResults.filter(p => p !== null);

      // 4. UPDATE AGGREGATES
      setPrograms(validPrograms);
      setStats({
        totalDonated: validPrograms.reduce((sum, p) => sum + p.totalBudget, 0),
        activePrograms: validPrograms.filter(p => p.status === 'active').length,
        beneficiariesReached: validPrograms.reduce((sum, p) => sum + p.beneficiariesReached, 0),
        fundsRemaining: walletBalance,
        totalDonatedChange: 0,
        programsChange: 0,
        beneficiariesReachedChange: 0,
        fundsRemainingChange: 0,
      });

    } catch (error) {
      console.error("🚨 Ledger synchronization failed:", error);
    } finally {
      setLoading(false);
    }
  }, [publicKey, queryContract, isLoaded]);

  // CRITICAL: Watch publicKey so we re-fetch when Freighter wakes up
  useEffect(() => {
    fetchData();
  }, [fetchData, publicKey, isLoaded]);

  return { loading, programs, stats, refresh: fetchData };
};