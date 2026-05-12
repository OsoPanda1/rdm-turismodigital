import { useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, TileLayer, CircleMarker, Tooltip, LayersControl, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.heat"
import { supabase } from "@/integrations/supabase/client"

type POI = {
  id: string
  name: string
  category: string
  municipality: string
  lat: number
  lng: number
  altitude_m: number | null
  description: string | null
  federation_id: string | null
}

const CATEGORY_COLORS: Record<string, string> = {
  mineria: "#F59E0B",
  templo: "#A855F7",
  ritual: "#EC4899",
  geologico: "#10B981",
  escuela: "#3B82F6",
  mercado: "#EF4444",
}

function HeatLayer({ points }: { points: POI[] }) {
  const map = useMap()
  const layerRef = useRef<L.Layer | null>(null)
  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current)
      layerRef.current = null
    }
    if (!points.length) return
    // weight by altitude as a proxy for use intensity
    const heatPoints = points.map((p) => [p.lat, p.lng, Math.max(0.4, (p.altitude_m ?? 2700) / 3000)]) as [number, number, number][]
    // @ts-expect-error heatLayer is added by leaflet.heat
    const heat = L.heatLayer(heatPoints, { radius: 35, blur: 25, maxZoom: 17, max: 1.0 })
    heat.addTo(map)
    layerRef.current = heat
    return () => {
      if (layerRef.current) map.removeLayer(layerRef.current)
    }
  }, [map, points])
  return null
}

export default function TerritorioPage() {
  const [pois, setPois] = useState<POI[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCats, setActiveCats] = useState<Set<string>>(new Set(Object.keys(CATEGORY_COLORS)))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase.from("pois").select("*").order("name")
      if (cancelled) return
      if (error) setError(error.message)
      else setPois((data as POI[]) ?? [])
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => pois.filter((p) => activeCats.has(p.category)), [pois, activeCats])
  const center: [number, number] = [20.1432, -98.6694]

  const toggle = (c: string) => {
    setActiveCats((prev) => {
      const next = new Set(prev)
      if (next.has(c)) next.delete(c); else next.add(c)
      return next
    })
  }

  const counts = useMemo(() => {
    const out: Record<string, number> = {}
    pois.forEach((p) => { out[p.category] = (out[p.category] ?? 0) + 1 })
    return out
  }, [pois])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 px-6 py-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">I · GEOGRAFÍA</p>
          <h1 className="font-serif text-2xl">Territorio vivo</h1>
          <p className="text-xs text-muted-foreground mt-1">{loading ? "Cargando POIs…" : `${filtered.length} de ${pois.length} POIs · 20.1432°N -98.6694°W`}</p>
        </div>
        <a href="/" className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">← inicio</a>
      </header>

      <div className="grid lg:grid-cols-[260px_1fr] gap-0">
        <aside className="border-r border-border/60 p-5 space-y-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">Categorías</p>
            <ul className="space-y-2">
              {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                <li key={cat}>
                  <button
                    onClick={() => toggle(cat)}
                    className={`w-full flex items-center justify-between text-left px-2 py-1.5 border ${activeCats.has(cat) ? "border-border/80 bg-card" : "border-border/30 opacity-50"}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-xs capitalize">{cat}</span>
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">{counts[cat] ?? 0}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-border/40 pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Capas</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">El heatmap pondera la intensidad de uso por altitud y densidad. Activa/desactiva desde el control superior derecho del mapa.</p>
          </div>
          {error ? <p className="text-[11px] text-destructive">{error}</p> : null}
        </aside>

        <div className="h-[calc(100vh-89px)]">
          <MapContainer center={center} zoom={14} scrollWheelZoom className="h-full w-full">
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Topográfico">
                <TileLayer attribution="© OpenTopoMap" url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Calles">
                <TileLayer attribution="© OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </LayersControl.BaseLayer>
            </LayersControl>
            <HeatLayer points={filtered} />

            {filtered.map((p) => (
              <CircleMarker
                key={p.id}
                center={[p.lat, p.lng]}
                radius={7}
                pathOptions={{ color: CATEGORY_COLORS[p.category] ?? "#888", fillColor: CATEGORY_COLORS[p.category] ?? "#888", fillOpacity: 0.85, weight: 2 }}
              >
                <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                  <div className="text-[11px]">
                    <div className="font-semibold">{p.name}</div>
                    <div className="opacity-70 capitalize">{p.category} · {p.altitude_m ?? "?"} msnm</div>
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
