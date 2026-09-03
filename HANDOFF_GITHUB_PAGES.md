# Addendum de Handoff — Compatibilidad con GitHub Pages
Complementa (no reemplaza) `HANDOFF_CHECKLIST_PUBLICACION.md`. La Release Candidate visual queda congelada; este documento cubre únicamente la adaptación de nombres de archivo, rutas y limitaciones de hosting estático para publicar en `https://usuario.github.io/nombre-repo/`.

---

## 1. Incompatibilidades detectadas con GitHub Pages

1. **Nombres de archivo con tildes, espacios y `.dc.html`** — ej. `Capacitación Detalle.dc.html`, `Informes de Gestión.dc.html`, `Página institucional.dc.html`. GitHub Pages sirve archivos por nombre literal; espacios/tildes generan URLs codificadas (`%20`, `%C3%A1`) frágiles entre sistemas. **Acción: renombrar a ASCII kebab-case (tabla §4).**
2. **El sitio no vive en `/`** — bajo un repo de proyecto (no `usuario.github.io` de usuario), la base real es `/nombre-repo/`. Cualquier enlace interno con slash inicial (`/Home.dc.html`) rompe. Los enlaces actuales usan rutas relativas sin slash inicial (correcto como principio), pero deben recalcularse por profundidad una vez cada página pase a vivir en su propia carpeta (`formacion/capacitaciones/index.html` en vez de `Capacitaciones.dc.html` en la raíz). **Acción: reescribir cada `href` relativo según la profundidad de carpeta de destino** (ver ejemplo §3).
3. **Rutas "amigables" con parámetro** (`/formacion/capacitaciones/:slug`) no existen en hosting estático — no hay motor de rutas del servidor. **Acción: cada instancia real de curso/novedad/documento debe ser una carpeta física con su propio `index.html`** (ver §5, ya señalado como plantilla representativa en el handoff anterior).
4. **Sin backend.** GitHub Pages solo sirve archivos estáticos. Formularios (Contacto, Solicitud de Rotación, Consulta de estado) no pueden procesar envíos por sí solos.
5. **Mantenimiento no es automático.** No hay servidor que intercepte tráfico y sirva `mantenimiento/index.html` condicionalmente. Activarlo implica un paso manual de despliegue (ver §6).
6. **Buscador con dataset embebido.** Sigue siendo viable como índice estático del lado del cliente (JSON generado en build), pero no es "backend de búsqueda" — ver §7.

---

## 2. Nombres de archivo definitivos (ASCII, minúsculas, kebab-case)

| Archivo Claude Design | Archivo final GitHub Pages | Estado | Acción necesaria |
|---|---|---|---|
| `Home.dc.html` | `index.html` | READY | Renombrar; reescribir enlaces internos con profundidad 0 |
| `404.dc.html` | `404.html` | READY | Renombrar; GitHub Pages lo reconoce automáticamente en la raíz del repo |
| `Mantenimiento.dc.html` | `mantenimiento/index.html` | REQUIERE DESPLIEGUE MANUAL | Ver §6 |
| `Formación.dc.html` | `formacion/index.html` | READY | Renombrar; reescribir enlaces (profundidad 1) |
| `Capacitaciones.dc.html` | `formacion/capacitaciones/index.html` | READY | Renombrar; reescribir enlaces (profundidad 2) |
| `Capacitación Detalle.dc.html` | `formacion/capacitaciones/<slug-curso>/index.html` | REQUIERE DESARROLLO | Plantilla representativa — generar una carpeta por curso real |
| `Rotaciones.dc.html` | `formacion/rotaciones/index.html` | READY | Renombrar; reescribir enlaces |
| `Solicitud de Rotación.dc.html` | `formacion/rotaciones/solicitud/index.html` | **REQUIERE INTEGRACIÓN EXTERNA** | Formulario sin backend propio — ver §8 |
| `Residencias.dc.html` | `formacion/residencias/index.html` | READY | Renombrar; reescribir enlaces |
| `Investigación.dc.html` | `investigacion/index.html` | READY | Renombrar; reescribir enlaces |
| `Recursos.dc.html` | `recursos/index.html` | READY | Renombrar; reescribir enlaces |
| `Novedades.dc.html` | `novedades/index.html` | READY | Renombrar; reescribir enlaces |
| `Detalle de noticia.dc.html` | `novedades/<slug-novedad>/index.html` | REQUIERE DESARROLLO | Plantilla representativa — una carpeta por novedad real |
| `Página institucional.dc.html` | `institucional/index.html` | READY | Renombrar; reescribir enlaces |
| `CODEI.dc.html` | `institucional/codei/index.html` | READY | Renombrar; reescribir enlaces |
| `Auditorio.dc.html` | `institucional/auditorio/index.html` | READY | Renombrar; reescribir enlaces |
| `Equipo.dc.html` | `institucional/equipo/index.html` | REQUIERE DATO HUMANO | Nombres reales pendientes (ya documentado) |
| `Informes de Gestión.dc.html` | `institucional/informes-de-gestion/index.html` | READY | Renombrar; reescribir enlaces |
| `Contacto.dc.html` | `contacto/index.html` | **REQUIERE INTEGRACIÓN EXTERNA** | Formulario sin backend propio — ver §8 |
| `Preguntas frecuentes.dc.html` | `preguntas-frecuentes/index.html` | READY | Renombrar; reescribir enlaces |
| `Buscador Global.dc.html` | Se integra como overlay en cada página (no es ruta propia) + `assets/search-index.json` | READY (client-side) | Ver §7 |
| `Detalle de Documento.dc.html` | `recursos/<slug-documento>/index.html` | REQUIERE DESARROLLO | Plantilla representativa — una carpeta por documento real |

---

## 3. Ejemplo de recálculo de enlaces relativos por profundidad
`index.html` (raíz) → enlace a Formación: `formacion/index.html`.
`formacion/index.html` (profundidad 1) → enlace a Inicio: `../index.html`; a Capacitaciones: `capacitaciones/index.html`.
`formacion/capacitaciones/index.html` (profundidad 2) → enlace a Inicio: `../../index.html`; a un curso: `curso-rcp-basica/index.html`.
Ningún enlace interno debe llevar slash inicial (`/algo.html`) — eso ancla al dominio raíz y rompe bajo `usuario.github.io/nombre-repo/`.

---

## 4. Assets con ruta relativa a verificar
`assets/logo-da.png`, `assets/logo-codei.png`, `assets/logo-hrrg.png` ya usan ruta relativa sin slash inicial — correcto en origen, pero deben recalcularse igual que los enlaces (§3) según la profundidad de cada página que los referencia (ej. desde `institucional/codei/index.html` sería `../../assets/logo-codei.png`). Mismo criterio para cualquier fuente de Google Fonts (esas ya son absolutas a `fonts.googleapis.com`, no requieren cambio).

---

## 5. Rutas dinámicas → contenido estático
Las 3 plantillas representativas (`Capacitación Detalle`, `Detalle de noticia`, `Detalle de Documento`) no pueden resolver un `:slug` en tiempo real sin servidor. Para publicar contenido real, desarrollo debe generar una carpeta física por ítem (build estático — SSG, script de export, o duplicado manual) usando la misma plantilla ya aprobada. **REQUIERE DESARROLLO.**

---

## 6. Mantenimiento — no es función de servidor
Documentar en el repo (README o `CONTRIBUTING`) que activar mantenimiento implica: reemplazar temporalmente el `index.html` publicado por el contenido de `mantenimiento/index.html` (o mover el sitio real a una subcarpeta y publicar mantenimiento en la raíz) y volver a desplegar. Es un paso manual — un workflow de GitHub Actions puede automatizar el intercambio de archivos en el `push`, pero sigue siendo un despliegue explícito, no una respuesta condicional en vivo.

---

## 7. Buscador — índice estático del lado del cliente
Viable sin backend: generar `assets/search-index.json` en build con los mismos campos ya usados en el dataset de `Buscador Global.dc.html` (`type`, `title`, `meta`, `url`), y que el buscador lo cargue por `fetch` relativo. Sigue siendo 100% estático — no es una "función de servidor". Mantener así satisface la regla de no exponer secretos (no hay credenciales que manejar).

---

## 8. Funcionalidades que requieren servicio externo
- **Contacto** (`contacto/index.html`): requiere un proveedor externo de envío de formularios estáticos (ej. Formspree, Google Forms embebido, o una Cloud Function) — **REQUIERE INTEGRACIÓN EXTERNA**.
- **Solicitud de Rotación**: idem — **REQUIERE INTEGRACIÓN EXTERNA**.
- **Consulta de estado de solicitud** (dentro de `Rotaciones.dc.html`): requiere una fuente de datos externa consultable (hoja de cálculo vía API, Airtable, o similar) para verificar el número de solicitud real — **REQUIERE INTEGRACIÓN EXTERNA**.

Ninguna de estas integraciones debe incluir tokens, claves de API ni credenciales en el HTML/JS publicado — cualquier llamada a un servicio externo debe hacerse contra un endpoint público sin secretos embebidos, o vía un formulario que redirige (ej. `action` de Formspree), nunca `fetch` con una API key visible en el código fuente.

---

## 9. `canonical` y `og:url`
Pendientes en las 22 páginas hasta confirmar la URL final de publicación (`https://usuario.github.io/nombre-repo/` u otro dominio). No se inventan valores — se agregan en el momento en que Dirección Académica confirme la URL definitiva.

---

## 10. Enlaces externos — sin cambios
Los 14 recursos de Drive, WhatsApp y email ya usan `target="_blank" rel="noopener"` con indicador visual de enlace externo — se mantiene igual, no depende del hosting.

---

## 11. Estructura de repositorio recomendada

```
/ (raíz del repo)
├── .nojekyll                           ← evita el procesamiento Jekyll de GitHub Pages
├── README.md
├── index.html                          ← Home
├── 404.html
├── assets/
│   ├── logo-da.png
│   ├── logo-codei.png
│   ├── logo-hrrg.png
│   └── search-index.json               ← índice estático del buscador (§7)
├── formacion/
│   ├── index.html
│   ├── capacitaciones/
│   │   ├── index.html
│   │   └── <slug-curso>/index.html     ← una por curso real
│   ├── rotaciones/
│   │   ├── index.html
│   │   └── solicitud/index.html
│   └── residencias/index.html
├── investigacion/index.html
├── recursos/
│   ├── index.html
│   └── <slug-documento>/index.html     ← una por documento real
├── novedades/
│   ├── index.html
│   └── <slug-novedad>/index.html       ← una por novedad real
├── institucional/
│   ├── index.html
│   ├── codei/index.html
│   ├── auditorio/index.html
│   ├── equipo/index.html
│   └── informes-de-gestion/index.html
├── contacto/index.html
├── preguntas-frecuentes/index.html
└── mantenimiento/index.html            ← no se publica salvo despliegue manual (§6)
```

---

## 12. Estrategia única de rutas internas
Una sola regla, sin excepciones ni mezcla de enfoques:

> **Todo enlace interno (navegación, breadcrumbs, logo→Home, assets, `search-index.json`) es una ruta relativa sin slash inicial, con tantos `../` como la profundidad de la página actual respecto a la raíz.**

- Ningún archivo usa `/algo` (slash inicial) — eso ancla al dominio raíz y rompe bajo `usuario.github.io/nombre-repo/`.
- Ningún archivo usa `<base href>` — alteraría los anchors, los enlaces externos (Drive/WhatsApp, que ya son absolutos y no deben tocarse) y la resolución de assets ya calculada por archivo. La profundidad se resuelve por archivo, no globalmente.
- El 404 vive en la raíz (`404.html`) — GitHub Pages solo lo activa así; usa la misma regla de profundidad 0.
- El logo/isotipo del header enlaza a Home con la misma fórmula (`../index.html`, `../../index.html`, etc. según profundidad).

Verificado con esta regla en las 4 profundidades reales del sitio (0, 1, 2, 3) para assets, `search-index.json`, Home, navegación global, breadcrumbs y 404 — sin inconsistencias.
