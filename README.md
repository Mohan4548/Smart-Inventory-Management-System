# Smart Inventory & Billing Management System

A production-ready retail inventory management and Point-of-Sale (POS) web application built with **React 19**, **Spring Boot 3.2**, and **MySQL 8.0**.

## 📌 Overview
The **Smart Inventory & Billing Management System** digitizes multi-branch retail operations. It provides centralized product catalog control, branch-wise stock isolation, USB hardware barcode POS billing, atomic transaction safety, stock movement audit trails, low-stock alerts, supplier management, and executive financial analytics.

## 🚀 Key Features
- **Executive Dashboard**: Real-time KPI metrics, branch filters, revenue trend charts, category stock distribution, and live low-stock/expiry alert streams.
- **Product & Inventory Control**: Product CRUD with barcode/SKU validation, batch & expiry monitoring, rack/shelf tracking, stock in/out workflows, and immutable movement audit logs.
- **Shop-Wise Isolation**: Independent stock levels maintained per store branch (e.g., Coimbatore, Karur, Chennai).
- **Barcode POS Billing**: USB scanner support, real-time cart stock guards, duplicate scan auto-increment, tax/discount engine, and printable invoice receipts (`INV-2026-XXXXXX`).
- **Suppliers & Branch Network**: Vendor profiles with GST tracking, multi-shop management, and dependency safeguards.
- **Reports & CSV Export**: Comprehensive sub-reports with flexible date range filters and 1-click CSV exports.

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Recharts, Lucide Icons, Custom Light-Theme CSS
- **Backend**: Spring Boot 3.2 (Java 17), RESTful APIs, Spring Data JPA
- **Database**: MySQL 8.0 (`smart_inventory_db`)

## 💻 Quick Start
```bash
# Start Backend (Port 8080)
cd backend && mvn spring-boot:run

# Start Frontend (Port 3000)
cd frontend && npm install && npm run dev
```
