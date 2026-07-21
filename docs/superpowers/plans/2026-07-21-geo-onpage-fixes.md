# Plan: GEO On-Page-Fixes

**Spec:** `docs/superpowers/specs/2026-07-21-geo-onpage-fixes-design.md`
**Architecture:** Statische Site ohne Build-Framework. `index.html` (DE) und `en/index.html` (EN) müssen bei HTML-Änderungen gespiegelt werden. FAQPage-Schema muss wortgleich mit dem sichtbaren FAQ-Text sein. Keine CSS/JS-Änderungen geplant → keine Re-Minifizierung nötig.

## Task 1: Technik-Basis

- [x] robots.txt: Disallow-Zeilen entfernen (Rechtsseiten haben bereits `meta noindex,follow`)
- [x] sitemap.xml: beide `lastmod` auf 2026-07-21
- [x] Font-Preload `clashdisplay.woff2` in beiden HTML-Heads ergänzen
- [x] `assets/logo.png` (512×512) aus favicon.svg rastern
- [x] llms.txt im Root anlegen (Standardformat)

**Verifikation:** `grep -c Disallow robots.txt` == 0; Datei llms.txt existiert; `sips -g pixelWidth assets/logo.png` ≥ 112.

## Task 2: Schema-Fixes DE (index.html Head)

- [x] `@type` → Array, `alternateName` → "SmartFlow Regensburg", `logo` → logo.png
- [x] `founder` → Person mit `@id #leon-heinrich`, Werdegang-Description, knowsAbout
- [x] WebSite- + WebPage-Schema mit speakable ergänzen
- [x] Services-Schema-Descriptions auf Ich-Form (Parität mit sichtbarem Text aus Task 4)
- [x] FAQPage-Schema: Kosten-Antwort neu (qualitativ), Ich-Form, Drift „einfach" beheben

**Verifikation:** Alle JSON-LD-Blöcke parsen (python3 json.loads).

## Task 3: Schema-Fixes EN (en/index.html Head)

- [x] Gleiche Änderungen wie Task 2, zusätzlich `areaServed` State „Bayern" → „Bavaria"

**Verifikation:** wie Task 2.

## Task 4: Content DE (index.html Body)

- [x] Hero-Subtitle: Definitionssatz „SmartFlow ist …" + Ich-Form; Button „Wie wir arbeiten" → „Wie ich arbeite"
- [x] Services: Header + 3 Descriptions auf Ich-Form
- [x] Audiences: 3 Wir-Stellen auf Ich
- [x] Process: Titel „So arbeite ich" + 4 Schritte auf Ich-Form
- [x] About: echten Werdegang einsetzen, TODO entfernen, Credentials ergänzen
- [x] CTA-Banner 2: „übernehmen wir" → „übernehme ich"
- [x] FAQ sichtbar: Ich-Form + neue Kosten-Antwort (wortgleich mit Schema)

**Verifikation:** grep kein `TODO`; Schema-FAQ-Texte == sichtbare Texte.

## Task 5: Content EN (en/index.html Body)

- [x] Spiegelung aller Task-4-Änderungen auf Englisch

**Verifikation:** wie Task 4.

## Task 6: Abschluss

- [x] Prüfkriterien aus der Spec komplett durchgehen
- [x] Commits, Push, Draft-PR
