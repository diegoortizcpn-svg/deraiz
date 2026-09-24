import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { admin, normalizeStatus } from "@/lib/kyc.server";

function canonical(v: unknown): string {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canonical).join(",")}]`;
  const o = v as Record<string, unknown>;
  return `{${Object.keys(o)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${canonical(o[k])}`)
    .join(",")}}`;
}

function safeEq(a: string, b: string | null): boolean {
  if (!b) return false;
  const x = Buffer.from(a);
  const y = Buffer.from(b.trim().toLowerCase());
  return x.length === y.length && timingSafeEqual(x, y);
}

const hmac = (secret: string, msg: string) => createHmac("sha256", secret).update(msg, "utf8").digest("hex");

export const Route = createFileRoute("/api/public/didit-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const secret = process.env["DIDIT_WEBHOOK_SECRET"];
        if (!secret) return new Response("Not configured", { status: 503 });

        const ts = Number(request.headers.get("x-timestamp"));
        if (!ts || Math.abs(Date.now() / 1000 - ts) > 300) {
          return new Response("Stale", { status: 401 });
        }

        let payload: Record<string, unknown>;
        try {
          payload = JSON.parse(raw);
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }
        const inner = (payload["data"] && typeof payload["data"] === "object" ? payload["data"] : {}) as Record<
          string,
          unknown
        >;
        const pick = (k: string) => (payload[k] ?? inner[k]) as string | undefined;
        const sessionId = pick("session_id");
        const rawStatus = pick("status");
        const vendor = pick("vendor_data");
        const webhookType = pick("webhook_type") ?? "";

        const ok =
          safeEq(hmac(secret, canonical(payload)), request.headers.get("x-signature-v2")) ||
          safeEq(
            hmac(secret, `${request.headers.get("x-timestamp")}:${sessionId ?? ""}:${rawStatus ?? ""}:${webhookType}`),
            request.headers.get("x-signature-simple"),
          ) ||
          safeEq(hmac(secret, raw), request.headers.get("x-signature"));
        if (!ok) return new Response("Invalid signature", { status: 401 });

        const status = normalizeStatus(rawStatus);
        if (!sessionId || !status) return new Response("ok");

        const db = await admin();
        const { data: updated } = await db
          .from("kyc_verifications")
          .update({ status })
          .eq("didit_session_id", sessionId)
          .select("id");
        if ((!updated || updated.length === 0) && typeof vendor === "string" && vendor.startsWith("G")) {
          await db
            .from("kyc_verifications")
            .upsert({ wallet_address: vendor, didit_session_id: sessionId, status }, { onConflict: "wallet_address" });
        }
        return new Response("ok");
      },
    },
  },
});
