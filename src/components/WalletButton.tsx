import { useWallet } from "@/lib/wallet";
import { shortAddress } from "@/config/assets";
import { cn } from "@/lib/utils";

export function WalletButton({ className }: { className?: string }) {
  const { address, connect, connecting, disconnect } = useWallet();

  if (address) {
    return (
      <button
        type="button"
        onClick={disconnect}
        title="Desconectar wallet"
        className={cn(
          "inline-flex items-center gap-2 rounded-full bg-violet px-4 py-2 text-sm font-medium text-violet-foreground transition hover:brightness-110",
          className,
        )}
      >
        <span className="size-2 rounded-full bg-lime" />
        <span className="font-mono">{shortAddress(address)}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={connect}
      disabled={connecting}
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-violet-foreground shadow-violet transition hover:brightness-110 disabled:opacity-60",
        className,
      )}
    >
      {connecting ? "Conectando…" : "Conectar wallet"}
    </button>
  );
}

export function NetworkNotice() {
  const { address, isTestnet, network, available, error } = useWallet();

  if (available === false) {
    return (
      <p className="rounded-2xl border border-violet/40 bg-violet/10 px-4 py-3 text-sm text-foreground">
        No detectamos la extensión Freighter. Instalala desde{" "}
        <a
          className="font-medium text-violet underline"
          href="https://www.freighter.app/"
          target="_blank"
          rel="noreferrer"
        >
          freighter.app
        </a>{" "}
        y volvé a intentar.
      </p>
    );
  }

  if (error) {
    return (
      <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
        {error}
      </p>
    );
  }

  if (address && !isTestnet) {
    return (
      <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
        Tu wallet está en la red <strong>{network ?? "desconocida"}</strong>. Esta demo funciona
        únicamente en <strong>Stellar Testnet</strong>: cambiá de red en Freighter para continuar.
      </p>
    );
  }

  return null;
}
