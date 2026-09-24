import { createServerFn } from "@tanstack/react-start";
import { admin, fetchDiditDecision, isValidWallet, normalizeStatus } from "./kyc.server";

const walletInput = (d: unknown) => {
  const w = (d as { walletAddress?: unknown })?.walletAddress;
  if (!isValidWallet(w)) throw new Error("Dirección de wallet inválida.");
  return { walletAddress: w };
};

export const createKycSession = createServerFn({ method: "POST" })
  .inputValidator(walletInput)
  .handler(async ({ data }) => {
    const db = await admin();
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
