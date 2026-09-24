import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NetworkNotice, WalletButton } from "@/components/WalletButton";
import { useWallet } from "@/lib/wallet";
import { KYC_LABELS } from "@/lib/kyc";
import { horizon, loadDeRaizBalances, loadTransactions, type TokenBalance, type TxRecord } from "@/lib/stellar";
import { explorerAccount, explorerTx, shortAddress } from "@/config/assets";

export const Route = createFileRoute("/mi-cuenta")({
  head: () => ({
    meta: [
      { title: "Mi cuenta · DeRaíz" },
      {
        name: "description",
        content:
          "Estado de tu wallet, verificación de identidad, tokens de prueba DeRaíz y transacciones en Stellar Testnet.",
      },
      { property: "og:title", content: "Mi cuenta · DeRaíz" },
      {
        property: "og:description",
        content: "Wallet, verificación de identidad y tokens de prueba en testnet.",
      },
    ],
  }),
  component: MiCuenta,
});

const statusTone: Record<string, string> = {
  Approved: "bg-leaf text-leaf-foreground",
  Declined: "bg-destructive text-destructive-foreground",
  "In Progress": "bg-violet text-violet-foreground",
  "In Review": "bg-violet text-violet-foreground",
  "Not Started": "bg-muted text-muted-foreground",
  Abandoned: "bg-muted text-muted-foreground",
  Expired: "bg-muted text-muted-foreground",
};

function MiCuenta() {
  const { address, kycStatus, isTestnet } = useWallet();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [txs, setTxs] = useState<TxRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [xlm, setXlm] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setBalances([]);
      setTxs([]);
      setXlm(null);
      return;
    }
    horizon
      .loadAccount(address)
      .then((acc) => setXlm(acc.balances.find((b) => b.asset_type === "native")?.balance ?? "0"))
      .catch(() => setXlm(null));
    setLoading(true);
    setNotice(null);
    Promise.all([loadDeRaizBalances(address), loadTransactions(address)])
      .then(([b, t]) => {
        setBalances(b);
        setTxs(t);
      })
      .catch(() => setNotice("Esta wallet todavía no existe en Stellar Testnet o Horizon no respondió."))
      .finally(() => setLoading(false));
  }, [address]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl leading-tight text-foreground sm:text-5xl">Mi cuenta</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Todo lo que ves acá corresponde a Stellar Testnet y a tokens de prueba sin valor económico.
      </p>

      <div className="mt-8 space-y-3">
        <NetworkNotice />
      </div>

      {!address ? (
        <div className="mt-8 rounded-3xl bg-card p-8 shadow-soft">
          <h2 className="text-xl text-foreground">Conectá tu wallet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Necesitás Freighter en red Testnet para ver tu estado y tus tokens de prueba.
          </p>
          <div className="mt-5">
            <WalletButton />
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {(kycStatus === "Not Started" || (!loading && balances.length === 0)) && (
            <section className="flex flex-col items-start gap-4 rounded-3xl bg-card p-7 shadow-soft md:col-span-2 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                Elegí un proyecto para verificar tu identidad y reclamar tokens de prueba
              </p>
              <Link
                to="/proyectos"
                className="inline-flex shrink-0 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-forest-foreground transition hover:bg-forest-soft"
              >
                Explorar proyectos
              </Link>
            </section>
          )}
          <section className="rounded-3xl bg-card p-7 shadow-soft">
            <h2 className="text-xl text-foreground">Wallet</h2>
            <p className="mt-3 break-all font-mono text-sm text-violet">{address}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Red: {isTestnet ? "Stellar Testnet" : "fuera de testnet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Saldo XLM (testnet):{" "}
              <span className="font-mono text-foreground">{xlm ?? "—"}</span>
            </p>
            <a
              href={explorerAccount(address)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-full bg-violet px-4 py-2 text-sm text-violet-foreground"
            >
              Ver {shortAddress(address)} en el explorer
            </a>
          </section>

          <section className="rounded-3xl bg-card p-7 shadow-soft">
            <h2 className="text-xl text-foreground">Verificación de identidad</h2>
            <span
              className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm ${
                statusTone[kycStatus] ?? "bg-muted text-muted-foreground"
              }`}
            >
              {KYC_LABELS[kycStatus]}
            </span>
            <p className="mt-3 text-sm text-muted-foreground">
              La verificación con Didit ocurre fuera de la cadena. Solo con estado aprobado el emisor
              habilita tu wallet.
            </p>
          </section>

          <section className="rounded-3xl bg-card p-7 shadow-soft md:col-span-2">
            <h2 className="text-xl text-foreground">Tokens de prueba DeRaíz</h2>
            {loading && <p className="mt-3 text-sm text-muted-foreground">Leyendo Horizon…</p>}
            {notice && <p className="mt-3 text-sm text-muted-foreground">{notice}</p>}
            {!loading && !notice && balances.length === 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                Todavía no tenés tokens de trazabilidad de prueba en esta wallet.
              </p>
            )}
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {balances.map((b) => (
                <li
                  key={b.assetCode}
                  className="flex items-center justify-between rounded-2xl bg-muted px-5 py-4"
                >
                  <span className="rounded-full bg-violet px-3 py-1 font-mono text-xs text-violet-foreground">
                    {b.assetCode}
                  </span>
                  <span className="font-mono text-sm text-foreground">{b.balance}</span>
                  <span className={`text-xs ${b.authorized ? "text-leaf" : "text-muted-foreground"}`}>
                    {b.authorized ? "Habilitado" : "Sin habilitación"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl bg-card p-7 shadow-soft md:col-span-2">
            <h2 className="text-xl text-foreground">Historial de transacciones</h2>
            {!loading && txs.length === 0 && (
              <p className="mt-3 text-sm text-muted-foreground">Sin transacciones registradas.</p>
            )}
            <ul className="mt-4 divide-y divide-border">
              {txs.map((t) => (
                <li key={t.hash} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <a
                    href={explorerTx(t.hash)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-violet underline"
                  >
                    {t.hash.slice(0, 10)}…{t.hash.slice(-6)}
                  </a>
                  <span className="text-xs text-muted-foreground">
                    {new Date(t.createdAt).toLocaleString("es-AR", { hour12: false })} · {t.operationCount} op ·{" "}
                    {t.successful ? "confirmada" : "fallida"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
