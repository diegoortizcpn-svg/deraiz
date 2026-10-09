import { createServerFn } from "@tanstack/react-start";
import { Keypair } from "@stellar/stellar-sdk";
import {
  admin,
  base64ToBytes,
  buildOwnershipMessage,
  fetchDiditDecision,
  isValidWallet,
  normalizeStatus,
} from "./kyc.server";

const walletInput = (d: unknown) => {
  const w = (d as { walletAddress?: unknown })?.walletAddress;
  if (!isValidWallet(w)) throw new Error("Dirección de wallet inválida.");
  return { walletAddress: w };
};

export const createWalletChallenge = createServerFn({ method: "POST" })
  .inputValidator(walletInput)
  .handler(async ({ data }) => {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const nonce = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    const expiresUnix = Math.floor(Date.now() / 1000) + 300;
    const db = await admin();
    const { error } = await db.from("wallet_challenges").insert({
      wallet_address: data.walletAddress,
      nonce,
      expires_at: new Date(expiresUnix * 1000).toISOString(),
    });
    if (error) {
      console.error("challenge insert error", error.code);
      throw new Error("No se pudo preparar la firma.");
    }
    return { nonce, message: buildOwnershipMessage(data.walletAddress, nonce, expiresUnix) };
  });

const sessionInput = (d: unknown) => {
  const { walletAddress, nonce, signature } = (d ?? {}) as Record<string, unknown>;
  if (!isValidWallet(walletAddress)) throw new Error("Dirección de wallet inválida.");
  if (typeof nonce !== "string" || !/^[0-9a-f]{64}$/.test(nonce)) throw new Error("Código inválido.");
  if (typeof signature !== "string" || signature.length === 0 || signature.length > 200)
    throw new Error("Firma inválida");
  return { walletAddress, nonce, signature };
};

export const createKycSession = createServerFn({ method: "POST" })
  .inputValidator(sessionInput)
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
      valid = Keypair.fromPublicKey(data.walletAddress).verifyMessage(message, base64ToBytes(data.signature) as never);
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

    const { data: row } = await db
      .from("kyc_verifications")
      .select("status")
      .eq("wallet_address", data.walletAddress)
      .maybeSingle();
    if (row?.status === "Approved") return { url: null as string | null, status: "Approved" };

    const apiKey = process.env["DIDIT_API_KEY"];
    const workflowId = process.env["DIDIT_WORKFLOW_ID"];
    if (!apiKey || !workflowId) throw new Error("La verificación todavía no está configurada.");

    const res = await fetch("https://verification.didit.me/v3/session/", {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        workflow_id: workflowId,
        vendor_data: data.walletAddress,
        callback: "https://deraiz.lovable.app/mi-cuenta",
      }),
    });
    if (!res.ok) {
      console.error("Didit session error", res.status, await res.text());
      throw new Error("No se pudo iniciar la verificación.");
    }
    const body = (await res.json()) as { session_id?: string; url?: string };
    if (!body.session_id || !body.url) throw new Error("Respuesta inesperada del proveedor.");

    const { error } = await db.from("kyc_verifications").upsert(
      { wallet_address: data.walletAddress, didit_session_id: body.session_id, status: "Not Started" },
      { onConflict: "wallet_address" },
    );
    if (error) {
      console.error(error);
      throw new Error("No se pudo guardar la verificación.");
    }
    return { url: body.url as string | null, status: "Not Started" };
  });

export const getKycStatusFn = createServerFn({ method: "POST" })
  .inputValidator(walletInput)
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: row } = await db
      .from("kyc_verifications")
      .select("status, didit_session_id")
      .eq("wallet_address", data.walletAddress)
      .maybeSingle();
    if (!row) return { status: "Not Started" };
    let status = normalizeStatus(row.status) ?? "Not Started";
    if ((status === "In Progress" || status === "Not Started") && row.didit_session_id) {
      const real = await fetchDiditDecision(row.didit_session_id);
      if (real && real !== status) {
        await db
          .from("kyc_verifications")
          .update({ status: real })
          .eq("wallet_address", data.walletAddress);
        status = real;
      }
    }
    return { status };
  });
