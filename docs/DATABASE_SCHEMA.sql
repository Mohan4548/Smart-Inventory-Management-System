-- MySQL Database Schema Definition
-- Smart Inventory & Billing Management System
-- Database Name: smart_inventory_db

CREATE DATABASE IF NOT EXISTS smart_inventory_db;
USE smart_inventory_db;

-- 1. Shops Table
CREATE TABLE IF NOT EXISTS shops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shop_id VARCHAR(100) NOT NULL UNIQUE,
    shop_name VARCHAR(255) NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    supplier_id VARCHAR(100) NOT NULL UNIQUE,
    supplier_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    gst_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL UNIQUE,
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    brand_name VARCHAR(100) NOT NULL,
    model_number VARCHAR(100),
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    purchase_price DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    tax DECIMAL(5,2) DEFAULT 18.00,
    quantity INT NOT NULL DEFAULT 0,
    minimum_stock_level INT NOT NULL DEFAULT 5,
    maximum_stock_level INT DEFAULT 100,
    unit VARCHAR(50) DEFAULT 'Pcs',
    batch_number VARCHAR(100),
    manufacturing_date DATE,
    expiry_date DATE,
    supplier_id BIGINT NOT NULL,
    shop_id BIGINT NOT NULL,
    rack_number VARCHAR(50),
    shelf_number VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

-- 4. Sales Table
CREATE TABLE IF NOT EXISTS sales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    shop_id BIGINT NOT NULL,
    shop_name VARCHAR(255),
    customer_name VARCHAR(255) DEFAULT 'Walk-in Customer',
    customer_phone VARCHAR(50),
    customer_email VARCHAR(100),
    customer_address VARCHAR(255),
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    tax DECIMAL(10,2) DEFAULT 0.00,
    grand_total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    amount_paid DECIMAL(10,2),
    change_amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'COMPLETED',
    sale_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

-- 5. Sale Items Table
CREATE TABLE IF NOT EXISTS sale_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sale_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    custom_product_id VARCHAR(100),
    barcode VARCHAR(100),
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 6. Stock Movements Audit Table
CREATE TABLE IF NOT EXISTS stock_movements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movement_id VARCHAR(100) NOT NULL UNIQUE,
    product_id BIGINT NOT NULL,
    shop_id BIGINT NOT NULL,
    movement_type VARCHAR(50) NOT NULL, -- STOCK_IN, STOCK_OUT, ADJUSTMENT, SALE
    quantity INT NOT NULL,
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    reason VARCHAR(255),
    supplier_name VARCHAR(255),
    reference_number VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);
