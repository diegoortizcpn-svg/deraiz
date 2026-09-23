CREATE TABLE public.kyc_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  didit_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'Not Started',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.token_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  asset_code TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 10,
  tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (wallet_address, asset_code)
);

GRANT SELECT, INSERT, UPDATE ON public.kyc_verifications TO anon, authenticated;
GRANT ALL ON public.kyc_verifications TO service_role;
GRANT SELECT, INSERT ON public.token_claims TO anon, authenticated;
GRANT ALL ON public.token_claims TO service_role;

ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Demo: cualquiera puede ver verificaciones" ON public.kyc_verifications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Demo: cualquiera puede crear verificaciones" ON public.kyc_verifications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Demo: cualquiera puede actualizar verificaciones" ON public.kyc_verifications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Demo: cualquiera puede ver reclamos" ON public.token_claims FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Demo: cualquiera puede crear reclamos" ON public.token_claims FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_kyc_verifications_updated_at BEFORE UPDATE ON public.kyc_verifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();