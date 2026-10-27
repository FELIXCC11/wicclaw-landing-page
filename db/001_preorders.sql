CREATE TABLE IF NOT EXISTS preorder_customers (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text,
  phone text,
  stripe_customer_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS preorders (
  id uuid PRIMARY KEY,
  customer_id uuid REFERENCES preorder_customers(id),
  sku text NOT NULL,
  product_name text NOT NULL,
  payment_option text NOT NULL CHECK (payment_option IN ('reserve', 'full')),
  currency text NOT NULL DEFAULT 'usd',
  hardware_price_cents integer,
  amount_due_cents integer NOT NULL,
  amount_paid_cents integer NOT NULL DEFAULT 0,
  amount_refunded_cents integer NOT NULL DEFAULT 0,
  hardware_balance_cents integer,
  tax_cents integer NOT NULL DEFAULT 0,
  shipping_cents integer NOT NULL DEFAULT 0,
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text UNIQUE,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','processing','paid','failed','partially_refunded','refunded')),
  order_status text NOT NULL DEFAULT 'pending_payment' CHECK (order_status IN ('pending_payment','reserved','prepaid_preorder','payment_failed','canceled','refunded')),
  fulfillment_status text NOT NULL DEFAULT 'not_started' CHECK (fulfillment_status IN ('not_started','preparing','shipped','delivered')),
  shipping_name text,
  shipping_address jsonb,
  shipping_estimate text,
  terms_snapshot jsonb NOT NULL,
  confirmation_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS preorders_customer_id_idx ON preorders(customer_id);
CREATE INDEX IF NOT EXISTS preorders_created_at_idx ON preorders(created_at DESC);

CREATE TABLE IF NOT EXISTS preorder_stripe_events (
  stripe_event_id text PRIMARY KEY,
  event_type text NOT NULL,
  order_id uuid,
  processed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS preorder_refunds (
  stripe_event_id text PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES preorders(id),
  stripe_charge_id text NOT NULL,
  cumulative_refunded_cents integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS preorder_fulfillment_events (
  id bigserial PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES preorders(id),
  from_status text NOT NULL,
  to_status text NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS preorder_email_outbox (
  order_id uuid PRIMARY KEY REFERENCES preorders(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sending','sent')),
  provider_id text,
  last_error text,
  attempt_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
