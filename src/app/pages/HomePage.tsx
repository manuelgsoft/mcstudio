
"use client";
import { useEffect, useState } from "react";
import {
  GlobeAsiaAustraliaIcon,
  LanguageIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const heroImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Destinos", title: "Explora destinos" },
    { label: "Consultoría", title: "Consulta personalizada" },
    { label: "Contacto", title: "Contacta con nosotros" },
    { label: "Reseñas", title: "Lee opiniones reales" },
    { label: "Quiénes Somos", title: "Conoce al equipo" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#4a4a4a]">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 text-[#0f0f0f] transition hover:opacity-85"
            aria-label="Volver arriba"
          >
            <div className="flex h-10 w-10 items-center justify-center text-[#0a6c74]">
              <GlobeAsiaAustraliaIcon className="h-10 w-10" />
            </div>
            <h1 className="text-xl font-semibold">MC Studio</h1>
          </button>

          <div className="hidden items-center gap-6 text-sm font-medium lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                title={item.title}
                className="relative px-1 text-[#0f0f0f] transition hover:text-[#0a6c74]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              className="hidden items-center gap-2 rounded-full border border-[#0f0f0f]/10 bg-white/70 px-3 py-2 text-sm font-medium text-[#0f0f0f] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[#0a6c74]/50 hover:text-[#0a6c74] sm:flex"
              title="Cambiar idioma"
            >
              <LanguageIcon className="h-5 w-5" />
              ES
            </button>
            <button className="flex items-center gap-2 rounded-full bg-[#0a6c74] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#2a9d8f]">
              <UserCircleIcon className="h-5 w-5" />
              Iniciar sesión
            </button>
          </div>
        </nav>
      </header>

      <main className="relative isolate">
        <section
          className="relative min-h-screen overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(15,15,15,0.45) 0%, rgba(15,15,15,0.2) 40%, rgba(15,15,15,0.6) 100%), url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/35" />
          <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-20 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-xl space-y-5 text-white drop-shadow-lg">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                ✦ Más de 500 viajeros satisfechos
              </div>
              <h1 className="text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl tracking-[0.03em]">
                <span className="block">Organizamos tu</span>
                <span className="block mt-1 text-[#F4A261]">viaje ideal</span>
              </h1>
              <p className="text-lg text-white sm:text-xl">
                Tú nos cuentas cómo eres, nosotros nos encargamos del resto
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <button className="w-full rounded-full bg-[#0a6c74] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#2a9d8f] sm:w-auto">
                  Obtén tu primera consulta GRATIS
                </button>
                <button className="w-full rounded-full border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-white sm:w-auto">
                  Ver destinos
                </button>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <span className="text-[#f4a261]">⭐</span>
                <span>Coordinación integral, soporte 24/7 y diseño a medida</span>
              </div>
            </div>

            <div className="mt-10 w-full max-w-sm rounded-2xl bg-white/90 p-6 shadow-2xl backdrop-blur-md lg:mt-0">
              <div className="space-y-2 text-[#0f0f0f]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0a6c74]">
                  Primera consulta gratis
                </p>
                <h3 className="text-xl font-semibold text-[#0f0f0f]">
                  Hablemos de tu próximo viaje
                </h3>
              </div>
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-[#0a6c74]/12 bg-white px-4 py-3 text-sm text-[#0f0f0f] shadow-inner">
                  <p className="text-xs uppercase tracking-wide text-[#4a4a4a]">Destino</p>
                  <p className="pt-1 font-semibold">Elige tu país</p>
                </div>
                <div className="rounded-xl border border-[#0a6c74]/12 bg-white px-4 py-3 text-sm text-[#0f0f0f] shadow-inner">
                  <p className="text-xs uppercase tracking-wide text-[#4a4a4a]">Fechas</p>
                  <p className="pt-1 font-semibold">Flexible o cerradas</p>
                </div>
                <button className="w-full rounded-full bg-[#f4a261] px-5 py-3 text-sm font-semibold text-[#0f0f0f] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#e8964f]">
                  Programar consulta
                </button>
                <p className="text-xs text-[#4a4a4a]">Sin compromiso · Respuesta en 24h</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
