# Plan de Migración: frontend_web → frontend_mobile (Sporting Club)

> **Documento vivo** — Generado a partir del análisis exhaustivo de `frontend_web/frontend`.
> Antes de escribir código, este plan debe ser aprobado por el usuario.

---

## 1. Resumen Ejecutivo

### 1.1 Contexto del Proyecto
- **Producto**: Sistema de Información Web para **Sporting Club**, una escuela de microfútbol.
- **Dos frontends** en el mismo repo:
  - `frontend_web` (carpeta `frontend/`) — **React 19 + Vite + React Router 7 + JWT**, patrón **MVC manual** (sin Redux/Context). **Completo y funcional**.
  - `frontend_mobile` (carpeta `frontend_mobile/`) — **Expo SDK 54 + React Native 0.81 + TypeScript + React Navigation 7 + AsyncStorage + axios**. **Básicamente esqueleto**: tiene casi todos los archivos copiados, pero solo `App.tsx` muestra un botón "Funciona". El resto de archivos están sin implementar (muchos son `.jsx` en una carpeta `.tsx`-only según `tsconfig.json`).

### 1.2 Decisión de Tecnología Mobile (justificada)
| Criterio | React Native + Expo | Flutter | Ionic |
|---|---|---|---|
| Reutilización de lógica JS/TS | ✅ Alta (mismo lenguaje) | ❌ Reescribir todo en Dart | ⚠️ Media (Angular/Vue/React) |
| Reutilización de la estructura MVC web | ✅ Directa | ❌ Cambio de paradigma | ✅ Directa |
| Compartir la misma API REST | ✅ Total | ✅ Total | ✅ Total |
| Equipo frontend React | ✅ Curva baja | ❌ Curva alta | ⚠️ Media |
| Convergencia con Vite (CLI dev) | ✅ Expo CLI / EAS | ❌ | ❌ |
| **Decisión recomendada** | ✅ **Sí** | ❌ | ❌ |

**Stack mobile confirmado** (ya está en `package.json` del mobile):
- **Expo SDK 54** + **React Native 0.81** + **React 19.1**
- **TypeScript estricto**
- **@react-navigation/native v7** + **native-stack** + **stack** (Auth flow + Tabs + Stack anidado)
- **@react-native-async-storage/async-storage** (reemplazo de localStorage)
- **axios** (disponible, aunque se puede usar `fetch` por paridad)
- **expo-status-bar**, **react-native-safe-area-context**, **react-native-screens**

### 1.3 ⚠️ Alerta sobre la versión de Expo
- `frontend_mobile/AGENTS.md` dice **"Expo HAS CHANGED — Read https://docs.expo.dev/versions/v57.0.0/"**.
- `package.json` declara `expo: ~54.0.32` y `react-native: 0.81.5`.
- **Discrepancia**: o se sube SDK a 57 (lo que implicaría actualizar `react-native` y `@react-navigation/*`), o se mantiene 54 y se omite el lineamiento del AGENTS.md.
- ✅ **Decisión confirmada por el usuario (2026-07-29)**: **mantener SDK 54**. La nota de AGENTS.md se mantiene como referencia pero no se aplica para esta migración.

### 1.4 Entorno de desarrollo confirmado
- ✅ El usuario ya dispone de **túnel QR** (Expo Go + `expo start --tunnel`), por lo que **no se requiere emulador**.
- Scripts disponibles en `package.json`: `start` (tunnel), `start:local` (LAN), `start:offline` (sin red), `web`.
- Esto resuelve el riesgo R3 del plan original (conectividad a `http://10.1.202.216:3000`).

---

## 2. Análisis Profundo del frontend_web

### 2.1 Stack y Arquitectura
| Aspecto | Valor |
|---|---|
| Framework | React 19.2.4 |
| Build | Vite 8 |
| Router | react-router-dom 7.14 |
| Estilos | CSS modules planos (sin Tailwind, sin CSS-in-JS) |
| Estado | Hooks locales (`useState`) + patrón de **services / models / controllers / hooks / views** (MVC manual) — **no hay Context ni Redux** |
| HTTP | `fetch` nativo, envuelto en `httpService.js` |
| Persistencia | `localStorage` (vía `storageService.js`) |
| Auth | JWT generado en cliente (`jwtService.js`) + verificación + `Authorization: Bearer` |
| Sin tipado | `.jsx` + `.js` puros, **TypeScript NO está en el web** |
| ESLint | Config básica |

### 2.2 Patrón arquitectónico (MVC manual)
```
config/      → constantes (api.js con todos los endpoints, constants.js vacío, routes.js)
services/    → Infraestructura (httpService, jwtService, storageService)
models/      → Capa de datos (hace fetch, normaliza la respuesta a { success, data, error })
controllers/ → Capa de negocio (valida, chequea permisos, llama al model, retorna callback)
hooks/       → Adaptadores a React (useState + onSuccess/onError de los controllers)
views/       → Componentes presentacionales + vistas (pages)
```
- **NO es el MVC clásico** porque no hay routing de URLs en el controller; los controllers exponen callbacks `onSuccess/onError` y los hooks los wrappean en `useState`.
- Esta separación **se puede replicar 1:1 en mobile** cambiando:
  - `localStorage` → `AsyncStorage`
  - `fetch` → `fetch` (sigue funcionando en RN, o axios)
  - CSS → `StyleSheet.create()` o `NativeWind`
  - `react-router-dom` → `@react-navigation/native`
  - Layout web (Sidebar + Topbar + grid CSS) → Drawer/BottomTabs + Stack + Flex

### 2.3 Mapeo de archivos web → equivalentes mobile (estado actual)
| frontend_web | frontend_mobile | Estado |
|---|---|---|
| `src/App.jsx` | `App.tsx` (solo "Funciona") | ❌ Hay que rehacer |
| `src/main.jsx` | `index.ts` (registerRootComponent) | ✅ OK |
| `src/services/httpService.js` | `services/httpService.ts` | ✅ Migrado, AsyncStorage |
| `src/services/jwtService.js` | `services/jwtService.ts` | ✅ Migrado |
| `src/services/storageService.js` | `services/storageService.ts` | ✅ Migrado (AsyncStorage) |
| `src/config/api.js` | `config/api.ts` | ✅ Migrado |
| `src/config/constants.js` | `config/constants.ts` | ⚠️ Vacíos en ambos |
| `src/config/routes.js` | `config/routes.ts` | ⚠️ Hay que poblar |
| `src/hooks/useAuth.js` | `hooks/useAuth.ts` | ⚠️ Revisar |
| `src/hooks/useUsers.js` | `hooks/useUsers.ts` | ⚠️ Revisar |
| `src/hooks/useDashboard.js` | `hooks/useDashboard.ts` | ⚠️ Revisar |
| `src/hooks/useCategories.js` | `hooks/useCategories.ts` | ⚠️ Revisar |
| `src/hooks/useProducts.js` | `hooks/useProducts.ts` | ⚠️ Revisar |
| `src/hooks/useHorary.js` | `hooks/useSchedules.ts` | ⚠️ Renombrado |
| `src/hooks/useStudents.js` (no existe) | `hooks/useStudents.ts` | ✅ Mobile lo tiene |
| `src/hooks/useTournaments.js` (no existe) | `hooks/useTournaments.ts` | ✅ Mobile lo tiene |
| `src/models/AuthModel.js` | `models/AuthModel.ts` | ✅ Migrado |
| `src/models/UserModel.js` | `models/UserModel.ts` | ⚠️ Revisar |
| `src/models/DashboardModel.js` | `models/DashboardModel.ts` | ⚠️ Revisar |
| `src/models/CategoryModel.js` | `models/CategoryModel.ts` | ⚠️ Revisar |
| `src/models/ProductModel.js` | `models/ProductModel.ts` | ⚠️ Revisar |
| `src/models/ScheduleModel.js` | `models/ScheduleModel.ts` | ⚠️ Revisar |
| `src/models/StudentModel.js` | `models/StudentModel.ts` | ⚠️ Revisar |
| `src/models/TournamentModel.js` | `models/TournamentModel.ts` | ⚠️ Revisar |
| `src/models/TeamModel.js` | `models/TeamModel.ts` | ⚠️ Revisar |
| `src/controllers/*.js` | `controllers/*.ts` | ⚠️ Revisar |
| `src/utils/helpers.js` | `utils/helpers.js` | ⚠️ Vacío |
| `src/utils/validators.js` | `utils/validators.js` | ⚠️ Vacío |
| `src/views/auth/LoginView.jsx` | `views/auth/LoginView.jsx` | ❌ Migrar a .tsx y RN |
| `src/views/auth/RegisterView.jsx` | `views/auth/RegisterView.jsx` | ❌ Migrar a .tsx y RN |
| `src/views/auth/ScheduleView.jsx` | `views/auth/ScheduleView.jsx` | ❌ Idem |
| `src/views/common/*` | `views/common/*` | ⚠️ Algunos migrados (.tsx), otros no |
| `src/views/dashboard/*` | `views/dashboard/*` | ❌ Mixto .tsx/.jsx, sin implementar |
| `src/views/layouts/*` | `views/layouts/*` | ❌ Mixto, sin implementar |
| `src/views/public/CatalogoView.jsx` | `views/public/CatalogoView.jsx` | ❌ Migrar |
| `src/views/UI/*` | `views/UI/*` | ⚠️ Solo esqueleto .tsx |
| `src/styles/*` | `styles/theme.ts` (único) | ❌ Crear resto o usar StyleSheet |
| `src/assets/*` | `src/assets/*` (PNG, SVG, logo) | ✅ Ya copiados |

> ⚠️ = archivo existe pero hay que revisar/ajustar.
> ❌ = hay que rehacer o migrar a RN.
> ✅ = ya migrado / correcto.

### 2.4 Endpoints de la API (mapeo completo)
Base URL: `http://10.1.202.216:3000/api` (vía `.env` VITE_API_URL).

| Recurso | Endpoints |
|---|---|
| **Users** | `POST /users/login`, `POST /users/create`, `GET /users`, `GET /users/:id`, `PUT /users`, `DELETE /users/delete/:id`, `PATCH /users/toggle-status/:id` |
| **Students** | `GET /students`, `POST /students/create`, `PUT /students`, `GET /students/:id`, `DELETE /students/delete/:id` |
| **Products** | `GET /products`, `POST /products/create`, `GET /products/:id`, `DELETE /products/delete/:id` |
| **Categories** | `GET /categories`, `POST /categories/create`, `GET /categories/:id`, `DELETE /categories/delete/:id` |
| **Schedules** | `GET /schedules`, `POST /schedules/create`, `GET /schedules/category/:id_category`, `DELETE /schedules/delete/:id` |
| **Tournaments** | `GET /tournaments`, `POST /tournaments/create`, `POST /tournaments/generate-teams` |

**TournamentModel** y **TeamModel** en el web son **local-only** (usan `localStorage`); no tienen endpoint real. **Migrar esa misma semántica al mobile** (usando `AsyncStorage`).

### 2.5 Sistema de Diseño (`sporting-theme.css`)
Variables CSS que deben traducirse a tokens de RN:
- `--sporting-red: #8B0000` (color de marca — primordial)
- `--sporting-red-hover: #a00000`
- `--sporting-red-gradient: linear-gradient(135deg, #8B0000 0%, #eb472ae7 100%)`
- `--sporting-dark: #111`, `--sporting-gray: #333`, `--sporting-light-gray: #f5f5f5`
- `--sporting-border: #eeeeee`, `--sporting-text: #333`, `--sporting-text-muted: #666`
- `--sporting-shadow: 0 2px 10px rgba(0,0,0,0.05)`
- `--sporting-radius: 8px`, `--sporting-radius-lg: 12px`
- Familias de fuentes: `Segoe UI, Tahoma, Geneva, Verdana, sans-serif` (RN no usa estas; usar `System` o sans-serif por defecto).
- Botones: `btn-sporting-primary`, `btn-sporting-secondary`, `btn-sporting-danger`
- Badges: `badge-sporting-admin`, `badge-sporting-seller`, `badge-sporting-customer`, `badge-sporting-user`

### 2.6 Flujos de Usuario

#### A. Autenticación
1. Usuario abre la app → ve `LoginView`.
2. LoginView → `useAuth().login(creds)` → `AuthModel.login()` → `httpService.post(/users/login)` → guardar token en AsyncStorage → redirigir.
3. Logout → `storageService.clearSession()` → redirigir a Login.

#### B. Roles y permisos
- **admin** → todo el panel + crear/eliminar usuarios.
- **seller** → panel excepto eliminar usuarios.
- **user** (estudiante) → "Student Dashboard" con Mi Panel, Mi Perfil, Mis Horarios, Mis Torneos.

#### C. Panel admin (tabs en Sidebar)
- Dashboard (resumen)
- Usuarios (CRUD)
- Categorías (CRUD)
- Horarios (CRUD)
- Estudiantes (CRUD)
- Equipos (CRUD local)
- Torneos (CRUD local + generate-teams)
- Productos (CRUD)
- Reportes (placeholder)

#### D. Panel estudiante (tabs en Sidebar)
- Mi Panel
- Mi Perfil
- Mis Horarios
- Mis Torneos

#### E. Público
- Catálogo (catálogo de productos + landing "Sobre nosotros" + hero)
- Login
- Register (solo admin/seller)

### 2.7 Lógica de Negocio Crítica (NO se debe perder)
1. **Doble validación**: el `Controller` valida campos obligatorios + permisos; el `Model` arma el payload; el `httpService` ejecuta.
2. **Normalización de respuesta**: `{ success, data, error, message }` desde el Model. **Mantener este contrato 1:1 en mobile**.
3. **Permisos por rol**: `AuthController.hasAnyRole(['admin','seller'])` y `AuthController.hasRole('admin')`.
4. **JWT simulado en cliente** + verificación con tolerancia de 5 minutos. **Mantener**.
5. **Token con prefijo `JWT `** que se limpia en `AuthModel.login`.
6. **Doble almacenamiento**: token, user, user_role por separado.

---

## 3. Estrategia de Adaptación Mobile

### 3.1 Arquitectura Mobile (equivalente)
```
frontend_mobile/
├── App.tsx                          # NavigationContainer + RootNavigator (Auth | Main)
├── index.ts                         # registerRootComponent (ya existe)
├── app.json                         # Expo config (ya existe)
├── assets/                          # Imágenes (ya copiadas)
├── src/
│   ├── config/
│   │   ├── api.ts                   # ✅ Misma API_CONFIG que el web
│   │   ├── constants.ts             # ⚠️ Constantes (storage keys, etc.)
│   │   └── routes.ts                # 🆕 Route names para React Navigation
│   ├── services/
│   │   ├── httpService.ts           # ✅ fetch + Bearer + AsyncStorage
│   │   ├── jwtService.ts            # ✅ Misma lógica
│   │   └── storageService.ts        # ✅ AsyncStorage en lugar de localStorage
│   ├── models/                      # Modelos (idénticos al web, .ts)
│   ├── controllers/                 # Controllers (idénticos, .ts)
│   ├── hooks/                       # Custom hooks (idénticos, .ts)
│   ├── types/                       # 🆕 Tipos compartidos (User, Product, etc.)
│   ├── utils/
│   │   ├── validators.ts            # 🆕 Reglas de validación reusables
│   │   └── helpers.ts               # 🆕 Helpers de formateo (fechas, COP, etc.)
│   ├── theme/
│   │   ├── colors.ts                # 🆕 Paleta Sporting (rojo #8B0000, etc.)
│   │   ├── spacing.ts               # 🆕 Escala 4/8/12/16/20/24
│   │   ├── typography.ts            # 🆕 Familias y pesos
│   │   └── index.ts                 # 🆕 Barrel export
│   ├── components/                  # 🆕 Componentes reusables RN (Button, Card, Input, Modal)
│   ├── navigation/                  # 🆕 React Navigation
│   │   ├── RootNavigator.tsx        # Decide Auth vs Main en función del token
│   │   ├── AuthNavigator.tsx        # Stack de Login/Register
│   │   ├── MainNavigator.tsx        # Drawer/BottomTabs según rol
│   │   └── linking.ts               # (opcional, deep linking)
│   ├── views/                       # Screens (cada uno su archivo .tsx)
│   │   ├── auth/                    # LoginScreen, RegisterScreen
│   │   ├── common/                  # AlertMessage, LoadingSpinner
│   │   ├── dashboard/               # DashboardScreen + sub-pantallas
│   │   ├── layouts/                 # DrawerContent, BottomTabs
│   │   └── public/                  # CatalogoScreen, HomeScreen
│   └── styles/                      # 🆕 StyleSheet compartidos si hace falta
└── MOBILE_MIGRATION_PLAN.md         # este archivo
```

### 3.2 Navegación táctil (mapping web → mobile)
| Web | Mobile |
|---|---|
| `BrowserRouter` + `<Routes>` | `NavigationContainer` + `createNativeStackNavigator` |
| Sidebar fija | `@react-navigation/drawer` (Drawer) — **usar `@react-navigation/bottom-tabs` como alternativa para pantallas principales, drawer para admin** |
| Topbar | Header del stack nativo (con botón hamburguesa) |
| `navigate('/dashboard')` | `navigation.navigate('Dashboard')` |
| `Navigate replace` | `navigation.reset()` |
| `<Route path="/dashboard/*">` (sub-rutas) | Drawer anidado con Stack dentro |
| Public navbar | `Stack` inicial: Home → Login/Register |

**Decisión concreta**:
- **Antes del login**: Stack con `Home` (catálogo público), `Login`, `Register`.
- **Después del login**:
  - Si `role === 'user'` → **Bottom Tabs** (Dashboard, Perfil, Horarios, Torneos).
  - Si `role === 'admin' | 'seller'` → **Drawer** (más opciones de admin).
- Cada tab/drawer item contiene un **Stack** interno para navegación detalle (ej: Users → UserDetail).

### 3.3 Gestión de Estado
- **Mantener** el patrón MVC + hooks locales del web.
- NO migrar a Redux/MobX/Zustand — el web no lo usa, y el alcance no lo justifica.
- Para datos globales persistentes (token, user, role) usar el `storageService` (AsyncStorage). NO Context global — coincide con el web.
- Donde el web tiene varios `useEffect` cargando datos, mantenerlos; pero considerar **`useFocusEffect`** de React Navigation para refrescar al volver a una pantalla.

### 3.4 Servicios y APIs
- **Reutilizar el 100%** de los endpoints del web.
- `httpService.ts` ya está migrado con `AsyncStorage` — ajustar a `fetch` (que ya está) y opcionalmente migrar a `axios` (ya está en deps).
- **Errores específicos de mobile**:
  - Sin red → mensaje "Sin conexión" + sugerir reintento.
  - Timeout → configurable (10s por defecto en el web; mantener).
  - Token expirado → cerrar sesión automáticamente (en RN, integrar listener de `AppState`).

### 3.5 Offline
- **Fase 1**: sin offline (igual que el web).
- **Fase 2 (futuro)**: cachear catálogos y torneos (TournamentModel + TeamModel son local-only, usan AsyncStorage en mobile).

### 3.6 Componentes UI — Adaptación 1:1
| Web (JSX) | Mobile (RN) | Notas |
|---|---|---|
| `<button className="btn-sporting-primary">` | `<Button variant="primary" />` | `Pressable` + StyleSheet |
| `<input>` | `<Input label="..." />` | `TextInput` controlado |
| `<table>` | `<FlatList>` o tarjetas | Las tablas HTML no existen en RN |
| `<Modal>` | `<Modal visible={} />` | RN tiene `Modal` nativo |
| `<Card>` | `<Card />` con `View` + `StyleSheet` | Sombras con `elevation` |
| `<PageHeader />` | `<PageHeader />` con título + subtítulo | Equivalente directo |
| `<LoadingSpinner />` | `<ActivityIndicator />` | Nativo |
| `<AlertMessage type="error" />` | `<AlertMessage />` con `Pressable` para cerrar | Equivalente directo |

---

## 4. Plan de Implementación por Fases

### Fase 0 — Aprobación y Ajustes Previos (sin código nuevo)
1. **Confirmar versión de Expo**: SDK 54 (instalado) o subir a 57 según `AGENTS.md`.
2. **Estrategia de tipos**: `tsconfig.json` ya tiene `strict: true`. Mantener.
3. **Limpiar archivos `.jsx`** en carpetas `src/` que rompen el strict de TS (renombrar a `.tsx` o eliminar si son stubs vacíos).

### Fase 1 — Cimientos (estructura + navegación + auth) — **prioridad alta**
**Objetivo**: app que arranca, navega y autentica contra el backend real.

1. Renombrar todos los `.jsx` huérfanos en `src/` a `.tsx` o eliminarlos.
2. Crear `src/theme/` (colors, spacing, typography, index).
3. Crear `src/types/` (User, Product, Tournament, Schedule, Category, Student, Team, AuthResponse).
4. Poblar `src/config/constants.ts` y `src/config/routes.ts`.
5. Crear `src/utils/validators.ts` y `src/utils/helpers.ts` reusables.
6. Crear `src/components/` base:
   - `Button.tsx` (variant: primary | secondary | danger, fullWidth, loading).
   - `Input.tsx` (label, value, onChangeText, error, secureTextEntry, keyboardType).
   - `Card.tsx` (children, style).
   - `Loading.tsx` (ActivityIndicator con texto opcional).
   - `AlertMessage.tsx` (success/error/warning con onClose).
   - `Modal.tsx` (visible, onClose, title, children).
7. Crear `src/navigation/RootNavigator.tsx` con switch Auth/Main según token.
8. Crear `src/navigation/AuthNavigator.tsx` (Login, Register).
9. Crear `src/views/auth/LoginScreen.tsx` funcional.
10. Crear `src/views/auth/RegisterScreen.tsx` funcional (solo admin/seller — replica la lógica del web).
11. Verificar modelos/controllers/hooks de auth en `.ts` (que ya están migrados pero falta testear).
12. Pantalla pública: `src/views/public/HomeScreen.tsx` (catálogo público + hero).

**Entregable Fase 1**: app que arranca, muestra Home público, hace login real, redirige al panel.

### Fase 2 — Panel administrativo (admin/seller)
1. `src/navigation/MainNavigator.tsx` con Drawer (admin/seller) y Bottom Tabs (user).
2. `src/views/layouts/DrawerContent.tsx` con menú admin (mismas opciones que Sidebar web).
3. `src/views/layouts/BottomTabs.tsx` con menú estudiante.
4. `src/views/dashboard/DashboardScreen.tsx` con métricas (Students, Categories, Schedules, Tournaments, Products, Teams).
5. Implementar pantallas (al menos 3 prioritarias):
   - **UsersScreen** + UserFormScreen (CRUD con permisos).
   - **CategoriesScreen** (CRUD).
   - **TournamentsScreen** (CRUD local + agregar estudiante).
6. AlertMessage, Loading, Modal reusables en cada pantalla.

**Entregable Fase 2**: panel admin navegable con 3 CRUD completos.

### Fase 3 — Panel estudiante + resto de pantallas
1. **StudentDashboardScreen**, **ProfileScreen**, **SchedulesScreen**, **MyTournamentsScreen**.
2. **ProductsScreen**, **TeamsScreen**, **ReportsScreen**, **StudentsScreen**.
3. Catálogo público con scroll y cards.

### Fase 4 — Pulido
1. Manejo de errores de red (sin conexión, timeout, 401).
2. Persistencia de sesión en frío (arranque con token válido).
3. Logout en background (AppState).
4. Accesibilidad: roles ARIA en RN → `accessibilityLabel`, `accessibilityRole`.
5. Theming con `useColorScheme` (dark mode opcional).
6. Internacionalización (es-CO ya está en español; mantener).

---

## 5. Estimación de Esfuerzo por Módulo

| Módulo | Esfuerzo | Notas |
|---|---|---|
| Renombrar/limpiar `.jsx` huérfanos | 0.5 h | Mecánico |
| Theme + tokens | 1 h | |
| Tipos TS compartidos | 1 h | |
| Config (constants, routes) | 0.5 h | |
| Utils (validators, helpers) | 1.5 h | |
| Componentes base (6) | 4 h | |
| Navigation root + auth | 3 h | |
| LoginScreen + RegisterScreen | 4 h | |
| HomeScreen público | 2 h | |
| Drawer/BottomTabs | 2 h | |
| DashboardScreen + métricas | 3 h | |
| UsersScreen CRUD | 4 h | |
| CategoriesScreen CRUD | 3 h | |
| TournamentsScreen CRUD | 3 h | |
| Pantallas restantes (6) | 12 h | |
| Pulido (errores, accesibilidad) | 4 h | |
| **TOTAL estimado** | **~48 h** | (≈ 1.5 semanas a tiempo parcial) |

---

## 6. Riesgos Identificados

| # | Riesgo | Mitigación |
|---|---|---|
| R1 | **Discrepancia Expo SDK 54 vs AGENTS.md v57** | Confirmar con usuario antes de instalar deps nuevas. |
| R2 | **Archivos `.jsx` mezclados con `.tsx`** rompen `tsconfig` strict | Renombrar/eliminar en Fase 0. |
| R3 | **El backend real es `http://10.1.202.216:3000`** (IP LAN) — desde un celular físico requiere tunnel (`expo start --tunnel`) | Ya hay scripts `start:local`, `start:offline`, `start:tunnel` en `package.json`. Documentar en README del mobile. |
| R4 | **JWT simulado en cliente** (no real) → el web verifica con `btoa/atob` que no existen en RN | `jwtService.ts` ya existe — verificar que `Buffer`/base64 funcione en RN (sí funciona `atob` con `Buffer` polyfill o `global.atob` que existe en Hermes desde RN 0.72). Si falla, usar `js-base64`. |
| R5 | **TournamentModel + TeamModel son local-only** — inconsistente con backend que sí tiene `/tournaments` | Mantener semántica local (igual que web) pero documentar para migración futura. |
| R6 | **Tailoring de Expo para admin/seller con Drawer** requiere `@react-navigation/drawer` + `react-native-gesture-handler` + `react-native-reanimated` | Confirmar instalación antes. Si no se instalan, sustituir por Bottom Tabs + un Stack padre. |
| R7 | **Sin tests** en el web ni en el mobile | Estrategia de testing abajo (recomendado, no obligatorio en Fase 1). |
| R8 | **`localStorage.getItem('auth_token')` en DashboardView.jsx web** — debe sustituirse por `await storageService.getToken()` en mobile | Refactor en migración. |

---

## 7. Estrategia de Testing Recomendada

### 7.1 Unit (Fase 1 en adelante)
- **Framework**: Jest (incluido en Expo) + `@testing-library/react-native`.
- **Cobertura objetivo**: models, controllers, utils, validators (lógica pura, sin RN).
- **Ejemplo**: testear que `UserModel.createUser` arma el payload correcto con `category_id` parseado a `int`.

### 7.2 Integración (Fase 2)
- Mockear `httpService` con `jest.mock('../services/httpService')`.
- Verificar que los hooks (`useUsers`, `useDashboard`) actualizan `loading`, `error`, `data`.

### 7.3 E2E (opcional, Fase 4)
- **Detox** o **Maestro** — flujo login → ver dashboard.

### 7.4 Accesibilidad
- Validar `accessibilityLabel` y `accessibilityRole` en componentes interactivos.
- Probar con VoiceOver (iOS) y TalkBack (Android).

---

## 8. Recomendaciones Técnicas

1. **NO instalar Redux/MobX/Zustand**: el web no lo usa y el patrón MVC + hooks es suficiente. Mantener paridad.
2. **NO migrar a Tailwind/NativeWind en Fase 1**: empezar con `StyleSheet.create` y un objeto `theme` compartido. NativeWind se puede añadir si el código crece.
3. **Tipado estricto desde el inicio**: TS strict ya está activo. No usar `any` salvo adaptadores HTTP.
4. **Estructura de carpetas por dominio** (`views/dashboard/users/`, `views/dashboard/categories/`) cuando crezca — mejor que la actual `views/dashboard/*` plana.
5. **Componentes con `forwardRef` + `Pressable`** en lugar de `TouchableOpacity` (más moderno, mejor performance).
6. **Formularios**: empezar con `useState`; considerar `react-hook-form` solo si los formularios crecen mucho (Register tiene 14 campos).
7. **Errores**: un hook `useApiError()` que normalice errores de red / 4xx / 5xx y devuelva `{ message, retry }`.
8. **Seguridad**: el `VITE_JWT_SECRET` del `.env` web es **simulado** (no es un secreto real). En mobile ni siquiera debe existir. Usar `expo-secure-store` si en el futuro se quiere persistir tokens de forma más segura.
9. **Versionado API**: añadir `API_CONFIG.VERSION = '/api/v1'` y un helper que prependa la versión.

---

## 9. Decisiones Confirmadas (2026-07-29)

| # | Decisión | Resultado |
|---|---|---|
| D1 | Versión de Expo | ✅ **Mantener SDK 54** (expo@~54.0.32, react-native@0.81.5). La nota del AGENTS.md queda como referencia futura, no aplica ahora. |
| D2 | Cliente HTTP | ✅ **`fetch` nativo** (paridad con frontend_web). httpService.ts ya está migrado; no se instala axios. |
| D3 | Persistencia token | ✅ **`AsyncStorage`** (ya en uso en storageService.ts). Suficiente para el alcance. |
| D4 | Navegación admin | ✅ **Drawer** con `@react-navigation/drawer`. Bottom Tabs solo para estudiantes. |
| D5 | Entorno dev | ✅ **Túnel QR** (Expo Go + `expo start --tunnel`). Sin emulador. |
| D6 | Almacenamiento de Torneos/Equipos | ⚠️ Por defecto: **Local con AsyncStorage** (igual que web). Documentar para futura migración a backend. |
| D7 | Tests | ⏸️ **Postergar a Fase 4** (no prioritario para esta migración). |

---

## 10. Listo para Implementación

Con las decisiones D1–D5 confirmadas, el plan está listo para ejecutarse.

**Próximos pasos al aprobar**:
1. Ejecutar **Fase 0** (limpieza de `.jsx` huérfanos, renombrar a `.tsx` o eliminar).
2. Instalar peers del Drawer: `@react-navigation/drawer`, `react-native-gesture-handler`, `react-native-reanimated`.
3. Proceder con **Fase 1** (auth + navegación + 1 pantalla pública).
4. Continuar con **Fases 2 y 3** progresivamente.

**No se escribirá código de implementación hasta tu aprobación explícita de este plan.**

---

### Anexo A — Recursos clave consultados
- `/c/Users/Aprendiz/Documents/git/Sporting/frontend_web/frontend/src/config/api.js` (endpoints)
- `/c/Users/Aprendiz/Documents/git/Sporting/frontend_web/frontend/src/services/httpService.js` (cliente HTTP)
- `/c/Users/Aprendiz/Documents/git/Sporting/frontend_web/frontend/src/services/storageService.js` (persistencia)
- `/c/Users/Aprendiz/Documents/git/Sporting/frontend_web/frontend/src/services/jwtService.js` (auth)
- `/c/Users/Aprendiz/Documents/git/Sporting/frontend_web/frontend/src/models/*.js` (modelos)
- `/c/Users/Aprendiz/Documents/git/Sporting/frontend_web/frontend/src/controllers/*.js` (controllers)
- `/c/Users/Aprendiz/Documents/git/Sporting/frontend_web/frontend/src/hooks/*.js` (hooks)
- `/c/Users/Aprendiz/Documents/git/Sporting/frontend_web/frontend/src/views/**/*.{jsx}` (vistas)
- `/c/Users/Aprendiz/Documents/git/Sporting/frontend_web/frontend/src/styles/sporting-theme.css` (tema)
- `/c/Users/Aprendiz/Documents/git/Sporting/frontend_web/frontend/src/App.jsx` + `main.jsx` (entrypoint y rutas)
- `/c/Users/Aprendiz/Documents/git/Sporting/frontend_web/frontend/.env` (config API)
- `/c/Users/Aprendiz/Documents/git/Sporting/frontend_mobile/package.json` (deps mobile)
- `/c/Users/Aprendiz/Documents/git/Sporting/frontend_mobile/App.tsx` (entrypoint actual)
- `/c/Users/Aprendiz/Documents/git/Sporting/frontend_mobile/AGENTS.md` (lineamiento Expo v57)