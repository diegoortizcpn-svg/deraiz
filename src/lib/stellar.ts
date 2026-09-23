import { Asset, BASE_FEE, Horizon, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { ASSET_CODES, HORIZON_URL, ISSUER, isIssuerConfigured } from "@/config/assets";

export const horizon = new Horizon.Server(HORIZON_URL);

export type TokenBalance = { assetCode: string; balance: string; authorized: boolean };

export async function loadDeRaizBalances(address: string): Promise<TokenBalance[]> {
  const account = await horizon.loadAccount(address);
  return account.balances
    .filter(
      (b): b is Horizon.HorizonApi.BalanceLineAsset =>
        "asset_code" in b && (ASSET_CODES as readonly string[]).includes(b.asset_code),
    )
    .map((b) => ({
      assetCode: b.asset_code,
      balance: b.balance,
      authorized: b.is_authorized !== false,
    }));
}

export type TxRecord = {
  hash: string;
  createdAt: string;
  successful: boolean;
  operationCount: number;
};

export async function loadTransactions(address: string, limit = 10): Promise<TxRecord[]> {
  const page = await horizon.transactions().forAccount(address).order("desc").limit(limit).call();
  return page.records.map((t) => ({
    hash: t.hash,
    createdAt: t.created_at,
    successful: t.successful,
    operationCount: t.operation_count,
  }));
}

/** Arma la operación changeTrust para el activo del proyecto y devuelve el XDR a firmar. */
export async function buildTrustlineXdr(address: string, assetCode: string): Promise<string> {
  if (!isIssuerConfigured()) {
    throw new Error(
      "El emisor de prueba todavía no está configurado (ISSUER pendiente en src/config/assets.ts).",
    );
  }
  const account = await horizon.loadAccount(address);
  const asset = new Asset(assetCode, ISSUER);
  return new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.changeTrust({ asset }))
    .setTimeout(120)
    .build()
    .toXDR();
}

export async function submitSignedXdr(signedXdr: string): Promise<string> {
  const tx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
  const res = await horizon.submitTransaction(tx);
  return res.hash;
}

export async function hasTrustline(address: string, assetCode: string): Promise<boolean> {
  try {
    const balances = await loadDeRaizBalances(address);
    return balances.some((b) => b.assetCode === assetCode);
  } catch {
    return false;
  }
}
