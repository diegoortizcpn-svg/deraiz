import { supabase } from "@/integrations/supabase/client";

// Estados internos exactos (se muestran traducidos en la interfaz).
export type KycStatus = "Not Started" | "In Progress" | "Approved" | "Declined" | "In Review";

export const KYC_LABELS: Record<KycStatus, string> = {
  "Not Started": "No iniciado",
  "In Progress": "En proceso",
  Approved: "Aprobado",
  Declined: "Rechazado",
  "In Review": "En revisión",
};

export async function getKycStatus(walletAddress: string): Promise<KycStatus> {
  const { data } = await supabase
    .from("kyc_verifications")
    .select("status")
    .eq("wallet_address", walletAddress)
    .maybeSingle();
  return (data?.status as KycStatus) ?? "Not Started";
}

/**
 * Placeholder: la verificación real con Didit se conecta más adelante.
 * Por ahora registra la wallet con estado "In Progress".
 */
export async function startKyc(walletAddress: string): Promise<KycStatus> {
  const { data } = await supabase
    .from("kyc_verifications")
    .upsert(
      { wallet_address: walletAddress, status: "In Progress" },
      { onConflict: "wallet_address" },
    )
    .select("status")
    .maybeSingle();
  return (data?.status as KycStatus) ?? "In Progress";
}
