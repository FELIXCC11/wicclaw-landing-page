CREATE TABLE IF NOT EXISTS shop_accounts (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS shop_sessions (
  token_hash text PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES shop_accounts(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS shop_sessions_expiry ON shop_sessions(expires_at);
CREATE TABLE IF NOT EXISTS shop_preview_orders (
  id uuid PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES shop_accounts(id) ON DELETE CASCADE,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS shop_preview_orders_account ON shop_preview_orders(account_id);
