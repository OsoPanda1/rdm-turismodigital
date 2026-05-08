import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4"
import { corsHeaders, json } from "../_shared/cors.ts"
import { CORE_REPO_WHITELIST, GH_USER, classifyRepo } from "../_shared/github.ts"

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  const token = Deno.env.get("GITHUB_TOKEN") ?? Deno.env.get("GITHUBTOKEN")
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" }
  if (token) headers.Authorization = `Bearer ${token}`
  const gh = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`, { headers })
  if (!gh.ok) return json({ error: `GitHub ${gh.status}`, synced: 0 }, 502)
  const allRepos = await gh.json()
  const allow = new Set(CORE_REPO_WHITELIST.map((r) => r.toLowerCase()))
  const rows = allRepos.filter((repo: any) => allow.has(String(repo.name).toLowerCase()) && !repo.fork).map((repo: any) => ({
    id: repo.full_name,
    github_id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    topics: repo.topics ?? [],
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? 0,
    size_kb: repo.size ?? 0,
    default_branch: repo.default_branch,
    pushed_at: repo.pushed_at,
    is_core: true,
    ...classifyRepo(repo),
    updated_at: new Date().toISOString(),
  }))
  const { error } = await supabase.from("repositories").upsert(rows, { onConflict: "id" })
  if (error) return json({ error: error.message, synced: 0 }, 500)
  return json({ synced: rows.length, repositories: rows.map((r: any) => r.full_name), excluded_policy: "EOCT excluye userbots, RAT, malware y scraping no consentido" })
})
