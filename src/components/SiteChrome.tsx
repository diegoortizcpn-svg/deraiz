import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { WalletButton } from "@/components/WalletButton";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/proyectos", label: "Proyectos" },
  { to: "/compliance", label: "Compliance" },
  { to: "/mi-cuenta", label: "Mi cuenta" },
] as const;

export function TopBanner() {
  return (
    <div className="bg-violet-soft px-4 py-2 text-center text-[11px] leading-relaxed text-violet-foreground sm:text-xs">
      Demo en Stellar Testnet · Proyectos ficticios · Sin dinero real · No constituye oferta de
      inversión ni de valores
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-forest/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid size-8 place-items-center rounded-full bg-lime text-sm font-semibold text-lime-foreground">
            R
          </span>
          <span className="font-display text-lg text-forest-foreground">
            De<span className="text-lime">Raíz</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-forest-foreground/80 transition hover:text-lime"
              activeProps={{ className: "text-lime text-sm" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <WalletButton />
        </div>

        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-forest-foreground/25 px-3 py-2 text-xs text-forest-foreground md:hidden"
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </nav>

      {open && (
        <div className="border-t border-forest-foreground/10 px-4 pb-5 md:hidden">
          <div className="flex flex-col gap-3 pt-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm text-forest-foreground/85"
                activeProps={{ className: "text-lime text-sm" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <WalletButton className="w-fit" />
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="grain surface-forest mt-24">
      <div className="grain-layer" />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-2xl">
              De<span className="text-lime">Raíz</span>
            </p>
            <p className="mt-3 text-sm text-forest-foreground/70">
              Trazabilidad de la producción agrícola de Latinoamérica con registro en Stellar.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-2">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className="text-forest-foreground/75 hover:text-lime">
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="https://stellar.expert/explorer/testnet"
                target="_blank"
                rel="noreferrer"
                className="text-violet-foreground/90 hover:text-lime"
              >
                Explorer testnet
              </a>
              <a
                href="https://www.freighter.app/"
                target="_blank"
                rel="noreferrer"
                className="text-violet-foreground/90 hover:text-lime"
              >
                Freighter
              </a>
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-forest-foreground/15 pt-6 text-xs leading-relaxed text-forest-foreground/60">
          DeRaíz es un prototipo educativo desarrollado para una hackathon. Los tokens son de prueba,
          no tienen valor económico ni otorgan derechos sobre ingresos, activos o resultados.
        </p>
      </div>
    </footer>
  );
}
