# Consultorio Odontológico Dra. Silvia Pellegrino

Sitio institucional de una sola vista (*one-page*) para un consultorio odontológico en La Tablada, Zona Oeste, Provincia de Buenos Aires. Next.js 16 con App Router, 100% estático, desplegado en Vercel.

No hay backend, ni base de datos, ni API routes, ni formularios: el contacto se resuelve con un enlace `tel:` y un mapa embebido de Google Maps.

---

## 1. Arquitectura

El repositorio tiene un único paquete, que vive en la subcarpeta `client/`. La raíz del repositorio solo contiene esa carpeta.

```
Consultorio-Odontologia/          <- raíz del repo (git)
└── client/                       <- único paquete npm/bun
    ├── app/                      <- App Router de Next.js
    ├── public/                   <- assets estáticos + contenido en JSON
    ├── package.json
    ├── next.config.ts
    ├── vercel.json
    ├── postcss.config.mjs
    ├── eslint.config.mjs
    └── tsconfig.json
```

### Flujo de renderizado

```
                          layout.tsx  (Server Component)
                          ├── metadata (SEO, OG, Twitter, robots, keywords)
                          ├── JSON-LD  <script type="application/ld+json">  -> schema.org/Dentist
                          ├── next/font/google  -> Instrument Serif + Playfair Display
                          ├── globals.scss
                          └── <Preloader>            (client, overlay hasta precargar 3 imágenes)
                                ├── {children}
                                └── <Footer>         -> Link a /Terminos
                                    <SpeedInsights>  (@vercel/speed-insights)

  page.tsx  ("/")                                    Terminos/page.tsx  ("/Terminos")
  ├── <Header>       id=—      fetch /json/header.json        └── fetch /json/tyc.json
  │     └── <HeaderLinks>  react-scroll + useActiveSection         └── <LegalSection> xN
  ├── <Dentista>     id=dentista
  │     ├── <Presentation>       (h1, bio, <a href="tel:">)
  │     └── <CardsDentista>      (3 tarjetas, datos hardcodeados)
  ├── <Nosotros>     id=nosotros
  │     ├── <LeftComponent>      (foto, anima al entrar en viewport)
  │     └── <RightComponent>     (texto + 2 <UnorderedList>)
  ├── <Tratamientos> id=tratamientos   fetch /json/tratamientos.json
  │     └── <TratamientoItem>    (grilla de 8 tratamientos)
  └── <Contacto>     id=contacto       fetch /json/contacto.json
        ├── <ContactoMap>        (<iframe> Google Maps)
        └── <ContactoItem>       (dirección, teléfono, horarios)
```

### Dirección de las dependencias

- `layout.tsx` y `page.tsx` son Server Components; solo componen.
- Los componentes que necesitan navegador (`"use client"`) son los que usan `IntersectionObserver`, `fetch` en `useEffect` o `react-scroll`: `Header`, `HeaderLinks`, `Preloader`, `Tratamientos`, `Contacto`, `LeftComponent`, `RightComponent`, `Terminos/page.tsx`.
- El contenido editable (links del header, tratamientos, datos de contacto, términos y condiciones) **no está en el código**: vive en `public/json/*.json` y se pide por `fetch` en tiempo de ejecución. Cambiar un tratamiento o un horario no requiere tocar TypeScript.
- Excepción a esa regla: las 3 tarjetas de `CardsDentista.tsx` y las dos listas de `RightComponent.tsx` sí están hardcodeadas en el componente.

---

## 2. Stack real

Versiones tal como figuran en `client/package.json`.

### Dependencias

| Paquete | Versión | Para qué |
|---|---|---|
| `next` | 16.1.2 | Framework, App Router, build estático |
| `react` / `react-dom` | 19.2.3 | Librería de UI |
| `sass` | ^1.101.0 | Compila `app/globals.scss` (mixins, variables de breakpoint) |
| `react-scroll` | ^1.9.3 | Scroll suave del header hacia cada sección |
| `react-intersection-observer` | ^10.0.3 | Dispara las animaciones de entrada al llegar a la sección |
| `@vercel/speed-insights` | ^1.3.1 | Métricas de Core Web Vitals en Vercel |
| `framer-motion` | ^12.42.2 | **Sin uso.** No aparece importado en ningún archivo de `app/` (ver §11) |

### Dependencias de desarrollo

| Paquete | Versión | Para qué |
|---|---|---|
| `typescript` | ^5.9.3 | Tipado, `strict: true` |
| `eslint` | ^9.39.4 | Linter (flat config) |
| `eslint-config-next` | 16.1.2 | Reglas `core-web-vitals` + `typescript` |
| `postcss` | ^8.5.16 | Pipeline de CSS |
| `@tailwindcss/postcss` / `tailwindcss` | ^4.3.2 | **Instalado pero inerte.** El plugin está en `postcss.config.mjs`, pero `globals.scss` nunca hace `@import "tailwindcss"` y no hay clases utilitarias en los `.tsx` (ver §11) |
| `autoprefixer` | ^10.5.2 | **Sin uso.** No está declarado como plugin en `postcss.config.mjs` |
| `@types/node`, `@types/react`, `@types/react-dom`, `@types/react-scroll` | — | Tipos |

Gestor de paquetes fijado: `bun@1.3.14` (campo `packageManager`). El lockfile versionado es `bun.lock`.

---

## 3. Estructura de archivos

```
client/app/
├── layout.tsx                 Root layout: metadata, JSON-LD, fuentes, Preloader, Footer
├── page.tsx                   Home: compone las 4 secciones
├── globals.scss               819 líneas. TODO el CSS del sitio
├── favicon.ico
├── robots.ts                  Genera /robots.txt
├── sitemap.ts                 Genera /sitemap.xml
├── lib/
│   └── site.ts                Resuelve la URL canónica del sitio
├── hooks/
│   └── useActiveSection.ts    IntersectionObserver -> id de la sección visible
├── Terminos/
│   ├── page.tsx               Ruta /Terminos
│   └── LegalSection.tsx       Render de una sección legal + subsecciones
└── _components/               Carpeta privada (el guion bajo la excluye del routing)
    ├── preloader/Preloader.tsx
    ├── header/{Header,HeaderLinks}.tsx
    ├── dentista/{Dentista,Presentation}.tsx  +  cards/CardsDentista.tsx
    ├── nosotros/Nosotros.tsx  +  left/LeftComponent.tsx  +  right/{RightComponent,UnorderedList}.tsx
    ├── tratamientos/{Tratamientos,TratamientoItem}.tsx
    ├── contacto/{Contacto,ContactoItem,ContactoMap}.tsx
    └── footer/Footer.tsx

client/public/
├── json/
│   ├── header.json            4 links de navegación
│   ├── tratamientos.json      8 tratamientos (src, alt, title)
│   ├── contacto.json          3 bloques: dirección, teléfono, horarios
│   └── tyc.json               Términos y condiciones + política de privacidad
├── img/
│   ├── backgrounds/           backgroundDentist.webp, backgroundTreatments.webp
│   ├── dentist/               dentist.webp + icons/{expert,uba,atencion}.webp
│   ├── treatments/            8 .webp, uno por tratamiento
│   └── us/us.webp             Foto usada también como imagen Open Graph
└── design/                    Flyers y mockup de diseño (ver §7 y §11)
```

---

## 4. Rutas

Salida verificada de `bun run build` (Next.js 16.1.2, Turbopack). **Las cinco rutas son estáticas**; no hay ninguna función serverless.

| Ruta | Tipo | Origen |
|---|---|---|
| `/` | Static | `app/page.tsx` |
| `/Terminos` | Static | `app/Terminos/page.tsx` |
| `/robots.txt` | Static | `app/robots.ts` |
| `/sitemap.xml` | Static | `app/sitemap.ts` |
| `/_not-found` | Static | 404 por defecto de Next |

La navegación del header **no cambia de ruta**: son anclas a los `id` de las secciones de `/`, resueltas por `react-scroll`.

---

## 5. Modelo de datos

No hay base de datos. El "modelo" son cuatro archivos JSON servidos como assets estáticos desde `public/json/`, consumidos con `fetch` desde el cliente.

### `header.json` → `LinkItem` (`HeaderLinks.tsx`)

```ts
{ id: number; ref: string; text: string }
```

`ref` debe coincidir exactamente con el `id` del `<div>` de la sección en `page.tsx` (`dentista`, `nosotros`, `tratamientos`, `contacto`). Si no coincide, el link no scrollea y el punto activo nunca se enciende.

### `tratamientos.json` → `Tratamiento` (`TratamientoItem.tsx`)

```ts
{ id: number; src: string; alt: string; title: string }
```

`src` es una ruta absoluta bajo `public/` y la imagen se renderiza con `next/image` a 160×160.

### `contacto.json` → `Contacto` (`ContactoItem.tsx`)

```ts
{ id: number; subtitle: string; item: string; extra?: string }
```

`extra` es opcional: se usa para la segunda línea del bloque de horarios.

### `tyc.json` → `LegalDataProps` (`LegalSection.tsx`)

```ts
{
  id: string;
  title: string;
  description: string;          // se omite del render si es ""
  subsections: {
    id: string;
    subtitle: string;
    items: string[];
  }[]
}
```

Tres secciones: *Términos y Condiciones de Uso*, *Política de Privacidad*, *Contacto*.

### Decisiones no obvias

- **Los JSON no se importan, se piden por `fetch`.** Con `resolveJsonModule: true` en `tsconfig.json` se podrían importar y quedarían embebidos en el bundle. Se eligió `fetch` para poder editar el contenido sin recompilar. El costo es que la sección aparece vacía durante el primer frame y que el tipado de la respuesta es una aserción (`items as LegalDataProps[]`), no una validación.
- **La antigüedad profesional se calcula, no se escribe.** `Presentation.tsx`: `new Date().getFullYear() - 1981`. No hay que actualizarla cada año.
- **El año del footer también se calcula:** `new Date().getFullYear()`.

---

## 6. Interfaz y comportamiento

### Header flotante

`HeaderLinks.tsx` es la pieza con más lógica del sitio:

- El nav es una columna de puntos sobre el lado derecho. El texto del link está en `color: transparent` y solo se revela en hover.
- **En pantallas táctiles no hay hover**, así que el primer toque revela el texto (clase `revealed`, aplicada solo si `window.matchMedia("(hover: none)")` da positivo) y un `pointerdown` fuera del nav lo vuelve a ocultar.
- El punto azul de sección activa lo maneja `useActiveSection`, **no** el `spy` de `react-scroll`: el `spy` está explícitamente en `false` porque agregaba su propia clase `active` y quedaban dos puntos encendidos a la vez.

### `useActiveSection(sectionIds)`

Un `IntersectionObserver` con `rootMargin: '-50% 0px -50% 0px'`, es decir, una franja de detección de altura cero en el centro exacto del viewport. La sección activa es la que cruza esa línea. Devuelve el `id`.

### Preloader

`Preloader.tsx` muestra un overlay a pantalla completa con un spinner hasta que se precargan tres imágenes: los dos fondos y `us.webp`. El motivo está comentado en el código: los fondos se aplican por CSS (`background-image` en el mixin `background()`), y `next/image` no los precarga, con lo cual aparecían de golpe. Tiene dos salvaguardas: `img.onerror` resuelve igual y hay un *failsafe* que quita el overlay a los 5 segundos pase lo que pase.

### Animaciones de entrada

`react-intersection-observer` con `triggerOnce: true`. Al entrar en viewport se agrega la clase `inView`, que dispara los keyframes `fade-left` / `fade-right` / `fade-up` / `fade-down` definidos en `globals.scss`. Usan `animation-delay` escalonado vía el mixin `turn($end)`.

### Estilos

Un único archivo, `app/globals.scss`, con toda la cascada anidada bajo `body`. Vale la pena conocer sus convenciones:

- **Breakpoints como strings, no como media queries.** Se declaran así:
  ```scss
  $tablet: "min-width: 768px) and (max-width: 870px";
  ```
  y se usan `@media (#{$tablet})`. Los paréntesis desbalanceados son intencionales: el de apertura lo pone el `@media (` y el de cierre el final de la interpolación. Es frágil, pero es la convención del archivo — si agregás un breakpoint, seguila.
- Hay **9 breakpoints en portrait** (`$miniMobile` … `$desktop`) y **4 en landscape** (`$mobileLandscape`, `$largeMobileLandscape`, `$tabletLandscape`, `$largeTabletLandscape`).
- Mixins principales: `titles()`, `subtitles()`, `divs()` (alto y ancho de cada sección), `background($url)`, `fade($fade, $delay)`, `turn($end)`, `headerLinkReveal()`.
- Las fuentes se consumen como CSS custom properties que inyecta `next/font`: `$fuente-textos: var(--font-instrument)` y `$fuente-titulos: var(--font-playfair)`.
- Los fondos usan `background-attachment: fixed` (efecto parallax).
- El header se posiciona con `svh` en vez de `vh` porque en móvil la barra del navegador que aparece y desaparece hacía saltar el header; se deja `%` como fallback en la línea anterior.
- La barra de scroll está oculta en los tres motores (`scrollbar-width`, `-ms-overflow-style`, `::-webkit-scrollbar`).

---

## 7. SEO y datos estructurados

Todo en `app/layout.tsx`, `app/robots.ts` y `app/sitemap.ts`.

- `metadataBase` se arma con `siteUrl` (ver §9), lo que hace que las URLs relativas de `alternates.canonical`, `openGraph.url` e imágenes se resuelvan a absolutas.
- **Canonical:** `/`.
- **Open Graph:** `type: website`, `locale: es_AR`, imagen `/img/us/us.webp` (700×700).
- **Twitter Card:** `summary_large_image`.
- **`robots`:** indexable, con `max-image-preview: large` y `max-snippet: -1` para Googlebot.
- **18 keywords** declaradas en `metadata.keywords`.
- **JSON-LD** inyectado en el `<body>` con `dangerouslySetInnerHTML`, tipo `schema.org/Dentist`: nombre, teléfono, `priceRange`, `medicalSpecialty`, `PostalAddress` (Catriel 4929, La Tablada, B1766FLK, AR), `GeoCoordinates` y `openingHoursSpecification` (lunes y miércoles, 15:30–20:00).
- **`/robots.txt`** permite todo excepto `/design`, y apunta al sitemap.
- **`/sitemap.xml`** lista `/` (prioridad 1, `monthly`) y `/Terminos` (prioridad 0.3, `yearly`). `lastModified` se calcula en cada build con `new Date()`.

> Los datos del negocio (teléfono, dirección, horarios) están duplicados en tres lugares: el JSON-LD y la `description` de `layout.tsx`, y `public/json/contacto.json`. Si cambia un horario hay que tocar los dos.

---

## 8. Seguridad

Superficie de ataque mínima: sitio estático, sin backend, sin autenticación, sin formularios y sin entrada de usuario que se persista.

Lo que sí existe y conviene tener presente:

- **`dangerouslySetInnerHTML`** en `layout.tsx`. El contenido es un `JSON.stringify` de un objeto literal definido en el mismo archivo, sin datos externos: no hay vector de inyección mientras ese objeto no pase a alimentarse de una fuente externa.
- **`<iframe>` de Google Maps** (`ContactoMap.tsx`) con `loading="lazy"`. Es contenido de terceros embebido; no declara `sandbox` ni `referrerPolicy`.
- **Los JSON de `public/` son públicos por definición.** Ninguno contiene nada sensible: son textos de la página y los datos de contacto que ya están publicados.
- **No hay secretos en el repositorio.** El único `process.env` del código es `VERCEL_PROJECT_PRODUCTION_URL`, que es pública.
- `client/.vercel/` (archivos `.env.*.local` bajados de Vercel, `project.json` con `projectId`/`orgId`) **no está versionado** — está en `.gitignore` y confirmado con `git ls-files`. No lo commitees.
- **`/design` es accesible públicamente en producción.** Los flyers y el mockup están versionados y se sirven bajo `https://<dominio>/design/…`. `robots.txt` los excluye de los buscadores, pero eso no los protege: si no deben ser públicos, hay que sacarlos de `public/`.

---

## 9. Configuración

### `next.config.ts`

Una sola opción: `allowedDevOrigins: ['localhost:3000', 'http://192.168.0.5:3000']`, para poder abrir el server de desarrollo desde otro dispositivo de la red local (esa IP es la de la máquina de desarrollo; cambiala si la tuya es otra).

### `vercel.json`

```json
{
  "framework": "nextjs",
  "installCommand": "bun install",
  "buildCommand": "bun run build",
  "devCommand": "bun run dev"
}
```

Fuerza a Vercel a usar Bun en vez de npm. El `$schema` habilita autocompletado en el editor.

### `tsconfig.json`

`strict: true`, `target: ES2017`, `moduleResolution: bundler`, alias `@/*` → raíz de `client/`.

### `eslint.config.mjs`

Flat config (`defineConfig`), compone `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`, y **redeclara explícitamente los ignores por defecto** (`.next/**`, `out/**`, `build/**`, `next-env.d.ts`), porque al pasar un `globalIgnores` propio se pisan los de la config base.

### `postcss.config.mjs`

Único plugin: `@tailwindcss/postcss`. Ver §11.

---

## 10. Puesta en marcha y despliegue

Requisitos: [Bun](https://bun.sh) 1.3.14 o superior. Node 22+ si preferís npm (el lockfile versionado es de Bun; usar npm generaría un `package-lock.json` que no corresponde al proyecto).

```bash
cd client
bun install
bun run dev        # http://localhost:3000
```

| Script | Comando real | Qué hace |
|---|---|---|
| `dev` | `next dev` | Servidor de desarrollo con HMR |
| `build` | `next build` | Build de producción (Turbopack) |
| `start` | `next start` | Sirve el build de producción |
| `lint` | `eslint` | Linter sobre todo el proyecto |

### Despliegue

El proyecto está enlazado a Vercel (proyecto `client`; los identificadores viven en `client/.vercel/project.json`, que no está versionado). Vercel toma la configuración de `vercel.json`: instala con `bun install` y construye con `bun run build`. **Root Directory del proyecto en Vercel: `client`.**

Como las cinco rutas son estáticas, el resultado es CDN puro: no se ejecuta ninguna función en cada request.

### Variables de entorno

No hay `.env.example` ni ninguna variable que haya que configurar a mano. La única que lee el código es:

| Nombre | Propósito | Obligatoria |
|---|---|---|
| `VERCEL_PROJECT_PRODUCTION_URL` | La inyecta Vercel automáticamente en build. `app/lib/site.ts` la usa para armar `siteUrl` (canonical, OG, sitemap, JSON-LD) | No — la provee la plataforma |

Fuera de Vercel, `siteUrl` cae al valor por defecto `https://silviapellegrino.com`, escrito en `app/lib/site.ts`. Si el dominio final es otro, ese es el único lugar donde hay que cambiarlo.

---

## 11. Estado verificado y pendientes

Todo lo de esta sección fue comprobado contra el código, no inferido.

**Build y lint en verde.** `bun run lint` no reporta nada. `bun run build` compila en ~13 s y prerenderiza las 5 rutas como estáticas.

**No hay tests.** No existe runner, ni archivos `*.test.*` / `*.spec.*`, ni script de test en `package.json`.

**Tres dependencias no se usan:**

- `framer-motion` (^12.42.2, dependencia de producción): cero importaciones en `app/`. Las animaciones se hacen con CSS keyframes + `react-intersection-observer`.
- `tailwindcss` / `@tailwindcss/postcss` (^4.3.2): el plugin está activo en `postcss.config.mjs`, pero `globals.scss` nunca hace `@import "tailwindcss"` y ningún `.tsx` usa clases utilitarias. Tailwind no emite nada. **Si alguien intenta usar `className="flex"` no va a funcionar** hasta que se agregue el `@import`.
- `autoprefixer` (^10.5.2): no figura entre los plugins de PostCSS.

**`console.log` en producción.** `app/_components/header/Header.tsx:14` imprime el JSON del header en cada carga.

**`client/README.md` existe y está vacío** (0 bytes, versionado). Esta documentación vive en la raíz del repositorio, que es donde se abre el proyecto.

**Anomalías de `.gitignore`:** `client/.gitignore` se ignora a sí mismo (línea 3) e ignora `/public/design` (línea 5), pero ambos están versionados desde antes de que se agregaran esas reglas — `.gitignore` no afecta a archivos ya trackeados. Efecto práctico: los flyers de `public/design/` se publican en producción (ver §8).

**Sin manejo de error visible.** `Tratamientos`, `Contacto` y `Terminos` hacen `fetch` sin `.catch()`: si un JSON falla en cargar, la sección queda vacía y en silencio. Solo `Header` loguea el error (a consola, no a la UI).

**Contenido hardcodeado que rompe la convención de los JSON:** las 3 tarjetas de `CardsDentista.tsx` y las listas de servicios y trayectoria de `RightComponent.tsx` están en el `.tsx`, no en `public/json/`.

**Sin `scroll-behavior: smooth` en CSS.** El scroll suave lo hace `react-scroll` en JS (`smooth: true`, `duration: 500`). No hay tratamiento de `prefers-reduced-motion` en ninguna animación del sitio.

> TODO: confirmar el dominio de producción definitivo. `app/lib/site.ts` usa `https://silviapellegrino.com` como fallback, con un comentario del propio autor advirtiendo que hay que cambiarlo si el dominio final es otro.

---

## 12. Convenciones del repositorio

- **Idioma:** los nombres de componentes, carpetas y clases CSS están en español (`Dentista`, `Tratamientos`, `nosotrosDivision`); los assets y sus carpetas, en inglés (`img/treatments`, `dentist.webp`). Los comentarios del código están en español y explican el *porqué*, no el *qué* — mantenelo así.
- **Componentes:** un componente por archivo, `export default`, PascalCase. Carpeta por sección dentro de `app/_components/`, con subcarpetas cuando la sección tiene partes (`nosotros/left/`, `nosotros/right/`).
- **`"use client"`** solo donde hace falta: hooks de navegador, `fetch` en `useEffect` o `react-scroll`.
- **Props:** interfaces declaradas en el mismo archivo del componente, con las props marcadas `readonly`.
- **Estilos:** todo en `app/globals.scss`. No hay CSS Modules ni `styled-components`. Las clases se nombran en camelCase y se anidan siguiendo la jerarquía del DOM, bajo `body`.
- **Contenido:** si el texto puede cambiar sin que cambie la lógica, va a `public/json/`.
- **Rutas de assets:** siempre absolutas desde `public/` (`/img/...`, `/json/...`).
- **Imágenes:** `.webp` en todos los casos, servidas con `next/image` con `width` y `height` explícitos.
- **Commits:** los hace el titular del repositorio, no herramientas automáticas. Rama por defecto: `main`.
