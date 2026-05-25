import { Component, type ReactNode } from "react"

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error) { console.error("[ErrorBoundary]", error) }
  render() {
    if (this.state.error) {
      return (
        <div className="p-10">
          <div className="glass rounded-lg p-6 max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-destructive mb-2">Módulo en falla</p>
            <h2 className="font-serif text-xl mb-3">Contención activa</h2>
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{this.state.error.message}</pre>
            <button onClick={() => this.setState({ error: null })} className="mt-4 px-3 py-1.5 border border-border text-xs font-mono uppercase tracking-widest hover:bg-white/[0.04]">Reintentar</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}