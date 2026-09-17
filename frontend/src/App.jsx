import React, { useState } from 'react';
import { InventoryProvider } from './context/InventoryContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';

import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Inventory } from './pages/Inventory';
import { Billing } from './pages/Billing';
import { Suppliers } from './pages/Suppliers';
import { Shops } from './pages/Shops';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const pageTitles = {
    dashboard: 'Dashboard Overview',
    products: 'Product Management',
    inventory: 'Inventory & Stock Control',
    billing: 'Billing & POS Terminal',
    suppliers: 'Supplier Directory',
    shops: 'Shops & Branch Network',
    reports: 'Reports & Analytics',
    settings: 'System Settings'
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'products':
        return <Products />;
      case 'inventory':
        return <Inventory />;
      case 'billing':
        return <Billing />;
      case 'suppliers':
        return <Suppliers />;
      case 'shops':
        return <Shops />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <Header title={pageTitles[activeTab]} />
        <div className="page-body">
          {renderActivePage()}
        </div>
      </main>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
}
