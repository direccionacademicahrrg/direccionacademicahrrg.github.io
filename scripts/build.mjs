#!/usr/bin/env node
/**
 * Build del Portal Dirección Académica HRRG.
 * Node >= 18. Sin dependencias.
 *
 * src/pages/**.html  ->  dist/**.html  (HTML plano, sin runtime)
 *
 * Resuelve:
 *   {{> head }} {{> header }} {{> footer }}   partials de src/partials/
 *   {{> icon:nombre }}                        SVG inline de src/partials/icons/
 *   {{ site_root }}                           calculado desde la ruta de salida
 *   {{ page_title }} {{ page_description }}
 *   {{ active_section }}
 *
 * Falla si queda cualquier {{ ... }} sin resolver.
 */

import { readFile, writeFile, mkdir, readdir, stat, rm, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const PARTIALS = path.join(SRC, 'partials');
const ICONS = path.join(PARTIALS, 'icons');

const MAX_PARTIAL_DEPTH = 6;

/* ---------- utilidades ---------- */

async function walk(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(abs, base)));
    else out.push(path.relative(base, abs));
  }
  return out;
}

async function copyTree(from, to) {
  if (!existsSync(from)) return 0;
  const files = await walk(from);
  for (const rel of files) {
    const dest = path.join(to, rel);
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(path.join(from, rel), dest);
  }
  return files.length;
}

/** SITE_ROOT desde la ruta de salida. index.html -> "./" ; a/b/index.html -> "../../" */
function siteRootFor(outRel) {
  const depth = outRel.split('/').length - 1;
  return depth === 0 ? './' : '../'.repeat(depth);
}

/* ---------- carga de partials e iconos ---------- */

const partials = new Map();
const icons = new Map();

async function loadPartials() {
  for (const rel of await walk(PARTIALS)) {
    if (rel.startsWith('icons' + path.sep) || rel.startsWith('icons/')) continue;
    const name = rel.replace(/\.html$/, '').split(path.sep).join('/');
    partials.set(name, await readFile(path.join(PARTIALS, rel), 'utf8'));
  }
  if (existsSync(ICONS)) {
    for (const rel of await readdir(ICONS)) {
      if (!rel.endsWith('.svg')) continue;
      icons.set(rel.replace(/\.svg$/, ''), (await readFile(path.join(ICONS, rel), 'utf8')).trim());
    }
  }
}

/* ---------- resolución ---------- */

function resolveIncludes(html, file) {
  for (let pass = 0; pass < MAX_PARTIAL_DEPTH; pass++) {
    let hit = false;
    html = html.replace(/\{\{>\s*icon:([a-z0-9-]+)\s*\}\}/g, (_, name) => {
      hit = true;
      if (!icons.has(name)) throw new Error(`${file}: icono desconocido "${name}"`);
      return icons.get(name);
    });
    html = html.replace(/\{\{>\s*([a-z0-9/-]+)\s*\}\}/g, (_, name) => {
      hit = true;
      if (!partials.has(name)) throw new Error(`${file}: partial desconocido "${name}"`);
      return partials.get(name);
    });
    if (!hit) return html;
  }
  throw new Error(`${file}: partials anidados demasiado profundo (posible ciclo)`);
}

function resolveVars(html, vars, file) {
  return html.replace(/\{\{\s*([a-z_][a-z0-9_]*)\s*\}\}/g, (m, key) => {
    if (!(key in vars)) throw new Error(`${file}: variable no definida "${key}"`);
    return vars[key];
  });
}

function assertClean(html, outRel) {
  const leftover = html.match(/\{\{[^}]*\}\}/g);
  if (leftover) {
    throw new Error(`${outRel}: quedaron marcadores sin resolver -> ${[...new Set(leftover)].join(', ')}`);
  }
  const forbidden = [
    'support.js', 'x-dc', 'dc-import', 'sc-for', 'sc-if',
    'image-slot', 'style-hover', 'style-focus', 'style-active',
    'DCLogic', 'data-dc-script', 'data-screen-label'
  ];
  const found = forbidden.filter(t => html.includes(t));
  if (found.length) {
    throw new Error(`${outRel}: residuos del entorno de diseño -> ${found.join(', ')}`);
  }
}

/** Front-matter simple: <!--@ key: value --> al inicio del archivo. */
function readMeta(html) {
  const meta = {};
  const re = /^\s*<!--@([\s\S]*?)-->/;
  const m = html.match(re);
  if (!m) return { meta, body: html };
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^\s*([a-z_]+)\s*:\s*(.*?)\s*$/);
    if (kv) meta[kv[1]] = kv[2];
  }
  return { meta, body: html.slice(m[0].length).replace(/^\n/, '') };
}

/* ---------- build ---------- */

async function build() {
  const t0 = Date.now();
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  await loadPartials();

  const pagesDir = path.join(SRC, 'pages');
  const pages = (await walk(pagesDir)).filter(f => f.endsWith('.html'));
  if (!pages.length) throw new Error('src/pages/ está vacío');

  for (const rel of pages) {
    const outRel = rel.split(path.sep).join('/');
    const raw = await readFile(path.join(pagesDir, rel), 'utf8');
    const { meta, body } = readMeta(raw);

    const vars = {
      site_root: siteRootFor(outRel),
      page_title: meta.title ?? '',
      page_description: meta.description ?? '',
      active_section: meta.active ?? ''
    };

    let html = resolveIncludes(body, outRel);
    html = resolveVars(html, vars, outRel);
    assertClean(html, outRel);

    const dest = path.join(DIST, outRel);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, html, 'utf8');
    console.log(`  ✓ ${outRel}  (site_root "${vars.site_root}", ${(html.length / 1024).toFixed(1)} KB)`);
  }

  const cssN = await copyTree(path.join(SRC, 'css'), path.join(DIST, 'assets/css'));
  const jsN = await copyTree(path.join(SRC, 'js'), path.join(DIST, 'assets/js'));
  const asN = await copyTree(path.join(SRC, 'assets'), path.join(DIST, 'assets'));
  const stN = await copyTree(path.join(SRC, 'static'), DIST);

  console.log(`  ✓ assets: ${cssN} css, ${jsN} js, ${asN} media, ${stN} raíz`);
  console.log(`\nBuild OK — ${pages.length} página(s) en ${Date.now() - t0}ms\n`);
}

build().catch(err => {
  console.error('\nBUILD FALLÓ\n' + err.message + '\n');
  process.exit(1);
});
