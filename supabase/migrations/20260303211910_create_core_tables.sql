/*
  # Create Core Tables for OldRoad Auto

  1. New Tables
    - `users` - User accounts with authentication and role management
      - `id` (text, primary key)
      - `email` (text, unique, not null)
      - `password` (text, not null)
      - `first_name` (text)
      - `last_name` (text)
      - `role` (text, not null)
      - `location` (text)
      - `created_at` (timestamptz)

    - `vehicles` - Vehicle inventory management
      - `id` (text, primary key)
      - `vin` (text)
      - `year` (int)
      - `make` (text)
      - `model` (text)
      - `trim` (text)
      - `price` (int)
      - `km` (int)
      - `fuel_type` (text)
      - `body_style` (text)
      - `status` (text)
      - `location` (text)
      - `images` (jsonb)
      - `features` (jsonb)
      - `accessories` (jsonb)
      - And many more fields for complete vehicle data

    - `messages` - Contact messages from customers
    - `invoices` - Customer invoices
    - `transactions` - Financial transactions
    - `bills` - Vendor bills
    - `entities` - Contact entities (vendors, customers, etc.)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
    - Admin users have full access
    - Sales users have read/write access to relevant data
    - Customers have limited access to their own data
*/

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  first_name text,
  last_name text,
  role text NOT NULL,
  location text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

CREATE POLICY "Admin users can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()::text
      AND users.role = 'ADMIN'
    )
  );

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
  id text PRIMARY KEY,
  vin text,
  year int,
  make text,
  model text,
  trim text,
  price int,
  km int,
  fuel_type text,
  body_style text,
  status text,
  location text,
  images jsonb DEFAULT '[]'::jsonb,
  description text,
  carfax_url text,
  features jsonb DEFAULT '{}'::jsonb,
  ready_to_sale_date text,
  post_date text,
  inventory_image text,
  contract_url text,
  discharge_url text,
  is_discharged boolean DEFAULT false,
  accessories jsonb DEFAULT '[]'::jsonb,
  transmission text,
  engine text,
  drivetrain text,
  sold_by_id text,
  sale_date text,
  buyer_name text,
  color text,
  ribbon text,
  is_carfax_one_owner boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vehicles"
  ON vehicles FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Staff can manage vehicles"
  ON vehicles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'SALES')
    )
  );

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id text PRIMARY KEY,
  full_name text,
  email text,
  subject text,
  message text,
  status text DEFAULT 'New',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view all messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'SALES')
    )
  );

CREATE POLICY "Staff can manage messages"
  ON messages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'SALES')
    )
  );

CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id text PRIMARY KEY,
  date text,
  due_date text,
  customer_id text,
  customer_name text,
  amount numeric,
  tax_amount numeric,
  status text,
  items jsonb DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'SALES')
    )
  );

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id text PRIMARY KEY,
  posting_date text,
  invoice_date text,
  system_entry_date text,
  type text,
  category text,
  amount numeric,
  tax_amount numeric,
  description text,
  location_id text,
  account_code text,
  period_id text,
  reference_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage transactions"
  ON transactions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'SALES')
    )
  );

-- Bills Table
CREATE TABLE IF NOT EXISTS bills (
  id text PRIMARY KEY,
  bill_number text,
  posting_date text,
  invoice_date text,
  system_entry_date text,
  due_date text,
  vendor_name text,
  vendor_type text,
  amount numeric,
  tax_amount numeric,
  status text,
  category text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage bills"
  ON bills FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'SALES')
    )
  );

-- Entities Table
CREATE TABLE IF NOT EXISTS entities (
  id text PRIMARY KEY,
  name text,
  category text,
  email text,
  phone text,
  address text,
  notes text,
  attachment_url text,
  attachment_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage entities"
  ON entities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()::text
      AND users.role IN ('ADMIN', 'SALES')
    )
  );