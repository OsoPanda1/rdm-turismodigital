import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import {
  BadgeCheck,
  BookOpen,
  Brush,
  ChevronLeft,
  ChevronRight,
  Compass,
  Gamepad2,
  Landmark,
  MapPinned,
  Mountain,
  Route,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trophy,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { tourismSpots } from "@/lib/tourism-data"

type PlatformPage = {
  id: string
  label: string
  title: string
  description: string
  icon: LucideIcon
}

const platformPages: PlatformPage[] = [
  {
    id: "home",
    label: "Home",
    title: "Plataforma turística operativa de Real del Monte",
    description: "Inicio con barra de herramientas, lectura rápida del destino y acceso a mapa, identidad, comercio y catálogo.",
    icon: Compass,
  },
  {
    id: "memoria",
    label: "Historia",
    title: "Historia, cultura y arte conectados",
    description: "Patrimonio minero, agenda cultural, arte local y narrativa territorial visibles desde una sola superficie.",
    icon: BookOpen,
  },
  {
    id: "explora",
    label: "Recorridos",
    title: "Recorridos, comercios y mapa interactivo",
    description: "Rutas listas para visitantes, catálogo de comercios y acceso directo al mapa territorial en vivo.",
    icon: Route,
  },
  {
    id: "juego",
    label: "Leyendas",
    title: "Mitos, leyendas y gamificación",
    description: "Experiencias narrativas, logros y dinámicas para convertir la visita en una travesía memorable.",
    icon: Trophy,
  },
]

const toolbarLinks = [
  { to: "/territorio", label: "Mapa interactivo", icon: MapPinned },
  { to: "/turismo", label: "Explorar catálogo", icon: Landmark },
  { to: "/comercio/registro", label: "Catálogo comercial", icon: ShoppingBag },
  { to: "/identidad", label: "Identidad", icon: BadgeCheck },
]

const liveSignals = [
  {
    zone: "Centro histórico",
    status: "Alta afluencia",
    detail: "Parroquia, corredor de pastes y plaza artesanal con actividad continua.",
  },
  {
    zone: "Circuito minero",
    status: "Ruta estable",
    detail: "Museo Mina de Acosta y narrativa patrimonial listos para recorridos guiados.",
  },
  {
    zone: "Miradores",
    status: "Clima favorable",
    detail: "Ventana óptima para fotografía, senderismo y vistas panorámicas.",
  },
]

const culturalMoments = [
  {
    title: "Memoria minera",
    text: "Relatos de extracción, arquitectura y vida obrera integrados en una experiencia de interpretación contemporánea.",
    icon: Mountain,
  },
  {
    title: "Tradición viva",
    text: "Cocina local, festividades y expresiones comunitarias visibles como parte central del destino.",
    icon: Landmark,
  },
  {
    title: "Arte territorial",
    text: "Piezas, talleres y escenas creativas conectadas con el flujo turístico y comercial del pueblo mágico.",
    icon: Brush,
  },
]

const routePlans = [
  {
    title: "Ruta minera esencial",
    duration: "3 horas",
    stops: ["Mina de Acosta", "Panteón Inglés", "Centro histórico"],
  },
  {
    title: "Ruta cultura y sabor",
    duration: "4 horas",
    stops: ["Parroquia", "Corredor de pastes", "Mercado artesanal"],
  },
  {
    title: "Ruta paisaje y leyenda",
    duration: "Atardecer",
    stops: ["Mirador", "Calles antiguas", "Circuito nocturno"],
  },
]

const merchantCatalog = [
  {
    name: "Pastes de la Montaña",
    type: "Gastronomía",
    note: "Especialidad tradicional con servicio rápido para rutas cortas.",
  },
  {
    name: "Casa del Cobre y Plata",
    type: "Artes y diseño",
    note: "Piezas locales, regalo turístico y manufactura con identidad regional.",
  },
  {
    name: "Taller Cornish Vivo",
    type: "Experiencia cultural",
    note: "Demostraciones, talleres y narrativas de herencia minera anglo-mexicana.",
  },
]

const legends = [
  {
    title: "La guardiana del socavón",
    text: "Una presencia que guía a quienes se internan en la historia minera cuando cae la neblina.",
  },
  {
    title: "Ecos del cementerio inglés",
    text: "Relato nocturno que mezcla memoria, arquitectura y silencios del cerro.",
  },
  {
    title: "La campana que llama al pueblo",
    text: "Narrativa oral asociada a celebraciones, avisos y episodios extraordinarios del centro histórico.",
  },
]

const quests = [
  {
    title: "Insignia Explorador Minero",
    reward: "+120 pts",
    text: "Completa museo, relato histórico y una parada gastronómica.",
  },
  {
    title: "Insignia Cronista del Pueblo",
    reward: "+90 pts",
    text: "Escucha una leyenda, registra una foto y visita un comercio creativo.",
  },
  {
    title: "Insignia Ruta Completa",
    reward: "+150 pts",
    text: "Sella tres recorridos en el mapa y desbloquea una recomendación premium.",
  },
]

export function TourismPlatform() {
  const [pageIndex, setPageIndex] = useState(0)
  const [clock, setClock] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const activePage = platformPages[pageIndex]
  const stats = useMemo(() => {
    const categories = new Set(tourismSpots.map((spot) => spot.category))
    return {
      spots: tourismSpots.length,
      categories: categories.size,
      routes: routePlans.length,
      quests: quests.length,
    }
  }, [])

  const nextPage = () => setPageIndex((current) => (current + 1) % platformPages.length)
  const prevPage = () => setPageIndex((current) => (current - 1 + platformPages.length) % platformPages.length)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">RDM Digital · Nodo turístico</p>
              <div>
                <h1 className="text-3xl font-semibold md:text-4xl">Real del Monte, visible y navegable</h1>
                <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
                  Plataforma turística con home operativo, barra de herramientas, historia, cultura, arte, recorridos, comercios, mapa en tiempo real y mitos del territorio.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatChip label="POIs" value={String(stats.spots)} />
              <StatChip label="Capas" value={String(stats.categories)} />
              <StatChip label="Rutas" value={String(stats.routes)} />
              <StatChip label="Logros" value={String(stats.quests)} />
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <nav aria-label="Barra de herramientas" className="flex flex-wrap gap-2">
              {toolbarLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-wrap items-center gap-2">
              {platformPages.map((page, index) => {
                const Icon = page.icon
                const active = index === pageIndex
                return (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => setPageIndex(index)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {page.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-border/60 bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.35fr_0.65fr] lg:px-6">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <activePage.icon className="h-4 w-4" />
              Página {pageIndex + 1} de {platformPages.length}
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold md:text-5xl">{activePage.title}</h2>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">{activePage.description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PagerButton onClick={prevPage} icon={ChevronLeft}>Anterior</PagerButton>
              <PagerButton onClick={nextPage} icon={ChevronRight}>Siguiente</PagerButton>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <SignalCard title="Hora territorial" value={clock.toLocaleTimeString("es-MX")} note="Lectura viva del tablero" icon={<ShieldCheck className="h-4 w-4" />} />
            <SignalCard title="Estado del mapa" value="Activo" note="Capas listas para exploración" icon={<MapPinned className="h-4 w-4" />} />
            <SignalCard title="Modo visita" value="Experiencial" note="Historia, cultura y comercio enlazados" icon={<Sparkles className="h-4 w-4" />} />
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 lg:px-6">
        {activePage.id === "home" ? <HomePageContent /> : null}
        {activePage.id === "memoria" ? <MemoryPageContent /> : null}
        {activePage.id === "explora" ? <ExplorePageContent /> : null}
        {activePage.id === "juego" ? <PlayPageContent /> : null}
      </div>
    </main>
  )
}

function HomePageContent() {
  return (
    <>
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <SectionHeader
            eyebrow="Home"
            title="Barra de herramientas y lectura rápida del destino"
            description="Todo lo importante del proyecto turístico queda visible desde la primera pantalla y sin depender de un dashboard técnico roto."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {liveSignals.map((signal) => (
              <article key={signal.zone} className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{signal.zone}</p>
                <h3 className="mt-2 text-lg font-semibold">{signal.status}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{signal.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <section className="space-y-4">
          <SectionHeader
            eyebrow="Mapa en tiempo real"
            title="Territorio listo para operar"
            description="La plataforma ya prioriza el flujo del visitante: descubrir, orientarse, recorrer y consumir dentro del destino."
          />
          <div className="grid gap-3">
            <FeatureRow label="Mapa interactivo" value="Capas territoriales y heatmap" />
            <FeatureRow label="Recorridos" value="Rutas por historia, sabor y paisaje" />
            <FeatureRow label="Comercios" value="Catálogo con vocación turística" />
            <FeatureRow label="Identidad" value="Insignias e historial del visitante" />
          </div>
        </section>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tourismSpots.slice(0, 4).map((spot) => (
          <article key={spot.id} className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{spot.category}</p>
            <h3 className="mt-2 text-lg font-semibold">{spot.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{spot.summary}</p>
            <p className="mt-3 text-xs text-muted-foreground">{spot.address}</p>
          </article>
        ))}
      </section>
    </>
  )
}

function MemoryPageContent() {
  return (
    <>
      <section className="space-y-5">
        <SectionHeader
          eyebrow="Historia · Cultura · Arte"
          title="La narrativa patrimonial ya está al frente"
          description="En vez de módulos operativos vacíos, aquí se prioriza la razón por la que la gente visita Real del Monte: memoria, tradición y experiencia estética."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {culturalMoments.map(({ title, text, icon: Icon }) => (
            <article key={title} className="rounded-lg border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {tourismSpots
          .filter((spot) => spot.category === "historia" || spot.category === "cultura")
          .map((spot) => (
            <article key={spot.id} className="rounded-lg border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{spot.category}</p>
              <h3 className="mt-2 text-xl font-semibold">{spot.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{spot.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {spot.tags.map((tag) => (
                  <span key={tag} className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
      </section>
    </>
  )
}

function ExplorePageContent() {
  return (
    <>
      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <SectionHeader
            eyebrow="Recorridos"
            title="Rutas listas para visitantes reales"
            description="Cada recorrido mezcla patrimonio, consumo local y orientación territorial para que el proyecto funcione como plataforma turística, no como panel técnico."
          />
          <div className="grid gap-3">
            {routePlans.map((route) => (
              <article key={route.title} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{route.title}</h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{route.duration}</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {route.stops.map((stop) => (
                    <li key={stop}>• {stop}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader
            eyebrow="Catálogo comercial"
            title="Comercios con vocación turística"
            description="Negocios presentados como parte del viaje: comer, comprar, aprender y regresar con una experiencia completa."
          />
          <div className="grid gap-3">
            {merchantCatalog.map((merchant) => (
              <article key={merchant.name} className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{merchant.type}</p>
                <h3 className="mt-2 text-lg font-semibold">{merchant.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{merchant.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-border bg-card p-5">
          <SectionHeader
            eyebrow="Mapa interactivo"
            title="Lectura territorial inmediata"
            description="El mapa vive como módulo principal del proyecto y no como ruta escondida."
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <FeatureRow label="Capas activas" value="Topografía, calles y calor de uso" />
            <FeatureRow label="Nodos visibles" value="POIs, miradores y patrimonio" />
            <FeatureRow label="Acción" value="Abrir mapa completo" />
          </div>
          <div className="mt-5">
            <Link to="/territorio" className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
              <MapPinned className="h-4 w-4" />
              Entrar al mapa territorial
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <SectionHeader
            eyebrow="Navegación"
            title="Accesos directos del visitante"
            description="La experiencia ya guía a la persona hacia la acción correcta sin perderse en vistas técnicas."
          />
          <div className="mt-5 grid gap-2">
            {toolbarLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="inline-flex items-center justify-between rounded-lg border border-border bg-background px-3 py-3 text-sm hover:bg-accent hover:text-accent-foreground">
                <span>{label}</span>
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function PlayPageContent() {
  return (
    <>
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <SectionHeader
            eyebrow="Mitos y leyendas"
            title="Narrativa viva para la visita nocturna y cultural"
            description="Las leyendas no quedan como texto perdido: se convierten en parte del recorrido, del mapa y de la memoria del visitante."
          />
          <div className="grid gap-3">
            {legends.map((legend) => (
              <article key={legend.title} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <ScrollText className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{legend.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{legend.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader
            eyebrow="Gamificación"
            title="Mecánicas para volver la visita memorable"
            description="Insignias, puntos y misiones que empujan al visitante a completar rutas, descubrir cultura y activar economía local."
          />
          <div className="grid gap-3">
            {quests.map((quest) => (
              <article key={quest.title} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{quest.title}</h3>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
                    <Gamepad2 className="h-3.5 w-3.5" />
                    {quest.reward}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{quest.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{eyebrow}</p>
      <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
    </div>
  )
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-3">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    </div>
  )
}

function SignalCard({ title, value, note, icon }: { title: string; value: string; note: string; icon: ReactNode }) {
  return (
    <article className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-xs uppercase tracking-[0.2em]">{title}</span></div>
      <p className="mt-3 text-xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{note}</p>
    </article>
  )
}

function FeatureRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  )
}

function PagerButton({ onClick, icon: Icon, children }: { onClick: () => void; icon: LucideIcon; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  )
}