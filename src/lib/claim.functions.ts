import { createServerFn } from "@tanstack/react-start";
import { Keypair } from "@stellar/stellar-sdk";
import { admin, base64ToBytes, buildOwnershipMessage, isValidWallet } from "./kyc.server";

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
    const { walletAddress, assetCode, nonce, signature } = (d ?? {}) as Record<string, unknown>;
    if (!isValidWallet(walletAddress)) throw new Error("Dirección de wallet inválida.");
    if (typeof assetCode !== "string" || !(CODES as readonly string[]).includes(assetCode))
      throw new Error("Activo inválido.");
    if (typeof nonce !== "string" || !/^[0-9a-f]{64}$/.test(nonce)) throw new Error("Código inválido.");
    if (typeof signature !== "string" || signature.length === 0 || signature.length > 200)
      throw new Error("Firma inválida");
    return { walletAddress, assetCode, nonce, signature };
  })
  .handler(async ({ data }) => {
    const db = await admin();

    // Prueba de propiedad de la wallet
    const { data: ch } = await db
      .from("wallet_challenges")
      .select("id, nonce, expires_at, used_at")
      .eq("wallet_address", data.walletAddress)
      .eq("nonce", data.nonce)
      .maybeSingle();
    if (!ch || ch.used_at !== null || new Date(ch.expires_at).getTime() <= Date.now())
      throw new Error("El código de firma venció o no es válido. Intentá de nuevo.");
    const expiresUnix = Math.floor(new Date(ch.expires_at).getTime() / 1000);
    const message = buildOwnershipMessage(data.walletAddress, ch.nonce, expiresUnix);
    let valid = false;
    try {
      valid = Keypair.fromPublicKey(data.walletAddress).verifyMessage(message, base64ToBytes(data.signature));
    } catch {
      valid = false;
    }
    if (!valid) throw new Error("Firma inválida");
    const { data: used } = await db
      .from("wallet_challenges")
      .update({ used_at: new Date().toISOString() })
      .eq("id", ch.id)
      .is("used_at", null)
      .select("id");
    if (!used || used.length === 0) throw new Error("El código de firma ya fue usado.");

    const { runClaim } = await import("./claim.server");
    return runClaim(data.walletAddress, data.assetCode);
  });
