import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { EXPLORER_URL } from "@/config/assets";

export const Route = createFileRoute("/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance on-chain · DeRaíz" },
      {
        name: "description",
        content:
          "Cómo funciona el flujo de verificación de identidad, habilitación de la wallet y emisión de tokens de prueba en Stellar Testnet.",
      },
      { property: "og:title", content: "Compliance on-chain · DeRaíz" },
      {
        property: "og:description",
        content:
          "KYC fuera de la cadena, habilitación de wallets por el emisor y controles nativos de Stellar.",
      },
    ],
  }),
  component: CompliancePage,
});

const flow = [
  {
    title: "1 · Verificación de identidad (Didit)",
    body: "El participante conecta su wallet e inicia la verificación con Didit. La validación de documentos y la prueba de vida ocurren fuera de la cadena: ningún dato personal se escribe en Stellar.",
    chain: false,
  },
  {
    title: "2 · Habilitación de la wallet",
    body: "Solo cuando el KYC queda aprobado, el emisor autoriza (allow trust) la wallet para el activo del proyecto. Sin esa habilitación, la wallet no puede mantener el token.",
    chain: true,
  },
  {
    title: "3 · Emisión de tokens de prueba",
    body: "Con la wallet habilitada y la trustline creada, el emisor envía los 10 tokens de trazabilidad de prueba. Cada movimiento queda registrado y es verificable en el explorer de testnet.",
    chain: true,
  },
];

const flags = [
  {
    flag: "AUTH_REQUIRED",
    text: "Nadie puede tener el token sin habilitación previa del emisor.",
  },
  {
    flag: "AUTH_REVOCABLE",
    text: "La habilitación de una wallet se puede revocar en cualquier momento.",
  },
  {
    flag: "CLAWBACK",
    text: "El emisor puede recuperar tokens ya entregados si corresponde.",
  },
];

function CompliancePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="max-w-3xl text-4xl leading-tight text-foreground sm:text-5xl">
        Compliance con <span className="text-violet">rieles on-chain</span>
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        La identidad se verifica fuera de la cadena; la habilitación y la trazabilidad viven en
        Stellar. Verde es el mundo real, violeta es la capa blockchain.
      </p>

      <div className="mt-12 grid gap-4">
        {flow.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div
              className={`rounded-3xl p-6 shadow-soft ${
                s.chain ? "bg-violet-soft text-violet-foreground" : "bg-card text-foreground"
              }`}
            >
              <p className="font-display text-lg">{s.title}</p>
              <p
                className={`mt-2 text-sm leading-relaxed ${
                  s.chain ? "text-violet-foreground/85" : "text-muted-foreground"
                }`}
              >
                {s.body}
              </p>
              <p
                className={`mt-3 text-xs uppercase tracking-wider ${
                  s.chain ? "text-lime" : "text-leaf"
                }`}
              >
                {s.chain ? "Capa on-chain" : "Fuera de la cadena"}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <section className="mt-14 rounded-3xl bg-card p-8 shadow-soft">
          <h2 className="text-2xl text-foreground">Controles activados en el emisor</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {flags.map((f) => (
              <li key={f.flag} className="rounded-2xl bg-muted p-5">
                <span className="rounded-full bg-violet px-3 py-1 font-mono text-xs text-violet-foreground">
                  {f.flag}
                </span>
                <p className="mt-3 text-sm text-muted-foreground">{f.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            El emisor habilita únicamente wallets con KYC aprobado. Podés auditar cada transacción en{" "}
            <a
              href={EXPLORER_URL}
              target="_blank"
              rel="noreferrer"
              className="text-violet underline"
            >
              stellar.expert (testnet)
            </a>
            .
          </p>
        </section>
      </Reveal>
    </div>
  );
}
