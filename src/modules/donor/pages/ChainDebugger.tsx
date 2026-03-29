import React, { useState } from 'react';
import { useStellar } from '../../../contexts/StellarContext';
import { parseScVal } from '../../../shared/api/contracts/utils';
import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';

export const ChainDebugger = () => {
  const { publicKey, queryContract } = useStellar();
  const [manualId, setManualId] = useState('');
  const storageKey = `funded_programs_${publicKey}`;
  
  const savedIds = JSON.parse(localStorage.getItem(storageKey) || '[]');

  const forceAddId = () => {
    if (!manualId.startsWith('C')) return alert("Invalid Contract ID format");
    const updated = [...new Set([...savedIds, manualId])];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    window.location.reload();
  };

  const clearStorage = () => {
    localStorage.removeItem(storageKey);
    window.location.reload();
  };

  return (
    <Card className="p-6 border-2 border-amber-400 bg-amber-50 mb-8">
      <h3 className="text-amber-800 font-bold mb-2">🛠️ On-Chain Discovery Debugger</h3>
      
      <div className="space-y-4 text-sm">
        <div>
          <p className="font-semibold">Connected Wallet:</p>
          <code className="text-xs bg-white px-2 py-1 rounded border">{publicKey || 'Not Connected'}</code>
        </div>

        <div>
          <p className="font-semibold">Local Discovery Index ({savedIds.length} IDs):</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {savedIds.length > 0 ? savedIds.map((id: string) => (
              <code key={id} className="text-[10px] bg-blue-100 p-1 rounded">{id}</code>
            )) : <span className="text-gray-400 italic text-xs">No IDs tracked in localStorage.</span>}
          </div>
        </div>

        <div className="flex gap-2">
          <input 
            className="flex-1 border p-2 rounded text-xs" 
            placeholder="Paste Program Contract ID (C...)" 
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
          />
          <Button size="sm" onClick={forceAddId}>Force Sync ID</Button>
          <Button variant="ghost" size="sm" onClick={clearStorage} className="text-red-600">Clear All</Button>
        </div>
      </div>
    </Card>
  );
};