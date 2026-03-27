import { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { Modal } from '../../../shared/components/Common/Modal';
import { Input } from '../../../shared/components/Forms/Input';
import { Spinner } from '../../../shared/components/Common/Spinner';

const categoryColors = {
  food: 'bg-green-100 text-green-800',
  water: 'bg-blue-100 text-blue-800',
  medicine: 'bg-red-100 text-red-800',
  shelter: 'bg-yellow-100 text-yellow-800',
  cash: 'bg-purple-100 text-purple-800',
};

const Inventory = () => {
  const { inventory, lowStockItems, loading, updateStock } = useInventory();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const handleUpdateStock = async () => {
    if (selectedItem && quantity >= 0) {
      await updateStock(selectedItem.itemId, quantity);
      setIsModalOpen(false);
      setSelectedItem(null);
      setQuantity(0);
    }
  };

  const openUpdateModal = (item: any) => {
    setSelectedItem(item);
    setQuantity(item.quantity);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            ⚠️ Low Stock Alert
          </h2>
          <div className="space-y-1">
            {lowStockItems.map((item) => (
              <div key={item.itemId} className="text-sm text-yellow-700">
                {item.name}: {item.quantity.toLocaleString()} {item.unit} remaining
                (Threshold: {item.lowStockThreshold} {item.unit})
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map((item) => (
          <Card key={item.itemId} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[item.category]}`}>
                {item.category.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-bold">{item.quantity.toLocaleString()} {item.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Warehouse:</span>
                <span className="text-sm">{item.warehouse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Low Stock Alert:</span>
                <span className="text-sm">{item.lowStockThreshold} {item.unit}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full ${
                    item.quantity <= item.lowStockThreshold 
                      ? 'bg-red-500' 
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, (item.quantity / (item.lowStockThreshold * 2)) * 100)}%` }}
                />
              </div>
              <Button 
                onClick={() => openUpdateModal(item)}
                variant="secondary"
                className="w-full mt-2"
                size="sm"
              >
                Update Stock
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Update Stock Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        title={`Update Stock: ${selectedItem?.name}`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Current Quantity</div>
            <div className="text-xl font-bold">
              {selectedItem?.quantity?.toLocaleString()} {selectedItem?.unit}
            </div>
          </div>
          
          <Input
            label="New Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            min={0}
            required
          />
          
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateStock}>
              Update Stock
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;