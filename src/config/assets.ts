// Configuración de activos de PRUEBA en Stellar TESTNET.
// No hay claves secretas aquí ni en ninguna parte del frontend.

export const NETWORK = "TESTNET" as const;
export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const EXPLORER_URL = "https://stellar.expert/explorer/testnet";

// Emisor único de los 4 activos de trazabilidad (cuenta de testnet con AUTH_REQUIRED, AUTH_REVOCABLE y AUTH_CLAWBACK_ENABLED).
export const ISSUER = "GAWC4ZMA4MGJF3TM5LW5BWPPQWL4JTFNXLPUGPLSWIV6UE3L4X7HSR6X";

export const ASSET_CODES = ["FRAMB", "HONGO", "PISTA", "MIEL"] as const;
export type AssetCode = (typeof ASSET_CODES)[number];

export const CLAIM_AMOUNT = 10;

export const isIssuerConfigured = () =>
  /^G[A-Z2-7]{55}$/.test(ISSUER);

export const explorerTx = (hash: string) => `${EXPLORER_URL}/tx/${hash}`;
export const explorerAccount = (address: string) => `${EXPLORER_URL}/account/${address}`;
export const explorerAsset = (code: string) => `${EXPLORER_URL}/asset/${code}-${ISSUER}`;

export const shortAddress = (address?: string | null, size = 4) =>
  address ? `${address.slice(0, size + 1)}…${address.slice(-size)}` : "";
