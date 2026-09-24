import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectCard } from "@/components/ProjectCard";
import { countries, crops, projects } from "@/data/projects";

export const Route = createFileRoute("/proyectos/")({
  head: () => ({
    meta: [
      { title: "Proyectos · DeRaíz" },
      {
        name: "description",
        content:
          "Cuatro proyectos ficticios de producción agrícola de Latinoamérica con trazabilidad registrada en Stellar Testnet.",
      },
      { property: "og:title", content: "Proyectos · DeRaíz" },
      {
        property: "og:description",
        content: "Explorá proyectos ficticios de agro con trazabilidad en Stellar Testnet.",
      },
    ],
  }),
  component: ProyectosPage,
});

const pill = (active: boolean) =>
  `rounded-full px-4 py-2 text-sm transition ${
    active
      ? "bg-forest text-forest-foreground"
      : "bg-card text-muted-foreground shadow-soft hover:text-foreground"
  }`;

function ProyectosPage() {
  const [country, setCountry] = useState<string>("Todos");
  const [crop, setCrop] = useState<string>("Todos");

  const cropOptions = useMemo(
    () =>
      Array.from(
        new Set(
          projects
            .filter((p) => country === "Todos" || p.country === country)
            .map((p) => p.crop),
        ),
      ),
    [country],
  );

  const handleCountryChange = (c: string) => {
    setCountry(c);
    const available = Array.from(
      new Set(
        projects.filter((p) => c === "Todos" || p.country === c).map((p) => p.crop),
      ),
    );
    if (crop !== "Todos" && !available.includes(crop)) setCrop("Todos");
  };

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (country === "Todos" || p.country === country) && (crop === "Todos" || p.crop === crop),
      ),
    [country, crop],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="max-w-2xl text-4xl leading-tight text-foreground sm:text-5xl">
        Proyectos con trazabilidad <span className="text-leaf">desde el lote</span>
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Producción de Latinoamérica con identidad verificada y registro en Stellar. Todos los
        proyectos son ficticios y sus datos son ilustrativos.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-3 md:hidden">
        {[
          { label: "País", value: country, set: setCountry, options: countries },
          { label: "Cultivo", value: crop, set: setCrop, options: crops },
        ].map((f) => (
          <div key={f.label} className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</span>
            <Select value={f.value} onValueChange={f.set}>
              <SelectTrigger aria-label={f.label} className="rounded-full border-border bg-card shadow-soft">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {["Todos", ...f.options].map((o) => (
                  <SelectItem key={o} value={o} className="rounded-xl">
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div className="mt-10 hidden space-y-4 md:block">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs uppercase tracking-wider text-muted-foreground">País</span>
          {["Todos", ...countries].map((c) => (
            <button key={c} type="button" onClick={() => setCountry(c)} className={pill(country === c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs uppercase tracking-wider text-muted-foreground">
            Cultivo
          </span>
          {["Todos", ...crops].map((c) => (
            <button key={c} type="button" onClick={() => setCrop(c)} className={pill(crop === c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-muted-foreground">
          No hay proyectos con esa combinación de filtros.
        </p>
      )}
    </div>
  );
}
