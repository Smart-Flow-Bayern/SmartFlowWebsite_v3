# GEO On-Page-Fixes — Design

**Datum:** 2026-07-21
**Basis:** GEO-Audit-Report vom 2026-07-20 (Gesamtscore 46/100). Scope laut Leon: nur On-Page/Code-Fixes; externe Maßnahmen (Google Business Profile, LinkedIn, Search Console) bleiben außen vor.

## Entscheidungen aus den Rückfragen

1. **Scope:** Nur On-Page/Code-Fixes in diesem Repo.
2. **Über-mich:** Echter Werdegang von Leon (siehe unten), keine erfundenen Fakten.
3. **Kosten-FAQ:** Qualitativ ausbauen (Einflussfaktoren, Ablauf, Festpreis nach Analyse), **ohne Euro-Beträge**.
4. **Ansprache:** Durchgängig Ich-Form (DE + EN) für die Firmenstimme. „Wir" bleibt nur, wo es „Sie und ich gemeinsam" meint.

## Freigegebene Fakten für die Über-mich-Sektion

- Ausbildung zum Medizinischen Fachangestellten in der Allgemeinarztpraxis Dr. Gall.
- Danach Stationen: Kinderkrankenhaus (Klinik), Kinderarztpraxis, Kinder- und Jugendpsychiatrie.
- Die Idee zu SmartFlow entstand im Klinikalltag: Prozesse beobachtet, die sich offensichtlich effizienter gestalten lassen.
- Schwerpunkte: Prozessoptimierung, Automatisierung, Datenbanken.
- Referenzprojekt: RAG-System für ein mittelständisches Unternehmen mit 40 Mitarbeitern aufgebaut.
- Kein Gründungsjahr genannt → wird nicht behauptet.

## Änderungen

### Content (index.html + en/index.html, gespiegelt)

- **Definitionssatz:** Zitierfähiger erster Satz „SmartFlow ist …" im Hero-Subtitle (DE/EN).
- **Über-mich:** Platzhaltertext + TODO-Kommentar ersetzen durch echten Werdegang; Credentials-Liste um Gesundheitswesen-Hintergrund und RAG-Projekt ergänzen.
- **Kosten-FAQ:** Neuer qualitativer Antworttext (sichtbar **und** FAQPage-Schema identisch).
- **Ich-Form:** Alle Firmenstimme-„Wir" in Hero, Services, Audiences, Process, CTA-Bannern, FAQ (sichtbar + Schema) auf Ich umstellen.
- **FAQ-Drift DE:** Schema-Text der Erstgespräch-FAQ an sichtbaren Text angleichen (Wort „einfach").

### Schema (beide Seiten)

- `@type` → `["LocalBusiness", "ProfessionalService"]`.
- `alternateName` DE/EN vereinheitlichen auf `"SmartFlow Regensburg"` (Entity-Disambiguierung ggü. SmartFlow Consulting München).
- `founder` → vollwertiges Person-Schema mit `@id https://smartflow.bayern/#leon-heinrich`, Werdegang-Description, `knowsAbout`.
- Neues **WebSite**- und **WebPage**-Schema mit `@id`-Verknüpfung; `speakable` (cssSelector: `.hero-subtitle`, `.about-text`) am WebPage-Knoten.
- `logo` → neues PNG ≥112×112 px (`assets/logo.png`, aus favicon.svg gerastert, 512×512).
- EN: `areaServed` State `"Bayern"` → `"Bavaria"`.
- **Kein `sameAs`** — Profile existieren noch nicht; wird nachgetragen, sobald Leon GBP/LinkedIn angelegt hat.

### Technik

- **llms.txt** im Root (llms.txt-Standard: H1, Blockquote-Summary, Link-Sektionen; DE mit EN-Hinweis).
- **robots.txt:** `Disallow`-Zeilen der Rechtsseiten entfernen (die Seiten haben bereits `meta noindex,follow`; das Disallow verhindert aktuell, dass Crawler das noindex sehen).
- **Font-Preload** für `clashdisplay.woff2` in beiden Seiten ergänzen.
- **sitemap.xml:** `lastmod` auf 2026-07-21.
- Minifizierte Assets nur bei CSS/JS-Änderung neu erzeugen (via `npx --yes esbuild`); aktuell sind keine CSS/JS-Änderungen geplant.

### Bewusst nicht enthalten

GBP/LinkedIn/GSC/Bing (extern), neue Pilotseite, Security-Header (GitHub Pages unterstützt keine Custom-Header), aggregateRating (keine echten Bewertungen vorhanden).

## Prüfkriterien

1. Alle JSON-LD-Blöcke beider Seiten parsen fehlerfrei (JSON-Validierung).
2. FAQPage-Schema-Texte == sichtbare FAQ-Texte (DE und EN).
3. Kein Firmenstimme-„Wir"/„we" mehr in Leistungs-/Prozess-/FAQ-Texten.
4. Kein TODO-Kommentar mehr in den About-Sektionen.
5. `llms.txt` existiert im Root und folgt dem Standardformat.
6. robots.txt enthält keine Disallow-Zeilen mehr; Rechtsseiten behalten `noindex, follow`.
7. Keine Euro-Beträge im Kosten-FAQ-Text.
8. `assets/logo.png` existiert mit ≥112×112 px und ist in beiden LocalBusiness-Schemas referenziert.

## Ablauf

Worktree auf Basis `feat/taste-redesign` → thematische Commits → Push → Draft-PR. Kein Merge, kein Deployment (bleibt bei Leon).
