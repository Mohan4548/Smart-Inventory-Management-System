import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { Store, Bell, User, Calendar } from 'lucide-react';

export const Header = ({ title }) => {
  const { shops, selectedShopId, setSelectedShopId, products } = useInventory();

  // Low stock counter for active shop view
  const lowStockCount = products.filter(p => {
    if (selectedShopId !== 'ALL' && Number(p.shopId) !== Number(selectedShopId)) return false;
    return p.quantity <= p.minimumStockLevel;
  }).length;

  const todayDateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="top-header">
      <div className="header-left">
        <h1 className="header-title">{title || 'Smart Inventory Dashboard'}</h1>

        <div className="branch-select-wrap">
          <Store size={16} className="text-blue-600" />
          <span>Active Branch:</span>
          <select 
            className="branch-select"
            value={selectedShopId}
            onChange={(e) => setSelectedShopId(e.target.value)}
          >
            <option value="ALL">🏢 All Shops & Branches</option>
            {shops.map(shop => (
              <option key={shop.id} value={shop.id}>
                📍 {shop.branchName} ({shop.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="header-right">
        <div className="header-info-chip">
          <Calendar size={14} />
          <span>{todayDateStr}</span>
        </div>

        {lowStockCount > 0 && (
          <div className="header-info-chip" style={{ background: '#FEF3C7', color: '#B45309', borderColor: '#FDE68A' }}>
            <Bell size={14} />
            <span>{lowStockCount} Stock Alerts</span>
          </div>
        )}

        <div className="header-info-chip" style={{ background: '#EFF6FF', color: '#1E40AF', borderColor: '#BFDBFE' }}>
          <User size={14} />
          <span>Manager POS</span>
        </div>
      </div>
    </header>
  );
};
