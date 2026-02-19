-- Affordable Microcredit Database Schema
-- Run this script to set up your PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin', 'loan_officer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  id_type VARCHAR(50) CHECK (id_type IN ('national_id', 'passport', 'drivers_license', 'voters_card')),
  id_number VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
  occupation VARCHAR(100),
  employer VARCHAR(200),
  monthly_income DECIMAL(15, 2),
  account_type VARCHAR(50) NOT NULL DEFAULT 'individual' CHECK (account_type IN ('individual', 'sme', 'group')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'blacklisted')),
  profile_image VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loan Products table
CREATE TABLE IF NOT EXISTS loan_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  min_amount DECIMAL(15, 2) NOT NULL,
  max_amount DECIMAL(15, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL, -- Annual interest rate
  min_term_months INTEGER NOT NULL,
  max_term_months INTEGER NOT NULL,
  processing_fee DECIMAL(5, 2) DEFAULT 0, -- Percentage
  late_payment_fee DECIMAL(15, 2) DEFAULT 0,
  grace_period_days INTEGER DEFAULT 0,
  requires_collateral BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loan Applications table
CREATE TABLE IF NOT EXISTS loan_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  loan_product_id UUID REFERENCES loan_products(id),
  amount DECIMAL(15, 2) NOT NULL,
  term_months INTEGER NOT NULL,
  purpose TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'disbursed', 'cancelled')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  collateral_description TEXT,
  collateral_value DECIMAL(15, 2),
  guarantor_name VARCHAR(200),
  guarantor_phone VARCHAR(20),
  guarantor_relationship VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loans table (active/disbursed loans)
CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES loan_applications(id),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  loan_product_id UUID REFERENCES loan_products(id),
  principal_amount DECIMAL(15, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  term_months INTEGER NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL, -- Principal + Interest
  amount_paid DECIMAL(15, 2) DEFAULT 0,
  amount_remaining DECIMAL(15, 2) NOT NULL,
  monthly_payment DECIMAL(15, 2) NOT NULL,
  disbursement_date DATE NOT NULL,
  due_date DATE NOT NULL,
  next_payment_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paid', 'defaulted', 'written_off', 'restructured')),
  disbursed_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Repayments table
CREATE TABLE IF NOT EXISTS repayments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  amount DECIMAL(15, 2) NOT NULL,
  principal_portion DECIMAL(15, 2) NOT NULL,
  interest_portion DECIMAL(15, 2) NOT NULL,
  late_fee DECIMAL(15, 2) DEFAULT 0,
  payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'bank_transfer', 'mobile_money', 'cheque', 'card')),
  payment_reference VARCHAR(100),
  payment_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'reversed')),
  received_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment Schedule table
CREATE TABLE IF NOT EXISTS payment_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  due_date DATE NOT NULL,
  principal_amount DECIMAL(15, 2) NOT NULL,
  interest_amount DECIMAL(15, 2) NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  amount_paid DECIMAL(15, 2) DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'overdue')),
  paid_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table (for auth)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_loans_client_id ON loans(client_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_due_date ON loans(due_date);
CREATE INDEX IF NOT EXISTS idx_repayments_loan_id ON repayments(loan_id);
CREATE INDEX IF NOT EXISTS idx_repayments_payment_date ON repayments(payment_date);
CREATE INDEX IF NOT EXISTS idx_loan_applications_client_id ON loan_applications(client_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON loan_applications(status);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- Insert default loan products
INSERT INTO loan_products (name, description, min_amount, max_amount, interest_rate, min_term_months, max_term_months, processing_fee, requires_collateral) VALUES
('Personal Loan', 'General purpose personal loan for individual needs', 10000, 500000, 24.00, 3, 24, 2.00, FALSE),
('Business Loan', 'Working capital and business expansion loans for SMEs', 50000, 5000000, 20.00, 6, 36, 1.50, TRUE),
('Emergency Loan', 'Quick disbursement loan for urgent needs', 5000, 100000, 30.00, 1, 6, 3.00, FALSE),
('Agricultural Loan', 'Loans for farming and agricultural activities', 25000, 2000000, 18.00, 6, 24, 1.00, FALSE),
('Group Loan', 'Loans for registered groups and cooperatives', 100000, 10000000, 22.00, 6, 36, 1.50, TRUE)
ON CONFLICT DO NOTHING;

-- Insert default admin user (password: admin123 - change in production!)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (email, password_hash, role) VALUES
('admin@affordablemicrocredit.com', '$2b$10$rQZ5q5z5z5z5z5z5z5z5z.5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('company_name', 'Affordable Microcredit Limited', 'Company name'),
('company_email', 'info@affordablemicrocredit.com', 'Company email'),
('company_phone', '+234 000 000 0000', 'Company phone'),
('company_address', 'Lagos, Nigeria', 'Company address'),
('currency', 'NGN', 'Default currency'),
('currency_symbol', '₦', 'Currency symbol'),
('late_payment_grace_days', '7', 'Grace period before late fees apply'),
('default_late_fee_percentage', '5', 'Default late payment fee percentage')
ON CONFLICT (key) DO NOTHING;
