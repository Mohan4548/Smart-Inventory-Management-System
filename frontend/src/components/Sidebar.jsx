import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  ShoppingCart, 
  Users, 
  Building2, 
  BarChart3, 
  Settings,
  Layers
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'billing', label: 'Billing / POS', icon: ShoppingCart },
    { id: 'suppliers', label: 'Suppliers', icon: Users },
    { id: 'shops', label: 'Shops & Branches', icon: Building2 },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Layers size={22} />
        </div>
        <div>
          <div className="brand-text">SmartInventory</div>
          <div className="brand-sub">Retail & POS v1.0</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div>Smart Inventory & Billing</div>
        <div>Enterprise Edition</div>
      </div>
    </aside>
  );
};
