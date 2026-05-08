export const GH_USER = "OsoPanda1"
export const CORE_REPO_WHITELIST = [
  "rdm-digital-nodo-cero", "RDM-Digital-X", "real-del-monte-twin", "real-del-monte-explorer", "real-del-monte-elevated", "rdm-smart-city-os",
  "tamv-digital-nexus", "tamv-sovereign-hub", "tamv-orchestrator", "tamv-sentient-digital-nexus", "tamv-nexus-verse", "tamv-horizon", "tamv-civilized", "tamvonline", "tamvweb",
  "metaverso-tamv-md-x4", "Plataforma-tamv-md-x4", "metaverso-latino-tamv-online", "multiverso-tamvonline", "federacion-tamv", "digital-civilization-core", "quantum-system-tamv", "citemesh-roots",
  "utamv-academic-core", "utamv-elite-masterclass", "DOCUMENTACION-TAMV-DM-X4-e-ISABELLA-AI", "documentacion-total-tamv-online",
]
export function classifyRepo(repo: { name: string; description?: string | null; topics?: string[] }) {
  const text = `${repo.name} ${repo.description ?? ""} ${(repo.topics ?? []).join(" ")}`.toLowerCase()
  if (/kernel|isabella|fann|eros|sentinel|ai\b|llm|model|quantum|orchestrator|nexus/.test(text)) return { federation_id: "tecnologica", classification: "infra-cognitiva" }
  if (/manuscrito|tomo|genesis|libro|compendio|documentacion|documentación/.test(text)) return { federation_id: "cultural", classification: "manuscrito" }
  if (/citemesh|consent|protocol|protocolo|legal|charter|civilization|federacion/.test(text)) return { federation_id: "gubernamental", classification: "protocolo" }
  if (/mercado|comercio|wallet|stripe|payment|pago|online|web/.test(text)) return { federation_id: "economica", classification: "comercio" }
  if (/educa|escuela|university|utamv|curso|academia|masterclass/.test(text)) return { federation_id: "educativa", classification: "pedagógico" }
  if (/salud|clinica|medic|telesalud/.test(text)) return { federation_id: "salud", classification: "salud" }
  if (/radio|prensa|blog|comunicacion|media/.test(text)) return { federation_id: "comunicacion", classification: "medios" }
  return { federation_id: "tecnologica", classification: "general" }
}
