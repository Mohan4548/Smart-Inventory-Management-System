import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Phone, 
  User, 
  Package, 
  Boxes, 
  X 
} from 'lucide-react';

export const Shops = () => {
  const { shops, products, addShop } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    branchName: '',
    city: '',
    district: '',
    state: 'Tamil Nadu',
    address: '',
    pincode: '',
    contactNumber: '',
    managerName: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.branchName || !formData.city) return;
    addShop({
      ...formData,
      name: formData.name || `Smart Retail ${formData.city}`
    });
    setIsModalOpen(false);
    setFormData({
      name: '',
      branchName: '',
      city: '',
      district: '',
      state: 'Tamil Nadu',
      address: '',
      pincode: '',
      contactNumber: '',
      managerName: ''
    });
  };

  return (
    <div className="shops-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={22} className="text-blue-600" />
            Shops & Multi-Branch Network
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
            Manage regional branch locations. Product stock levels are tracked independently for each branch.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add New Branch
        </button>
      </div>

      {/* Branch Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {shops.map(shop => {
          const shopProducts = products.filter(p => Number(p.shopId) === Number(shop.id));
          const totalUnits = shopProducts.reduce((sum, p) => sum + p.quantity, 0);
          const totalValuation = shopProducts.reduce((sum, p) => sum + (p.purchasePrice * p.quantity), 0);

          return (
            <div key={shop.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{shop.branchName}</h3>
                    <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>{shop.name}</div>
                  </div>
                  <span className="badge badge-instock">OPERATIONAL</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: '#334155', margin: '14px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} className="text-gray-400" /> {shop.address}, {shop.city} - {shop.pincode}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={14} className="text-gray-400" /> Manager: {shop.managerName || 'Store In-Charge'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} className="text-gray-400" /> {shop.contactNumber}
                  </div>
                </div>

                {/* Branch Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>SKUs</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#2563EB' }}>{shopProducts.length}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>STOCK UNITS</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#16A34A' }}>{totalUnits}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>VALUATION</div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>
                      ₹{(totalValuation / 1000).toFixed(1)}k
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Shop Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Branch / Shop</h3>
              <button className="btn btn-secondary btn-icon-only" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Branch Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Coimbatore Branch"
                      value={formData.branchName}
                      onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Coimbatore"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Full Address *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Phone Number</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Branch Manager Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.managerName}
                      onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
