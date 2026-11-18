-- Never86 tenant data lake — first real tenant onboarding.
-- Tenant: Kristin Aduna (ktmaduna@gmail.com), operator_id 'kristin-grill'
-- Venue: The New American Grill (fixtures/portals/grill).
--
-- Run against Neon Postgres:
--   psql "$DATABASE_URL" -f services/tenant-data-lake/migrations/0001_kristin_grill.sql
--
-- Every tenant gets its own Postgres schema (`tenant_<operator_id with dashes -> underscores>`)
-- so tenants never share tables or accidentally cross-query each other's data. Every row also
-- carries operator_id, source_email, source_file_name, and imported_at so the origin of every
-- number in the lake is traceable back to the Gmail thread + attachment it came from.

CREATE SCHEMA IF NOT EXISTS tenant_kristin_grill;

-- source_files: one row per attachment we've ingested. daily_sales / labor_hours / menu_items /
-- vendors / invoices all reference this table so every parsed row can be traced back to the
-- exact email + file it came from.
CREATE TABLE IF NOT EXISTS tenant_kristin_grill.source_files (
  id BIGSERIAL PRIMARY KEY,
  operator_id TEXT NOT NULL DEFAULT 'kristin-grill',
  source_email TEXT NOT NULL,
  email_subject TEXT,
  email_date DATE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  sheet_name TEXT,
  row_count INTEGER,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  UNIQUE (operator_id, source_email, file_name, sheet_name)
);

CREATE TABLE IF NOT EXISTS tenant_kristin_grill.daily_sales (
  id BIGSERIAL PRIMARY KEY,
  operator_id TEXT NOT NULL DEFAULT 'kristin-grill',
  business_date DATE NOT NULL,
  net_sales NUMERIC(12, 2),
  gross_sales NUMERIC(12, 2),
  tax NUMERIC(12, 2),
  tips NUMERIC(12, 2),
  discounts NUMERIC(12, 2),
  refunds NUMERIC(12, 2),
  guest_count NUMERIC(10, 2),
  check_count NUMERIC(10, 2),
  source_file_id BIGINT REFERENCES tenant_kristin_grill.source_files (id),
  source_email TEXT NOT NULL,
  file_name TEXT NOT NULL,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tenant_kristin_grill.labor_hours (
  id BIGSERIAL PRIMARY KEY,
  operator_id TEXT NOT NULL DEFAULT 'kristin-grill',
  business_date DATE,
  employee_name TEXT NOT NULL,
  job_title TEXT,
  in_at TIMESTAMPTZ,
  out_at TIMESTAMPTZ,
  regular_hours NUMERIC(8, 2),
  overtime_hours NUMERIC(8, 2),
  payable_hours NUMERIC(8, 2),
  labor_cost NUMERIC(12, 2),
  source_file_id BIGINT REFERENCES tenant_kristin_grill.source_files (id),
  source_email TEXT NOT NULL,
  file_name TEXT NOT NULL,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tenant_kristin_grill.menu_items (
  id BIGSERIAL PRIMARY KEY,
  operator_id TEXT NOT NULL DEFAULT 'kristin-grill',
  business_date DATE,
  menu_item TEXT NOT NULL,
  menu_group TEXT,
  menu_name TEXT,
  sales_category TEXT,
  qty_sold NUMERIC(10, 2),
  net_sales NUMERIC(12, 2),
  gross_sales NUMERIC(12, 2),
  voided BOOLEAN NOT NULL DEFAULT false,
  void_reason TEXT,
  source_file_id BIGINT REFERENCES tenant_kristin_grill.source_files (id),
  source_email TEXT NOT NULL,
  file_name TEXT NOT NULL,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tenant_kristin_grill.vendors (
  id BIGSERIAL PRIMARY KEY,
  operator_id TEXT NOT NULL DEFAULT 'kristin-grill',
  vendor_name TEXT NOT NULL,
  category TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  notes TEXT,
  source_file_id BIGINT REFERENCES tenant_kristin_grill.source_files (id),
  source_email TEXT,
  file_name TEXT,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (operator_id, vendor_name)
);

CREATE TABLE IF NOT EXISTS tenant_kristin_grill.invoices (
  id BIGSERIAL PRIMARY KEY,
  operator_id TEXT NOT NULL DEFAULT 'kristin-grill',
  vendor_id BIGINT REFERENCES tenant_kristin_grill.vendors (id),
  vendor_name TEXT,
  invoice_number TEXT,
  week_label TEXT,
  invoice_date DATE,
  due_date DATE,
  amount_total NUMERIC(12, 2),
  amount_paid NUMERIC(12, 2),
  status TEXT NOT NULL DEFAULT 'unpaid',
  line_items JSONB,
  source_file_id BIGINT REFERENCES tenant_kristin_grill.source_files (id),
  source_email TEXT NOT NULL,
  file_name TEXT NOT NULL,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kg_daily_sales_date
  ON tenant_kristin_grill.daily_sales (business_date);
CREATE INDEX IF NOT EXISTS idx_kg_labor_hours_date
  ON tenant_kristin_grill.labor_hours (business_date);
CREATE INDEX IF NOT EXISTS idx_kg_labor_hours_employee
  ON tenant_kristin_grill.labor_hours (employee_name);
CREATE INDEX IF NOT EXISTS idx_kg_menu_items_date
  ON tenant_kristin_grill.menu_items (business_date);
CREATE INDEX IF NOT EXISTS idx_kg_menu_items_item
  ON tenant_kristin_grill.menu_items (menu_item);
CREATE INDEX IF NOT EXISTS idx_kg_invoices_vendor
  ON tenant_kristin_grill.invoices (vendor_id);
CREATE INDEX IF NOT EXISTS idx_kg_invoices_week_label
  ON tenant_kristin_grill.invoices (week_label);
