# Guía de actualización del Portal Académico HRRG

Esta guía está pensada para editar el sitio desde GitHub sin conocimientos avanzados de programación.

## Regla de seguridad

Antes de modificar un archivo, creá una rama o conservá una copia. Cambiá únicamente el bloque de contenido indicado y revisá la vista previa antes de unir el cambio a `main`.

## Regla editorial obligatoria

No publiques cursos, fechas, destinatarios, estados, certificados ni enlaces a modo de ejemplo. Cada dato debe provenir de información oficial proporcionada o validada por la Dirección Académica. Si todavía no existen datos confirmados, conservá el mensaje de estado vacío de la sección.

## Actualizar una capacitación

1. Abrí `formacion/capacitaciones/index.html`.
2. Cuando incorpores la primera actividad confirmada, quitá el atributo `hidden` de `filters-bar` y `catalog-count`, y agregalo al bloque `training-empty`.
3. Buscá `class="training-item"`.
4. Copiá un bloque completo desde `<li class="training-item"` hasta su `</li>`.
5. Cambiá:
   - `data-category`: `Vigente`, `Próxima a abrir`, `Cerrada` o `Finalizada`;
   - `data-search`: palabras útiles para el buscador;
   - día, mes y año;
   - tipo, título, modalidad y destinatarios;
   - clase visual del estado: `--open`, `--soon` o `--closed`;
   - enlace real de cronograma o inscripción.
6. Actualizá el número inicial de “capacitaciones encontradas”.
6. Si el recurso debe aparecer en el buscador global, editá `assets/search-index.json`.

No agregues estilos `style="..."` dentro del HTML. Usá las clases existentes.

## Publicar una novedad

1. Abrí `novedades/index.html`.
2. Copiá una novedad existente completa.
3. Cambiá fecha, categoría, título, estado y enlace.
4. Verificá si también debe aparecer en la sección “Novedades y agenda” de `index.html`.
5. Indicá siempre el año cuando una fecha pueda resultar ambigua.

## Reemplazar un documento o enlace

1. Buscá el texto visible del documento en el archivo correspondiente.
2. Reemplazá solamente el contenido de `href="..."`.
3. Si el enlace es externo, conservá `target="_blank" rel="noopener"`.
4. Probá el enlace sin iniciar sesión y confirmá que el archivo de Drive tenga el permiso institucional correcto.
5. Actualizá fecha, formato y tamaño mostrados junto al documento.

## Reemplazar una fotografía

1. Usá una fotografía autorizada institucionalmente.
2. Exportá una versión WebP de hasta 1200 px de ancho y, de ser posible, otra de 720 px.
3. Guardala en `assets/img/` con nombre corto, sin espacios ni tildes.
4. Cambiá el `src`, el `srcset` y el texto `alt` del HTML.
5. El texto alternativo debe describir la imagen, no repetir el nombre del archivo.

## Actualizar el buscador

El archivo `assets/search-index.json` contiene una lista JSON. Cada entrada debe conservar esta forma:

```json
{
  "type": "Capacitación",
  "title": "Nombre del recurso",
  "summary": "Descripción breve",
  "url": "formacion/capacitaciones/index.html",
  "external": false,
  "keywords": ["curso", "tema"]
}
```

Recordá separar cada entrada con una coma. Las URLs internas parten desde la raíz y no llevan `/` inicial.

## Verificación antes de publicar

GitHub ejecutará automáticamente `.github/workflows/validar-sitio.yml`. Un tilde verde indica que las páginas, recursos y rutas internas básicas son válidas.

También podés ejecutar localmente:

```text
python tools/check_site.py
```

Además, revisá manualmente Inicio, Capacitaciones, Recursos y Contacto en un celular.
