import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { explorerAccount, explorerTx, ISSUER } from "@/config/assets";

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
    title: "1 · Prueba de propiedad y verificación de identidad",
    body: "El participante conecta su wallet y firma un mensaje con Freighter para probar que es suya (no es una transacción y no tiene costo). Después verifica su identidad con Didit: la validación de documentos, la prueba de vida y la comparación facial ocurren fuera de la cadena. Ningún dato personal se escribe en Stellar.",
    chain: false,
  },
  {
    title: "2 · Habilitación de la wallet",
    body: "Solo cuando el KYC queda aprobado, el emisor autoriza la trustline de la wallet para el activo del proyecto (operación SetTrustLineFlags). Sin esa habilitación, la wallet no puede mantener el token.",
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
    text: "La habilitación de una wallet se puede revocar en cualquier momento. Demostrado en testnet.",
  },
  {
    flag: "AUTH_CLAWBACK_ENABLED",
    text: "El emisor puede recuperar tokens ya entregados. Demostrado en testnet.",
  },
];

const evidence = [
  { label: "Trustline de MIEL (queda bloqueada)", hash: "c3a91febf6057c4f7ce4588de53e3a56e55ddd4adabc11006f402718d7117c23" },
  { label: "Habilitación y envío de 10 MIEL en una transacción", hash: "6461cb59767f9c14671541a2a169a7ed220556140c08d7cbf31c3800f84863ac" },
  { label: "Revocación de la habilitación", hash: "87ee6ea5818ae6c96223a4590c23625d90c797fe7ae7413420e49f5fec630f06" },
  { label: "Pago rechazado por la red (op_not_authorized)", hash: "992706f425d1063efb9662547075a10eb6e08e85d52f59050c1b73be4347cde4" },
  { label: "Clawback de 10 MIEL (saldo a 0)", hash: "82cd6ae0fcf9776fe023e0481fcce6d21b17fee5c78135bc099c0aa3c3d14cb6" },
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
              href={explorerAccount(ISSUER)}
              target="_blank"
              rel="noreferrer"
              className="text-violet underline"
            >
              cuenta del emisor en stellar.expert (testnet)
            </a>
            .
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-6 rounded-3xl bg-card p-8 shadow-soft">
          <h2 className="text-2xl text-foreground">Evidencia on-chain (activo MIEL)</h2>
          <ul className="mt-6 grid gap-3">
            {evidence.map((e) => (
              <li key={e.hash}>
                <a
                  href={explorerTx(e.hash)}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl bg-muted p-4 transition hover:bg-violet/10"
                >
                  <p className="text-sm text-foreground">{e.label}</p>
                  <p className="mt-1 break-all font-mono text-xs text-violet underline">{e.hash}</p>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Stellar Expert puede mostrar como quitados flags que la operación no tocó; el estado real se lee en Horizon.
          </p>
        </section>
      </Reveal>

      <div className="mt-12 flex justify-center">
        <Link
          to="/proyectos"
          className="inline-flex rounded-full bg-forest px-6 py-3 text-sm font-medium text-forest-foreground transition hover:bg-forest-soft"
        >
          Explorar proyectos
        </Link>
      </div>
    </div>
  );
}
