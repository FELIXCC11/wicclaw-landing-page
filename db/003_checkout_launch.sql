-- Additive migration; run after 001 and 002, in one transaction.
ALTER TABLE preorders ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES shop_accounts(id);
ALTER TABLE preorders ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 1 CHECK (quantity BETWEEN 1 AND 10);
ALTER TABLE preorders ADD COLUMN IF NOT EXISTS checkout_request_id uuid;
ALTER TABLE preorders ADD COLUMN IF NOT EXISTS items_snapshot jsonb NOT NULL DEFAULT '[]'::jsonb;
CREATE UNIQUE INDEX IF NOT EXISTS preorders_checkout_request ON preorders(account_id, checkout_request_id);
CREATE INDEX IF NOT EXISTS preorders_account ON preorders(account_id);
ALTER TABLE preorder_email_outbox ADD COLUMN IF NOT EXISTS first_attempt_at timestamptz;
CREATE TABLE IF NOT EXISTS preorder_notifications (
  id text PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES preorders(id),
  kind text NOT NULL CHECK (kind IN ('payment_failed','refund','preparing','shipped','delivered')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sending','sent')),
  attempt_count integer NOT NULL DEFAULT 0,
  provider_id text,
  first_attempt_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
