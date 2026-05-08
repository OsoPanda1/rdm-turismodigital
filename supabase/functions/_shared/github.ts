export const GH_USER = "OsoPanda1"
export const GITHUB_REPOS_PER_PAGE = 100
export const GITHUB_SYNC_MIN_PAGES = 3
export const GITHUB_SYNC_MAX_PAGES = 10

export const CORE_REPO_WHITELIST = [
  "rdm-digital-nodo-cero", "RDM-Digital-X", "real-del-monte-twin", "real-del-monte-explorer", "real-del-monte-elevated", "rdm-smart-city-os",
  "tamv-digital-nexus", "tamv-sovereign-hub", "tamv-orchestrator", "tamv-sentient-digital-nexus", "tamv-nexus-verse", "tamv-horizon", "tamv-civilized", "tamvonline", "tamvweb",
  "metaverso-tamv-md-x4", "Plataforma-tamv-md-x4", "metaverso-latino-tamv-online", "multiverso-tamvonline", "federacion-tamv", "digital-civilization-core", "quantum-system-tamv", "citemesh-roots",
  "utamv-academic-core", "utamv-elite-masterclass", "DOCUMENTACION-TAMV-DM-X4-e-ISABELLA-AI", "documentacion-total-tamv-online",
]

export function isCoreRepo(name: string) {
  return CORE_REPO_WHITELIST.some((core) => core.toLowerCase() === name.toLowerCase())
}

export function classifyRepo(repo: { name: string; description?: string | null; topics?: string[] }) {
  const text = `${repo.name} ${repo.description ?? ""} ${(repo.topics ?? []).join(" ")}`.toLowerCase()
  if (/kernel|isabella|fann|eros|sentinel|ai\b|llm|model|quantum|orchestrator|nexus/.test(text)) return { federation_id: "tecnologica", classification: "infra-cognitiva" }
  if (/manuscrito|tomo|genesis|libro|compendio|documentacion|documentación/.test(text)) return { federation_id: "cultural", classification: "manuscrito" }
  if (/citemesh|consent|protocol|protocolo|legal|charter|civilization|federacion/.test(text)) return { federation_id: "gubernamental", classification: "protocolo" }
  if (/mercado|comercio|wallet|stripe|payment|pago|online|web/.test(text)) return { federation_id: "economica", classification: "comercio" }
  if (/educa|escuela|university|utamv|curso|academia|masterclass/.test(text)) return { federation_id: "educativa", classification: "pedagógico" }
  if (/salud|clinica|medic|telesalud/.test(text)) return { federation_id: "salud", classification: "salud" }
  if (/radio|prensa|blog|comunicacion|media/.test(text)) return { federation_id: "comunicacion", classification: "medios" }
  if (/nodo|rdm|territorio|twin|real-del-monte|smart-city/.test(text)) return { federation_id: "gubernamental", classification: "canónico" }
  return { federation_id: "tecnologica", classification: "general" }
}

export async function fetchGitHubRepos(headers: Record<string, string>, minPages = GITHUB_SYNC_MIN_PAGES, maxPages = GITHUB_SYNC_MAX_PAGES) {
  const repositories: any[] = []
  const seen = new Set<number>()
  let pagesScanned = 0

  for (let page = 1; page <= Math.max(1, maxPages); page += 1) {
    const url = new URL(`https://api.github.com/users/${GH_USER}/repos`)
    url.searchParams.set("per_page", String(GITHUB_REPOS_PER_PAGE))
    url.searchParams.set("sort", "pushed")
    url.searchParams.set("page", String(page))

    const gh = await fetch(url.toString(), { headers })
    if (!gh.ok) throw new Error(`GitHub ${gh.status}`)

    const batch = await gh.json()
    pagesScanned = page
    batch.forEach((repo: any) => {
      if (!seen.has(repo.id)) {
        seen.add(repo.id)
        repositories.push(repo)
      }
    })

    if (page >= Math.max(1, minPages) && batch.length < GITHUB_REPOS_PER_PAGE) break
  }

  return { repositories, pagesScanned }
}

export function analyzeRepositories(repositories: any[]) {
  return repositories.reduce(
    (acc, repo) => {
      const federation = classifyRepo(repo).federation_id
      const language = repo.language ?? "Sin lenguaje"
      acc.total += 1
      acc.core += isCoreRepo(repo.name) && !repo.fork ? 1 : 0
      acc.forks += repo.fork ? 1 : 0
      acc.archived += repo.archived ? 1 : 0
      acc.languages[language] = (acc.languages[language] ?? 0) + 1
      acc.federations[federation] = (acc.federations[federation] ?? 0) + 1
      if (!acc.latestPush || new Date(repo.pushed_at).getTime() > new Date(acc.latestPush).getTime()) acc.latestPush = repo.pushed_at
      return acc
    },
    { total: 0, core: 0, forks: 0, archived: 0, languages: {}, federations: {}, latestPush: null },
  )
}
