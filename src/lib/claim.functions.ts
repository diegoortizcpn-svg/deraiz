import { createServerFn } from "@tanstack/react-start";
import { isValidWallet } from "./kyc.server";

const CODES = ["FRAMB", "HONGO", "PISTA", "MIEL"] as const;

export const getClaimsFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const w = (d as { walletAddress?: unknown })?.walletAddress;
    if (!isValidWallet(w)) throw new Error("Dirección de wallet inválida.");
    return { walletAddress: w };
  })
  .handler(async ({ data }) => {
    const { admin } = await import("./kyc.server");
    const db = await admin();
    const { data: rows } = await db
      .from("token_claims")
      .select("asset_code, amount, tx_hash, created_at")
      .eq("wallet_address", data.walletAddress);
    return rows ?? [];
  });

export const claimTokensFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const { walletAddress, assetCode } = (d ?? {}) as { walletAddress?: unknown; assetCode?: unknown };
    if (!isValidWallet(walletAddress)) throw new Error("Dirección de wallet inválida.");
    if (typeof assetCode !== "string" || !(CODES as readonly string[]).includes(assetCode))
      throw new Error("Activo inválido.");
    return { walletAddress, assetCode };
  })
  .handler(async ({ data }) => {
    const { runClaim } = await import("./claim.server");
    return runClaim(data.walletAddress, data.assetCode);
  });
