import React from 'react';
import { AlertOctagon, X } from 'lucide-react';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#DC2626' }}>
            <AlertOctagon size={24} />
            <h3 className="modal-title">{title || 'Confirm Action'}</h3>
          </div>
          <button className="btn btn-secondary btn-icon-only" onClick={onCancel}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ color: '#475569', fontSize: '0.9rem' }}>
          {message || 'Are you sure you want to proceed with this operation?'}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete Item
          </button>
        </div>
      </div>
    </div>
  );
};
