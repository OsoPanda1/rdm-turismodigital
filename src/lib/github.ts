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

export const GH_USER = "OsoPanda1"

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

export async function fetchGitHubRepos(): Promise<GHRepo[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`, {
      headers: { Accept: "application/vnd.github+json" },
    })
    if (!res.ok) return []
    return (await res.json()) as GHRepo[]
  } catch {
    return []
  }
}

export function classifyRepo(repo: Pick<GHRepo, "name" | "description" | "topics">): {
  federation: string
  classification: string
} {
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
