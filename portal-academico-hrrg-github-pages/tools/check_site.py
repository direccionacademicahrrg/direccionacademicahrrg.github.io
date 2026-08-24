"""Validación local del portal, sin dependencias externas."""

from __future__ import annotations

import json
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.references: list[tuple[str, str]] = []
        self.links: list[tuple[str, str]] = []
        self.h1_count = 0
        self.title_count = 0
        self.lang = ""
        self._anchor_href: str | None = None
        self._anchor_text: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == "html":
            self.lang = data.get("lang") or ""
        if tag == "h1":
            self.h1_count += 1
        if tag == "title":
            self.title_count += 1
        if data.get("id"):
            self.ids.append(data["id"] or "")
        if tag == "a" and data.get("href"):
            self.references.append(("enlace", data["href"] or ""))
            self._anchor_href = data["href"] or ""
            self._anchor_text = []
        if tag in {"img", "script"} and data.get("src"):
            self.references.append(("recurso", data["src"] or ""))
        if tag == "link" and data.get("href"):
            self.references.append(("recurso", data["href"] or ""))

    def handle_data(self, data: str) -> None:
        if self._anchor_href is not None:
            self._anchor_text.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "a" and self._anchor_href is not None:
            text = " ".join("".join(self._anchor_text).split())
            self.links.append((self._anchor_href, text))
            self._anchor_href = None
            self._anchor_text = []


def resolve_local(source: Path, value: str) -> Path | None:
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc or value.startswith(("#", "mailto:", "tel:", "javascript:")):
        return None
    raw = unquote(parsed.path)
    if not raw:
        return source
    target = (source.parent / raw).resolve()
    if raw.endswith("/") or target.is_dir():
        target /= "index.html"
    return target


errors: list[str] = []
pages = sorted(ROOT.rglob("*.html"))
expected_named_links = {
    "Quiénes somos": ROOT / "institucional" / "index.html",
    "CODEI": ROOT / "institucional" / "codei" / "index.html",
    "Equipo": ROOT / "institucional" / "equipo" / "index.html",
    "Informes de gestión": ROOT / "institucional" / "informes-de-gestion" / "index.html",
}

for page in pages:
    parser = PageParser()
    parser.feed(page.read_text(encoding="utf-8"))
    rel = page.relative_to(ROOT).as_posix()
    if parser.title_count != 1:
        errors.append(f"{rel}: debe tener exactamente un <title>.")
    if parser.h1_count != 1:
        errors.append(f"{rel}: debe tener exactamente un <h1>.")
    if parser.lang != "es-AR":
        errors.append(f"{rel}: el idioma debe ser es-AR.")
    for identifier, count in Counter(parser.ids).items():
        if count > 1:
            errors.append(f"{rel}: id duplicado: {identifier}.")
    for kind, value in parser.references:
        target = resolve_local(page, value)
        if target is not None and not target.exists():
            errors.append(f"{rel}: {kind} inexistente: {value}.")
    for value, text in parser.links:
        expected = expected_named_links.get(text)
        target = resolve_local(page, value)
        if expected is not None and target is not None and target != expected.resolve():
            errors.append(f"{rel}: “{text}” apunta a {value}, pero debe ir a {expected.relative_to(ROOT).as_posix()}.")

index_path = ROOT / "assets" / "search-index.json"
try:
    search_index = json.loads(index_path.read_text(encoding="utf-8"))
except (OSError, json.JSONDecodeError) as exc:
    errors.append(f"assets/search-index.json: no se pudo leer: {exc}.")
else:
    for position, item in enumerate(search_index, start=1):
        if not item.get("external"):
            target = (ROOT / str(item.get("url", ""))).resolve()
            if not target.exists():
                errors.append(f"search-index.json #{position}: URL interna inexistente: {item.get('url')}.")

if errors:
    print("VALIDACIÓN FALLIDA")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print(f"VALIDACIÓN CORRECTA: {len(pages)} páginas y todas las rutas internas verificadas.")
