import { useQuery } from "@tanstack/react-query"
import { classifyRepo, fetchGitHubRepos, fetchGitHubUser, isCoreRepo } from "@/lib/github"

type SyncResult = { synced?: number; repositories?: unknown[]; error?: string }

export default function RepositorioPage() {
  const user = useQuery({ queryKey: ["github-user"], queryFn: fetchGitHubUser })
  const repos = useQuery({ queryKey: ["github-repos"], queryFn: fetchGitHubRepos })
  const sync = useQuery<SyncResult>({
    queryKey: ["github-sync-edge"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source: "repositorio-page" }),
      })
      return res.json()
    },
    retry: false,
  })

  const enriched = (repos.data ?? [])
    .filter((r) => !r.fork && isCoreRepo(r.name))
    .map((r) => ({ ...r, ...classifyRepo(r), is_core: true }))
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())

  const byFed = enriched.reduce<Record<string, typeof enriched>>((acc, repo) => {
    acc[repo.federation] = acc[repo.federation] ?? []
    acc[repo.federation].push(repo)
    return acc
  }, {})

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">VI · REPOSITORIO EVOLUTIVO</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-[1.05]">
            GitHub <span className="text-accent">OsoPanda1</span> como database federada
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-8">
            Interconectividad activa con whitelist EOCT: solo repos núcleo TAMV/RDM se absorben como metadatos,
            excluyendo malware, userbots, RAT y scrapers no consentidos.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 border border-border/40">
            <Stat label="GitHub públicos" value={user.data?.public_repos ?? enriched.length} />
            <Stat label="Núcleo whitelist" value={enriched.length} />
            <Stat label="Federaciones" value={Object.keys(byFed).length} />
            <Stat label="Sync Edge" value={sync.data?.synced ?? "pendiente"} />
          </div>
          {sync.data?.error ? <p className="mt-4 text-sm text-amber-400">Edge sync: {sync.data.error}</p> : null}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        {Object.entries(byFed).map(([fed, list]) => (
          <div key={fed} className="mb-16">
            <div className="flex items-baseline justify-between mb-6 border-b border-border/40 pb-3">
              <h2 className="font-serif text-2xl">Federación {fed}</h2>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{list.length} nodos</span>
            </div>
            <div className="grid md:grid-cols-2 gap-px bg-border/40 border border-border/40">
              {list.map((r) => (
                <a key={r.id} href={r.html_url} target="_blank" rel="noreferrer" className="bg-card p-6 hover:bg-card/60 transition-colors group block">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{r.classification}</span>
                    <span className="font-mono text-xs text-muted-foreground">★ {r.stargazers_count} · {r.language ?? "—"}</span>
                  </div>
                  <h3 className="font-serif text-lg group-hover:text-accent transition-colors mb-2">{r.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 min-h-[2.5em]">{r.description ?? "Sin descripción."}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(r.topics ?? []).slice(0, 5).map((t) => <span key={t} className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-border/60 text-muted-foreground">{t}</span>)}
                  </div>
                  <p className="mt-4 font-mono text-[10px] text-muted-foreground">Push: {new Date(r.pushed_at).toLocaleDateString("es-MX")}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="bg-card p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</p><p className="font-serif text-3xl text-accent">{value}</p></div>
}
