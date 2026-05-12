import { Navigate, Route, Routes } from "react-router-dom"
import Home from "@/pages/Home"
import RepositorioPage from "@/pages/Repositorio"
import SimplePage from "@/pages/SimplePage"
import DashboardPage from "@/pages/Dashboard"
import AuthPage from "@/pages/Auth"
import ComercioRegistro from "@/pages/ComercioRegistro"
import TurismoPage from "@/pages/Turismo"
import TerritorioPage from "@/pages/Territorio"
import IdentidadPage from "@/pages/Identidad"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/repositorio" element={<RepositorioPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/panel" element={<DashboardPage />} />
      <Route path="/turismo" element={<TurismoPage />} />
      <Route path="/comercio/registro" element={<ComercioRegistro />} />
      <Route path="/commerce" element={<ComercioRegistro />} />
      <Route path="/auth/login" element={<AuthPage mode="login" />} />
      <Route path="/auth/sign-up" element={<AuthPage mode="signup" />} />
      <Route path="/auth/sign-up-success" element={<SimplePage title="Registro confirmado" eyebrow="ID-NVIDA" body="Tu cuenta fue creada. Revisa tu correo si Supabase requiere verificación." />} />
      <Route path="/auth/error" element={<SimplePage title="Error de autenticación" eyebrow="ID-NVIDA" body="No fue posible completar el flujo de acceso." />} />
      <Route path="/territorio" element={<TerritorioPage />} />
      <Route path="/identidad" element={<IdentidadPage />} />
      <Route path="/map" element={<Navigate to="/territorio" replace />} />
      <Route path="/mercado" element={<SimplePage title="Mercado soberano" eyebrow="ECONOMÍA" body="Directorio y visibilidad condicionada a comercios activos del Nodo Cero." />} />
      <Route path="/mercado/recibo" element={<SimplePage title="Recibo federado" eyebrow="PAGOS" body="Confirmación de aportación y ledger MSR del Mercado Soberano." />} />
      <Route path="/manuscrito" element={<SimplePage title="Manuscrito Digital" eyebrow="IV · LIBRO GÉNESIS" body="Tomos TAMV/MD-X4 firmados por Edwin Oswaldo Castillo Trejo · Anubis Villaseñor." />} />
      <Route path="/manuscrito/:id" element={<SimplePage title="Tomo federado" eyebrow="MANUSCRITO" body="Capítulos y firmas SHA-256 del compendio TAMV." />} />
      <Route path="/federaciones" element={<SimplePage title="Las 7 Federaciones" eyebrow="II · ESTRUCTURA" body="Educativa, Cultural, Económica, Tecnológica, Salud, Comunicación y Gubernamental." />} />
      <Route path="/federaciones/:id" element={<SimplePage title="Federación TAMV" eyebrow="JURISDICCIÓN" body="Dominio operativo autónomo interconectado por EOCT, MSR y BookPI." />} />
      <Route path="*" element={<SimplePage title="Ruta no encontrada" eyebrow="404" body="El nodo solicitado aún no está publicado en el router Lovable/Vite." />} />
    </Routes>
  )
}
