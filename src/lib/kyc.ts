import { createKycSession, getKycStatusFn } from "@/lib/kyc.functions";

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

/** Crea la sesión en Didit y abre la verificación en una pestaña nueva. */
export async function startKyc(walletAddress: string): Promise<KycStatus> {
  const tab = typeof window !== "undefined" ? window.open("", "_blank") : null;
  try {
    const res = await createKycSession({ data: { walletAddress } });
    if (res.url) {
      if (tab) tab.location.href = res.url;
      else window.open(res.url, "_blank", "noopener");
    } else tab?.close();
    return res.status as KycStatus;
  } catch (e) {
    tab?.close();
    throw e;
  }
}
