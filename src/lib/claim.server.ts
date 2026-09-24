import { Asset, BASE_FEE, Horizon, Keypair, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { admin, fetchDiditDecision, normalizeStatus } from "./kyc.server";
import { CLAIM_AMOUNT, HORIZON_URL, ISSUER } from "@/config/assets";

type Result = { ok: boolean; message: string; txHash: string | null };
const fail = (message: string): Result => ({ ok: false, message, txHash: null });

export async function runClaim(wallet: string, code: string): Promise<Result> {
  const db = await admin();

  // 2. KYC verificado en el servidor
  const { data: kyc } = await db
    .from("kyc_verifications")
    .select("status, didit_session_id")
    .eq("wallet_address", wallet)
    .maybeSingle();
  let status = normalizeStatus(kyc?.status) ?? "Not Started";
  if ((status === "In Progress" || status === "Not Started") && kyc?.didit_session_id) {
    const real = await fetchDiditDecision(kyc.didit_session_id);
    if (real && real !== status) {
      await db.from("kyc_verifications").update({ status: real }).eq("wallet_address", wallet);
      status = real;
    }
  }
  if (status !== "Approved") return fail("Tu identidad todavía no está verificada.");

  // 3. Reclamo previo
  const { data: prev } = await db
    .from("token_claims")
    .select("id")
    .eq("wallet_address", wallet)
    .eq("asset_code", code)
    .maybeSingle();
  if (prev) return fail("Esta wallet ya reclamó los tokens de prueba de este proyecto.");

  // 4. Trustline
  const horizon = new Horizon.Server(HORIZON_URL);
  let authorized = false;
  try {
    const acc = await horizon.loadAccount(wallet);
    const line = acc.balances.find(
      (b) => "asset_code" in b && b.asset_code === code && "asset_issuer" in b && b.asset_issuer === ISSUER,
    ) as Horizon.HorizonApi.BalanceLineAsset | undefined;
    if (!line) return fail("Primero creá la trustline.");
    authorized = line.is_authorized === true;
  } catch {
    return fail("Primero creá la trustline.");
  }

  // 5. Reserva
  const { data: reserved, error: resErr } = await db
    .from("token_claims")
    .insert({ wallet_address: wallet, asset_code: code, amount: CLAIM_AMOUNT, tx_hash: null })
    .select("id")
    .single();
  if (resErr || !reserved) {
    if (resErr?.code === "23505") return fail("Esta wallet ya reclamó los tokens de prueba de este proyecto.");
    console.error("claim reserve error", resErr?.code);
    return fail("No se pudo registrar el reclamo de tokens de prueba.");
  }

  // 6-7. Transacción del emisor
  try {
    const secret = process.env["STELLAR_ISSUER_SECRET"];
    if (!secret) throw new Error("issuer secret missing");
    const kp = Keypair.fromSecret(secret);
    const issuerAcc = await horizon.loadAccount(kp.publicKey());
    const asset = new Asset(code, ISSUER);
    const b = new TransactionBuilder(issuerAcc, { fee: BASE_FEE, networkPassphrase: Networks.TESTNET });
    if (!authorized) {
      b.addOperation(Operation.setTrustLineFlags({ trustor: wallet, asset, flags: { authorized: true } }));
    }
    b.addOperation(Operation.payment({ destination: wallet, asset, amount: String(CLAIM_AMOUNT) }));
    const tx = b.setTimeout(180).build();
    tx.sign(kp);
    const res = await horizon.submitTransaction(tx);
    await db.from("token_claims").update({ tx_hash: res.hash }).eq("id", reserved.id);
    return { ok: true, message: `¡Listo! Recibiste ${CLAIM_AMOUNT} ${code} de prueba`, txHash: res.hash };
  } catch (e) {
    const codes = (e as { response?: { data?: { extras?: { result_codes?: unknown } } } })?.response?.data
      ?.extras?.result_codes;
    console.error("claim submit failed", codes ? JSON.stringify(codes) : (e as Error)?.message);
    await db.from("token_claims").delete().eq("id", reserved.id);
    return fail("No se pudo enviar los tokens de prueba. Intentá de nuevo en unos minutos.");
  }
}
