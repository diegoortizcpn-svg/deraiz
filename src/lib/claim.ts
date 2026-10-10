import type { AssetCode } from "@/config/assets";
import { claimTokensFn, getClaimsFn } from "./claim.functions";
import { createWalletChallenge } from "./kyc.functions";
import { WalletSignError } from "./kyc";

export type ClaimResult = {
  ok: boolean;
  message: string;
  txHash?: string | null;
};

/** Prueba de propiedad de la wallet y luego el emisor envía los tokens de prueba desde el backend. */
export async function claimTokens(
  walletAddress: string,
  assetCode: AssetCode,
  signMessage: (message: string) => Promise<string>,
): Promise<ClaimResult> {
  let nonce: string;
  let message: string;
  try {
    ({ nonce, message } = await createWalletChallenge({ data: { walletAddress } }));
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "No se pudo reclamar." };
  }
  let signature: string;
  try {
    signature = await signMessage(message);
  } catch {
    throw new WalletSignError("No se pudo firmar con la wallet.");
  }
  try {
    return await claimTokensFn({ data: { walletAddress, assetCode, nonce, signature } });
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "No se pudo reclamar." };
  }
}

export async function getClaims(walletAddress: string) {
  return getClaimsFn({ data: { walletAddress } });
}
