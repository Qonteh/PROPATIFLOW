-- RentEase Property Management System - MySQL/MariaDB Database Schema
-- Compatible with XAMPP phpMyAdmin
-- Run this in phpMyAdmin or MySQL command line

-- Create Database
CREATE DATABASE IF NOT EXISTS rental_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rental_platform;

-- =====================================================
-- USERS TABLE - Core user authentication and profile
-- =====================================================
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS background_checks;
DROP TABLE IF EXISTS property_views;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS maintenance_requests;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS leases;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS credit_scores;
DROP TABLE IF EXISTS tenant_profiles;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS verifications;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS notification_settings;
DROP TABLE IF EXISTS payment_settings;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    role ENUM('tenant', 'landlord', 'agent') NOT NULL DEFAULT 'tenant',
    is_verified TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    avatar_url VARCHAR(500) DEFAULT NULL,
    date_of_birth DATE DEFAULT NULL,
    address TEXT DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    state VARCHAR(100) DEFAULT NULL,
    country VARCHAR(100) DEFAULT 'Tanzania',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- =====================================================
-- NOTIFICATION SETTINGS TABLE - User notification preferences
-- =====================================================
CREATE TABLE notification_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    new_applications TINYINT(1) DEFAULT 1,
    payment_reminders TINYINT(1) DEFAULT 1,
    maintenance_requests TINYINT(1) DEFAULT 1,
    monthly_reports TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_user_notif (user_id)
) ENGINE=InnoDB;

-- =====================================================
-- PAYMENT SETTINGS TABLE - Landlord payment info
-- =====================================================
CREATE TABLE payment_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    bank_name VARCHAR(100) DEFAULT NULL,
    account_number VARCHAR(50) DEFAULT NULL,
    account_name VARCHAR(100) DEFAULT NULL,
    mobile_money VARCHAR(20) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_user_payment (user_id)
) ENGINE=InnoDB;

-- =====================================================
-- SESSIONS TABLE - User session management
-- =====================================================
CREATE TABLE sessions (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB;

-- =====================================================
-- VERIFICATION TABLE - User identity verification
-- =====================================================
CREATE TABLE verifications (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    nin_number VARCHAR(20) DEFAULT NULL,
    nin_verified TINYINT(1) DEFAULT 0,
    nin_verified_at DATETIME DEFAULT NULL,
    bvn_number VARCHAR(20) DEFAULT NULL,
    bvn_verified TINYINT(1) DEFAULT 0,
    bvn_verified_at DATETIME DEFAULT NULL,
    id_document_url VARCHAR(500) DEFAULT NULL,
    id_document_type ENUM('national_id', 'passport', 'drivers_license', 'voters_card') DEFAULT NULL,
    id_verified TINYINT(1) DEFAULT 0,
    id_verified_at DATETIME DEFAULT NULL,
    selfie_url VARCHAR(500) DEFAULT NULL,
    selfie_verified TINYINT(1) DEFAULT 0,
    address_verified TINYINT(1) DEFAULT 0,
    address_document_url VARCHAR(500) DEFAULT NULL,
    verification_status ENUM('pending', 'in_progress', 'verified', 'rejected') DEFAULT 'pending',
    rejection_reason TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_verification (user_id)
) ENGINE=InnoDB;

-- =====================================================
-- PROPERTIES TABLE - Property listings
-- =====================================================
CREATE TABLE properties (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    landlord_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    property_type ENUM('apartment', 'house', 'condo', 'studio', 'duplex', 'room', 'office', 'shop') NOT NULL,
    status ENUM('available', 'rented', 'maintenance', 'unavailable') DEFAULT 'available',
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'Tanzania',
    zip_code VARCHAR(20) DEFAULT NULL,
    latitude DECIMAL(10, 8) DEFAULT NULL,
    longitude DECIMAL(11, 8) DEFAULT NULL,
    bedrooms INT DEFAULT 1,
    bathrooms INT DEFAULT 1,
    area_sqft INT DEFAULT NULL,
    rent_amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TZS',
    security_deposit DECIMAL(12, 2) DEFAULT NULL,
    is_furnished TINYINT(1) DEFAULT 0,
    parking_spaces INT DEFAULT 0,
    amenities TEXT DEFAULT NULL,
    images TEXT DEFAULT NULL,
    extra_features TEXT DEFAULT NULL,
    video_url VARCHAR(500) DEFAULT NULL,
    available_from DATE DEFAULT NULL,
    min_lease_months INT DEFAULT 12,
    pet_policy ENUM('allowed', 'not_allowed', 'negotiable') DEFAULT 'not_allowed',
    is_published TINYINT(1) DEFAULT 1,
    views_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_landlord (landlord_id),
    INDEX idx_status (status),
    INDEX idx_city (city),
    INDEX idx_rent (rent_amount),
    INDEX idx_type (property_type)
) ENGINE=InnoDB;

-- =====================================================
-- TENANT PROFILES TABLE - Extended tenant information
-- =====================================================
CREATE TABLE tenant_profiles (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    nida_number VARCHAR(30) DEFAULT NULL,
    employer_name VARCHAR(255) DEFAULT NULL,
    employment_status ENUM('employed', 'self_employed', 'unemployed', 'student', 'retired') DEFAULT 'employed',
    job_title VARCHAR(100) DEFAULT NULL,
    annual_income DECIMAL(15, 2) DEFAULT NULL,
    income_verified TINYINT(1) DEFAULT 0,
    employment_start_date DATE DEFAULT NULL,
    previous_landlord_name VARCHAR(255) DEFAULT NULL,
    previous_landlord_phone VARCHAR(20) DEFAULT NULL,
    previous_landlord_email VARCHAR(255) DEFAULT NULL,
    previous_address TEXT DEFAULT NULL,
    rental_history_years INT DEFAULT 0,
    has_pets TINYINT(1) DEFAULT 0,
    pet_details TEXT DEFAULT NULL,
    number_of_occupants INT DEFAULT 1,
    emergency_contact_name VARCHAR(255) DEFAULT NULL,
    emergency_contact_phone VARCHAR(20) DEFAULT NULL,
    emergency_contact_relationship VARCHAR(50) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tenant_profile (user_id)
) ENGINE=InnoDB;

-- =====================================================
-- CREDIT SCORES TABLE - Tenant credit information (private)
-- =====================================================
CREATE TABLE credit_scores (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    total_score INT NOT NULL,
    payment_history_score INT DEFAULT 0,
    credit_utilization_score INT DEFAULT 0,
    credit_history_length_score INT DEFAULT 0,
    credit_mix_score INT DEFAULT 0,
    new_inquiries_score INT DEFAULT 0,
    score_rating ENUM('excellent', 'good', 'fair', 'poor') NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_shared_with_landlord TINYINT(1) DEFAULT 0,
    share_code VARCHAR(50) DEFAULT NULL UNIQUE,
    share_code_expires_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_credit (user_id)
) ENGINE=InnoDB;

-- =====================================================
-- APPLICATIONS TABLE - Rental applications
-- =====================================================
CREATE TABLE applications (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    property_id VARCHAR(36) NOT NULL,
    tenant_id VARCHAR(36) NOT NULL,
    landlord_id VARCHAR(36) NOT NULL,
    status ENUM('pending', 'under_review', 'approved', 'rejected', 'withdrawn', 'expired') DEFAULT 'pending',
    application_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    desired_move_in DATE NOT NULL,
    proposed_rent DECIMAL(12, 2) DEFAULT NULL,
    lease_duration_months INT DEFAULT 12,
    message TEXT DEFAULT NULL,
    documents TEXT DEFAULT NULL,
    credit_score_shared TINYINT(1) DEFAULT 0,
    background_check_consent TINYINT(1) DEFAULT 0,
    income_verification_consent TINYINT(1) DEFAULT 0,
    landlord_notes TEXT DEFAULT NULL,
    rejection_reason TEXT DEFAULT NULL,
    reviewed_at DATETIME DEFAULT NULL,
    reviewed_by VARCHAR(36) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_property (property_id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_landlord (landlord_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- =====================================================
-- LEASES TABLE - Active lease agreements
-- =====================================================
CREATE TABLE leases (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    property_id VARCHAR(36) NOT NULL,
    tenant_id VARCHAR(36) NOT NULL,
    landlord_id VARCHAR(36) NOT NULL,
    application_id VARCHAR(36) DEFAULT NULL,
    status ENUM('draft', 'pending_signature', 'active', 'expired', 'terminated', 'renewed') DEFAULT 'draft',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount DECIMAL(12, 2) NOT NULL,
    security_deposit DECIMAL(12, 2) DEFAULT NULL,
    payment_due_day INT DEFAULT 1,
    late_fee_amount DECIMAL(10, 2) DEFAULT 0,
    late_fee_grace_days INT DEFAULT 5,
    terms_and_conditions TEXT DEFAULT NULL,
    special_clauses TEXT DEFAULT NULL,
    document_url VARCHAR(500) DEFAULT NULL,
    signed_by_tenant TINYINT(1) DEFAULT 0,
    tenant_signed_at DATETIME DEFAULT NULL,
    signed_by_landlord TINYINT(1) DEFAULT 0,
    landlord_signed_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL,
    INDEX idx_property (property_id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- =====================================================
-- PAYMENTS TABLE - Rent and other payments
-- =====================================================
CREATE TABLE payments (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    lease_id VARCHAR(36) NOT NULL,
    tenant_id VARCHAR(36) NOT NULL,
    landlord_id VARCHAR(36) NOT NULL,
    property_id VARCHAR(36) NOT NULL,
    payment_type ENUM('rent', 'security_deposit', 'late_fee', 'utility', 'maintenance', 'other') NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TZS',
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('bank_transfer', 'card', 'cash', 'mobile_money', 'crypto') NOT NULL,
    payment_reference VARCHAR(100) DEFAULT NULL UNIQUE,
    transaction_id VARCHAR(100) DEFAULT NULL,
    payment_gateway VARCHAR(50) DEFAULT NULL,
    due_date DATE DEFAULT NULL,
    paid_date DATETIME DEFAULT NULL,
    payment_period_start DATE DEFAULT NULL,
    payment_period_end DATE DEFAULT NULL,
    late_fee_applied DECIMAL(10, 2) DEFAULT 0,
    notes TEXT DEFAULT NULL,
    receipt_url VARCHAR(500) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_lease (lease_id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB;

-- =====================================================
-- MAINTENANCE REQUESTS TABLE
-- =====================================================
CREATE TABLE maintenance_requests (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    property_id VARCHAR(36) NOT NULL,
    tenant_id VARCHAR(36) NOT NULL,
    landlord_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('plumbing', 'electrical', 'appliance', 'hvac', 'structural', 'pest', 'cleaning', 'other') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'emergency') DEFAULT 'medium',
    status ENUM('open', 'in_progress', 'scheduled', 'completed', 'cancelled') DEFAULT 'open',
    images TEXT DEFAULT NULL,
    scheduled_date DATETIME DEFAULT NULL,
    completed_date DATETIME DEFAULT NULL,
    cost DECIMAL(10, 2) DEFAULT NULL,
    paid_by ENUM('landlord', 'tenant', 'shared') DEFAULT NULL,
    contractor_name VARCHAR(255) DEFAULT NULL,
    contractor_phone VARCHAR(20) DEFAULT NULL,
    landlord_notes TEXT DEFAULT NULL,
    tenant_rating INT DEFAULT NULL,
    tenant_feedback TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_property (property_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
) ENGINE=InnoDB;

-- =====================================================
-- MESSAGES TABLE - Communication between users
-- =====================================================
CREATE TABLE messages (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    sender_id VARCHAR(36) NOT NULL,
    receiver_id VARCHAR(36) NOT NULL,
    property_id VARCHAR(36) DEFAULT NULL,
    application_id VARCHAR(36) DEFAULT NULL,
    subject VARCHAR(255) DEFAULT NULL,
    content TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    read_at DATETIME DEFAULT NULL,
    attachments TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL,
    INDEX idx_sender (sender_id),
    INDEX idx_receiver (receiver_id),
    INDEX idx_read (is_read)
) ENGINE=InnoDB;

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE notifications (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type ENUM('application', 'payment', 'maintenance', 'message', 'lease', 'verification', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    link VARCHAR(500) DEFAULT NULL,
    is_read TINYINT(1) DEFAULT 0,
    read_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_type (type)
) ENGINE=InnoDB;

-- =====================================================
-- FAVORITES TABLE - Saved properties
-- =====================================================
CREATE TABLE favorites (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    property_id VARCHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, property_id)
) ENGINE=InnoDB;

-- =====================================================
-- PROPERTY VIEWS TABLE - Track property views
-- =====================================================
CREATE TABLE property_views (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    property_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_property (property_id),
    INDEX idx_viewed_at (viewed_at)
) ENGINE=InnoDB;

-- =====================================================
-- BACKGROUND CHECKS TABLE
-- =====================================================
CREATE TABLE background_checks (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    check_type ENUM('criminal', 'eviction', 'employment', 'reference') NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'failed') DEFAULT 'pending',
    result ENUM('clear', 'flagged', 'inconclusive') DEFAULT NULL,
    details TEXT DEFAULT NULL,
    provider VARCHAR(100) DEFAULT NULL,
    provider_reference VARCHAR(100) DEFAULT NULL,
    completed_at DATETIME DEFAULT NULL,
    valid_until DATE DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_type (check_type),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- =====================================================
-- DOCUMENTS TABLE - User uploaded documents
-- =====================================================
CREATE TABLE documents (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    document_type ENUM('id_card', 'passport', 'drivers_license', 'utility_bill', 'bank_statement', 'employment_letter', 'pay_slip', 'lease_agreement', 'other') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INT DEFAULT NULL,
    mime_type VARCHAR(100) DEFAULT NULL,
    is_verified TINYINT(1) DEFAULT 0,
    verified_at DATETIME DEFAULT NULL,
    verified_by VARCHAR(36) DEFAULT NULL,
    expires_at DATE DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_type (document_type)
) ENGINE=InnoDB;

-- =====================================================
-- INSERT SAMPLE DATA FOR TESTING
-- =====================================================

-- All demo/sample data removed. Only schema is created.
