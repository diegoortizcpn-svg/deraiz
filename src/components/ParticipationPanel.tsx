import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWallet } from "@/lib/wallet";
import { KYC_LABELS, startKyc } from "@/lib/kyc";
import { buildTrustlineXdr, hasTrustline, submitSignedXdr } from "@/lib/stellar";
import { claimTokens, getClaims } from "@/lib/claim";
import { CLAIM_AMOUNT, explorerTx, shortAddress } from "@/config/assets";
import { NetworkNotice, WalletButton } from "@/components/WalletButton";
import type { Project } from "@/data/projects";

type StepProps = {
  n: number;
  title: string;
  done: boolean;
  enabled: boolean;
  children: React.ReactNode;
};

function Step({ n, title, done, enabled, children }: StepProps) {
  return (
    <li className={enabled ? "" : "opacity-45"}>
      <div className="flex items-center gap-3">
        <span
          className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
            done
              ? "bg-leaf text-leaf-foreground"
              : enabled
                ? "bg-violet text-violet-foreground"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {done ? "✓" : n}
        </span>
        <p className="text-sm font-medium text-foreground">{title}</p>
      </div>
      <div className="mt-2 pl-10 text-sm text-muted-foreground">{children}</div>
    </li>
  );
}

export function ParticipationPanel({ project }: { project: Project }) {
  const { address, isTestnet, kycStatus, setKycStatus, sign } = useWallet();
  const [trustline, setTrustline] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setTrustline(false);
      setClaimed(false);
      return;
    }
    hasTrustline(address, project.assetCode).then(setTrustline).catch(() => setTrustline(false));
    getClaims(address)
      .then((claims) => setClaimed(claims.some((c) => c.asset_code === project.assetCode)))
      .catch(() => setClaimed(false));
  }, [address, project.assetCode]);

  const approved = kycStatus === "Approved";

  const handleKyc = async () => {
    if (!address) return;
    setBusy("kyc");
    try {
      const status = await startKyc(address);
      setKycStatus(status);
      toast.info(
        "Verificación iniciada con Didit (demo). El estado queda en proceso hasta que el proveedor responda.",
      );
    } catch {
      toast.error("No se pudo iniciar la verificación.");
    } finally {
      setBusy(null);
    }
  };

  const handleTrustline = async () => {
    if (!address) return;
    setBusy("trustline");
    try {
      const xdr = await buildTrustlineXdr(address, project.assetCode);
      const signed = await sign(xdr);
      const hash = await submitSignedXdr(signed);
      setTxHash(hash);
      setTrustline(true);
      toast.success("Trustline creada en testnet.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo crear la trustline.");
    } finally {
      setBusy(null);
    }
  };

  const handleClaim = async () => {
    if (!address) return;
    setBusy("claim");
    try {
      const res = await claimTokens(address, project.assetCode);
      if (res.ok) {
        setClaimed(true);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <aside className="rounded-3xl bg-card p-6 shadow-soft">
      <h2 className="text-xl text-foreground">Participar en la demo</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Cada paso se habilita solo cuando el anterior está completo.
      </p>

      <div className="mt-4 space-y-3">
        <NetworkNotice />
      </div>

      <ol className="mt-6 space-y-5">
        <Step n={1} title="Conectar wallet" done={Boolean(address)} enabled>
          {address ? (
            <p className="font-mono text-violet">{shortAddress(address, 6)}</p>
          ) : (
            <WalletButton />
          )}
        </Step>

        <Step n={2} title="Verificar identidad" done={approved} enabled={Boolean(address)}>
          <p>
            Estado: <strong className="text-foreground">{KYC_LABELS[kycStatus]}</strong>
          </p>
          {address && !approved && (
            <button
              type="button"
              onClick={handleKyc}
              disabled={busy === "kyc"}
              className="mt-2 rounded-full bg-violet px-4 py-2 text-sm font-medium text-violet-foreground transition hover:brightness-110 disabled:opacity-60"
            >
              {busy === "kyc" ? "Iniciando…" : "Verificar identidad"}
            </button>
          )}
        </Step>

        <Step n={3} title="Crear trustline" done={trustline} enabled={Boolean(address) && approved}>
          <p>
            Autorizás a tu wallet a mantener el activo{" "}
            <span className="font-mono text-violet">{project.assetCode}</span>.
          </p>
          {address && approved && !trustline && (
            <button
              type="button"
              onClick={handleTrustline}
              disabled={busy === "trustline" || !isTestnet}
              className="mt-2 rounded-full bg-violet px-4 py-2 text-sm font-medium text-violet-foreground transition hover:brightness-110 disabled:opacity-60"
            >
              {busy === "trustline" ? "Firmando…" : "Crear trustline"}
            </button>
          )}
          {txHash && (
            <a
              href={explorerTx(txHash)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block break-all font-mono text-xs text-violet underline"
            >
              {txHash}
            </a>
          )}
        </Step>

        <Step
          n={4}
          title={`Reclamar ${CLAIM_AMOUNT} tokens de prueba`}
          done={claimed}
          enabled={Boolean(address) && approved && trustline}
        >
          <p>Gratis, una sola vez por wallet y por proyecto. Los tokens no se compran.</p>
          {address && approved && trustline && !claimed && (
            <button
              type="button"
              onClick={handleClaim}
              disabled={busy === "claim"}
              className="mt-2 rounded-full bg-lime px-4 py-2 text-sm font-medium text-lime-foreground transition hover:brightness-105 disabled:opacity-60"
            >
              {busy === "claim" ? "Reclamando…" : `Reclamar ${CLAIM_AMOUNT} tokens de prueba`}
            </button>
          )}
          {claimed && <p className="mt-2 text-leaf">Tokens de prueba ya reclamados.</p>}
        </Step>
      </ol>
    </aside>
  );
}
