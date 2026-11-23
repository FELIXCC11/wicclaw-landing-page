CREATE TABLE IF NOT EXISTS prelaunch_waitlist (
  id uuid PRIMARY KEY,
  submission_type text NOT NULL DEFAULT 'waitlist' CHECK (submission_type='waitlist'),
  email text NOT NULL UNIQUE,
  form_data jsonb NOT NULL,
  consent boolean NOT NULL CHECK (consent),
  consent_version text NOT NULL DEFAULT 'prelaunch-2026-11',
  created_at timestamptz NOT NULL DEFAULT now(),
  email_status text NOT NULL DEFAULT 'not_configured' CHECK (email_status IN ('not_configured','pending','sending','accepted','failed')),
  email_provider_id text,
  email_attempt_at timestamptz,
  email_verified_at timestamptz
);
CREATE TABLE IF NOT EXISTS prelaunch_demo_requests (
  id uuid PRIMARY KEY,
  submission_type text NOT NULL DEFAULT 'demo' CHECK (submission_type='demo'),
  email text NOT NULL,
  form_data jsonb NOT NULL,
  dedupe_key text NOT NULL UNIQUE,
  consent boolean NOT NULL CHECK (consent),
  consent_version text NOT NULL DEFAULT 'prelaunch-2026-11',
  created_at timestamptz NOT NULL DEFAULT now(),
  email_status text NOT NULL DEFAULT 'not_configured' CHECK (email_status IN ('not_configured','pending','sending','accepted','failed')),
  email_provider_id text,
  email_attempt_at timestamptz,
  email_verified_at timestamptz
);
CREATE INDEX IF NOT EXISTS prelaunch_demo_email ON prelaunch_demo_requests(email);
CREATE TABLE IF NOT EXISTS prelaunch_rate_limits (
  key text PRIMARY KEY,
  hits integer NOT NULL DEFAULT 1,
  expires_at timestamptz NOT NULL
);
