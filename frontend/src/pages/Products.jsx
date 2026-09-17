import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { getDefaultImageForProduct } from '../catalog/imageCatalog';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  Filter, 
  Package, 
  AlertCircle 
} from 'lucide-react';

export const Products = () => {
  const { 
    products, 
    activeProducts, 
    shops, 
    suppliers, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    calculateStockStatus 
  } = useInventory();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedShopFilter, setSelectedShopFilter] = useState('ALL');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Form State
  const initialForm = {
    customProductId: '',
    name: '',
    category: 'Beverages',
    subCategory: '',
    brand: '',
    modelNumber: '',
    sku: '',
    barcode: '',
    description: '',
    purchasePrice: '',
    sellingPrice: '',
    taxPercentage: '18',
    discountPercentage: '0',
    quantity: '',
    minimumStockLevel: '5',
    maximumStockLevel: '100',
    unit: 'Pcs',
    batchNumber: '',
    mfgDate: '',
    expiryDate: '',
    supplierId: suppliers[0]?.id || 1,
    shopId: shops[0]?.id || 1,
    rackNumber: 'RACK-A',
    shelfNumber: 'SHELF-1',
    image: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  // Unique categories and brands for filter dropdowns
  const categories = Array.from(new Set(products.map(p => p.category)));
  const brands = Array.from(new Set(products.map(p => p.brand)));

  // Filter application
  const filteredProducts = activeProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.customProductId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.barcode.includes(searchQuery);
    
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesBrand = selectedBrand === 'ALL' || p.brand === selectedBrand;
    const matchesShop = selectedShopFilter === 'ALL' || Number(p.shopId) === Number(selectedShopFilter);
    
    const status = calculateStockStatus(p.quantity, p.minimumStockLevel);
    const matchesStatus = selectedStatus === 'ALL' || status === selectedStatus;

    return matchesSearch && matchesCategory && matchesBrand && matchesShop && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    const nextIdNumber = products.length + 1001;
    const nextBarcodeNumber = 8901000000000 + products.length + 1;
    setFormData({
      ...initialForm,
      customProductId: `PRD-${nextIdNumber}`,
      barcode: String(nextBarcodeNumber)
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const handleOpenDeleteModal = (id) => {
    setDeletingProductId(id);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.customProductId.trim()) errors.customProductId = 'Product ID is required';
    if (!formData.brand.trim()) errors.brand = 'Brand / Company is required';
    if (!formData.barcode.trim()) errors.barcode = 'Barcode is required';

    if (!formData.sellingPrice || Number(formData.sellingPrice) < 0) {
      errors.sellingPrice = 'Valid selling price is required';
    }
    if (formData.quantity === '' || Number(formData.quantity) < 0) {
      errors.quantity = 'Quantity cannot be negative';
    }
    if (formData.minimumStockLevel === '' || Number(formData.minimumStockLevel) < 0) {
      errors.minimumStockLevel = 'Minimum stock level cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Automatic default image selector if none provided
    const imageToUse = formData.image || getDefaultImageForProduct(formData.name, formData.category);
    const payload = { ...formData, image: imageToUse };

    if (editingProduct) {
      const success = updateProduct(editingProduct.id, payload);
      if (success) setIsFormModalOpen(false);
    } else {
      const success = addProduct(payload);
      if (success) setIsFormModalOpen(false);
    }
  };

  const confirmDelete = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setIsDeleteModalOpen(false);
      setDeletingProductId(null);
    }
  };

  return (
    <div className="products-page">
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Products Directory</h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>Manage your catalog, prices, and multi-branch stock levels.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Product Name, ID, or Barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="ALL">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className="form-select" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="ALL">All Brands</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <select className="form-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="ALL">All Stock Statuses</option>
            <option value="IN STOCK">IN STOCK</option>
            <option value="LOW STOCK">LOW STOCK</option>
            <option value="OUT OF STOCK">OUT OF STOCK</option>
          </select>

          <select className="form-select" value={selectedShopFilter} onChange={(e) => setSelectedShopFilter(e.target.value)}>
            <option value="ALL">All Shops</option>
            {shops.map(s => <option key={s.id} value={s.id}>{s.branchName}</option>)}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>ID / Barcode</th>
              <th>Brand & Cat</th>
              <th>Shop Branch</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Stock Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                  <Package size={40} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <div>No products matched your filter criteria.</div>
                </td>
              </tr>
            ) : (
              filteredProducts.map(prod => {
                const status = calculateStockStatus(prod.quantity, prod.minimumStockLevel);
                const badgeClass = status === 'IN STOCK' ? 'badge-instock' : (status === 'LOW STOCK' ? 'badge-lowstock' : 'badge-outstock');

                return (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={prod.image} alt={prod.name} className="product-img-thumb" />
                        <div>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{prod.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Unit: {prod.unit || 'Pcs'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{prod.customProductId}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace' }}>{prod.barcode}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{prod.brand}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{prod.category}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{prod.shopName}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>₹{prod.sellingPrice.toFixed(2)}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Cost: ₹{prod.purchasePrice.toFixed(2)}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{prod.quantity}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Min: {prod.minimumStockLevel}</div>
                    </td>
                    <td>
                      <span className={`badge ${badgeClass}`}>{status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button className="btn btn-secondary btn-icon-only" title="View Details" onClick={() => handleOpenViewModal(prod)}>
                          <Eye size={15} />
                        </button>
                        <button className="btn btn-secondary btn-icon-only" title="Edit Product" onClick={() => handleOpenEditModal(prod)}>
                          <Edit size={15} />
                        </button>
                        <button className="btn btn-secondary btn-icon-only" style={{ color: '#EF4444' }} title="Delete Product" onClick={() => handleOpenDeleteModal(prod.id)}>
                          <Trash2 size={15} />
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

      {/* Add / Edit Product Modal */}
      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="btn btn-secondary btn-icon-only" onClick={() => setIsFormModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  {/* Basic Info */}
                  <div className="form-group">
                    <label className="form-label">Product ID *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.customProductId}
                      onChange={(e) => setFormData({ ...formData, customProductId: e.target.value })}
                    />
                    {formErrors.customProductId && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.customProductId}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Barcode *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    />
                    {formErrors.barcode && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.barcode}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Product Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Coca-Cola 500ml Pet Bottle"
                      value={formData.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        setFormData({ 
                          ...formData, 
                          name: newName,
                          image: getDefaultImageForProduct(newName, formData.category)
                        });
                      }}
                    />
                    {formErrors.name && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select 
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        setFormData({ 
                          ...formData, 
                          category: newCat,
                          image: getDefaultImageForProduct(formData.name, newCat)
                        });
                      }}
                    >
                      <option value="Beverages">Beverages</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Grocery">Grocery</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Apparel">Apparel</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Brand / Company *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Coca-Cola, Dell, Aavin"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                    {formErrors.brand && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.brand}</span>}
                  </div>

                  {/* Pricing */}
                  <div className="form-group">
                    <label className="form-label">Purchase Price (₹) *</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-input" 
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Selling Price (₹) *</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-input" 
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    />
                    {formErrors.sellingPrice && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.sellingPrice}</span>}
                  </div>

                  {/* Stock & Shop */}
                  <div className="form-group">
                    <label className="form-label">Current Quantity *</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                    {formErrors.quantity && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{formErrors.quantity}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Minimum Stock Level *</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={formData.minimumStockLevel}
                      onChange={(e) => setFormData({ ...formData, minimumStockLevel: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Shop Location *</label>
                    <select 
                      className="form-select"
                      value={formData.shopId}
                      onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
                    >
                      {shops.map(s => <option key={s.id} value={s.id}>{s.branchName} ({s.city})</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Supplier *</label>
                    <select 
                      className="form-select"
                      value={formData.supplierId}
                      onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                    >
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <img 
                        src={formData.image || getDefaultImageForProduct(formData.name, formData.category)} 
                        alt="Catalog Preview" 
                        style={{ width: '50px', height: '50px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Default Local Image Catalog Auto-Selected</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Image automatically mapped to '{formData.name || 'Product'}'. No mandatory file upload needed.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Product Details Modal */}
      {isViewModalOpen && viewingProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Product Information Card</h3>
              <button className="btn btn-secondary btn-icon-only" onClick={() => setIsViewModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
                <img src={viewingProduct.image} alt={viewingProduct.name} style={{ width: '80px', height: '80px', borderRadius: '12px', border: '1px solid #CBD5E1' }} />
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{viewingProduct.name}</h4>
                  <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>{viewingProduct.brand} • {viewingProduct.category}</div>
                  <div style={{ marginTop: '4px' }}>
                    <span className={`badge badge-${calculateStockStatus(viewingProduct.quantity, viewingProduct.minimumStockLevel).toLowerCase().replace(/\s+/g, '')}`}>
                      {calculateStockStatus(viewingProduct.quantity, viewingProduct.minimumStockLevel)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-grid" style={{ fontSize: '0.875rem' }}>
                <div><strong>Product ID:</strong> {viewingProduct.customProductId}</div>
                <div><strong>Barcode:</strong> {viewingProduct.barcode}</div>
                <div><strong>Selling Price:</strong> ₹{viewingProduct.sellingPrice.toFixed(2)}</div>
                <div><strong>Cost Price:</strong> ₹{viewingProduct.purchasePrice.toFixed(2)}</div>
                <div><strong>Current Stock:</strong> {viewingProduct.quantity} {viewingProduct.unit}</div>
                <div><strong>Min Level:</strong> {viewingProduct.minimumStockLevel}</div>
                <div><strong>Shop Location:</strong> {viewingProduct.shopName}</div>
                <div><strong>Supplier:</strong> {viewingProduct.supplierName}</div>
                <div><strong>Rack/Shelf:</strong> {viewingProduct.rackNumber} / {viewingProduct.shelfNumber}</div>
                <div><strong>Batch No:</strong> {viewingProduct.batchNumber || 'N/A'}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product from the catalog? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
