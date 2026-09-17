import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts, initialShops, initialSuppliers, initialSales } from '../data/mockData';
import { getDefaultImageForProduct } from '../catalog/imageCatalog';
import { productService, supplierService, shopService } from '../services/api';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [shops, setShops] = useState(initialShops);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [sales, setSales] = useState(initialSales);
  
  const [selectedShopId, setSelectedShopId] = useState('ALL');
  const [toast, setToast] = useState(null);
  const [isApiConnected, setIsApiConnected] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Stock status helper
  const calculateStockStatus = (quantity, minStock) => {
    const q = Number(quantity);
    const m = Number(minStock || 5);
    if (q <= 0) return 'OUT OF STOCK';
    if (q <= m) return 'LOW STOCK';
    return 'IN STOCK';
  };

  // Attempt sync with Spring Boot REST API
  useEffect(() => {
    async function syncBackendData() {
      try {
        const [apiShops, apiSuppliers, apiProducts] = await Promise.all([
          shopService.getAll(),
          supplierService.getAll(),
          productService.getAll()
        ]);

        if (apiShops && apiShops.length > 0) {
          setShops(apiShops.map(s => ({
            ...s,
            branchName: s.branchName || s.shopName
          })));
        }
        if (apiSuppliers && apiSuppliers.length > 0) {
          setSuppliers(apiSuppliers.map(sup => ({
            ...sup,
            name: sup.supplierName || sup.name
          })));
        }
        if (apiProducts && apiProducts.length > 0) {
          setProducts(apiProducts.map(p => ({
            ...p,
            name: p.productName || p.name,
            customProductId: p.productId || p.customProductId,
            brand: p.brandName || p.brand,
            taxPercentage: p.tax !== undefined ? p.tax : p.taxPercentage,
            image: p.productImage || p.image || getDefaultImageForProduct(p.productName || p.name, p.category)
          })));
        }
        setIsApiConnected(true);
      } catch (err) {
        // Fallback to local memory state cleanly if backend is not reachable
        setIsApiConnected(false);
      }
    }

    syncBackendData();
  }, []);

  const activeProducts = selectedShopId === 'ALL'
    ? products
    : products.filter(p => Number(p.shopId) === Number(selectedShopId));

  // Product CRUD with API + Memory Sync
  const addProduct = async (productData) => {
    // Unique check
    if (products.some(p => p.barcode === productData.barcode)) {
      showToast(`Barcode '${productData.barcode}' already exists. Please use a different barcode.`, 'error');
      return false;
    }
    const pid = productData.productId || productData.customProductId;
    if (products.some(p => (p.productId || p.customProductId) === pid)) {
      showToast(`Product ID '${pid}' already exists.`, 'error');
      return false;
    }

    const shop = shops.find(s => Number(s.id) === Number(productData.shopId));
    const supplier = suppliers.find(s => Number(s.id) === Number(productData.supplierId));

    const imageToUse = productData.image || productData.productImage || getDefaultImageForProduct(productData.name || productData.productName, productData.category);

    const payload = {
      productId: pid,
      productName: productData.name || productData.productName,
      productImage: imageToUse,
      category: productData.category,
      subCategory: productData.subCategory || '',
      brandName: productData.brand || productData.brandName,
      modelNumber: productData.modelNumber || '',
      sku: productData.sku || '',
      barcode: productData.barcode,
      description: productData.description || '',
      purchasePrice: Number(productData.purchasePrice),
      sellingPrice: Number(productData.sellingPrice),
      tax: Number(productData.taxPercentage || productData.tax || 18),
      quantity: Number(productData.quantity),
      minimumStockLevel: Number(productData.minimumStockLevel),
      maximumStockLevel: Number(productData.maximumStockLevel || 100),
      unit: productData.unit || 'Pcs',
      batchNumber: productData.batchNumber || '',
      manufacturingDate: productData.manufacturingDate || productData.mfgDate || null,
      expiryDate: productData.expiryDate || null,
      supplierId: Number(productData.supplierId),
      shopId: Number(productData.shopId),
      rackNumber: productData.rackNumber || 'RACK-A',
      shelfNumber: productData.shelfNumber || 'SHELF-1'
    };

    try {
      if (isApiConnected) {
        const created = await productService.create(payload);
        const formatted = {
          ...created,
          name: created.productName,
          customProductId: created.productId,
          brand: created.brandName,
          taxPercentage: created.tax,
          image: created.productImage || imageToUse
        };
        setProducts(prev => [formatted, ...prev]);
      } else {
        const localCreated = {
          ...payload,
          id: Date.now(),
          customProductId: pid,
          name: payload.productName,
          brand: payload.brandName,
          shopName: shop ? shop.branchName || shop.shopName : 'Branch Shop',
          supplierName: supplier ? supplier.supplierName || supplier.name : 'Supplier Vendor',
          image: imageToUse
        };
        setProducts(prev => [localCreated, ...prev]);
      }
      showToast(`Product '${payload.productName}' added successfully!`, 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to create product', 'error');
      return false;
    }
  };

  const updateProduct = async (id, updatedData) => {
    const shop = shops.find(s => Number(s.id) === Number(updatedData.shopId));
    const supplier = suppliers.find(s => Number(s.id) === Number(updatedData.supplierId));
    const imageToUse = updatedData.image || updatedData.productImage || getDefaultImageForProduct(updatedData.name || updatedData.productName, updatedData.category);

    const payload = {
      productId: updatedData.productId || updatedData.customProductId,
      productName: updatedData.name || updatedData.productName,
      productImage: imageToUse,
      category: updatedData.category,
      subCategory: updatedData.subCategory || '',
      brandName: updatedData.brand || updatedData.brandName,
      modelNumber: updatedData.modelNumber || '',
      sku: updatedData.sku || '',
      barcode: updatedData.barcode,
      description: updatedData.description || '',
      purchasePrice: Number(updatedData.purchasePrice),
      sellingPrice: Number(updatedData.sellingPrice),
      tax: Number(updatedData.taxPercentage || updatedData.tax || 18),
      quantity: Number(updatedData.quantity),
      minimumStockLevel: Number(updatedData.minimumStockLevel),
      maximumStockLevel: Number(updatedData.maximumStockLevel || 100),
      unit: updatedData.unit || 'Pcs',
      batchNumber: updatedData.batchNumber || '',
      manufacturingDate: updatedData.manufacturingDate || updatedData.mfgDate || null,
      expiryDate: updatedData.expiryDate || null,
      supplierId: Number(updatedData.supplierId),
      shopId: Number(updatedData.shopId),
      rackNumber: updatedData.rackNumber || 'RACK-A',
      shelfNumber: updatedData.shelfNumber || 'SHELF-1'
    };

    try {
      if (isApiConnected) {
        const updated = await productService.update(id, payload);
        const formatted = {
          ...updated,
          name: updated.productName,
          customProductId: updated.productId,
          brand: updated.brandName,
          taxPercentage: updated.tax,
          image: updated.productImage || imageToUse
        };
        setProducts(prev => prev.map(p => p.id === id ? formatted : p));
      } else {
        setProducts(prev => prev.map(p => {
          if (p.id === id) {
            return {
              ...p,
              ...payload,
              customProductId: payload.productId,
              name: payload.productName,
              brand: payload.brandName,
              shopName: shop ? shop.branchName || shop.shopName : p.shopName,
              supplierName: supplier ? supplier.supplierName || supplier.name : p.supplierName,
              image: imageToUse
            };
          }
          return p;
        }));
      }
      showToast(`Product updated successfully!`, 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to update product', 'error');
      return false;
    }
  };

  const deleteProduct = async (id) => {
    const prod = products.find(p => p.id === id);
    try {
      if (isApiConnected) {
        await productService.delete(id);
      }
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast(`Product '${prod?.name || prod?.productName || 'Item'}' deleted successfully.`, 'info');
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const adjustStock = (productId, adjustmentQty, reason) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newQty = Math.max(0, p.quantity + Number(adjustmentQty));
        return { ...p, quantity: newQty };
      }
      return p;
    }));
    showToast(`Stock updated (${reason}).`, 'success');
  };

  const addShop = (shopData) => {
    const newShop = { ...shopData, id: Date.now() };
    setShops(prev => [...prev, newShop]);
    showToast(`Branch '${newShop.branchName}' created!`, 'success');
  };

  const addSupplier = (supData) => {
    const newSup = { ...supData, id: Date.now() };
    setSuppliers(prev => [...prev, newSup]);
    showToast(`Supplier '${newSup.name || newSup.supplierName}' registered!`, 'success');
  };

  const processCheckout = ({ cartItems, customerName, customerPhone, paymentMethod, shopId, subtotal, taxAmount, discountAmount, grandTotal }) => {
    if (!cartItems || cartItems.length === 0) {
      showToast('Billing cart is empty!', 'error');
      return null;
    }

    for (const item of cartItems) {
      const product = products.find(p => p.id === item.product.id);
      if (!product) {
        showToast(`Error: Product '${item.product.name}' no longer exists!`, 'error');
        return null;
      }
      if (product.quantity < item.quantity) {
        showToast(`Stock Alert: Insufficient stock for '${product.name}'. Available: ${product.quantity}, Requested: ${item.quantity}`, 'error');
        return null;
      }
    }

    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartMatch = cartItems.find(item => item.product.id === p.id);
        if (cartMatch) {
          const newQuantity = p.quantity - cartMatch.quantity;
          return { ...p, quantity: newQuantity };
        }
        return p;
      });
    });

    const activeShop = shops.find(s => Number(s.id) === Number(shopId)) || shops[0];

    const newSale = {
      id: Date.now(),
      invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      shopId: activeShop.id,
      shopName: activeShop.branchName || activeShop.shopName,
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || 'N/A',
      subtotal,
      taxAmount,
      discountAmount,
      grandTotal,
      paymentMethod: paymentMethod || 'CASH',
      paymentStatus: 'PAID',
      saleTimestamp: new Date().toISOString(),
      items: cartItems.map(ci => ({
        productId: ci.product.id,
        customProductId: ci.product.customProductId || ci.product.productId,
        productName: ci.product.name || ci.product.productName,
        barcode: ci.product.barcode,
        unitPrice: ci.product.sellingPrice,
        quantity: ci.quantity,
        totalPrice: ci.product.sellingPrice * ci.quantity
      }))
    };

    setSales(prev => [newSale, ...prev]);
    showToast(`Bill ${newSale.invoiceNumber} generated! Inventory stock reduced automatically.`, 'success');
    return newSale;
  };

  return (
    <InventoryContext.Provider value={{
      products,
      activeProducts,
      shops,
      suppliers,
      sales,
      selectedShopId,
      setSelectedShopId,
      toast,
      showToast,
      calculateStockStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      addShop,
      addSupplier,
      processCheckout,
      isApiConnected
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
