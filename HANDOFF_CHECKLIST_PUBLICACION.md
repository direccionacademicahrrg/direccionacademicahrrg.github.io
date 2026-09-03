# Handoff / Checklist de publicación — Portal Dirección Académica HRRG
Release Candidate congelada. Este documento describe el estado exacto de esa versión — no introduce cambios de diseño.

Leyenda: **READY** (listo para producción) · **REQUIERE DATO HUMANO** (falta un dato/decisión de Dirección Académica) · **REQUIERE DESARROLLO** (depende de implementación real, no de diseño).

---

## 1. Inventario de páginas (22)

| # | Página | Archivo | Ruta sugerida | Estado |
|---|---|---|---|---|
| 1 | Inicio | `Home.dc.html` | `/` | READY |
| 2 | Formación | `Formación.dc.html` | `/formacion` | READY |
| 3 | Capacitaciones (listado) | `Capacitaciones.dc.html` | `/formacion/capacitaciones` | READY |
| 4 | Capacitación — Detalle | `Capacitación Detalle.dc.html` | `/formacion/capacitaciones/:slug` | READY (plantilla única — ver §7) |
| 5 | Rotaciones | `Rotaciones.dc.html` | `/formacion/rotaciones` | READY |
| 6 | Solicitud de Rotación | `Solicitud de Rotación.dc.html` | `/formacion/rotaciones/solicitud` | READY |
| 7 | Residencias | `Residencias.dc.html` | `/formacion/residencias` | READY |
| 8 | Investigación | `Investigación.dc.html` | `/investigacion` | READY |
| 9 | Recursos | `Recursos.dc.html` | `/recursos` | READY |
| 10 | Novedades (listado) | `Novedades.dc.html` | `/novedades` | READY |
| 11 | Detalle de noticia | `Detalle de noticia.dc.html` | `/novedades/:slug` | READY (plantilla única — ver §7) |
| 12 | Institucional | `Página institucional.dc.html` | `/institucional` | READY |
| 13 | CODEI | `CODEI.dc.html` | `/institucional/codei` | READY |
| 14 | Auditorio | `Auditorio.dc.html` | `/institucional/auditorio` | READY |
| 15 | Equipo | `Equipo.dc.html` | `/institucional/equipo` | **REQUIERE DATO HUMANO** (nombres) |
| 16 | Informes de gestión | `Informes de Gestión.dc.html` | `/institucional/informes-de-gestion` | READY |
| 17 | Contacto | `Contacto.dc.html` | `/contacto` | READY |
| 18 | Preguntas frecuentes | `Preguntas frecuentes.dc.html` | `/preguntas-frecuentes` | READY |
| 19 | Buscador global | `Buscador Global.dc.html` | overlay, sin ruta propia | REQUIERE DESARROLLO (índice de búsqueda real) |
| 20 | Documento — Detalle | `Detalle de Documento.dc.html` | `/recursos/:slug` | READY (plantilla única — ver §7) |
| 21 | Error 404 | `404.dc.html` | catch-all | READY |
| 22 | Mantenimiento | `Mantenimiento.dc.html` | toma de dominio temporal | REQUIERE DESARROLLO (activación por config de servidor) |

---

## 2. SEO — title / meta description / Open Graph / robots
Confirmado presente y único por página en las 22 páginas: `<title>`, `meta description`, `og:title`, `og:description`, `og:type`. 404 y Mantenimiento llevan además `robots: noindex` (correcto — no deben indexarse). **READY.**

Pendiente de desarrollo: `og:image` (no hay foto institucional real cargada aún — los `<image-slot>` de Home/Institucional son placeholders) y URL canónica una vez exista el dominio real. **REQUIERE DATO HUMANO** (fotos) + **REQUIERE DESARROLLO** (canonical/dominio).

---

## 3. Enlaces externos y recursos de Drive (confirmados por Dirección Académica en esta sesión)

| Recurso | Página(s) donde aparece | Enlace |
|---|---|---|
| Capacitaciones / Cronograma | Home, Formación, Recursos, Buscador | drive.google.com/drive/folders/1zy5eBaW2vMDOZOTy3H7evoZhEcnhQoXw |
| Ateneos | Formación, Novedades, Home | drive.google.com/drive/folders/1Clj5yDkuxgOsXz8BwjMOw6wlzY-6YuCr |
| Residencias del equipo de salud | Formación, Residencias, Recursos | drive.google.com/drive/folders/1tDbIZ6dvTrEv1yQxCoZzLJrI-SYHqL65 |
| Guía del Rotante | Formación, Recursos | drive.google.com/drive/folders/1cJ-IOMUGhqwgrQ0qVMu2szmPX2E4XwLX |
| Rotaciones y Visitas Autorizadas (planilla) | Home, Recursos | docs.google.com/spreadsheets/d/1fz92F8DbGFFwEgCqIaUvHlXCwuAlBtV6zZ58wOUX5Mc |
| Formularios (rotación/residencia) | Recursos | drive.google.com/drive/folders/1Y85DRHrfFwkG-LV7Db0V624qX1mTOYfR |
| Investigación en Salud | Investigación, Recursos, Buscador | drive.google.com/drive/folders/1y2eFFiG8gSy72CSWOzwD5FTWANCfZQFc |
| Repositorio de investigación | Investigación | drive.google.com/drive/folders/1sV8qX3Vutm6sefx_XKlR-F8UyKR2p-BY |
| CODEI | Institucional, CODEI | drive.google.com/drive/folders/1arNDlFwNu2PcoYFzy9Ftwq_IFi9Sy-Zk |
| Auditorio | Institucional, Auditorio | drive.google.com/drive/folders/1hQEdt4USfNYkMG1aHYvK23OIs-1ELxAn |
| Informes de Gestión Vigencia 2025 | Institucional, Informes de Gestión, Recursos, Novedades | drive.google.com/drive/folders/1nDGO35EIFf4DmtYaNixXEgJu68myYK3S |
| Nosotros (Quiénes somos) | Home | drive.google.com/drive/folders/1wv5yXXGUehHSbCzAHGMCT3c1w_uazP7Q |
| WhatsApp | Header, footer y todas las páginas de contacto | api.whatsapp.com/send?phone=5492966270210 |
| Email | Footer y páginas de contacto | docenciahrrg@gmail.com |

Todos abren en pestaña nueva (`target="_blank" rel="noopener"`) con indicador de enlace externo. **READY.** Vencimiento/permisos de las carpetas de Drive: **REQUIERE DATO HUMANO** (mantenimiento periódico fuera del alcance de este diseño).

---

## 4. Formularios y destinos

| Formulario | Página | Envía a | Estados |
|---|---|---|---|
| Contacto | `Contacto.dc.html` | Simulado en el prototipo — **REQUIERE DESARROLLO** (endpoint real / email) | idle, loading, success, error (con reintentar) |
| Solicitud de rotación | `Solicitud de Rotación.dc.html` | idem | idle, loading, success (nº de solicitud), error |
| Consulta de estado de solicitud | `Rotaciones.dc.html` | idem | idle, loading, encontrada, no encontrada |
| Inscripción a capacitación | `Capacitación Detalle.dc.html` | Enlace real a Drive de Capacitaciones (no hay formulario propio inventado) | disponible / próxima / cupos completos / cerrada / finalizada |

Todos los campos con `<label>` real, `autocomplete`, validación inline y `aria-invalid`/`aria-describedby`. **READY** en diseño; conexión a backend real es **REQUIERE DESARROLLO**.

---

## 5. Estados especiales
404, Mantenimiento, recurso externo no disponible, error de carga, vacío/sin resultados (buscador, novedades, capacitaciones) — todos con texto breve, no alarmista, y CTA "Reintentar" únicamente donde hay una acción real que reintentar. Estado "sin conexión" no implementado — **REQUIERE DESARROLLO** si el equipo de desarrollo decide agregar detección real de red.

---

## 6. Responsive y accesibilidad
Desktop (1440px) y mobile (390px) verificados en las 22 páginas con el mismo comportamiento y destinos. Tablet no tiene mock dedicado — hereda el patrón mobile hasta 899px (regla ya documentada en el handoff de Design System). Teclado: todo control interactivo es `<button>`/`<a>`/`<input>` real, foco visible de dos capas, `aria-label` en íconos sin texto, `role="dialog"` + `aria-modal` en el buscador. **READY.**

---

## 7. Nota de arquitectura — plantillas representativas
`Capacitación Detalle.dc.html`, `Detalle de noticia.dc.html` y `Detalle de Documento.dc.html` son una plantilla reutilizable con contenido de UN ítem representativo cada una (ya aprobado explícitamente). En producción, desarrollo debe generar una instancia real por ítem (curso, novedad, documento) a partir de estos mismos componentes — **REQUIERE DESARROLLO**.

---

## 8. Placeholders pendientes de dato humano
- `Equipo.dc.html`: 8 cargos con "[Nombre a confirmar]".
- Fotografías institucionales reales (Home hero, Home "Quiénes somos", Institucional) — actualmente `<image-slot>` placeholders.
- Vigencia/renovación periódica de los enlaces de Drive listados en §3.

---

## 9. Requisitos técnicos para producción
- Hosting de archivos estáticos + resolución de rutas "amigables" (§1) sobre los `.dc.html` (o su equivalente ya compilado).
- Backend real para los 3 formularios de §4 (email transaccional o integración con Google Forms/Sheets existente).
- Redirección 404 real del servidor hacia `404.dc.html`.
- Mecanismo de activación de `Mantenimiento.dc.html` a nivel de servidor/CDN.
- Índice de búsqueda real para `Buscador Global.dc.html` (hoy es un dataset de demostración en el propio archivo).
- Carga de fotografías reales en los `<image-slot>`.

## 10. Qué verificar después del deploy
- Los 22 `<title>`/OG resuelven correctamente al compartir en redes/WhatsApp.
- Los 14 recursos de Drive de §3 siguen accesibles con permisos de "cualquiera con el enlace".
- El 404 real del servidor cae en `404.dc.html` (no en un error genérico del hosting).
- Formularios entregan a la bandeja de Dirección Académica.
- Buscador global devuelve resultados reales, no solo el dataset de demostración.
