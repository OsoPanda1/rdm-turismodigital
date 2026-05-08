export type GHRepo = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  size: number
  default_branch: string
  archived: boolean
  fork: boolean
  pushed_at: string
  created_at: string
  updated_at: string
}

export type GHUser = {
  login: string
  name: string | null
  bio: string | null
  blog: string | null
  location: string | null
  public_repos: number
  followers: number
  following: number
  avatar_url: string
  html_url: string
  created_at: string
}

export type RepoClassification = {
  federation: string
  classification: string
}

export type RepoAnalysis = {
  total: number
  core: number
  forks: number
  archived: number
  languages: Record<string, number>
  federations: Record<string, number>
  latestPush: string | null
}

export const GH_USER = "OsoPanda1"
export const GITHUB_REPOS_PER_PAGE = 100
export const GITHUB_SYNC_MIN_PAGES = 3
export const GITHUB_SYNC_MAX_PAGES = 10

export const CORE_REPO_WHITELIST = [
  "rdm-digital-nodo-cero",
  "RDM-Digital-X",
  "real-del-monte-twin",
  "real-del-monte-explorer",
  "real-del-monte-elevated",
  "rdm-smart-city-os",
  "tamv-digital-nexus",
  "tamv-sovereign-hub",
  "tamv-orchestrator",
  "tamv-sentient-digital-nexus",
  "tamv-nexus-verse",
  "tamv-horizon",
  "tamv-civilized",
  "tamvonline",
  "tamvweb",
  "metaverso-tamv-md-x4",
  "Plataforma-tamv-md-x4",
  "metaverso-latino-tamv-online",
  "multiverso-tamvonline",
  "federacion-tamv",
  "digital-civilization-core",
  "quantum-system-tamv",
  "citemesh-roots",
  "utamv-academic-core",
  "utamv-elite-masterclass",
  "DOCUMENTACION-TAMV-DM-X4-e-ISABELLA-AI",
  "documentacion-total-tamv-online",
]

export function isCoreRepo(name: string) {
  return CORE_REPO_WHITELIST.some((core) => core.toLowerCase() === name.toLowerCase())
}

export async function fetchGitHubUser(): Promise<GHUser | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${GH_USER}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
    if (!res.ok) return null
    return (await res.json()) as GHUser
  } catch {
    return null
  }
}

export async function fetchGitHubRepos(options: { maxPages?: number; minPages?: number } = {}): Promise<GHRepo[]> {
  const maxPages = Math.max(1, options.maxPages ?? GITHUB_SYNC_MAX_PAGES)
  const minPages = Math.max(1, options.minPages ?? GITHUB_SYNC_MIN_PAGES)
  const repos: GHRepo[] = []
  const seen = new Set<number>()

  for (let page = 1; page <= maxPages; page += 1) {
    try {
      const url = new URL(`https://api.github.com/users/${GH_USER}/repos`)
      url.searchParams.set("per_page", String(GITHUB_REPOS_PER_PAGE))
      url.searchParams.set("sort", "pushed")
      url.searchParams.set("page", String(page))

      const res = await fetch(url.toString(), { headers: { Accept: "application/vnd.github+json" } })
      if (!res.ok) break

      const batch = (await res.json()) as GHRepo[]
      batch.forEach((repo) => {
        if (!seen.has(repo.id)) {
          seen.add(repo.id)
          repos.push(repo)
        }
      })

      if (page >= minPages && batch.length < GITHUB_REPOS_PER_PAGE) break
    } catch {
      break
    }
  }

  return repos
}

export function classifyRepo(repo: Pick<GHRepo, "name" | "description" | "topics">): RepoClassification {
  const text = `${repo.name} ${repo.description ?? ""} ${(repo.topics ?? []).join(" ")}`.toLowerCase()
  if (/kernel|isabella|fann|eros|sentinel|ai\b|llm|model|quantum|orchestrator|nexus/.test(text))
    return { federation: "tecnologica", classification: "infra-cognitiva" }
  if (/manuscrito|tomo|genesis|libro|compendio|tamv-doc|documentacion|documentación/.test(text))
    return { federation: "cultural", classification: "manuscrito" }
  if (/citemesh|consent|protocol|protocolo|legal|charter|civilization|federacion|federación/.test(text))
    return { federation: "gubernamental", classification: "protocolo" }
  if (/mercado|comercio|wallet|stripe|payment|pago|online|web/.test(text))
    return { federation: "economica", classification: "comercio" }
  if (/educa|escuela|university|utamv|curso|academia|masterclass/.test(text))
    return { federation: "educativa", classification: "pedagógico" }
  if (/salud|clinica|medic|telesalud/.test(text)) return { federation: "salud", classification: "salud" }
  if (/radio|prensa|blog|comunicacion|media/.test(text))
    return { federation: "comunicacion", classification: "medios" }
  if (/nodo|rdm|territorio|twin|real-del-monte|smart-city/.test(text))
    return { federation: "gubernamental", classification: "canónico" }
  return { federation: "tecnologica", classification: "general" }
}

export function analyzeRepositories(repos: GHRepo[]): RepoAnalysis {
  return repos.reduce<RepoAnalysis>(
    (acc, repo) => {
      const federation = classifyRepo(repo).federation
      const language = repo.language ?? "Sin lenguaje"
      acc.total += 1
      acc.core += isCoreRepo(repo.name) && !repo.fork ? 1 : 0
      acc.forks += repo.fork ? 1 : 0
      acc.archived += repo.archived ? 1 : 0
      acc.languages[language] = (acc.languages[language] ?? 0) + 1
      acc.federations[federation] = (acc.federations[federation] ?? 0) + 1
      if (!acc.latestPush || new Date(repo.pushed_at).getTime() > new Date(acc.latestPush).getTime()) {
        acc.latestPush = repo.pushed_at
      }
      return acc
    },
    { total: 0, core: 0, forks: 0, archived: 0, languages: {}, federations: {}, latestPush: null },
  )
}
