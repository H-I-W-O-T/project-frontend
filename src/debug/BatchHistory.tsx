import React, { useEffect, useState, useCallback } from "react";
import { supplyClient } from "../shared/api/contracts/supplyClient";

interface CustodyEvent {
  event_type: number;
  quantity_new: bigint;
  timestamp: bigint;
  notes: string;
  signed_by: string;
}

const eventMap: Record<number, { label: string; color: string; icon: string }> = {
  0: { label: "Batch Created", color: "bg-blue-600", icon: "🏗️" },
  1: { label: "Transfer of Custody", color: "bg-amber-500", icon: "🚚" },
  2: { label: "Damage Reported", color: "bg-red-500", icon: "⚠️" },
  3: { label: "Aid Distributed", color: "bg-emerald-600", icon: "🎁" },
};

export const BatchHistory = ({ wallet, batchId }: { wallet: any; batchId: string }) => {
  const [history, setHistory] = useState<CustodyEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!batchId) return;
    setLoading(true);
    try {
      const client = supplyClient(wallet);
      // NOTE: Using simulation mode here to avoid wallet popups for "Read" calls
      const result = await client.getBatchHistory(batchId);
      
      if (Array.isArray(result)) {
        setHistory(result);
      }
    } catch (err) {
      console.warn("Audit trail pending ledger confirmation...");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [batchId, wallet]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (!batchId) return null;

  return (
    <div className="mt-10 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Immutable Audit Trail</h2>
          <p className="text-xs text-slate-500 font-mono mt-1">ID: {batchId.slice(0, 16)}...</p>
        </div>
        <button 
          onClick={fetchHistory}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          title="Sync with Ledger"
        >
          <span className={loading ? "animate-spin block" : ""}>🔄</span>
        </button>
      </div>

      {history.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-xl">
          <p className="text-slate-400 text-sm">Waiting for ledger confirmation...</p>
        </div>
      ) : (
        <div className="relative space-y-0">
          {history.map((event, idx) => {
            const type = eventMap[Number(event.event_type)] || { label: "Unknown", color: "bg-slate-400", icon: "❓" };
            
            // Inventory Logic: Calculate the delta between steps
            const currentQty = BigInt(event.quantity_new);
            const previousQty = idx > 0 ? BigInt(history[idx - 1].quantity_new) : 0n;
            const unitsMoved = idx === 0 ? currentQty : previousQty - currentQty;

            return (
              <div key={idx} className="group relative pl-10 pb-10 last:pb-0">
                {/* Vertical Line Connector */}
                {idx !== history.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-slate-100 group-hover:bg-indigo-100 transition-colors" />
                )}
                
                {/* Event Node */}
                <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-sm z-10 ${type.color} text-white`}>
                  {type.icon}
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Step {idx + 1}</span>
                      <h3 className="text-md font-bold text-slate-800">{type.label}</h3>
                    </div>
                    <time className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-500">
                      {new Date(Number(event.timestamp) * 1000).toLocaleString()}
                    </time>
                  </div>

                  {/* Quantity Stats Card */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white px-4 py-3 rounded-lg border border-slate-100">
                      <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">
                        {idx === 0 ? "Initial Load" : "Movement"}
                      </p>
                      <p className={`text-lg font-black ${idx === 0 ? 'text-slate-900' : 'text-rose-500'}`}>
                        {idx === 0 ? "" : "-"}{unitsMoved.toString()}
                      </p>
                    </div>
                    <div className="bg-white px-4 py-3 rounded-lg border border-slate-100">
                      <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Stock Remaining</p>
                      <p className="text-lg font-black text-indigo-600">
                        {currentQty.toString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-slate-600 leading-relaxed italic">"{event.notes}"</p>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-slate-200 flex-shrink-0" />
                      <p className="text-[10px] font-mono text-slate-400 truncate">
                        Signed: {event.signed_by.toString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};