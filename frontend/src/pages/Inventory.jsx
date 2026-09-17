import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Boxes, 
  Search, 
  PlusCircle, 
  MinusCircle, 
  AlertTriangle, 
  MapPin, 
  Calendar,
  X 
} from 'lucide-react';

export const Inventory = () => {
  const { 
    activeProducts, 
    shops, 
    selectedShopId, 
    adjustStock, 
    calculateStockStatus 
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShopFilter, setSelectedShopFilter] = useState(selectedShopId);

  // Stock Adjustment Modal state
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [targetProduct, setTargetProduct] = useState(null);
  const [adjustmentQty, setAdjustmentQty] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('ADD'); // 'ADD' or 'REMOVE'
  const [reason, setReason] = useState('New Shipment Received');

  const filteredProducts = activeProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.customProductId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.batchNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesShop = selectedShopFilter === 'ALL' || Number(p.shopId) === Number(selectedShopFilter);
    return matchesSearch && matchesShop;
  });

  const handleOpenAdjustModal = (product, type = 'ADD') => {
    setTargetProduct(product);
    setAdjustmentType(type);
    setAdjustmentQty('');
    setReason(type === 'ADD' ? 'Stock Replenishment' : 'Damaged / Expired Goods');
    setIsAdjustModalOpen(true);
  };

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (!adjustmentQty || Number(adjustmentQty) <= 0) return;

    const delta = adjustmentType === 'ADD' ? Number(adjustmentQty) : -Number(adjustmentQty);
    adjustStock(targetProduct.id, delta, reason);
    setIsAdjustModalOpen(false);
  };

  return (
    <div className="inventory-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Boxes size={22} className="text-blue-600" />
            Inventory & Warehouse Control
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
            Track batch numbers, shelf locations, expiry dates, and perform stock adjustments.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            className="search-input"
            placeholder="Search stock by product, batch number, or rack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select className="form-select" value={selectedShopFilter} onChange={(e) => setSelectedShopFilter(e.target.value)}>
          <option value="ALL">All Branch Warehouses</option>
          {shops.map(s => <option key={s.id} value={s.id}>{s.branchName} ({s.city})</option>)}
        </select>
      </div>

      {/* Inventory Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product Details</th>
              <th>Branch Warehouse</th>
              <th>Rack & Shelf</th>
              <th>Batch Number</th>
              <th>Mfg & Expiry</th>
              <th>Stock Status</th>
              <th>Available Qty</th>
              <th style={{ textAlign: 'right' }}>Stock Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                  No inventory records match your query.
                </td>
              </tr>
            ) : (
              filteredProducts.map(prod => {
                const status = calculateStockStatus(prod.quantity, prod.minimumStockLevel);
                const badgeClass = status === 'IN STOCK' ? 'badge-instock' : (status === 'LOW STOCK' ? 'badge-lowstock' : 'badge-outstock');

                return (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={prod.image} alt={prod.name} className="product-img-thumb" />
                        <div>
                          <div style={{ fontWeight: 600 }}>{prod.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>ID: {prod.customProductId}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', fontWeight: 500 }}>
                        <MapPin size={14} className="text-gray-400" />
                        {prod.shopName}
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1' }}>
                        {prod.rackNumber || 'RACK-A1'} / {prod.shelfNumber || 'SHELF-01'}
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.8125rem', background: '#F8FAFC', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                        {prod.batchNumber || 'BT-2026-GEN'}
                      </code>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', flexDirection: 'column' }}>
                        <span>Mfg: {prod.mfgDate || '2026-06-01'}</span>
                        <span style={{ color: '#DC2626' }}>Exp: {prod.expiryDate || '2027-06-01'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${badgeClass}`}>{status}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>
                        {prod.quantity} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>{prod.unit}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Min: {prod.minimumStockLevel}</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenAdjustModal(prod, 'ADD')}>
                          <PlusCircle size={14} className="text-green-600" /> + Add
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenAdjustModal(prod, 'REMOVE')}>
                          <MinusCircle size={14} className="text-red-600" /> - Deduct
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && targetProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {adjustmentType === 'ADD' ? '📥 Restock / Receive Shipment' : '📤 Deduct Stock / Adjustment'}
              </h3>
              <button className="btn btn-secondary btn-icon-only" onClick={() => setIsAdjustModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit}>
              <div className="modal-body">
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700 }}>{targetProduct.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                    Warehouse: {targetProduct.shopName} • Current Stock: <strong>{targetProduct.quantity} {targetProduct.unit}</strong>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Adjustment Quantity ({targetProduct.unit}) *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="Enter quantity"
                    min="1"
                    value={adjustmentQty}
                    onChange={(e) => setAdjustmentQty(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reason / Notes *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAdjustModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={`btn ${adjustmentType === 'ADD' ? 'btn-primary' : 'btn-danger'}`}>
                  Confirm {adjustmentType === 'ADD' ? 'Addition' : 'Deduction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
