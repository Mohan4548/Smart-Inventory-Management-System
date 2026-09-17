import React, { useState, useEffect, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Barcode, 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  CheckCircle, 
  X, 
  AlertTriangle,
  User,
  CreditCard,
  Zap
} from 'lucide-react';

export const Billing = () => {
  const { 
    activeProducts, 
    shops, 
    selectedShopId, 
    processCheckout, 
    showToast,
    calculateStockStatus 
  } = useInventory();

  // Search & Barcode input states
  const [searchInput, setSearchInput] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  
  // Cart state
  const [cart, setCart] = useState([]);

  // Customer & Payment state
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Bill Receipt Modal state
  const [completedSale, setCompletedSale] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const barcodeInputRef = useRef(null);

  // Active Shop for billing
  const currentShopId = selectedShopId === 'ALL' ? (shops[0]?.id || 1) : selectedShopId;
  const currentShop = shops.find(s => Number(s.id) === Number(currentShopId)) || shops[0];

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const term = barcodeInput.trim().toLowerCase();
    const match = activeProducts.find(p => 
      p.barcode === term || 
      p.customProductId.toLowerCase() === term ||
      p.name.toLowerCase().includes(term)
    );

    if (match) {
      addToCart(match);
      setBarcodeInput('');
    } else {
      showToast(`Product not found for scan/ID: '${barcodeInput}'`, 'error');
    }
  };

  const addToCart = (product) => {
    const currentStock = product.quantity;
    if (currentStock <= 0) {
      showToast(`Cannot add '${product.name}' - Item is OUT OF STOCK!`, 'error');
      return;
    }

    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingIndex > -1) {
      const currentCartQty = cart[existingIndex].quantity;
      if (currentCartQty + 1 > currentStock) {
        showToast(`Stock limit reached! Available stock for '${product.name}' is ${currentStock}.`, 'error');
        return;
      }

      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
      showToast(`Increased '${product.name}' quantity in cart.`, 'success');
    } else {
      setCart([...cart, { product, quantity: 1 }]);
      showToast(`Added '${product.name}' to cart.`, 'success');
    }
  };

  const updateCartQty = (productId, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;

          const availableStock = item.product.quantity;
          if (newQty > availableStock) {
            showToast(`Cannot exceed available stock (${availableStock} units)!`, 'error');
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
  const taxAmount = cart.reduce((sum, item) => {
    const itemTotal = item.product.sellingPrice * item.quantity;
    return sum + (itemTotal * ((item.product.taxPercentage || 18) / 100));
  }, 0);
  
  const grandTotal = Math.max(0, subtotal + taxAmount - Number(discountAmount || 0));

  const handleGenerateBill = () => {
    if (cart.length === 0) {
      showToast('Please add items to the cart before generating a bill.', 'error');
      return;
    }

    const saleResult = processCheckout({
      cartItems: cart,
      customerName,
      customerPhone,
      paymentMethod,
      shopId: currentShopId,
      subtotal,
      taxAmount,
      discountAmount: Number(discountAmount || 0),
      grandTotal
    });

    if (saleResult) {
      setCompletedSale(saleResult);
      setIsInvoiceModalOpen(true);
      setCart([]);
    }
  };

  const catalogProducts = activeProducts.filter(p => {
    if (!searchInput.trim()) return true;
    const term = searchInput.toLowerCase();
    return p.name.toLowerCase().includes(term) ||
           p.category.toLowerCase().includes(term) ||
           p.customProductId.toLowerCase().includes(term);
  });

  return (
    <div className="billing-page">
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={24} className="text-blue-500" />
            POS Terminal & Invoice Billing
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>
            Active Branch Terminal: <strong>{currentShop.branchName} ({currentShop.city})</strong>
          </p>
        </div>

        {/* USB Barcode Scanner Input */}
        <form onSubmit={handleBarcodeSubmit} style={{ display: 'flex', gap: '10px' }}>
          <div className="search-box" style={{ width: '340px' }}>
            <Barcode size={18} className="text-blue-400" />
            <input
              ref={barcodeInputRef}
              type="text"
              className="search-input"
              placeholder="Scan Barcode or enter Product ID..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Scan & Add</button>
        </form>
      </div>

      {/* POS Dual Panel Layout */}
      <div className="pos-layout">
        {/* Left Side: Product Catalog Grid & Search */}
        <div className="pos-catalog-panel">
          <div className="search-box">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              className="search-input"
              placeholder="Filter catalog by name, category, or ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '16px' }}>
            {catalogProducts.map(prod => {
              const status = calculateStockStatus(prod.quantity, prod.minimumStockLevel);
              const isOut = status === 'OUT OF STOCK';

              return (
                <div 
                  key={prod.id} 
                  className="card"
                  style={{ 
                    padding: '14px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justify: 'space-between',
                    opacity: isOut ? 0.5 : 1,
                    borderColor: isOut ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'
                  }}
                >
                  <div>
                    <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.08)' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', lineHeight: '1.25', height: '2.5em', overflow: 'hidden' }}>
                      {prod.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>ID: {prod.customProductId}</div>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#60A5FA' }}>₹{prod.sellingPrice.toFixed(2)}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isOut ? '#EF4444' : '#10B981' }}>
                        {isOut ? 'Stock: 0' : `Qty: ${prod.quantity}`}
                      </div>
                    </div>

                    <button 
                      className={`btn ${isOut ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                      style={{ width: '100%' }}
                      disabled={isOut}
                      onClick={() => addToCart(prod)}
                    >
                      <Plus size={14} /> {isOut ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Billing Cart & Summary */}
        <div className="pos-cart-panel">
          <div className="pos-cart-header">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} /> Current Sale Cart
            </h3>
            <span className="badge badge-instock">{cart.length} Items</span>
          </div>

          <div className="pos-cart-items">
            {cart.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', color: '#6B7280' }}>
                <ShoppingCart size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <div>Cart is empty. Scan barcode or click product to add.</div>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="cart-item-row">
                  <img src={item.product.image} alt={item.product.name} style={{ width: '42px', height: '42px', borderRadius: '8px' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>₹{item.product.sellingPrice.toFixed(2)} each</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button className="cart-qty-btn" onClick={() => updateCartQty(item.product.id, -1)}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontWeight: 800, fontSize: '0.875rem', minWidth: '22px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button className="cart-qty-btn" onClick={() => updateCartQty(item.product.id, 1)}>
                      <Plus size={12} />
                    </button>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '0.875rem', minWidth: '65px', textAlign: 'right', color: '#F3F4F6' }}>
                    ₹{(item.product.sellingPrice * item.quantity).toFixed(2)}
                  </div>

                  <button className="btn btn-secondary btn-icon-only" style={{ color: '#EF4444' }} onClick={() => removeFromCart(item.product.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Customer & Payment Inputs */}
          <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Customer Name"
                style={{ flex: 1, fontSize: '0.8125rem' }}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Phone No"
                style={{ width: '120px', fontSize: '0.8125rem' }}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select 
                className="form-select" 
                style={{ flex: 1, fontSize: '0.8125rem' }}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="UPI">📱 UPI / QR Code</option>
                <option value="CARD">💳 Credit / Debit Card</option>
                <option value="CASH">💵 Cash Payment</option>
                <option value="NET_BANKING">🏦 Net Banking</option>
              </select>

              <input 
                type="number" 
                className="form-input" 
                placeholder="Discount (₹)"
                style={{ width: '110px', fontSize: '0.8125rem' }}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Cart Summary & Checkout Button */}
          <div className="pos-cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax / GST (18%):</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            {Number(discountAmount) > 0 && (
              <div className="summary-row" style={{ color: '#10B981' }}>
                <span>Discount:</span>
                <span>- ₹{Number(discountAmount).toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Grand Total:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '6px' }}
              disabled={cart.length === 0}
              onClick={handleGenerateBill}
            >
              <CheckCircle size={18} /> Generate Bill & Reduce Stock
            </button>
          </div>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {isInvoiceModalOpen && completedSale && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={20} color="#10B981" /> Invoice Receipt Generated
              </h3>
              <button className="btn btn-secondary btn-icon-only" onClick={() => setIsInvoiceModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ fontFamily: 'Courier, monospace', fontSize: '0.875rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '16px', borderBottom: '1px dashed rgba(255,255,255,0.2)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>SMART RETAIL POS</h3>
                <div>{completedSale.shopName}</div>
                <div>Invoice #: {completedSale.invoiceNumber}</div>
                <div>Date: {new Date(completedSale.saleTimestamp).toLocaleString()}</div>
                <div>Customer: {completedSale.customerName} ({completedSale.customerPhone})</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                {completedSale.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div>{it.quantity}x {it.productName}</div>
                    <div>₹{it.totalPrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <span>₹{completedSale.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tax (GST):</span>
                  <span>₹{completedSale.taxAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1rem', marginTop: '6px' }}>
                  <span>GRAND TOTAL:</span>
                  <span>₹{completedSale.grandTotal.toFixed(2)}</span>
                </div>
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: '#9CA3AF' }}>
                  Payment Method: {completedSale.paymentMethod} • Status: PAID
                  <div style={{ marginTop: '4px', fontStyle: 'italic' }}>*** Inventory Stock Decremented Automatically ***</div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => window.print()}>
                <Printer size={16} /> Print Receipt
              </button>
              <button className="btn btn-primary" onClick={() => setIsInvoiceModalOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
