import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type FreighterApi = {
  isConnected: () => Promise<{ isConnected?: boolean }>;
  isAllowed: () => Promise<{ isAllowed?: boolean }>;
  requestAccess: () => Promise<{ address?: string; error?: unknown }>;
  getAddress: () => Promise<{ address?: string }>;
  getNetwork: () => Promise<{ network?: string }>;
  signTransaction: (
    xdr: string,
    opts: { networkPassphrase: string; address: string },
  ) => Promise<{ signedTxXdr?: string; error?: unknown }>;
};

// La extensión solo existe en el navegador: se carga de forma diferida.
async function freighter(): Promise<FreighterApi> {
  const mod = (await import("@stellar/freighter-api")) as unknown as {
    default?: FreighterApi;
  } & FreighterApi;
  return mod.default ?? mod;
}
import { Networks } from "@stellar/stellar-sdk";
import { getKycStatus, type KycStatus } from "@/lib/kyc";

type WalletState = {
  address: string | null;
  network: string | null;
  isTestnet: boolean;
  connecting: boolean;
  available: boolean | null;
  error: string | null;
  kycStatus: KycStatus;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshKyc: () => Promise<void>;
  setKycStatus: (s: KycStatus) => void;
  sign: (xdr: string) => Promise<string>;
};

const WalletContext = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<KycStatus>("Not Started");

  const readNetwork = useCallback(async () => {
    const res = await (await freighter()).getNetwork();
    setNetwork(res.network ?? null);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await (await freighter()).isConnected();
        if (!active) return;
        setAvailable(Boolean(res.isConnected));
        if (!res.isConnected) return;
        const allowed = await (await freighter()).isAllowed();
        if (allowed.isAllowed) {
          const addr = await (await freighter()).getAddress();
          if (!active) return;
          if (addr.address) setAddress(addr.address);
          await readNetwork();
        }
      } catch {
        if (active) setAvailable(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [readNetwork]);

  useEffect(() => {
    if (!address) {
      setKycStatus("Not Started");
      return;
    }
    const load = () => getKycStatus(address).then(setKycStatus).catch(() => {});
    load();
    const onVis = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", onVis);
    };
  }, [address]);

  // Mientras la verificación esté en proceso, reconsultar cada 5 segundos.
  useEffect(() => {
    if (!address || (kycStatus !== "In Progress" && kycStatus !== "In Review")) return;
    const id = setInterval(() => {
      getKycStatus(address).then(setKycStatus).catch(() => {});
    }, 5000);
    return () => clearInterval(id);
  }, [address, kycStatus]);

  const connect = useCallback(async () => {
    setError(null);
    setConnecting(true);
    try {
      const check = await (await freighter()).isConnected();
      if (!check.isConnected) {
        setAvailable(false);
        setError("No encontramos la extensión Freighter en este navegador.");
        return;
      }
      setAvailable(true);
      const res = await (await freighter()).requestAccess();
      if (res.error || !res.address) {
        setError("No se pudo conectar la wallet.");
        return;
      }
      setAddress(res.address);
      await readNetwork();
    } catch {
      setError("No se pudo conectar la wallet.");
    } finally {
      setConnecting(false);
    }
  }, [readNetwork]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setKycStatus("Not Started");
  }, []);

  const refreshKyc = useCallback(async () => {
    if (!address) return;
    setKycStatus(await getKycStatus(address));
  }, [address]);

  const sign = useCallback(
    async (xdr: string) => {
      if (!address) throw new Error("Conectá tu wallet primero.");
      const res = await (await freighter()).signTransaction(xdr, {
        networkPassphrase: Networks.TESTNET,
        address,
      });
      if (res.error || !res.signedTxXdr) throw new Error("La firma fue cancelada.");
      return res.signedTxXdr;
    },
    [address],
  );

  const isTestnet = network ? network.toUpperCase().includes("TESTNET") : false;

  return (
    <WalletContext.Provider
      value={{
        address,
        network,
        isTestnet,
        connecting,
        available,
        error,
        kycStatus,
        connect,
        disconnect,
        refreshKyc,
        setKycStatus,
        sign,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet debe usarse dentro de WalletProvider");
  return ctx;
}
