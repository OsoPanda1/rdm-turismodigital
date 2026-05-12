# RDM Digital / TAMV Online

## Resumen ejecutivo
RDM Digital es una plataforma territorial digital basada en React + Vite + Supabase, orientada a operar identidad digital, cartografía territorial, turismo inteligente, telemetría, repositorio evolutivo GitHub, protocolos TAMV y módulos de economía/operación federada en un mismo sistema.

No es solo una landing: es un stack operativo con frontend productivo, stores de estado de dominio, funciones Edge para procesos críticos y componentes de análisis visual (dashboard, anillo federado, ECG operativo).

---

## 1) ¿Qué es el proyecto?
RDM Digital / TAMV Online es una arquitectura de software cívico-territorial para:
- **Identidad y acceso** (ID-NVIDA + autenticación Supabase).
- **Turismo inteligente** (contenido, exploración y asistencia IA contextual).
- **Territorio digital** (componentes de mapa y visualización de nodos).
- **Repositorio evolutivo** (ingesta y clasificación de repos GitHub por federaciones).
- **Gobernanza operativa** (protocolos EOCT/MSR/BookPI, dashboard y consola).

---

## 2) ¿Para qué sirve?
Sirve como núcleo de operación digital para una estrategia “smart territory / twin city” en Real del Monte, permitiendo:
1. Publicar servicios ciudadanos y comerciales en una UI única.
2. Medir estado operativo de nodos, telemetría y señales de red.
3. Integrar conocimiento vivo desde GitHub para el ecosistema TAMV/RDM.
4. Preparar despliegue progresivo hacia un sistema federado multi-módulo.

---

## 3) ¿Qué hace hoy (capacidades implementadas)?

### Frontend y navegación
- Aplicación SPA React con ruteo por dominios: `home`, `dashboard`, `repositorio`, `territorio`, `turismo`, `identidad`, `auth`.  
- Vistas de operación: dashboard modular (`ECG`, `anillo`, `consola`) y explorador de repositorios filtrable.

### Estado y lógica
- Stores por dominio para red, economía e Isabella (estado de nodos, balance, salud operativa).  
- Capa de clasificación de repositorios por federación y tipología para análisis del ecosistema.

### Backend serverless (Supabase Edge Functions)
- Endpoints para: `github-sync`, `dashboard-summary`, `federation-state`, `telemetry-ingest`, `protocols-execute`, `places-register`, `stripe-checkout`, `stripe-webhook`, `billing-monthly`, `isabella-chat`, `kernel-isabella-chat`, `isabella-evaluate`, `kernel-isabella-evaluate`.

### Datos y persistencia
- Migraciones SQL versionadas en `supabase/migrations`.
- Integración de cliente Supabase en frontend.

---

## 4) ¿Cómo lo hace? (arquitectura técnica)

### Stack principal
- **Frontend:** React 18 + Vite + TypeScript + React Router.
- **Data fetching/cache:** TanStack React Query.
- **Estilo/UI:** Tailwind + Radix UI + componentes custom.
- **Mapeo/geo:** Leaflet + React-Leaflet.
- **Gráficas:** Recharts.
- **Backend operacional:** Supabase Edge Functions (Deno).
- **Pagos:** Stripe (checkout + webhook).

### Patrón de ejecución
1. UI consume datos de Supabase y GitHub API.
2. React Query cachea y normaliza sincronizaciones.
3. Stores de dominio mantienen señal operacional en tiempo real de vistas críticas.
4. Edge Functions ejecutan procesos de integración, validación y orquestación.

---

## 5) Misión, visión y objetivos

### Misión
Construir una infraestructura digital territorial auditable, útil y soberana para ciudadanía, comercio e instituciones, con enfoque en interoperabilidad, trazabilidad y operación continua.

### Visión
Ser referencia de plataforma civilizatoria digital hispanoamericana en modelos smart city / digital twin federados, integrando territorio, conocimiento, economía y gobernanza en una sola arquitectura viva.

### Objetivos estratégicos
- Consolidar el núcleo operativo RDM/TAMV en producción estable.
- Unificar identidad, observabilidad y protocolos bajo estándares de confiabilidad medibles.
- Acelerar despliegue por módulos sin perder coherencia arquitectónica.

---

## 6) Porcentaje real de avance hacia producción y despliegue

## Estimación actual: **72%**

### Justificación técnica de la estimación
**Fortalezas ya implementadas (alto peso):**
- Base frontend productiva funcional.
- Integración Supabase/Edge Functions real.
- Dashboard, repositorio y módulos operativos con datos vivos.
- Pipeline de build estable.

**Brechas para 100% producción (pendientes críticos):**
- Hardening de seguridad integral (RLS exhaustivo, limitación de tasa sistemática, observabilidad transversal).
- SLO/SLI formales y alertamiento operativo completo.
- Cobertura de pruebas end-to-end y pruebas de carga.
- Automatización madura de despliegue/rollback multi-entorno.

> Nota: 72% es una estimación de madurez técnica del producto (no de “idea”), con enfoque en readiness operativo.

---

## 7) Biografía del CEO fundador (fuente interna del proyecto)
Con base en los textos existentes dentro del repositorio, el proyecto atribuye su conceptualización filosófica y parte de su construcción a **Anubis Villaseñor**. Se describe como una iniciativa de alto alcance civilizatorio, con énfasis en blindaje jurídico-legal, integración tecnológica y visión sistémica de largo plazo.

**Importante:** este README evita inventar datos biográficos no verificables (edad, historial laboral, estudios o cargos externos) que no estén explicitados en el propio proyecto.

---

## 8) Posicionamiento tecnológico
RDM Digital se posiciona como una plataforma híbrida entre:
- **Smart city OS** (servicios territoriales y observabilidad),
- **Digital twin operativo** (visualización de nodos/telemetría),
- **Knowledge-driven platform** (repositorio evolutivo y clasificación de ecosistema),
- **Capa protocolaria/federada** (EOCT/MSR/BookPI como narrativa de gobernanza técnica).

### Diferenciadores
1. Unión de producto cívico, turismo y operación territorial en una sola base de código.
2. Arquitectura preparada para crecimiento federado por dominios.
3. Integración temprana de IA y telemetría en flujos prácticos (no solo demostrativos).

---

## 9) Estructura del repositorio (macro mapa)
- `src/pages`: superficies de producto por dominio.
- `src/components`: UI y módulos operativos (RDM/TAMV).
- `src/stores`: estado de red, economía, Isabella.
- `src/lib`: utilidades de negocio (GitHub, pagos, TAMV engines, paginación).
- `supabase/functions`: backend serverless por caso de uso.
- `supabase/migrations`: evolución de esquema de datos.
- `core/`: motores de orquestación, evento y espacialidad.
- `infra/`: seguridad, tracing y artefactos de operación.

---

## 10) Instalación y ejecución
```bash
pnpm install
pnpm dev
```

Build de producción:
```bash
pnpm build
```

Preview local:
```bash
pnpm preview
```

---

## 11) Ruta recomendada para llegar a 100% producción
1. Formalizar seguridad de datos end-to-end (RLS, secretos, auditoría y threat-model).
2. Instrumentar observabilidad completa (logs estructurados, métricas y tracing unificados).
3. Implementar pruebas e2e/regresión + carga con umbrales de calidad bloqueantes.
4. Definir pipeline CI/CD con estrategias canary y rollback validado.
5. Cerrar brechas UX de páginas placeholder y estandarizar design system operativo.

---

## 12) Declaración final
RDM Digital no se presenta como un prototipo estático: es una base funcional de sistema territorial digital con capacidad real de evolucionar a operación institucional, siempre que complete su fase de hardening y gobierno de producción.
