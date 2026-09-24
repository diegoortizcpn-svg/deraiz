DROP POLICY IF EXISTS "Demo: cualquiera puede crear verificaciones" ON public.kyc_verifications;
DROP POLICY IF EXISTS "Demo: cualquiera puede actualizar verificaciones" ON public.kyc_verifications;
DROP POLICY IF EXISTS "Demo: cualquiera puede ver verificaciones" ON public.kyc_verifications;
DROP POLICY IF EXISTS "Demo: cualquiera puede crear reclamos" ON public.token_claims;
REVOKE ALL ON public.kyc_verifications FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.token_claims FROM anon, authenticated;
GRANT ALL ON public.kyc_verifications TO service_role;
GRANT ALL ON public.token_claims TO service_role;
CREATE UNIQUE INDEX IF NOT EXISTS kyc_verifications_session_idx ON public.kyc_verifications(didit_session_id) WHERE didit_session_id IS NOT NULL;