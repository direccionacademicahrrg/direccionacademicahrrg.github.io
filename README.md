# Portal Dirección Académica — HRRG

Portal institucional de la Dirección Académica — Docencia e Investigación del Hospital Regional Río Gallegos (Santa Cruz). Reemplaza al directorio de enlaces (Linktree) por un sitio navegable con acceso a capacitaciones, rotaciones, residencias, investigación, recursos e información institucional.

Es un sitio **estático simple**: HTML llano + un solo CSS + un solo JS. Sin build, sin Node, sin frameworks, sin backend. Pensado para que una persona sin experiencia avanzada en programación pueda mantenerlo editando archivos directamente en GitHub.

## Estructura del repositorio

```
/ (raíz)
├── .nojekyll
├── index.html                    ← Inicio
├── 404.html                      ← autónomo, sin dependencias externas (ver más abajo)
├── assets/
│   ├── css/site.css               ← único archivo de estilos
│   ├── js/site.js                 ← único archivo de JS (menú, buscador, filtros)
│   ├── search-index.json          ← índice del buscador global, editado a mano
│   ├── logo-da.png
│   ├── logo-codei.png
│   ├── logo-hrrg.png
│   └── img/                       ← fotografías y tarjeta social optimizadas
├── formacion/
│   ├── index.html
│   ├── capacitaciones/index.html
│   ├── residencias/index.html
│   └── rotaciones/
│       ├── index.html
│       └── solicitud/index.html
├── investigacion/index.html
├── recursos/
│   ├── index.html
│   ├── auditorio/index.html
│   └── preguntas-frecuentes/index.html
├── institucional/
│   ├── index.html
│   ├── codei/index.html
│   ├── equipo/index.html
│   └── informes-de-gestion/index.html
├── novedades/index.html
├── contacto/index.html
├── buscar/index.html              ← resultados del buscador global
├── mantenimiento/index.html       ← ver "Modo mantenimiento" abajo
├── tools/check_site.py            ← verificación automática de rutas y HTML
├── GUIA-DE-ACTUALIZACION.md
├── CONTENIDOS-PENDIENTES.md
└── CHECKLIST-PUBLICACION.md
```

No hay páginas de detalle por capacitación, noticia o documento: cada una de esas listas enlaza directamente al recurso real (una carpeta de Drive, un formulario, u otra sección del sitio) en vez de a una página intermedia que solo repetiría lo mismo.

## Publicar con GitHub Pages
1. Subir el contenido de este árbol a la rama que sirva GitHub Pages (`main` o `gh-pages`, según configuración del repo).
2. En **Settings → Pages**, seleccionar esa rama y la carpeta raíz (`/`).
3. El sitio queda disponible en `https://<usuario>.github.io/<nombre-repo>/`.
4. El archivo `.nojekyll` ya está incluido — evita que GitHub Pages intente procesar el sitio con Jekyll.
5. Todas las rutas internas ya están escritas a mano como relativas (`../`, `../../`, etc. según la profundidad de cada archivo), sin `/` inicial y sin el nombre del repositorio hardcodeado. Si movés un archivo de carpeta, revisá y corregí a mano las rutas `../assets/...` que contiene.

## 404.html
Es un archivo aparte, con sus propios estilos incluidos adentro (no depende de `site.css` ni de `site.js`). Esto es intencional: GitHub Pages puede servir el contenido de `404.html` para una URL inexistente de **cualquier profundidad**, y en ese caso una ruta relativa (`../index.html`, etc.) apuntaría a un lugar equivocado según la URL que el visitante haya escrito.

El botón "Volver a Inicio" queda pendiente hasta que exista la URL pública final del sitio: hay un comentario en el HTML (`<!-- Cuando se conozca la URL pública... -->`) indicando exactamente qué reemplazar. Mientras tanto, la página ofrece email y WhatsApp reales como contacto.

## Buscador global
`assets/search-index.json` es una lista editada a mano. Cada entrada:
```json
{
  "type": "Capacitación",
  "title": "Nombre real del recurso",
  "summary": "Descripción breve",
  "url": "formacion/capacitaciones/index.html",
  "external": false,
  "keywords": ["palabra", "clave"]
}
```
- `url` interna: relativa a la raíz del sitio, sin `/` inicial.
- `url` externa (Drive, etc.): la dirección completa, y `"external": true`.

El buscador de cualquier página (header, Inicio) envía la búsqueda a `buscar/index.html?q=...`. Esa página carga el índice, filtra por título/resumen/palabras clave y muestra los resultados reales, con teclado y foco visibles. No usa librerías, IA ni backend.

## Modo mantenimiento
No existe un mecanismo automático en GitHub Pages para "activar" mantenimiento. Para mostrarlo hay que reemplazar manualmente `index.html` (y opcionalmente los demás) por una copia del contenido de `mantenimiento/index.html`, o mover el sitio real a una subcarpeta temporalmente, y volver a publicar. Es un despliegue explícito, no un interruptor.

## Funcionalidades que requieren integración externa
Este sitio es estático y no tiene backend propio. Los siguientes puntos ya enlazan a recursos reales (Google Drive) en lugar de simular un envío:
- **Contacto**: WhatsApp y email reales, sin formulario propio.
- **Solicitar rotación**: enlaza directamente al formulario real de Google Drive.
- **Consulta de estado de una solicitud de rotación**: no está implementada — no existe todavía una fuente de datos real para ofrecerla.

## Contenidos pendientes

Los datos sin confirmación no se muestran como placeholders públicos. La lista de información que debe validar Dirección Académica está en `CONTENIDOS-PENDIENTES.md`.

- Los nombres del equipo se sustituyen temporalmente por “Información en proceso de actualización”.
- Los espacios para fotografías aún no autorizadas quedan identificados solo mediante comentarios HTML.
- La entrada del hospital se sirve como WebP responsive de 720 y 1200 px.
- `assets/img/og-hrrg.jpg` está preparada como tarjeta social, pero requiere aprobación y una URL pública absoluta antes de incorporarla a los metadatos.
- `canonical`, `og:url` y `og:image` siguen pendientes hasta confirmar la URL pública final.
- El enlace “Volver a Inicio” de `404.html` sigue pendiente hasta conocer esa URL.

## Validación automática

Cada cambio enviado a `main` ejecuta `.github/workflows/validar-sitio.yml`. La comprobación detecta rutas o recursos internos inexistentes, IDs duplicados, páginas sin título o `h1` y URLs incorrectas del buscador.

Para ejecutarla manualmente:

```text
python tools/check_site.py
```

## Editar contenido
- **Texto**: abrí el archivo en GitHub, hacé clic en el lápiz (editar), cambiá solo el texto entre etiquetas `<...>` y confirmá el cambio.
- **Un enlace**: buscá `href="..."` cerca del texto y reemplazá solo lo que está entre comillas.
- **Header y footer**: se repiten copiados en cada página (a propósito, para no depender de un sistema de build). Si cambiás algo ahí, repetí el cambio en todas las páginas.
- **Una fotografía**: consultá `GUIA-DE-ACTUALIZACION.md` para optimizarla y actualizar `src`, `srcset` y `alt`.

## Antes de publicar
- [ ] Ejecutar `python tools/check_site.py` y corregir cualquier error.
- [ ] Revisar el sitio en un celular real (o achicando la ventana del navegador).
- [ ] Revisar que Inicio cargue bien y que el buscador devuelva resultados con una palabra real.
- [ ] Revisar Contacto (WhatsApp y email abren correctamente).
- [ ] Confirmar la URL pública definitiva (usuario/organización de GitHub o dominio propio).
- [ ] Completar el enlace de "Volver a Inicio" en `404.html` con esa URL.
- [ ] Revisar `CONTENIDOS-PENDIENTES.md` con Dirección Académica.
- [ ] Completar `CHECKLIST-PUBLICACION.md`.
