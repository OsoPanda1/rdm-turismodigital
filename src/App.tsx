import { lazy } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "@/app/shell/AppShell"
import { Bot, Coins, Compass, Cpu, FileSearch, Hexagon, Landmark, Map as MapIcon } from "lucide-react"
import { ModulePlaceholder } from "@/app/pages/Module"

const CommandCenter = lazy(() => import("@/app/pages/CommandCenter"))
const TerritorioPage = lazy(() => import("@/pages/Territorio"))
const TurismoPage = lazy(() => import("@/pages/Turismo"))
const IdentidadPage = lazy(() => import("@/pages/Identidad"))
const RepositorioPage = lazy(() => import("@/pages/Repositorio"))
const ComercioRegistro = lazy(() => import("@/pages/ComercioRegistro"))
const AuthPage = lazy(() => import("@/pages/Auth"))
const SimplePage = lazy(() => import("@/pages/SimplePage"))

export default function App() {
  return (
    <Routes>
      {/* Redirects legacy → /app/* */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/panel" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/territorio" element={<Navigate to="/app/territory" replace />} />
      <Route path="/map" element={<Navigate to="/app/territory" replace />} />
      <Route path="/turismo" element={<Navigate to="/app/tourism" replace />} />
      <Route path="/mercado" element={<Navigate to="/app/economy" replace />} />
      <Route path="/identidad" element={<Navigate to="/app/identidad" replace />} />
      <Route path="/repositorio" element={<Navigate to="/app/devops" replace />} />
      <Route path="/comercio/registro" element={<ComercioRegistro />} />
      <Route path="/commerce" element={<Navigate to="/comercio/registro" replace />} />

      {/* Auth */}
      <Route path="/auth/login" element={<AuthPage mode="login" />} />
      <Route path="/auth/sign-up" element={<AuthPage mode="signup" />} />
      <Route path="/auth/sign-up-success" element={<SimplePage title="Registro confirmado" eyebrow="ID-NVIDA" body="Tu cuenta fue creada." />} />
      <Route path="/auth/error" element={<SimplePage title="Error de autenticación" eyebrow="ID-NVIDA" body="No fue posible completar el flujo." />} />

      {/* TAMV OS Shell */}
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<CommandCenter />} />
        <Route path="territory" element={<TerritorioPage />} />
        <Route path="tourism" element={<TurismoPage />} />
        <Route path="economy" element={<ModulePlaceholder icon={Coins} eyebrow="V · ECONOMÍA" title="Mercado Soberano" description="Directorio de comercios federados con visibilidad Tourist-First. Pago, activación y ledger MSR conectados a Stripe + BookPI™." links={[{ to: "/comercio/registro", label: "Registrar comercio" }]} />} />
        <Route path="isabella" element={<ModulePlaceholder icon={Bot} eyebrow="IA · HITL" title="Isabella · Multi-Agente" description="Orquestador conversacional con agentes especializados: turismo, territorio, economía, gobernanza, investigación y crisis. Memoria, herramientas y retrieval federado." />} />
        <Route path="governance" element={<ModulePlaceholder icon={Landmark} eyebrow="II · ESTRUCTURA" title="Gobernanza heptafederada" description="Las 7 Federaciones · Educativa, Cultural, Económica, Tecnológica, Salud, Comunicación y Gubernamental. Quórum, votaciones y firmas SHA-256." />} />
        <Route path="devops" element={<RepositorioPage />} />
        <Route path="evidence" element={<ModulePlaceholder icon={FileSearch} eyebrow="AUDITORÍA" title="Evidencia · BookPI™" description="Ledger firmado de protocolos, manuscritos y operaciones del Nodo Cero. Trazabilidad completa con audit_signatures." />} />
        <Route path="utamv" element={<ModulePlaceholder icon={Hexagon} eyebrow="RED" title="UTAMV · Red federada" description="Mesh territorial Real del Monte → Corredor de la Montaña. Nodos hermanos, peering y sincronización inter-pueblo." />} />
        <Route path="identidad" element={<IdentidadPage />} />
      </Route>

      {/* Manuscrito / Federaciones contenido público */}
      <Route path="/manuscrito" element={<SimplePage title="Manuscrito Digital" eyebrow="IV · LIBRO GÉNESIS" body="Tomos TAMV/MD-X4 firmados por EOCT · Anubis Villaseñor." />} />
      <Route path="/manuscrito/:id" element={<SimplePage title="Tomo federado" eyebrow="MANUSCRITO" body="Capítulos y firmas SHA-256 del compendio TAMV." />} />
      <Route path="/federaciones" element={<Navigate to="/app/governance" replace />} />
      <Route path="/federaciones/:id" element={<Navigate to="/app/governance" replace />} />

      <Route path="*" element={<ModulePlaceholder icon={Compass} eyebrow="404" title="Ruta no encontrada" description="El nodo solicitado no existe en TAMV OS." links={[{ to: "/app/dashboard", label: "Ir al Command Center" }]} />} />
    </Routes>
  )
}
