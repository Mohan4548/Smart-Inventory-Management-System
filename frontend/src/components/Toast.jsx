import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export const Toast = () => {
  const { toast } = useInventory();

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />,
    warning: <AlertTriangle size={18} />
  };

  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type || 'info'}`}>
        {iconMap[toast.type] || iconMap.info}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
