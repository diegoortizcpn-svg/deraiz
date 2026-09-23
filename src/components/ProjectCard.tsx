import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative">
        <img
          src={project.image}
          alt={project.name}
          loading="lazy"
          width={1280}
          height={864}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-forest/90 px-3 py-1 text-xs font-medium text-forest-foreground backdrop-blur">
          {project.status}
        </span>
        <span className="absolute bottom-4 left-4 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-medium text-foreground backdrop-blur">
          Proyecto ficticio · Datos ilustrativos
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl text-foreground">{project.name}</h3>
          <span className="shrink-0 rounded-full bg-violet px-3 py-1 font-mono text-xs text-violet-foreground">
            {project.assetCode}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {project.countryFlag} {project.location}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
        <Link
          to="/proyectos/$slug"
          params={{ slug: project.slug }}
          className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-forest-foreground transition hover:bg-forest-soft"
        >
          Explorar proyecto
          <span aria-hidden>→</span>
        </Link>
      </div>
    </motion.article>
  );
}
