import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

type QueryStatus = "idle" | "loading" | "success" | "error"

interface UseSupabaseQueryOptions<T> {
  table: string
  select?: string
  match?: Record<string, unknown>
  order?: { column: string; ascending?: boolean }
  limit?: number
  transform?: (rows: unknown[]) => T[]
}

export function useSupabaseQuery<T = unknown>({ table, select = "*", match, order, limit, transform }: UseSupabaseQueryOptions<T>) {
  const [data, setData] = useState<T[] | null>(null)
  const [status, setStatus] = useState<QueryStatus>("idle")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setStatus("loading")
      let query = supabase.from(table as never).select(select)
      if (match) query = query.match(match)
      if (order) query = query.order(order.column, { ascending: order.ascending ?? true })
      if (limit) query = query.limit(limit)
      const { data: rowsData, error: queryError } = await query
      if (cancelled) return
      if (queryError) { setError(queryError.message); setStatus("error"); return }
      const rows = (rowsData as unknown[]) ?? []
      setData(transform ? transform(rows) : (rows as T[]))
      setStatus("success")
    }
    run()
    return () => { cancelled = true }
  }, [limit, match, order, select, table, transform])

  return { data, status, error }
}
