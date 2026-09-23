import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { RootsNetwork } from "@/components/RootsNetwork";
import { ProjectCard } from "@/components/ProjectCard";
import { WalletButton } from "@/components/WalletButton";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DeRaíz · Trazabilidad del agro desde la raíz" },
      {
        name: "description",
        content:
          "Demo en Stellar Testnet: producción agrícola de Latinoamérica con identidad verificada, habilitación de wallets y tokens de trazabilidad de prueba.",
      },
      { property: "og:title", content: "DeRaíz · Trazabilidad del agro desde la raíz" },
      {
        property: "og:description",
        content:
          "Proyectos ficticios de agro latinoamericano con trazabilidad y compliance on-chain en Stellar Testnet.",
      },
    ],
  }),
  component: Index,
});

const steps = [
  { n: "01", title: "Conectá tu wallet Freighter", chain: true },
  { n: "02", title: "Verificá tu identidad con Didit", chain: false },
  { n: "03", title: "El emisor habilita tu wallet on-chain", chain: true },
  { n: "04", title: "Reclamá tus tokens de trazabilidad de prueba", chain: true },
];

const stellarReasons = [
  { title: "Comisiones mínimas", body: "Cada registro de trazabilidad cuesta fracciones de centavo." },
  { title: "Confirmación en segundos", body: "Los hitos quedan asentados casi en el momento." },
  {
    title: "Compliance nativo",
    body: "Solo wallets habilitadas por el emisor pueden tener el token, y el emisor puede revocar la habilitación y recuperar tokens.",
  },
];

const metrics = [
  { value: "4", label: "Proyectos ficticios" },
  { value: "2", label: "Países" },
  { value: "0", label: "Wallets verificadas (testnet)" },
  { value: "0", label: "Tokens de prueba reclamados" },
];

const roadmap = [
  { title: "Demo en testnet", detail: "Hoy: flujo completo de trazabilidad con tokens de prueba." },
  { title: "Pilotos con productores reales", detail: "Validación en campo de los hitos y registros." },
  {
    title: "Operación bajo el marco regulatorio de cada país",
    detail: "Cumplimiento local antes de cualquier uso productivo.",
  },
];

function Index() {
  return (
    <div>
      <section className="grain surface-forest">
        <div className="grain-layer" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-lime/35 px-4 py-1.5 text-xs text-lime">
              Prototipo para hackathon · Stellar Testnet
            </span>
            <h1 className="mt-6 text-5xl leading-[1.05] text-forest-foreground sm:text-6xl">
              Trazabilidad del agro desde la <span className="text-lime">raíz</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-forest-foreground/80">
              Producción de Latinoamérica con identidad verificada y registro en Stellar.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/proyectos"
                className="inline-flex rounded-full bg-lime px-6 py-3 text-sm font-medium text-lime-foreground transition hover:brightness-105"
              >
                Explorar proyectos
              </Link>
              <WalletButton />
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <RootsNetwork />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="text-3xl text-foreground sm:text-4xl">Cómo funciona</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-card p-6 shadow-soft">
                <span
                  className={`font-mono text-sm ${s.chain ? "text-violet" : "text-leaf"}`}
                >
                  {s.n}
                </span>
                <p className="mt-4 text-base leading-snug text-foreground">{s.title}</p>
                <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.chain ? "Capa on-chain" : "Fuera de la cadena"}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl text-foreground sm:text-4xl">Proyectos</h2>
            <Link to="/proyectos" className="text-sm text-leaf underline">
              Ver todos con filtros
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>

      <section className="grain surface-forest">
        <div className="grain-layer" />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <h2 className="text-3xl text-forest-foreground sm:text-4xl">
              Por qué <span className="text-lime">Stellar</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {stellarReasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl bg-violet-soft p-6 text-violet-foreground">
                  <h3 className="text-xl">{r.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-violet-foreground/85">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.06}>
                <div className="rounded-3xl border border-forest-foreground/15 p-6">
                  <p className="font-display text-4xl text-lime">{m.value}</p>
                  <p className="mt-2 text-sm text-forest-foreground/75">{m.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-xs text-forest-foreground/55">
            Métricas de demostración en testnet.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="text-3xl text-foreground sm:text-4xl">Hoja de ruta</h2>
        </Reveal>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {roadmap.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08}>
              <li className="h-full rounded-3xl bg-card p-6 shadow-soft">
                <span className="grid size-8 place-items-center rounded-full bg-leaf text-sm text-leaf-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg text-foreground">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.detail}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>
    </div>
  );
}
