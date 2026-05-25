import { Suspense, type ReactNode } from "react"
import { Outlet } from "react-router-dom"
import { EnterpriseSidebar } from "./EnterpriseSidebar"
import { TopCommandBar } from "./TopCommandBar"
import { Breadcrumbs } from "./Breadcrumbs"
import { ErrorBoundary } from "./ErrorBoundary"

function Fallback() {
  return (
    <div className="grid place-items-center h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Cargando módulo</p>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <EnterpriseSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopCommandBar />
        <Breadcrumbs />
        <main className="flex-1 min-w-0">
          <ErrorBoundary>
            <Suspense fallback={<Fallback />}>{children ?? <Outlet />}</Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}