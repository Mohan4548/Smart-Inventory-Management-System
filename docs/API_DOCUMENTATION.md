# REST API Documentation - Smart Inventory & Billing Management System

Base URL: `http://localhost:8080/api`

Standard Response Payload Format:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-09-17T11:15:00"
}
```

---

## 1. Product APIs (`/api/products`)

### Get All Products
- **HTTP Method**: `GET`
- **Endpoint**: `/api/products`
- **Query Parameters**:
  - `shopId` (optional): Filter products by shop branch ID.
  - `query` (optional): Search term for Product Name, Product ID, or Barcode.
- **Response**: `200 OK` - Array of `ProductResponseDto`.

### Get Product by ID
- **HTTP Method**: `GET`
- **Endpoint**: `/api/products/{id}`
- **Response**: `200 OK` - `ProductResponseDto` object.
- **Error**: `404 Not Found` if product ID does not exist.

### Get Product by Barcode
- **HTTP Method**: `GET`
- **Endpoint**: `/api/products/barcode/{barcode}`
- **Response**: `200 OK` - `ProductResponseDto`.

### Create Product
- **HTTP Method**: `POST`
- **Endpoint**: `/api/products`
- **Request Body**:
```json
{
  "productId": "PRD-1008",
  "productName": "Pepsi 500ml Pet Bottle",
  "productImage": "data:image/svg+xml;...",
  "category": "Beverages",
  "brandName": "PepsiCo",
  "barcode": "8901058000999",
  "purchasePrice": 32.00,
  "sellingPrice": 40.00,
  "tax": 18.0,
  "quantity": 50,
  "minimumStockLevel": 15,
  "supplierId": 1,
  "shopId": 1
}
```
- **Response**: `201 Created` - Created `ProductResponseDto`.
- **Errors**: `400 Bad Request` for validation failures or duplicate Barcode/Product ID.

### Update Product
- **HTTP Method**: `PUT`
- **Endpoint**: `/api/products/{id}`
- **Response**: `200 OK` - Updated `ProductResponseDto`.

### Delete Product
- **HTTP Method**: `DELETE`
- **Endpoint**: `/api/products/{id}`
- **Response**: `200 OK` - Success confirmation message.

---

## 2. Inventory APIs (`/api/inventory`)

### Stock In (Restock Shipment)
- **HTTP Method**: `POST`
- **Endpoint**: `/api/inventory/stock-in`
- **Request Body**:
```json
{
  "productId": 1,
  "shopId": 1,
  "quantity": 25,
  "supplierId": 1,
  "purchasePrice": 32.00,
  "batchNumber": "BT-2026-X",
  "reason": "Supplier Shipment Arrival"
}
```
- **Response**: `200 OK` - Updated product stock & created `STOCK_IN` movement record.

### Stock Out / Adjustment
- **HTTP Method**: `POST`
- **Endpoint**: `/api/inventory/stock-out`
- **Request Body**:
```json
{
  "productId": 1,
  "shopId": 1,
  "quantity": 5,
  "reason": "Damaged / Expired Goods"
}
```
- **Response**: `200 OK` - Updated product stock & created `STOCK_OUT` movement record.
- **Error**: `400 Bad Request` if requested deduction exceeds available stock.

### Get Stock Movements Audit Log
- **HTTP Method**: `GET`
- **Endpoint**: `/api/inventory/movements`
- **Response**: `200 OK` - List of historical `StockMovement` entries.

---

## 3. Sales & POS Billing APIs (`/api/sales`)

### Process Transactional Sale
- **HTTP Method**: `POST`
- **Endpoint**: `/api/sales`
- **Request Body**:
```json
{
  "shopId": 1,
  "customerName": "R. Sundaram",
  "customerPhone": "+91 98400 12345",
  "subtotal": 100.00,
  "discount": 5.00,
  "tax": 18.00,
  "grandTotal": 113.00,
  "paymentMethod": "UPI",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 50.00
    }
  ]
}
```
- **Behavior**: Atomic transaction (`@Transactional`) verifying stock availability, generating unique invoice ID (`INV-2026-XXXXXX`), reducing shop stock, and writing a `SALE` movement log.
- **Response**: `201 Created` - Created `SaleResponseDto`.

### Get Sales History
- **HTTP Method**: `GET`
- **Endpoint**: `/api/sales`
- **Query Parameters**: `shopId`, `query`, `startDate`, `endDate`.
- **Response**: `200 OK` - Array of `SaleResponseDto`.

---

## 4. Supplier APIs (`/api/suppliers`) & Shop APIs (`/api/shops`)

- `GET /api/suppliers` & `POST /api/suppliers` & `PUT /api/suppliers/{id}` & `DELETE /api/suppliers/{id}`
- `GET /api/shops` & `POST /api/shops` & `PUT /api/shops/{id}` & `DELETE /api/shops/{id}`

---

## 5. Dashboard Summary API (`/api/dashboard`)

### Get Dashboard Summary Metrics
- **HTTP Method**: `GET`
- **Endpoint**: `/api/dashboard/summary`
- **Query Parameters**: `shopId` (optional, default `ALL`).
- **Response**: `200 OK`
```json
{
  "totalProducts": 7,
  "totalStockQuantity": 174,
  "lowStockCount": 1,
  "outOfStockCount": 1,
  "todaySales": 71141.42,
  "todayOrders": 2,
  "totalInventoryValue": 435800.00,
  "activeShops": 3
}
```
