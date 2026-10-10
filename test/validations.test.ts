// Pruebas de las validaciones del servidor importadas de src/lib/kyc.server.ts.
import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { ALL_STATUSES, isValidWallet, normalizeStatus } from "../src/lib/kyc.server";

describe("normalizeStatus", () => {
  it("acepta las mayúsculas y separadores que puede enviar Didit", () => {
    expect(normalizeStatus("Approved")).toBe("Approved");
    expect(normalizeStatus("APPROVED")).toBe("Approved");
    expect(normalizeStatus("approved")).toBe("Approved");
    expect(normalizeStatus("  In Review  ")).toBe("In Review");
    expect(normalizeStatus("IN_REVIEW")).toBe("In Review");
    expect(normalizeStatus("in-progress")).toBe("In Progress");
    expect(normalizeStatus("Not Started")).toBe("Not Started");
  });

  it("devuelve null para estados desconocidos o valores que no son texto", () => {
    expect(normalizeStatus("Aprobado")).toBeNull();
    expect(normalizeStatus("")).toBeNull();
    expect(normalizeStatus(undefined)).toBeNull();
    expect(normalizeStatus(null)).toBeNull();
    expect(normalizeStatus(42)).toBeNull();
    expect(normalizeStatus({ status: "Approved" })).toBeNull();
  });

  it("reconoce exactamente los siete estados definidos", () => {
    expect([...ALL_STATUSES]).toEqual([
      "Not Started",
      "In Progress",
      "In Review",
      "Approved",
      "Declined",
      "Abandoned",
      "Expired",
    ]);
    for (const s of ALL_STATUSES) expect(normalizeStatus(s)).toBe(s);
  });

  it("solo 'Approved' coincide con la condición que usa el reclamo (status === 'Approved')", () => {
    const habilitados = ALL_STATUSES.filter((s) => normalizeStatus(s) === "Approved");
    expect(habilitados).toEqual(["Approved"]);
  });
});

describe("isValidWallet", () => {
  const kp = Keypair.random();

  it("acepta una clave pública Stellar válida", () => {
    expect(isValidWallet(kp.publicKey())).toBe(true);
  });

  it("rechaza una clave secreta", () => {
    expect(isValidWallet(kp.secret())).toBe(false);
  });

  it("rechaza una clave con el checksum alterado", () => {
    const pk = kp.publicKey();
    const last = pk.slice(-1) === "A" ? "B" : "A";
    expect(isValidWallet(pk.slice(0, -1) + last)).toBe(false);
  });

  it("rechaza texto vacío, truncado o con espacios", () => {
    expect(isValidWallet("")).toBe(false);
    expect(isValidWallet(kp.publicKey().slice(0, 40))).toBe(false);
    expect(isValidWallet(` ${kp.publicKey()}`)).toBe(false);
  });

  it("rechaza valores que no son texto", () => {
    expect(isValidWallet(undefined)).toBe(false);
    expect(isValidWallet(null)).toBe(false);
    expect(isValidWallet(123)).toBe(false);
    expect(isValidWallet({})).toBe(false);
  });
});
