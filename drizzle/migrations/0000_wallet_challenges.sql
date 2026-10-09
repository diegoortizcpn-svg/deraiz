CREATE TABLE public.wallet_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  nonce text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON public.wallet_challenges FROM anon, authenticated;
GRANT ALL ON public.wallet_challenges TO service_role;
ALTER TABLE public.wallet_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verifications ADD COLUMN ownership_verified_at timestamptz;