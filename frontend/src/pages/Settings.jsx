import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Settings as SettingsIcon, 
  Save, 
  Database, 
  Percent, 
  Bell, 
  Store, 
  Printer 
} from 'lucide-react';

export const Settings = () => {
  const { showToast } = useInventory();

  const [settingsForm, setSettingsForm] = useState({
    storeName: 'Smart Inventory & Billing Management System',
    defaultTaxRate: '18',
    lowStockThreshold: '5',
    currencySymbol: '₹',
    receiptHeader: 'Thank you for shopping with Smart Retail!',
    backendUrl: 'http://localhost:8080/api',
    dbConnection: 'jdbc:mysql://localhost:3306/smart_inventory_db'
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('System settings updated successfully!', 'success');
  };

  return (
    <div className="settings-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SettingsIcon size={22} className="text-blue-600" />
            System Configuration & Preferences
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
            Configure store defaults, GST tax rates, low stock alerts, and backend API connections.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* General Store Setup */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={18} className="text-blue-600" /> Store Branding & Receipt
          </h3>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">System App Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={settingsForm.storeName}
              onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Receipt Footer Note</label>
            <input 
              type="text" 
              className="form-input" 
              value={settingsForm.receiptHeader}
              onChange={(e) => setSettingsForm({ ...settingsForm, receiptHeader: e.target.value })}
            />
          </div>
        </div>

        {/* Tax & Threshold Defaults */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Percent size={18} className="text-blue-600" /> Tax & Alert Rules
          </h3>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Default GST Tax Rate (%)</label>
            <input 
              type="number" 
              className="form-input" 
              value={settingsForm.defaultTaxRate}
              onChange={(e) => setSettingsForm({ ...settingsForm, defaultTaxRate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Global Low Stock Warning Threshold (Units)</label>
            <input 
              type="number" 
              className="form-input" 
              value={settingsForm.lowStockThreshold}
              onChange={(e) => setSettingsForm({ ...settingsForm, lowStockThreshold: e.target.value })}
            />
          </div>
        </div>

        {/* Database & Spring Boot REST API Endpoint */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} className="text-blue-600" /> Spring Boot & MySQL Integration Pipeline
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Spring Boot REST API Endpoint</label>
              <input 
                type="text" 
                className="form-input" 
                value={settingsForm.backendUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, backendUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">MySQL Database Connection URL</label>
              <input 
                type="text" 
                className="form-input" 
                value={settingsForm.dbConnection}
                onChange={(e) => setSettingsForm({ ...settingsForm, dbConnection: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginTop: '16px', background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-instock">REST API ACTIVE</span>
              <span style={{ fontSize: '0.8125rem', color: '#64748B', marginLeft: '10px' }}>
                Backend: <code>com.smartinventory.SmartInventoryApplication</code> (Port 8080)
              </span>
            </div>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
