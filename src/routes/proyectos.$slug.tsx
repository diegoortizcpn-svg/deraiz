import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { ParticipationPanel } from "@/components/ParticipationPanel";
import { ProjectCard } from "@/components/ProjectCard";
import { getProject, projects, TOKEN_MEANING } from "@/data/projects";
import { EXPLORER_URL, ISSUER, isIssuerConfigured } from "@/config/assets";

export const Route = createFileRoute("/proyectos/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Proyecto no disponible · DeRaíz" }, { name: "robots", content: "noindex" }],
      };
    }
    const { project } = loaderData;
    const description = `${project.name} · ${project.location}. Proyecto ficticio con trazabilidad de prueba en Stellar Testnet.`;
    return {
      meta: [
        { title: `${project.name} · DeRaíz` },
        { name: "description", content: description },
        { property: "og:title", content: `${project.name} · DeRaíz` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProyectoDetalle,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl text-foreground">Proyecto no encontrado</h1>
      <Link
        to="/proyectos"
        className="mt-6 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm text-forest-foreground"
      >
        Ver todos los proyectos
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl text-foreground">No pudimos mostrar este proyecto</h1>
    </div>
  ),
});

function ProyectoDetalle() {
  const { project } = Route.useLoaderData();

  return (
    <div>
      <section className="relative">
        <img
          src={project.image}
          alt={project.name}
          width={1280}
          height={864}
          className="h-[46vh] min-h-64 w-full object-cover"
        />
        <div className="absolute inset-0 bg-forest/65" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
            <Link
              to="/proyectos"
              className="text-sm text-forest-foreground/85 transition hover:text-lime"
            >
              ← Volver a proyectos
            </Link>
            <nav aria-label="Breadcrumb" className="mb-4 mt-2 text-xs text-forest-foreground/70">
              <Link to="/" className="hover:text-lime">Inicio</Link>
              <span className="mx-1.5">/</span>
              <Link to="/proyectos" className="hover:text-lime">Proyectos</Link>
              <span className="mx-1.5">/</span>
              <span className="text-forest-foreground">{project.name}</span>
            </nav>
            <span className="rounded-full bg-cream/90 px-3 py-1 text-xs font-medium text-foreground">
              Proyecto ficticio · Datos ilustrativos
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl leading-tight text-forest-foreground sm:text-5xl">
              {project.name}
            </h1>
            <p className="mt-2 text-forest-foreground/85">
              {project.countryFlag} {project.location} · {project.status}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-10">
          <div className="lg:hidden">
            <ParticipationPanel project={project} />
          </div>
          <Reveal>
            <section className="rounded-3xl bg-card p-7 shadow-soft">
              <h2 className="text-2xl text-foreground">Ficha productiva</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {project.sheet.map((row) => (
                  <div key={row.label} className="rounded-2xl bg-muted p-4">
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="mt-1 text-sm text-foreground">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </Reveal>

          <Reveal>
            <section className="rounded-3xl bg-card p-7 shadow-soft">
              <h2 className="text-2xl text-foreground">Cronograma</h2>
              <ol className="mt-6 space-y-6 border-l border-border pl-6">
                {project.timeline.map((t, i) => (
                  <li key={t.title} className="relative">
                    <span className="absolute -left-[31px] top-1 grid size-4 place-items-center rounded-full bg-leaf text-[9px] text-leaf-foreground">
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium text-foreground">{t.title}</p>
                    <p className="text-sm text-muted-foreground">{t.detail}</p>
                  </li>
                ))}
              </ol>
            </section>
          </Reveal>

          <Reveal>
            <section className="rounded-3xl bg-card p-7 shadow-soft">
              <h2 className="text-2xl text-foreground">Qué representa el token</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{TOKEN_MEANING}</p>
            </section>
          </Reveal>

          <Reveal>
            <section className="rounded-3xl bg-card p-7 shadow-soft">
              <h2 className="text-2xl text-foreground">Riesgos del cultivo</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.risks.map((r) => (
                  <li
                    key={r}
                    className="rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal>
            <section className="grain rounded-3xl bg-violet-soft p-7 text-violet-foreground">
              <div className="grain-layer" />
              <h2 className="text-2xl">Datos on-chain</h2>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-violet-foreground/70">
                    Código del activo
                  </dt>
                  <dd className="mt-1 font-mono text-lime">{project.assetCode}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-violet-foreground/70">
                    Supply de prueba
                  </dt>
                  <dd className="mt-1 font-mono">{project.testSupply}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wider text-violet-foreground/70">
                    Emisor
                  </dt>
                  <dd className="mt-1 break-all font-mono text-sm">
                    {isIssuerConfigured() ? ISSUER : `${ISSUER} (pendiente de despliegue)`}
                  </dd>
                </div>
              </dl>
              <a
                href={EXPLORER_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex rounded-full bg-lime px-5 py-2.5 text-sm font-medium text-lime-foreground"
              >
                Ver en Stellar Expert (testnet)
              </a>
            </section>
          </Reveal>
        </div>

        <div className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <ParticipationPanel project={project} />
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl text-foreground">Otros proyectos</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects
            .filter((p) => p.slug !== project.slug)
            .map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
        </div>
      </section>
    </div>
  );
}
