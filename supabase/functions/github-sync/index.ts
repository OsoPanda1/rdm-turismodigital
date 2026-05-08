import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4"
import { corsHeaders, json } from "../_shared/cors.ts"
import { GITHUB_SYNC_MAX_PAGES, GITHUB_SYNC_MIN_PAGES, analyzeRepositories, classifyRepo, fetchGitHubRepos, isCoreRepo } from "../_shared/github.ts"

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  const body = await req.json().catch(() => ({}))
  const minPages = Math.max(GITHUB_SYNC_MIN_PAGES, Number(body?.minPages ?? GITHUB_SYNC_MIN_PAGES))
  const maxPages = Math.max(minPages, Math.min(GITHUB_SYNC_MAX_PAGES, Number(body?.maxPages ?? GITHUB_SYNC_MAX_PAGES)))
  const token = Deno.env.get("GITHUB_TOKEN") ?? Deno.env.get("GITHUBTOKEN")
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" }
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const { repositories: allRepos, pagesScanned } = await fetchGitHubRepos(headers, minPages, maxPages)
    const analysis = analyzeRepositories(allRepos)
    const rows = allRepos.filter((repo: any) => isCoreRepo(String(repo.name)) && !repo.fork).map((repo: any) => ({
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
    if (error) return json({ error: error.message, synced: 0, analyzed: analysis.total, pages_scanned: pagesScanned, analysis }, 500)

    return json({
      synced: rows.length,
      analyzed: analysis.total,
      pages_scanned: pagesScanned,
      min_pages_requested: minPages,
      repositories: rows.map((r: any) => r.full_name),
      analysis,
      excluded_policy: "EOCT excluye forks, userbots, RAT, malware y scraping no consentido",
    })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "GitHub sync failed", synced: 0 }, 502)
  }
})
