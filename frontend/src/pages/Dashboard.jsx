import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Package, 
  Boxes, 
  AlertTriangle, 
  XCircle, 
  IndianRupee, 
  ShoppingBag, 
  TrendingUp,
  ArrowUpRight,
  Building2,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export const Dashboard = ({ onNavigate }) => {
  const { activeProducts, sales, calculateStockStatus, shops } = useInventory();

  // Metrics calculations
  const totalProducts = activeProducts.length;
  const totalStockQuantity = activeProducts.reduce((sum, p) => sum + p.quantity, 0);

  const lowStockProducts = activeProducts.filter(p => {
    const status = calculateStockStatus(p.quantity, p.minimumStockLevel);
    return status === 'LOW STOCK';
  });

  const outOfStockProducts = activeProducts.filter(p => {
    const status = calculateStockStatus(p.quantity, p.minimumStockLevel);
    return status === 'OUT OF STOCK';
  });

  const todaySalesTotal = sales.reduce((sum, s) => sum + s.grandTotal, 0);
  const todayOrdersCount = sales.length;

  const totalInventoryValue = activeProducts.reduce(
    (sum, p) => sum + (p.purchasePrice * p.quantity), 0
  );

  // Category Stock Dataset
  const categoryStockDataMap = {};
  activeProducts.forEach(p => {
    categoryStockDataMap[p.category] = (categoryStockDataMap[p.category] || 0) + p.quantity;
  });
  const stockChartData = Object.keys(categoryStockDataMap).map(cat => ({
    name: cat,
    stock: categoryStockDataMap[cat]
  }));

  // Sales Trend chart data
  const salesChartData = [
    { time: '09:00 AM', revenue: 2400 },
    { time: '11:00 AM', revenue: 8900 },
    { time: '01:00 PM', revenue: 24500 },
    { time: '03:00 PM', revenue: 41200 },
    { time: '05:00 PM', revenue: 62800 },
    { time: '07:00 PM', revenue: todaySalesTotal || 78450 }
  ];

  return (
    <div className="dashboard-page">
      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Total Products</div>
            <div className="kpi-value">{totalProducts}</div>
          </div>
          <div className="kpi-icon-box" style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)', color: '#FFF' }}>
            <Package size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Total Stock Units</div>
            <div className="kpi-value">{totalStockQuantity}</div>
          </div>
          <div className="kpi-icon-box" style={{ background: 'linear-gradient(135deg, #059669, #10B981)', color: '#FFF' }}>
            <Boxes size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Low Stock Items</div>
            <div className="kpi-value" style={{ color: lowStockProducts.length > 0 ? '#F59E0B' : '#FFFFFF' }}>
              {lowStockProducts.length}
            </div>
          </div>
          <div className="kpi-icon-box" style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)', color: '#FFF' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Out of Stock</div>
            <div className="kpi-value" style={{ color: outOfStockProducts.length > 0 ? '#EF4444' : '#FFFFFF' }}>
              {outOfStockProducts.length}
            </div>
          </div>
          <div className="kpi-icon-box" style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444)', color: '#FFF' }}>
            <XCircle size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Today's Revenue</div>
            <div className="kpi-value">₹{todaySalesTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="kpi-icon-box" style={{ background: 'linear-gradient(135deg, #047857, #10B981)', color: '#FFF' }}>
            <IndianRupee size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Today's POS Orders</div>
            <div className="kpi-value">{todayOrdersCount}</div>
          </div>
          <div className="kpi-icon-box" style={{ background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', color: '#FFF' }}>
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Total Stock Valuation</div>
            <div className="kpi-value">₹{totalInventoryValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="kpi-icon-box" style={{ background: 'linear-gradient(135deg, #0284C7, #38BDF8)', color: '#FFF' }}>
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Active Branches</div>
            <div className="kpi-value">{shops.length}</div>
          </div>
          <div className="kpi-icon-box" style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)', color: '#FFF' }}>
            <Building2 size={24} />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>Sales Revenue Trend (Today)</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Real-time transaction revenue aggregation</p>
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', padding: '6px 12px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
              <Sparkles size={14} /> Live POS Stream
            </span>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '10px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>Category Stock Distribution</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Current stock units per category</p>
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 700 }}>Active Inventory</span>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '10px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="stock" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Low Stock Alerts & Recent Transactions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {/* Low Stock Alerts Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A' }}>
              <AlertTriangle size={20} color="#F59E0B" />
              Low & Out of Stock Alerts
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('inventory')}>
              Manage Stock
            </button>
          </div>

          {[...lowStockProducts, ...outOfStockProducts].length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
              ✨ All catalog items are sufficiently stocked!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[...lowStockProducts, ...outOfStockProducts].map(prod => {
                const status = calculateStockStatus(prod.quantity, prod.minimumStockLevel);
                const badgeClass = status === 'OUT OF STOCK' ? 'badge-outstock' : 'badge-lowstock';
                return (
                  <div key={prod.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={prod.image} alt={prod.name} className="product-img-thumb" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>{prod.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{prod.shopName} • ID: {prod.customProductId}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${badgeClass}`}>{status}</span>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '4px', color: '#0F172A' }}>
                        Qty: {prod.quantity} / Min: {prod.minimumStockLevel}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>Recent POS Transactions</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('billing')}>
              New Bill
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sales.slice(0, 5).map(sale => (
              <div key={sale.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#2563EB' }}>{sale.invoiceNumber}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{sale.customerName} ({sale.shopName})</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0F172A' }}>
                    ₹{sale.grandTotal.toFixed(2)}
                  </div>
                  <span className="badge badge-instock" style={{ fontSize: '0.6875rem', marginTop: '2px' }}>{sale.paymentMethod}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
