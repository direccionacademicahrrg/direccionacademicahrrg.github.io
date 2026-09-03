# Manifest de exportación — Portal Dirección Académica HRRG → GitHub Pages
Complementa `HANDOFF_GITHUB_PAGES.md`. Profundidad = cantidad de `../` necesarios para llegar a la raíz del repo desde ese archivo. Ruta a `/assets` y a Home se calculan con la regla única de §12 del addendum (relativa, sin slash inicial, sin `<base href>`).

| Archivo Claude Design | Destino GitHub | Profundidad | Ruta a /assets | Ruta a Home | Estado |
|---|---|---|---|---|---|
| `Home.dc.html` | `index.html` | 0 | `assets/` | `index.html` (self) | READY |
| `404.dc.html` | `404.html` | 0 | `assets/` | `index.html` | READY |
| `Mantenimiento.dc.html` | `mantenimiento/index.html` | 1 | `../assets/` | `../index.html` | REQUIERE DESPLIEGUE MANUAL |
| `Formación.dc.html` | `formacion/index.html` | 1 | `../assets/` | `../index.html` | READY |
| `Capacitaciones.dc.html` | `formacion/capacitaciones/index.html` | 2 | `../../assets/` | `../../index.html` | READY |
| `Capacitación Detalle.dc.html` | `formacion/capacitaciones/<slug-curso>/index.html` | 3 | `../../../assets/` | `../../../index.html` | REQUIERE DESARROLLO (una carpeta por curso real) |
| `Rotaciones.dc.html` | `formacion/rotaciones/index.html` | 2 | `../../assets/` | `../../index.html` | READY |
| `Solicitud de Rotación.dc.html` | `formacion/rotaciones/solicitud/index.html` | 3 | `../../../assets/` | `../../../index.html` | REQUIERE INTEGRACIÓN EXTERNA |
| `Residencias.dc.html` | `formacion/residencias/index.html` | 2 | `../../assets/` | `../../index.html` | READY |
| `Investigación.dc.html` | `investigacion/index.html` | 1 | `../assets/` | `../index.html` | READY |
| `Recursos.dc.html` | `recursos/index.html` | 1 | `../assets/` | `../index.html` | READY |
| `Detalle de Documento.dc.html` | `recursos/<slug-documento>/index.html` | 2 | `../../assets/` | `../../index.html` | REQUIERE DESARROLLO (una carpeta por documento real) |
| `Novedades.dc.html` | `novedades/index.html` | 1 | `../assets/` | `../index.html` | READY |
| `Detalle de noticia.dc.html` | `novedades/<slug-novedad>/index.html` | 2 | `../../assets/` | `../../index.html` | REQUIERE DESARROLLO (una carpeta por novedad real) |
| `Página institucional.dc.html` | `institucional/index.html` | 1 | `../assets/` | `../index.html` | READY |
| `CODEI.dc.html` | `institucional/codei/index.html` | 2 | `../../assets/` | `../../index.html` | READY |
| `Auditorio.dc.html` | `institucional/auditorio/index.html` | 2 | `../../assets/` | `../../index.html` | READY |
| `Equipo.dc.html` | `institucional/equipo/index.html` | 2 | `../../assets/` | `../../index.html` | REQUIERE DATO HUMANO (nombres) |
| `Informes de Gestión.dc.html` | `institucional/informes-de-gestion/index.html` | 2 | `../../assets/` | `../../index.html` | READY |
| `Contacto.dc.html` | `contacto/index.html` | 1 | `../assets/` | `../index.html` | REQUIERE INTEGRACIÓN EXTERNA |
| `Preguntas frecuentes.dc.html` | `preguntas-frecuentes/index.html` | 1 | `../assets/` | `../index.html` | READY |
| `Buscador Global.dc.html` | Overlay embebido en cada página (sin ruta propia) | variable (igual a la página que lo monta) | igual que la página que lo monta | igual que la página que lo monta | READY (client-side, ver §7 del addendum) |

## Archivos pendientes de exportación real
Ningún archivo de la lista está bloqueado por diseño. Quedan pendientes de **generación técnica** (no de diseño) los siguientes, porque son plantillas representativas hasta tener el contenido real final:
- Una carpeta por curso real dentro de `formacion/capacitaciones/`.
- Una carpeta por novedad real dentro de `novedades/`.
- Una carpeta por documento real dentro de `recursos/`.

## Buscador global — estrategia SITE_ROOT
Las URLs de `assets/search-index.json` se guardan relativas a la raíz del repo, sin slash inicial (ej. `"url": "formacion/capacitaciones/index.html"`) — nunca relativas a la página que las muestra, porque el buscador se embebe en páginas de distinta profundidad. Cada página exportada define su propia constante `SITE_ROOT` según la profundidad de esta tabla:

| Profundidad | `SITE_ROOT` |
|---|---|
| 0 | `./` |
| 1 | `../` |
| 2 | `../../` |
| 3 | `../../../` |

El buscador construye cada destino como `SITE_ROOT + result.url`, y carga el índice como `SITE_ROOT + "assets/search-index.json"`. Ningún archivo codifica `/nombre-repo/` manualmente ni depende del usuario de GitHub — la misma lógica sigue funcionando si el sitio migra a un dominio propio.

## Datos que faltan para publicar
1. Nombre de usuario u organización de GitHub.
2. Nombre definitivo del repositorio (define si la base es `/` o `/nombre-repo/`).
3. Dominio propio, si Dirección Académica va a usar uno en vez de `usuario.github.io/nombre-repo/`.

Con esos 3 datos se completan `canonical` y `og:url` en las 22 páginas (hoy pendientes intencionalmente, sin valores inventados).
