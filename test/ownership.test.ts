// Pruebas de la prueba de propiedad de la wallet (SEP-53).
// buildOwnershipMessage y base64ToBytes se importan del código real de la app.
// verifyOwnership replica las líneas de verificación de createKycSession y claimTokensFn
// (src/lib/kyc.functions.ts y src/lib/claim.functions.ts), porque esas funciones no se exportan.
import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { base64ToBytes, buildOwnershipMessage } from "../src/lib/kyc.server";

const NONCE = "a".repeat(64);
const EXPIRES = 1791650036;

function verifyOwnership(wallet: string, message: string, signatureB64: string): boolean {
  try {
    return Keypair.fromPublicKey(wallet).verifyMessage(message, base64ToBytes(signatureB64));
  } catch {
    return false;
  }
}

const sign = (kp: Keypair, message: string) => Buffer.from(kp.signMessage(message)).toString("base64");

describe("mensaje de propiedad", () => {
  const kp = Keypair.random();

  it("incluye dominio, wallet, código y vencimiento", () => {
    const m = buildOwnershipMessage(kp.publicKey(), NONCE, EXPIRES);
    expect(m).toContain("Dominio: deraiz.lovable.app");
    expect(m).toContain(`Wallet: ${kp.publicKey()}`);
    expect(m).toContain(`Codigo: ${NONCE}`);
    expect(m).toContain(`Vence (unix): ${EXPIRES}`);
    expect(m).toContain("No es una transaccion y no tiene costo.");
  });

  it("redondea hacia abajo un vencimiento con decimales", () => {
    const m = buildOwnershipMessage(kp.publicKey(), NONCE, EXPIRES + 0.9);
    expect(m).toContain(`Vence (unix): ${EXPIRES}`);
  });

  it("es determinista: mismos datos, mismo mensaje", () => {
    expect(buildOwnershipMessage(kp.publicKey(), NONCE, EXPIRES)).toBe(
      buildOwnershipMessage(kp.publicKey(), NONCE, EXPIRES),
    );
  });
});

describe("verificación de la firma SEP-53", () => {
  const kp = Keypair.random();
  const other = Keypair.random();
  const message = buildOwnershipMessage(kp.publicKey(), NONCE, EXPIRES);

  it("acepta la firma correcta de la wallet", () => {
    expect(verifyOwnership(kp.publicKey(), message, sign(kp, message))).toBe(true);
  });

  it("rechaza si el código (nonce) es otro", () => {
    const m2 = buildOwnershipMessage(kp.publicKey(), "b".repeat(64), EXPIRES);
    expect(verifyOwnership(kp.publicKey(), m2, sign(kp, message))).toBe(false);
  });

  it("rechaza si el vencimiento fue alterado", () => {
    const m2 = buildOwnershipMessage(kp.publicKey(), NONCE, EXPIRES + 3600);
    expect(verifyOwnership(kp.publicKey(), m2, sign(kp, message))).toBe(false);
  });

  it("rechaza la firma de otra wallet", () => {
    expect(verifyOwnership(kp.publicKey(), message, sign(other, message))).toBe(false);
  });

  it("rechaza un mensaje armado para otra wallet", () => {
    const m2 = buildOwnershipMessage(other.publicKey(), NONCE, EXPIRES);
    expect(verifyOwnership(kp.publicKey(), m2, sign(kp, message))).toBe(false);
  });

  it("rechaza una firma cruda sin el prefijo SEP-53", () => {
    const raw = Buffer.from(kp.sign(Buffer.from(message))).toString("base64");
    expect(verifyOwnership(kp.publicKey(), message, raw)).toBe(false);
  });

  it("rechaza basura: base64 inválido, firma vacía o bytes al azar", () => {
    expect(verifyOwnership(kp.publicKey(), message, "%%%no-es-base64%%%")).toBe(false);
    expect(verifyOwnership(kp.publicKey(), message, "")).toBe(false);
    expect(verifyOwnership(kp.publicKey(), message, Buffer.alloc(64, 7).toString("base64"))).toBe(false);
  });

  it("rechaza una dirección de wallet inválida sin lanzar error", () => {
    expect(verifyOwnership("GNO-ES-UNA-WALLET", message, sign(kp, message))).toBe(false);
  });
});
