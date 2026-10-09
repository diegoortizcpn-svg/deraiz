import { createKycSession, createWalletChallenge, getKycStatusFn } from "@/lib/kyc.functions";

export type KycStatus =
  | "Not Started"
  | "In Progress"
  | "In Review"
  | "Approved"
  | "Declined"
  | "Abandoned"
  | "Expired";

export const KYC_LABELS: Record<KycStatus, string> = {
  "Not Started": "No iniciado",
  "In Progress": "En proceso",
  "In Review": "En revisión",
  Approved: "Aprobado",
  Declined: "Rechazado",
  Abandoned: "Abandonado",
  Expired: "Vencido",
};

export const RETRYABLE: KycStatus[] = ["Not Started", "Declined", "Abandoned", "Expired"];

export async function getKycStatus(walletAddress: string): Promise<KycStatus> {
  const res = await getKycStatusFn({ data: { walletAddress } });
  return (res.status as KycStatus) ?? "Not Started";
}

export class WalletSignError extends Error {}

/** Prueba de propiedad de la wallet y luego crea la sesión en Didit. No abre pestañas. */
export async function startKyc(
  walletAddress: string,
  signMessage: (message: string) => Promise<string>,
): Promise<{ status: KycStatus; url: string | null }> {
  const { nonce, message } = await createWalletChallenge({ data: { walletAddress } });
  let signature: string;
  try {
    signature = await signMessage(message);
  } catch {
    throw new WalletSignError("No se pudo firmar con la wallet.");
  }
  const res = await createKycSession({ data: { walletAddress, nonce, signature } });
  return { status: res.status as KycStatus, url: res.url };
}
