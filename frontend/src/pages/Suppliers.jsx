import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  X,
  Package
} from 'lucide-react';

export const Suppliers = () => {
  const { suppliers, addSupplier, products } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    contactNumber: '',
    email: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    gstNumber: ''
  });

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contactNumber) return;
    addSupplier(formData);
    setIsModalOpen(false);
    setFormData({
      name: '',
      companyName: '',
      contactNumber: '',
      email: '',
      address: '',
      city: '',
      state: 'Tamil Nadu',
      gstNumber: ''
    });
  };

  return (
    <div className="suppliers-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={22} className="text-blue-600" />
            Supplier Directory & Vendors
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
            Manage authorized wholesale vendors, contact info, and tax GST registrations.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Register Supplier
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            className="search-input"
            placeholder="Search suppliers by name, company, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Supplier Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {filteredSuppliers.map(sup => {
          const linkedCount = products.filter(p => Number(p.supplierId) === Number(sup.id)).length;

          return (
            <div key={sup.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{sup.name}</h3>
                    <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>{sup.companyName}</div>
                  </div>
                  <span className="badge badge-instock" style={{ fontSize: '0.6875rem' }}>Active Vendor</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: '#334155', margin: '14px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} className="text-gray-400" /> {sup.contactNumber}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} className="text-gray-400" /> {sup.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} className="text-gray-400" /> {sup.address}, {sup.city}, {sup.state}
                  </div>
                  {sup.gstNumber && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace' }}>
                      <FileText size={14} className="text-gray-400" /> GST: {sup.gstNumber}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Package size={14} /> {linkedCount} Supplied Products
                </span>
                <button className="btn btn-secondary btn-sm">View Catalog</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Supplier Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Register New Supplier</h3>
              <button className="btn btn-secondary btn-icon-only" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Contact Person Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company / Firm Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Street Address</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">GST Number</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 33AAAAC1234F1Z1"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
