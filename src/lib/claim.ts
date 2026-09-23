import { supabase } from "@/integrations/supabase/client";
import { CLAIM_AMOUNT, type AssetCode } from "@/config/assets";

export type ClaimResult = {
  ok: boolean;
  message: string;
  txHash?: string | null;
};

/**
 * Placeholder: la emisión real desde el emisor se conecta más adelante
 * (el emisor firma en el backend, nunca en el frontend).
 * Registra el reclamo de 10 tokens de prueba: una sola vez por wallet y activo.
 */
export async function claimTokens(
  walletAddress: string,
  assetCode: AssetCode,
): Promise<ClaimResult> {
  const { data, error } = await supabase
    .from("token_claims")
    .insert({ wallet_address: walletAddress, asset_code: assetCode, amount: CLAIM_AMOUNT })
    .select("tx_hash")
    .maybeSingle();

  if (error) {
    if (error.code === "23505" || error.code === "23514" || error.code === "23000" || error.code === "23503") {
      return { ok: false, message: "No se pudo registrar el reclamo." };
    }
    if (error.code === "23505" || error.message.includes("duplicate")) {
      return { ok: false, message: "Esta wallet ya reclamó los tokens de prueba de este proyecto." };
    }
    return { ok: false, message: error.message };
  }

  return {
    ok: true,
    message: `Reclamo registrado: ${CLAIM_AMOUNT} ${assetCode} de prueba. La emisión on-chain se completa cuando el emisor esté activo.`,
    txHash: data?.tx_hash ?? null,
  };
}

export async function getClaims(walletAddress: string) {
  const { data } = await supabase
    .from("token_claims")
    .select("asset_code, amount, tx_hash, created_at")
    .eq("wallet_address", walletAddress);
  return data ?? [];
}
