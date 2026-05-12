import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  analyzeRepositories,
  classifyRepo,
  fetchGitHubRepos,
  fetchGitHubUser,
  GITHUB_SYNC_MIN_PAGES,
  isCoreRepo,
  type GHRepo,
  type RepoAnalysis,
} from "@/lib/github"

const PAGE_SIZE = 9

type EnrichedRepo = GHRepo & ReturnType<typeof classifyRepo> & { is_core: boolean }
type SyncResult = {
  synced?: number
  analyzed?: number
  pages_scanned?: number
  min_pages_requested?: number
  repositories?: unknown[]
  analysis?: RepoAnalysis
  error?: string
}

export default function RepositorioPage() {
  const [page, setPage] = useState(1)
  const [federationFilter, setFederationFilter] = useState("all")
  const [search, setSearch] = useState("")

  const user = useQuery({ queryKey: ["github-user"], queryFn: fetchGitHubUser })
  const repos = useQuery({ queryKey: ["github-repos", "deep", GITHUB_SYNC_MIN_PAGES], queryFn: () => fetchGitHubRepos({ minPages: GITHUB_SYNC_MIN_PAGES }) })
  const sync = useQuery<SyncResult>({
    queryKey: ["github-sync-edge", GITHUB_SYNC_MIN_PAGES],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source: "repositorio-page", minPages: GITHUB_SYNC_MIN_PAGES }),
      })
      return res.json()
    },
    retry: false,
  })

  const enriched = useMemo(() => (repos.data ?? []).map((r) => ({ ...r, ...classifyRepo(r), is_core: isCoreRepo(r.name) && !r.fork })), [repos.data])
  const coreRepos = useMemo(() => enriched.filter((r) => r.is_core).sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()), [enriched])

  const analysis = useMemo(() => sync.data?.analysis ?? analyzeRepositories(repos.data ?? []), [repos.data, sync.data?.analysis])

  const filteredRepos = useMemo(() => {
    const text = search.trim().toLowerCase()
    return coreRepos.filter((repo) => {
      if (federationFilter !== "all" && repo.federation !== federationFilter) return false
      if (!text) return true
      return (`${repo.name} ${repo.description ?? ""} ${(repo.topics ?? []).join(" ")}`.toLowerCase().includes(text))
    })
  }, [coreRepos, federationFilter, search])

  const totalPages = Math.max(1, Math.ceil(filteredRepos.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedRepos = filteredRepos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const federationOptions = useMemo(() => Array.from(new Set(coreRepos.map((repo) => repo.federation))), [coreRepos])
  const topLanguages = useMemo(() => Object.entries(analysis.languages).sort((a, b) => b[1] - a[1]).slice(0, 6), [analysis.languages])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">VI · REPOSITORIO EVOLUTIVO</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-4 leading-[1.05]">GitHub <span className="text-accent">OsoPanda1</span> como database federada</h1>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-8">Análisis activo del núcleo RDM/TAMV con normalización por federación, filtros vivos y seguimiento de lenguaje para decisiones de arquitectura.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 border border-border/40">
            <Stat label="GitHub analizados" value={analysis.total || user.data?.public_repos || coreRepos.length} />
            <Stat label="Núcleo fusionado" value={analysis.core || coreRepos.length} />
            <Stat label="Federaciones" value={Object.keys(analysis.federations).length} />
            <Stat label="Sync Edge" value={sync.data?.synced ?? "pendiente"} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value) }} placeholder="Buscar repo, tema o descripción..." className="rounded-xl border border-border/60 bg-card px-4 py-2 text-sm" />
            <select value={federationFilter} onChange={(e) => { setPage(1); setFederationFilter(e.target.value) }} className="rounded-xl border border-border/60 bg-card px-4 py-2 text-sm">
              <option value="all">Todas las federaciones</option>
              {federationOptions.map((fed) => <option key={fed} value={fed}>{fed}</option>)}
            </select>
            <div className="rounded-xl border border-border/60 bg-card px-4 py-2 text-sm">Páginas escaneadas: {sync.data?.pages_scanned ?? GITHUB_SYNC_MIN_PAGES}</div>
          </div>
          {sync.data?.error ? <p className="mt-4 text-sm text-amber-400">Edge sync: {sync.data.error}</p> : null}

          <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-2">
            {topLanguages.map(([lang, count]) => <div key={lang} className="rounded-lg border border-border/50 px-3 py-2 text-xs"><p className="font-semibold">{lang}</p><p className="text-muted-foreground">{count} repos</p></div>)}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-border/40 pb-4">
          <div>
            <h2 className="font-serif text-2xl">Explorador robusto del núcleo</h2>
            <p className="text-sm text-muted-foreground">Página {currentPage} de {totalPages} · {filteredRepos.length} repos filtrados</p>
          </div>
          <div className="flex gap-2">
            <button className="border border-border/60 px-4 py-2 text-sm disabled:opacity-40" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</button>
            <button className="border border-border/60 px-4 py-2 text-sm disabled:opacity-40" disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Siguiente</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedRepos.map((r) => (
            <a key={r.id} href={r.html_url} target="_blank" rel="noreferrer" className="rounded-2xl border border-border/50 bg-card p-5 hover:bg-card/60 transition-colors group block">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{r.classification}</span>
                <span className="font-mono text-xs text-muted-foreground">★ {r.stargazers_count} · {r.language ?? "—"}</span>
              </div>
              <h3 className="font-serif text-lg group-hover:text-accent transition-colors mb-2">{r.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 min-h-[3.5em]">{r.description ?? "Sin descripción."}</p>
              <div className="flex flex-wrap gap-1.5">{(r.topics ?? []).slice(0, 5).map((t) => <span key={t} className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-border/60 text-muted-foreground">{t}</span>)}</div>
              <p className="mt-4 font-mono text-[10px] text-muted-foreground">Push: {new Date(r.pushed_at).toLocaleDateString("es-MX")}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="bg-card p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</p><p className="font-serif text-3xl text-accent">{value}</p></div>
}
