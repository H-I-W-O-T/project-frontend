// components/DistributionForm.tsx
import React, { useState } from 'react';
import type  { Beneficiary, DistributionFormData } from '../types/agent.types';

interface DistributionFormProps {
  beneficiary: Beneficiary;
  onSubmit: (data: DistributionFormData) => void;
  onCancel: () => void;
}

export const DistributionForm: React.FC<DistributionFormProps> = ({ beneficiary, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<DistributionFormData>({
    beneficiaryId: beneficiary.id,
    type: 'cash',
    amount: 0,
    items: []
  });
  const [showItems, setShowItems] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addItem = () => {
    if (newItem.name && newItem.quantity > 0) {
      setFormData({
        ...formData,
        items: [...(formData.items || []), { ...newItem }]
      });
      setNewItem({ name: '', quantity: 1 });
    }
  };

  const removeItem = (index: number) => {
    const newItems = formData.items?.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Distribution Details</h2>
      
      {/* Distribution Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Distribution Type</label>
        <div className="grid grid-cols-2 gap-2">
          {(['cash', 'food', 'shelter', 'medical', 'water'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, type })}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                formData.type === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Amount/Quantity */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {formData.type === 'cash' ? 'Amount (ETB)' : 'Quantity'}
        </label>
        <input
          type="number"
          required
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Items for non-cash distributions */}
      {formData.type !== 'cash' && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowItems(!showItems)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showItems ? 'Hide Items' : 'Add Items'}
          </button>
          
          {showItems && (
            <div className="mt-2 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                  className="w-20 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                />
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700"
                >
                  Add
                </button>
              </div>
              
              {formData.items && formData.items.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Added Items:</h4>
                  <div className="space-y-2">
                    {formData.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span>{item.name}</span>
                        <span>Quantity: {item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
        <textarea
          rows={3}
          placeholder="Any additional notes..."
          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Confirm Distribution
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};