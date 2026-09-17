# College Viva Preparation Guide - Smart Inventory & Billing Management System

### Q1: What is the Smart Inventory & Billing Management System?
**Answer**: It is a full-stack enterprise retail management web application built using React for the frontend, Spring Boot for the REST API backend, and MySQL for relational data storage. It automates product catalog management, shop-wise inventory control, USB/manual barcode POS billing, automatic stock deduction, and real-time financial reporting.

### Q2: Why did you choose React for the frontend?
**Answer**: React provides a fast, component-based, declarative UI framework with efficient virtual DOM rendering. It enables smooth user experiences for POS terminal billing, cart state management, dynamic chart updates, and modal popups without page reloads.

### Q3: Why did you choose Spring Boot for the backend?
**Answer**: Spring Boot offers a robust, production-ready framework for building scalable Java REST APIs. It provides seamless Spring Data JPA database integration, declarative `@Transactional` management for inventory safety, dependency injection, and centralized exception handling.

### Q4: How is database access handled in Spring Boot?
**Answer**: Database access is managed using Spring Data JPA (Java Persistence API) powered by Hibernate ORM. Entities like `Product`, `Shop`, `Supplier`, `Sale`, `SaleItem`, and `StockMovement` map Java objects directly to MySQL tables.

### Q5: How does billing automatically reduce inventory stock?
**Answer**: When a POS transaction is submitted to `POST /api/sales`, the `@Transactional` `BillingService` validates that every cart item has sufficient stock in the selected shop. It then atomically decrements `product.quantity`, creates a `Sale` and `SaleItem` records, writes a `StockMovement` entry (`movementType = SALE`), and updates the stock status.

### Q6: How do you prevent negative inventory stock?
**Answer**: Both frontend and backend perform strict validation. If a user attempts a Stock Out or POS checkout where `requestedQuantity > availableStock`, the transaction is aborted and a `400 Bad Request` or user-facing alert is returned, rolling back all database mutations.

### Q7: How does multi-branch inventory tracking work?
**Answer**: Stock levels are isolated per shop branch (e.g., Coimbatore Branch, Karur Branch, Chennai Branch). When a sale occurs at Coimbatore Branch, stock is deducted **only** from Coimbatore Branch's inventory, leaving Karur and Chennai stock untouched.

### Q8: How is dynamic stock status calculated?
**Answer**: Stock status is calculated automatically from quantity and minimum stock level:
- `quantity == 0` → `OUT OF STOCK` (Red Badge)
- `quantity <= minimumStockLevel` → `LOW STOCK` (Amber Badge)
- `quantity > minimumStockLevel` → `IN STOCK` (Green Badge)

### Q9: How do default local product images work without mandatory user upload?
**Answer**: The system includes a predefined local SVG image catalog (`imageCatalog.js`). When a user enters a product name or category (e.g., "Coca-Cola", "Laptop", "Milk", "Rice"), the application automatically matches and assigns a crisp local image fallback.

### Q10: How do you prevent double-submission on POS checkout?
**Answer**: In the React billing component, the "Generate Bill" button immediately sets `isProcessing = true` upon click, disabling the submit button and preventing duplicate invoice creation or double stock deduction.

### Q11: How is exception handling implemented in Spring Boot?
**Answer**: Centralized exception handling is implemented using `@RestControllerAdvice` in `GlobalExceptionHandler.java`. Custom exceptions like `ResourceNotFoundException`, `DuplicateResourceException`, and `InvalidInputException` return clean, user-friendly JSON payloads: `{ "success": false, "message": "..." }`.

### Q12: How are unique constraints enforced?
**Answer**: Unique constraints are enforced both in JPA Entity definitions (`@Column(unique = true)`) and in Service layer pre-checks for `productId`, `barcode`, `sku`, `supplierId`, `shopId`, and `invoiceNumber`.

### Q13: What testing was performed on the system?
**Answer**: End-to-end integration testing was conducted across all 8 modules (Dashboard, Products, Inventory, Billing/POS, Sales, Suppliers, Shops, Reports) covering product CRUD, barcode lookups, stock deduction, multi-branch isolation, date filters, and responsive layout checks.

### Q14: How does the CSV export feature work on reports?
**Answer**: The frontend extracts currently filtered data arrays (e.g., Sales ledger or Inventory valuation), formats headers into comma-separated values, creates a blob Data-URI, and triggers an automated browser file download.

### Q15: What are future scope enhancements for this project?
**Answer**: Future enhancements include role-based access control (RBAC) with JWT authentication, hardware thermal receipt printer integration, automated email/SMS invoice dispatches, and machine learning demand forecasting.
