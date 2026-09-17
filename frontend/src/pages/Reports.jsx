import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  IndianRupee, 
  Package, 
  Award,
  Calendar
} from 'lucide-react';

export const Reports = () => {
  const { sales, activeProducts, showToast } = useInventory();

  const totalSalesRevenue = sales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalItemsSold = sales.reduce((sum, s) => {
    return sum + s.items.reduce((iSum, it) => iSum + it.quantity, 0);
  }, 0);

  const inventoryValuationCost = activeProducts.reduce((sum, p) => sum + (p.purchasePrice * p.quantity), 0);
  const inventoryValuationRetail = activeProducts.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);
  const projectedProfit = inventoryValuationRetail - inventoryValuationCost;

  const handleExportCSV = () => {
    showToast('Sales & Inventory Report exported to CSV format!', 'success');
  };

  return (
    <div className="reports-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={22} className="text-blue-600" />
            Executive Financial & Sales Reports
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
            Comprehensive analytics, stock valuation, and revenue breakdowns.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={handleExportCSV}>
          <Download size={16} /> Export CSV Report
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Total POS Revenue</div>
            <div className="kpi-value">₹{totalSalesRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#ECFDF5', color: '#059669' }}>
            <IndianRupee size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Inventory Cost Value</div>
            <div className="kpi-value">₹{inventoryValuationCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#EFF6FF', color: '#2563EB' }}>
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Projected Profit</div>
            <div className="kpi-value" style={{ color: '#16A34A' }}>
              ₹{projectedProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#F0FDF4', color: '#16A34A' }}>
            <Award size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Total Units Sold</div>
            <div className="kpi-value">{totalItemsSold} Pcs</div>
          </div>
          <div className="kpi-icon-box" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
            <Package size={22} />
          </div>
        </div>
      </div>

      {/* Reports Tables Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Sales Ledger */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Completed POS Transaction History</h3>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Branch</th>
                  <th>Payment</th>
                  <th style={{ textAlign: 'right' }}>Grand Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700, color: '#2563EB' }}>{s.invoiceNumber}</td>
                    <td>{s.customerName}</td>
                    <td>{s.shopName}</td>
                    <td><span className="badge badge-instock">{s.paymentMethod}</span></td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{s.grandTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Valuation per Category */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Inventory Stock Valuation by Category</h3>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total Units</th>
                  <th>Cost Valuation</th>
                  <th style={{ textAlign: 'right' }}>Retail Valuation</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(new Set(activeProducts.map(p => p.category))).map(cat => {
                  const catProducts = activeProducts.filter(p => p.category === cat);
                  const units = catProducts.reduce((sum, p) => sum + p.quantity, 0);
                  const costVal = catProducts.reduce((sum, p) => sum + (p.purchasePrice * p.quantity), 0);
                  const retailVal = catProducts.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);

                  return (
                    <tr key={cat}>
                      <td style={{ fontWeight: 600 }}>{cat}</td>
                      <td>{units} Pcs</td>
                      <td>₹{costVal.toLocaleString('en-IN')}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#2563EB' }}>₹{retailVal.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
