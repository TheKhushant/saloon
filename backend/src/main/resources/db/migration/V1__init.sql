-- V1: baseline schema for the salon backend.

CREATE TABLE branches (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    phone VARCHAR(50),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE admins (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'SUPERADMIN')),
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_admins_email ON admins(email);

CREATE TABLE app_users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_app_users_email ON app_users(email);

CREATE TABLE barbers (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_barbers_branch ON barbers(branch_id);

CREATE TABLE barber_specialties (
    barber_id UUID NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
    specialty VARCHAR(255) NOT NULL
);

CREATE TABLE services (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    duration_minutes INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    description TEXT,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    image VARCHAR(1000),
    rating NUMERIC(3, 2) DEFAULT 0,
    stylists INTEGER DEFAULT 0,
    popularity INTEGER DEFAULT 0,
    original_price NUMERIC(10, 2),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_services_branch ON services(branch_id);
CREATE INDEX idx_services_active ON services(active);
CREATE INDEX idx_services_approval ON services(approval_status);

CREATE TABLE service_tags (
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL
);

CREATE TABLE service_benefits (
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    benefit VARCHAR(500) NOT NULL
);

CREATE TABLE products (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('HAIR_CARE', 'BEARD_CARE', 'SKIN_CARE', 'TOOLS')),
    price NUMERIC(10, 2) NOT NULL,
    total_stock INTEGER NOT NULL DEFAULT 0,
    coming_soon BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    description TEXT,
    image_url VARCHAR(1000),
    rating NUMERIC(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    tag VARCHAR(100),
    how_to_use TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_approval ON products(approval_status);

CREATE TABLE product_benefits (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    benefit VARCHAR(500) NOT NULL
);

CREATE TABLE product_ingredients (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    ingredient VARCHAR(255) NOT NULL
);

CREATE TABLE product_allocations (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    assigned_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('ASSIGNED', 'PENDING')),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_allocations_product ON product_allocations(product_id);

CREATE TABLE stock_requests (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    requested_at TIMESTAMP NOT NULL DEFAULT now(),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'FULFILLED')),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE offers (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED')),
    discount_value NUMERIC(10, 2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    expires_at TIMESTAMP,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_offers_code ON offers(code);
CREATE INDEX idx_offers_approval ON offers(approval_status);

CREATE TABLE customers (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    total_bookings INTEGER NOT NULL DEFAULT 0,
    total_spent NUMERIC(12, 2) NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_branch ON customers(branch_id);

CREATE TABLE holidays (
    id UUID PRIMARY KEY,
    date DATE NOT NULL,
    reason VARCHAR(500) NOT NULL,
    closed_all_day BOOLEAN NOT NULL DEFAULT TRUE,
    open_time VARCHAR(10),
    close_time VARCHAR(10),
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_holidays_date ON holidays(date);

CREATE TABLE templates (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('MODERN', 'CLASSIC', 'LUXURY', 'INDUSTRIAL', 'MINIMALIST', 'PREMIUM')),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('ACTIVE', 'DRAFT', 'FEATURED', 'ARCHIVED')),
    description TEXT,
    image_url VARCHAR(1000),
    before_image_url VARCHAR(1000),
    after_image_url VARCHAR(1000),
    suitable_for VARCHAR(255),
    budget_min NUMERIC(12, 2) DEFAULT 0,
    budget_max NUMERIC(12, 2) DEFAULT 0,
    setup_days INTEGER DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 0,
    version VARCHAR(20) DEFAULT '1.0',
    created_by VARCHAR(255),
    favorite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE template_images (
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    image VARCHAR(1000) NOT NULL
);

CREATE TABLE template_theme_colors (
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    color VARCHAR(20) NOT NULL
);

CREATE TABLE template_furniture (
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    item VARCHAR(255) NOT NULL
);

CREATE TABLE template_tags (
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL
);

CREATE TABLE template_cost_items (
    id UUID PRIMARY KEY,
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL
);

CREATE TABLE template_assignments (
    id UUID PRIMARY KEY,
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('ASSIGNED', 'PENDING')),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE settings (
    id UUID PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL DEFAULT 'My Salon',
    phone VARCHAR(50),
    email VARCHAR(255),
    address VARCHAR(500),
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
    open_time VARCHAR(10) NOT NULL DEFAULT '09:00',
    close_time VARCHAR(10) NOT NULL DEFAULT '20:00',
    slot_duration_minutes INTEGER NOT NULL DEFAULT 30,
    max_bookings_per_slot INTEGER NOT NULL DEFAULT 5,
    allow_online_booking BOOLEAN NOT NULL DEFAULT TRUE,
    require_deposit_for_booking BOOLEAN NOT NULL DEFAULT FALSE,
    deposit_percentage INTEGER NOT NULL DEFAULT 20,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    booking_ref VARCHAR(30) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    service VARCHAR(255) NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    barber VARCHAR(255),
    barber_id UUID REFERENCES barbers(id) ON DELETE SET NULL,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    branch_name VARCHAR(255),
    date DATE NOT NULL,
    time VARCHAR(5) NOT NULL,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    deposit_required BOOLEAN NOT NULL DEFAULT FALSE,
    deposit_amount NUMERIC(10, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW')),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_bookings_branch_date ON bookings(branch_id, date);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
-- Prevents two active bookings for the same barber/branch/date/time slot at
-- the database level, not just in application code.
CREATE UNIQUE INDEX idx_bookings_no_double_book
    ON bookings(branch_id, barber_id, date, time)
    WHERE status IN ('PENDING', 'CONFIRMED') AND barber_id IS NOT NULL;

CREATE TABLE payments (
    id UUID PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL DEFAULT 'FULL' CHECK (type IN ('DEPOSIT', 'FULL')),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    method VARCHAR(20) NOT NULL DEFAULT 'CASH' CHECK (method IN ('CASH', 'CARD', 'UPI', 'WALLET', 'OTHER')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    transaction_ref VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_payments_booking ON payments(booking_id);
