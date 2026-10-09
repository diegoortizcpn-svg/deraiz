import { StrKey } from "@stellar/stellar-sdk";

export const ALL_STATUSES = [
  "Not Started",
  "In Progress",
  "In Review",
  "Approved",
  "Declined",
  "Abandoned",
  "Expired",
] as const;
export type ServerKycStatus = (typeof ALL_STATUSES)[number];

export function normalizeStatus(raw: unknown): ServerKycStatus | null {
  if (typeof raw !== "string") return null;
  const k = raw.trim().toLowerCase().replace(/[_\s-]+/g, " ");
  return ALL_STATUSES.find((s) => s.toLowerCase() === k) ?? null;
}

export function isValidWallet(addr: unknown): addr is string {
  return typeof addr === "string" && addr.startsWith("G") && StrKey.isValidEd25519PublicKey(addr);
}

export function buildOwnershipMessage(wallet: string, nonce: string, expiresUnix: number): string {
  return (
    "DeRaiz (testnet) - prueba de propiedad de wallet\n" +
    "Dominio: deraiz.lovable.app\n" +
    `Wallet: ${wallet}\n` +
    `Codigo: ${nonce}\n` +
    `Vence (unix): ${Math.floor(expiresUnix)}\n` +
    "No es una transaccion y no tiene costo."
  );
}

export function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export async function fetchDiditDecision(sessionId: string): Promise<ServerKycStatus | null> {
  const key = process.env["DIDIT_API_KEY"];
  if (!key) return null;
  try {
    const res = await fetch(
      `https://verification.didit.me/v3/session/${encodeURIComponent(sessionId)}/decision/`,
      { headers: { "x-api-key": key } },
    );
    if (!res.ok) return null;
    const body = (await res.json()) as { status?: string };
    return normalizeStatus(body.status);
  } catch {
    return null;
  }
}
