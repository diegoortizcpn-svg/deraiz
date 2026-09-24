import type { AssetCode } from "@/config/assets";
import { claimTokensFn, getClaimsFn } from "./claim.functions";

export type ClaimResult = {
  ok: boolean;
  message: string;
  txHash?: string | null;
};

/** El emisor firma y envía los tokens de prueba desde el backend. */
export async function claimTokens(walletAddress: string, assetCode: AssetCode): Promise<ClaimResult> {
  try {
    return await claimTokensFn({ data: { walletAddress, assetCode } });
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "No se pudo reclamar." };
  }
}

export async function getClaims(walletAddress: string) {
  return getClaimsFn({ data: { walletAddress } });
}
