DROP POLICY IF EXISTS "Demo: cualquiera puede ver reclamos" ON public.token_claims;
REVOKE SELECT ON public.token_claims FROM anon;
REVOKE SELECT ON public.token_claims FROM authenticated;