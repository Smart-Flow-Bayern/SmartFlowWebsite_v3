# Frontend-Veredelung „Editorial Engineering" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die bestehende SmartFlow-Landingpage zu einem High-End-„Editorial-Engineering"-Auftritt veredeln — gleiche ruhige Editorial-Basis, aber mit echtem Typo-Pairing (Display + Body + Mono), präziserer Farbwelt, Tiefe und genau **einer** orchestrierten Signatur-Animation (der „Flow-Line").

**Architecture:** Statische Seite ohne Build-Framework. Eine geteilte `css/styles.css` und `js/main.js` versorgen **beide** Sprachseiten (`index.html` = DE, `en/index.html` = EN); beide laden die **minifizierten** Varianten `css/styles.min.css` und `js/main.min.js`. CSS/JS-Änderungen wirken automatisch auf beide Seiten — nur HTML-Strukturänderungen müssen in beiden Dateien gespiegelt werden. Animationen laufen primär über CSS-Keyframes, von JS nur ausgelöst; `prefers-reduced-motion` zeigt überall den statischen Endzustand.

**Tech Stack:** HTML5, CSS (Custom Properties / Design Tokens), Vanilla JS (IntersectionObserver, requestAnimationFrame), self-hosted woff2-Fonts, SVG. Minifizierung via `npx esbuild` (kein npm-Setup, kein `package.json`). Visuelle Verifikation via lokalem `python3 -m http.server` + Playwright-MCP-Screenshots.

## Global Constraints

- **Keine Build-Pipeline einführen.** Kein `package.json`, kein `node_modules`. Minifizierung ausschließlich per `npx esbuild` (lädt das Tool transient).
- **Quelle vor Minifikat:** Immer `css/styles.css` und `js/main.js` editieren. Die `.min`-Dateien werden in Task 5 neu erzeugt — niemals von Hand minifizieren.
- **Zweisprachigkeit:** Jede HTML-Strukturänderung in `index.html` muss mit dem **englischen** Pendant in `en/index.html` gespiegelt werden (gleiche Klassen/Struktur, übersetzte Texte).
- **A11y-Floor:** Sichtbarer Tastatur-Fokus bleibt erhalten; alle Animationen respektieren `@media (prefers-reduced-motion: reduce)`; Textkontrast ≥ AA (4.5:1 für Fließtext) auf hellem **und** dunklem Theme.
- **Light + Dark:** Beide Themes bleiben voll funktionsfähig; jede neue Farbe/Token braucht einen Wert in `:root` **und** in `[data-theme="dark"]`.
- **Farb-Tokens (verbatim):** `--color-accent: #1B4DFF` (Kobalt), Flow-Verlauf `#1B4DFF → #36D2E0`. Ink `#0C1116`, Paper `#F6F7F9`.
- **Fonts (verbatim):** Display = **Clash Display**, Body = **Manrope** (bestehend), Mono = **JetBrains Mono**. Bei Download-Fehler: System-Fallback im `font-family`-Stack greift; Task meldet den Fehlschlag, blockiert aber nicht.
- **Signatur-Disziplin:** Genau **eine** orchestrierte Animation (Hero-Flow-Line). Der Rest bleibt dezent (Hover, Fade-in, ein Count-up). Keine zusätzlichen Auffälligkeiten.
- **Verifikation statt Unit-Tests:** Dies ist ein visueller Plan. „Test" = lokalen Server starten, per Playwright-MCP bei Viewports **320 / 768 / 1440 px** in **light + dark** screenshotten, Konsole auf Fehler prüfen. Jede Task endet mit Screenshot-Verifikation + Commit.

---

## File Structure

| Datei | Verantwortung | Aktion |
|---|---|---|
| `css/styles.css` | Einziges Stylesheet (Tokens, alle Sektionen, beide Themes) | Modify (alle Tasks) |
| `js/main.js` | Verhalten: Theme, Menü, Scroll, **neu**: Flow-Line + Count-up | Modify (Task 2, 4) |
| `index.html` | DE-Seite: Hero/Services/Results-Markup | Modify (Task 2, 3, 4) |
| `en/index.html` | EN-Seite: gespiegeltes Markup, englische Texte | Modify (Task 2, 3, 4, 5) |
| `assets/fonts/clashdisplay.woff2` | Display-Font (self-hosted) | Create (Task 1) |
| `assets/fonts/jetbrainsmono.woff2` | Mono-Font (self-hosted) | Create (Task 1) |
| `css/styles.min.css` | Minifikat (von HTML geladen) | Regenerate (Task 5) |
| `js/main.min.js` | Minifikat (von HTML geladen) | Regenerate (Task 5) |

**Verifikations-Workflow (in jeder Task identisch):**
1. Lokalen Server starten (einmalig, im Hintergrund): `python3 -m http.server 8000` im Projekt-Root.
2. **Während der Entwicklung** lädt die Seite die `.min`-Dateien. Damit Änderungen an `styles.css`/`main.js` sofort sichtbar sind, in **Task 1 Step 4** einmalig temporär auf die Quelldateien umstellen (siehe dort). In Task 5 zurückstellen + minifizieren.
3. Screenshot via Playwright MCP: `browser_navigate` → `http://localhost:8000/` bzw. `/en/`, `browser_resize` auf die drei Breiten, `browser_take_screenshot`, `browser_console_messages` (muss leer/fehlerfrei sein).

---

### Task 1: Setup, Fonts & Design-Tokens

Legt den Branch an, beschafft die zwei neuen Fonts, definiert das neue Token-System (Farbe + 3 Font-Rollen) und wendet die Schrift-Familien auf die bestehenden Klassen an. Danach trägt die Seite bereits die neue typografische Persönlichkeit, ohne dass das Layout sich ändert.

**Files:**
- Modify: `css/styles.css:7-13` (@font-face Block), `css/styles.css:19-82` (Token-Blöcke `:root` + `[data-theme="dark"]`)
- Create: `assets/fonts/clashdisplay.woff2`, `assets/fonts/jetbrainsmono.woff2`
- Modify (temporär): `index.html:44` + `index.html:798` und `en/index.html:44` + `en/index.html:797` (auf Quelldateien umstellen)

**Interfaces:**
- Produces (von späteren Tasks genutzt): CSS-Variablen `--font-display`, `--font-body`, `--font-mono`, `--color-accent-soft` (`#36D2E0`), sowie geänderte Werte für `--color-bg`, `--color-text` etc.

- [ ] **Step 1: Branch anlegen**

```bash
cd /Users/leon/Documents/GitHub/SmartFlowWebsite-v3
git checkout -b feat/frontend-veredelung
```

- [ ] **Step 2: Fonts beschaffen**

JetBrains Mono (über Google-Fonts-CSS-API, stabil):

```bash
curl -sL "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400..700&display=swap" \
  -H "User-Agent: Mozilla/5.0" \
  | grep -oE "https://[^) ]+\.woff2" | head -1 \
  | xargs curl -sL -o assets/fonts/jetbrainsmono.woff2
```

Clash Display (über Fontshare-Download-API, liefert ein ZIP mit woff2):

```bash
curl -sL "https://api.fontshare.com/v2/fonts/download/clash-display" -o /tmp/clash.zip \
  && unzip -o /tmp/clash.zip -d /tmp/clash >/dev/null \
  && (cp "$(find /tmp/clash -iname '*Variable*.woff2' | head -1)" assets/fonts/clashdisplay.woff2 2>/dev/null \
      || cp "$(find /tmp/clash -iname '*Semibold*.woff2' | head -1)" assets/fonts/clashdisplay.woff2)
```

- [ ] **Step 3: Download verifizieren**

```bash
ls -l assets/fonts/clashdisplay.woff2 assets/fonts/jetbrainsmono.woff2
```

Expected: beide Dateien existieren und sind **> 10 KB**.
Falls eine Datei fehlt oder < 5 KB: Download ist fehlgeschlagen — Datei löschen und im Abschlussbericht melden. Der `font-family`-Fallback-Stack (Step 5) hält die Seite funktionsfähig; **nicht** blockieren.

- [ ] **Step 4: HTML temporär auf Quelldateien umstellen (DE + EN)**

Für die Dauer der Entwicklung auf die nicht-minifizierten Quellen zeigen (in Task 5 zurückgestellt).
In `index.html`:

```html
<link rel="stylesheet" href="css/styles.css" />
```
```html
<script src="js/main.js"></script>
```

In `en/index.html` (relative Pfade beachten):

```html
<link rel="stylesheet" href="../css/styles.css" />
```
```html
<script src="../js/main.js"></script>
```

- [ ] **Step 5: @font-face + Tokens in `css/styles.css` setzen**

Ersetze den bestehenden `@font-face`-Block (Zeilen ~7–13) durch:

```css
@font-face {
  font-family: 'Manrope';
  src: url('../assets/fonts/manrope.woff2') format('woff2');
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Clash Display';
  src: url('../assets/fonts/clashdisplay.woff2') format('woff2');
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'JetBrains Mono';
  src: url('../assets/fonts/jetbrainsmono.woff2') format('woff2');
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}
```

Ersetze im `:root`-Block die betroffenen Zeilen (Farben + Font-Variablen). Setze genau diese Werte:

```css
  --color-bg: #F6F7F9;
  --color-bg-alt: #EDEFF3;
  --color-surface: #FFFFFF;
  --color-text: #0C1116;
  --color-text-secondary: #41505F;
  --color-text-muted: #6B7A8A;
  --color-accent: #1B4DFF;
  --color-accent-soft: #36D2E0;
  --color-border: rgba(12, 17, 22, 0.10);

  --font-display: 'Clash Display', 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
```

Setze außerdem im `:root` die Button/Helper-Tokens passend:

```css
  --btn-cta-bg: #0C1116;
  --process-number-color: rgba(12, 17, 22, 0.14);
```

Ersetze im `[data-theme="dark"]`-Block:

```css
  --color-bg: #0C1116;
  --color-bg-alt: #131A22;
  --color-surface: #1A232E;
  --color-text: #F6F7F9;
  --color-text-secondary: #A7B4C2;
  --color-text-muted: #6B7A8A;
  --color-accent: #5B7BFF;
  --color-accent-soft: #36D2E0;
  --color-border: rgba(255, 255, 255, 0.12);

  --header-bg: rgba(12, 17, 22, 0.85);
  --mobile-menu-bg: #0F151C;
  --btn-cta-bg: #F6F7F9;
  --btn-cta-color: #0C1116;
  --process-number-color: rgba(255, 255, 255, 0.10);
```

(Dunkles Kobalt `#5B7BFF` ist auf dunklem Grund kontraststärker als `#1B4DFF`.)

- [ ] **Step 6: Schrift-Rollen auf bestehende Klassen anwenden**

Füge in `css/styles.css` einen neuen Block direkt nach dem `body`-Regelblock ein (zentrale Zuweisung statt verstreut):

```css
/* Typo-Rollen: Display für Headlines, Mono für Daten/Labels */
.hero-title,
.section-title,
.service-title,
.results-title,
.contact-title,
.cta-banner-title,
.case-study-title,
.process-title,
.cal-placeholder-title,
.legal-page h1,
.legal-page h2 {
  font-family: var(--font-display);
  font-weight: 600;
}

.hero-eyebrow,
.section-label,
.results-label,
.contact-label,
.case-study-industry,
.footer-heading,
.metric-number,
.case-study-metric,
.process-number,
.service-number,
.testimonial-role {
  font-family: var(--font-mono);
  font-feature-settings: 'tnum' 1;
}

/* Mono braucht weniger Letterspacing als die alten Sans-Labels */
.hero-eyebrow,
.section-label,
.results-label,
.contact-label,
.case-study-industry,
.footer-heading {
  letter-spacing: 0.08em;
}
```

- [ ] **Step 7: Verifizieren (Screenshot DE light + dark)**

Server starten (falls nicht laufend): `python3 -m http.server 8000` (Hintergrund). Dann per Playwright MCP:
- `browser_navigate` → `http://localhost:8000/`
- `browser_resize` 1440×900 → `browser_take_screenshot` (Dateiname `t1-de-light.png`)
- Dark-Mode via Klick auf `#theme-toggle` → `browser_take_screenshot` (`t1-de-dark.png`)
- `browser_console_messages` → muss fehlerfrei sein.

Expected: Headlines erscheinen in Clash Display, Eyebrow-Labels + Kennzahlen in JetBrains Mono; Hintergrund leicht kühl (#F6F7F9), Akzente kobaltblau. Layout sonst unverändert. Falls Fonts nicht greifen (Download fehlte): Fallback-Schriften sichtbar — akzeptabel, im Bericht vermerken.

- [ ] **Step 8: Commit**

```bash
git add css/styles.css index.html en/index.html assets/fonts/
git commit -m "feat(design): neue Farb-Tokens + Display/Mono-Typo-Pairing"
```

---

### Task 2: Hero asymmetrisch + Flow-Line-Signatur

Baut den zentrierten Hero zu einem zweispaltigen Layout um (Text links, animierte Flow-Line rechts) und implementiert die **eine** Signatur-Animation: verstreute Knoten ordnen sich beim Laden zu einer fließenden Prozess-Pipeline.

**Files:**
- Modify: `index.html:258-281` (Hero-Markup DE), `en/index.html` (Hero-Markup EN, gleiche Zeilenregion)
- Modify: `css/styles.css` (Hero-Block ~344-463, neue `.hero-visual`/`.flow-*`-Regeln + Keyframes)
- Modify: `js/main.js` (neue `initFlowLine()` + Aufruf in `DOMContentLoaded`)

**Interfaces:**
- Consumes: `--color-accent`, `--color-accent-soft`, `--font-display`, `--font-mono` (Task 1).
- Produces: JS-Funktion `initFlowLine()`; CSS-Klassen `.hero-inner`, `.hero-visual`, `.flow-svg`, `.flow-path`, `.flow-node`, `.flow-chip`, Klassen-Toggle `.flow-animate` / `.flow-static`.

- [ ] **Step 1: Hero-Markup umbauen (DE) — `index.html`**

Ersetze den kompletten Inhalt von `<section class="hero" id="hero">` durch eine zweispaltige Struktur. Der bestehende `.hero-content`-Block bleibt inhaltlich erhalten, bekommt aber den Wrapper `.hero-inner` und einen Geschwister-Block `.hero-visual`:

```html
<section class="hero" id="hero">
  <div class="hero-inner">
    <div class="hero-content fade-in">
      <p class="hero-eyebrow">Prozessberatung Regensburg · Mittelstand &amp; Handwerk</p>
      <h1 class="hero-title">
        Bis zu 30 % weniger<br>
        Verwaltungsaufwand.<br>
        <span class="accent">In 90 Tagen.</span>
      </h1>
      <p class="hero-subtitle">
        Wir digitalisieren und automatisieren Prozesse für Hausverwaltungen, Praxen,
        Handwerksbetriebe und Mittelstand in Bayern — pragmatisch, ohne neue Software
        aufzudrängen, wo bestehende Systeme reichen.
      </p>
      <div class="hero-actions">
        <a href="#contact" class="btn-cta">Effizienz-Analyse anfordern &rarr;</a>
        <a href="#process" class="btn-secondary">Wie wir arbeiten</a>
      </div>
      <p class="hero-trust">
        <span class="sr-only">5 Sterne — </span>
        <span class="hero-trust-stars" aria-hidden="true">★★★★★</span>
        Sitz Regensburg · Kostenfreies Erstgespräch · Antwort in &lt; 24 h
      </p>
    </div>

    <div class="hero-visual fade-in" aria-hidden="true">
      <svg class="flow-svg" viewBox="0 0 360 420" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
        <defs>
          <linearGradient id="flowGrad" x1="0" y1="0" x2="360" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="var(--color-accent)"/>
            <stop offset="1" stop-color="var(--color-accent-soft)"/>
          </linearGradient>
        </defs>
        <path class="flow-path"
          d="M48 56 C 150 56, 60 150, 180 170 S 120 280, 312 300"
          stroke="url(#flowGrad)" stroke-width="2.5" stroke-linecap="round"/>
        <g class="flow-nodes" stroke="url(#flowGrad)" stroke-width="2" fill="var(--color-bg)">
          <circle class="flow-node" style="--i:0" cx="48"  cy="56"  r="9"/>
          <circle class="flow-node" style="--i:1" cx="180" cy="170" r="9"/>
          <circle class="flow-node" style="--i:2" cx="312" cy="300" r="9"/>
        </g>
        <g class="flow-chips" fill="none">
          <rect class="flow-chip" style="--i:0" x="92"  y="44"  width="46" height="24" rx="6"/>
          <rect class="flow-chip" style="--i:1" x="206" y="158" width="46" height="24" rx="6"/>
          <rect class="flow-chip" style="--i:2" x="246" y="288" width="46" height="24" rx="6"/>
        </g>
      </svg>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Hero-Markup spiegeln (EN) — `en/index.html`**

Identische Struktur, englische Texte. Eyebrow: `Process consulting Regensburg · SMEs &amp; trades`; Titel: `Up to 30% less<br>administrative work.<br><span class="accent">In 90 days.</span>`; Subtitle: `We digitise and automate processes for property managers, medical practices, trades and SMEs across Bavaria — pragmatically, without pushing new software where existing systems suffice.`; Buttons: `Request efficiency analysis &rarr;` / `How we work`; Trust: `Based in Regensburg · Free initial consultation · Reply within &lt; 24 h`. Die `.hero-visual`-SVG ist **identisch** (enthält keine Texte).

- [ ] **Step 3: Hero-CSS umbauen — `css/styles.css`**

Ersetze die `.hero`- und `.hero-content`-Regeln; ergänze Visual + Animation:

```css
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: calc(var(--header-height) + 6vh) var(--space-lg) 12vh;
}

.hero-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: var(--space-2xl);
  align-items: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-lg);
  text-align: left;
}

.hero-subtitle,
.hero-trust { text-align: left; }

.hero-actions { justify-content: flex-start; }

.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flow-svg { width: 100%; max-width: 360px; height: auto; }

.flow-path {
  pathLength: 1;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

.flow-node,
.flow-chip { opacity: 0; }

/* Animierter Zustand (von JS gesetzt) */
.flow-animate .flow-path {
  animation: flow-draw 1.4s cubic-bezier(.65,.05,.36,1) forwards;
}
.flow-animate .flow-node {
  animation: flow-pop .5s ease-out forwards;
  animation-delay: calc(0.5s + var(--i) * 0.45s);
  transform-box: fill-box;
  transform-origin: center;
}
.flow-animate .flow-chip {
  stroke: var(--color-text-muted);
  stroke-width: 1.5;
  animation: flow-fade .5s ease-out forwards;
  animation-delay: calc(0.7s + var(--i) * 0.45s);
}

/* Statischer Endzustand (reduced-motion) */
.flow-static .flow-path { stroke-dashoffset: 0; }
.flow-static .flow-node,
.flow-static .flow-chip { opacity: 1; }
.flow-static .flow-chip { stroke: var(--color-text-muted); stroke-width: 1.5; }

@keyframes flow-draw { to { stroke-dashoffset: 0; } }
@keyframes flow-pop {
  0% { opacity: 0; transform: scale(0.4); }
  70% { transform: scale(1.15); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes flow-fade { to { opacity: 1; } }

@media (max-width: 860px) {
  .hero-inner { grid-template-columns: 1fr; gap: var(--space-xl); }
  .hero-visual { order: -1; }
  .flow-svg { max-width: 260px; }
}

@media (prefers-reduced-motion: reduce) {
  .flow-animate .flow-path,
  .flow-animate .flow-node,
  .flow-animate .flow-chip { animation: none; }
}
```

- [ ] **Step 4: `initFlowLine()` in `js/main.js` ergänzen**

Neue Funktion (z. B. nach `initStickyCta`) und Aufruf in `DOMContentLoaded`:

```javascript
function initFlowLine() {
  const svg = document.querySelector('.flow-svg');
  if (!svg) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    svg.classList.add('flow-static');
    return;
  }
  requestAnimationFrame(() => svg.classList.add('flow-animate'));
}
```

In der `DOMContentLoaded`-Liste ergänzen:

```javascript
  initFlowLine();
```

- [ ] **Step 5: Verifizieren (Hero, beide Sprachen + Viewports + Konsole)**

Per Playwright MCP, Server auf `:8000`:
- `http://localhost:8000/` bei 1440 → Screenshot `t2-de-1440.png`: Text links, Flow-Line rechts, Animation läuft beim Laden (Pfad zeichnet sich, Knoten poppen gestaffelt).
- 768 und 320 → Screenshots: Visual rückt über den Text, nichts überläuft.
- `http://localhost:8000/en/` bei 1440 → `t2-en-1440.png`: englische Texte, gleiche Optik.
- `browser_console_messages`: keine Fehler.

Expected: genau eine auffällige Animation im Hero; Layout asymmetrisch; mobil sauber gestapelt.

- [ ] **Step 6: Commit**

```bash
git add index.html en/index.html css/styles.css js/main.js
git commit -m "feat(hero): asymmetrischer Hero mit Flow-Line-Signatur (DE+EN)"
```

---

### Task 3: Services + Prozess

Korrigiert das doppelte `01/02/03`-Muster: Services bekommen **statt** Nummern ein technisches Glyph + Karten-Tiefe; der Prozess **behält** die Nummerierung (echte Sequenz) und bekommt einen verbindenden Flow-Connector.

**Files:**
- Modify: `index.html:286-351` (Services DE), `index.html:402-446` (Prozess DE)
- Modify: `en/index.html` (Services + Prozess EN, gleiche Regionen)
- Modify: `css/styles.css` (Services-Block ~469-580, Process-Block ~586-652)

**Interfaces:**
- Consumes: `--font-display`, `--font-mono`, `--color-accent`, `--color-surface`, `--color-border`, `--color-accent-soft` (Task 1).
- Produces: CSS-Klasse `.service-glyph`; geändertes `.service-block` (Karten-Layout); `.process-steps`-Connector.

- [ ] **Step 1: Services-Markup umbauen (DE) — `index.html`**

Für **jeden** der drei `.service-block` die `<span class="service-number">…</span>` durch ein `<span class="service-glyph">`-Element ersetzen. Block 01 (Prozessoptimierung):

```html
<div class="service-block fade-in">
  <div class="service-block-inner">
    <span class="service-glyph" aria-hidden="true">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 12h4l2 5 4-14 2 9h6"/>
      </svg>
    </span>
    <div class="service-body">
      <h3 class="service-title">Prozessoptimierung</h3>
      <p class="service-description">Wir analysieren Ihre bestehenden Abläufe, identifizieren Engpässe und gestalten Ihre Workflows neu — für mehr Effizienz und weniger verschwendete Zeit.</p>
      <ul class="service-features">
        <li class="service-feature">Ist-Analyse</li>
        <li class="service-feature">Engpass-Identifikation</li>
        <li class="service-feature">Workflow-Redesign</li>
        <li class="service-feature">KPI-Definition</li>
      </ul>
    </div>
  </div>
</div>
```

Block 02 (Digitalisierung) — gleiches Muster, nur der Glyph-`<svg>`-Inhalt wird ersetzt durch (Cloud/Upload):

```html
<path d="M12 13V3m0 0L8 7m4-4 4 4"/><path d="M20 16.5A4.5 4.5 0 0 0 16 9h-1.3A6 6 0 1 0 5 16"/>
```

Block 03 (Automatisierung) — Glyph-`<svg>`-Inhalt (Zahnrad/Automatik):

```html
<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3m-3.5-6.5-2 2m-9 9-2 2m0-13 2 2m9 9 2 2"/>
```

(Beibehalten: jeweils `service-body`, `service-title`, `service-description`, `service-features` der Blöcke 02/03 wie im Original — nur das Nummern-Span wird zum Glyph-Span.)

- [ ] **Step 2: Services-Markup spiegeln (EN) — `en/index.html`**

Gleiche drei Glyphs, englische Titel/Texte aus der bestehenden EN-Datei beibehalten — nur `<span class="service-number">01</span>` etc. durch das jeweilige `<span class="service-glyph">…</span>` ersetzen.

- [ ] **Step 3: Services-CSS auf Karten-Look — `css/styles.css`**

Ersetze die `.service-block`- und `.service-number`-Regeln:

```css
.service-block {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  padding: var(--space-xl);
  margin-bottom: var(--space-md);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal);
}
.service-block:last-child { border-bottom: 1px solid var(--color-border); }
.service-block:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 40px rgba(12, 17, 22, 0.08);
  border-color: color-mix(in srgb, var(--color-accent) 40%, var(--color-border));
}

.service-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
  color: var(--color-accent);
  flex-shrink: 0;
}
```

(Die alte `.service-number`-Regel entfällt; sie darf im `font-mono`-Selektor aus Task 1 gelistet bleiben, ohne zu schaden.)

- [ ] **Step 4: Prozess-Connector — `css/styles.css`**

Ergänze in der Process-Sektion einen durchgehenden vertikalen Flow-Strich, der die Schritte verbindet (Nummern bleiben):

```css
.process-steps { position: relative; }
.process-steps::before {
  content: '';
  position: absolute;
  left: calc(2.5rem - 1px);
  top: var(--space-xl);
  bottom: var(--space-xl);
  width: 2px;
  background: linear-gradient(var(--color-accent), var(--color-accent-soft));
  opacity: 0.35;
}
.process-number { position: relative; z-index: 1; }

@media (max-width: 600px) {
  .process-steps::before { display: none; }
}
```

- [ ] **Step 5: Verifizieren**

Server `:8000`, Playwright MCP:
- DE 1440 → `t3-de-services.png`: drei Service-Karten mit Glyph statt Nummer, dezenter Hover-Lift; Prozess mit vertikalem Verlaufsstrich + erhaltenen Nummern.
- DE 320 → `t3-de-mobile.png`: Karten stapeln, Strich aus.
- EN 1440 → `t3-en.png`.
- `browser_console_messages`: leer.

Expected: keine `01/02/03`-Dopplung mehr; Services wirken technischer und greifbarer, Prozess als echte Sequenz.

- [ ] **Step 6: Commit**

```bash
git add index.html en/index.html css/styles.css
git commit -m "feat(services,process): Glyph-Karten statt Nummern, Prozess-Flow-Connector"
```

---

### Task 4: Results-Count-up + Tiefe für Testimonials/About/CTA

Mono-Kennzahlen mit dezentem Count-up beim Scrollen; Karten (Case Studies, Testimonials, About-Foto-Frame, CTA-Banner) bekommen abgestimmte Tiefe.

**Files:**
- Modify: `index.html:460-473` (Metriken DE)
- Modify: `en/index.html` (Metriken EN)
- Modify: `js/main.js` (neue `initCountUp()` + Aufruf)
- Modify: `css/styles.css` (Results-, Testimonial-, About-, CTA-Blöcke)

**Interfaces:**
- Consumes: `--font-mono`, `--color-accent`, `--color-surface`, `--color-bg-alt` (Task 1).
- Produces: JS-Funktion `initCountUp()`; HTML-Attribut `data-count` auf einem inneren `<span>` der `.metric-number`.

- [ ] **Step 1: Metrik-Markup mit `data-count` (DE) — `index.html`**

Ersetze die drei `.metric-item`:

```html
<div class="metric-item fade-in">
  <span class="metric-number"><span data-count="22">22</span><span class="metric-unit">%</span></span>
  <span class="metric-label">Zeitersparnis</span>
</div>
<div class="metric-item fade-in">
  <span class="metric-number"><span data-count="32">32</span><span class="metric-unit">%</span></span>
  <span class="metric-label">Fehlerreduktion</span>
</div>
<div class="metric-item fade-in">
  <span class="metric-number"><span data-count="187">187</span><span class="metric-unit">%</span></span>
  <span class="metric-label">ROI</span>
</div>
```

- [ ] **Step 2: Metrik-Markup spiegeln (EN) — `en/index.html`**

Gleiche Struktur; englische Labels (`Time saved`, `Error reduction`, `ROI`) beibehalten, `data-count`-Werte identisch (22 / 32 / 187).

- [ ] **Step 3: `initCountUp()` in `js/main.js`**

```javascript
function initCountUp() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      obs.unobserve(el);
      if (reduce) { el.textContent = String(target); return; }
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  nums.forEach((n) => obs.observe(n));
}
```

In `DOMContentLoaded` ergänzen:

```javascript
  initCountUp();
```

- [ ] **Step 4: Tiefe für Karten — `css/styles.css`**

Ergänze (Case Studies + Testimonials bekommen den gleichen Hover wie Service-Karten; About-Foto-Frame + CTA-Banner-Akzent):

```css
.case-study,
.testimonial {
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}
.case-study:hover,
.testimonial:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 40px rgba(12, 17, 22, 0.08);
}

.about-image {
  border: 1px solid var(--color-border);
  box-shadow: 0 24px 60px rgba(12, 17, 22, 0.10);
}

.cta-banner {
  background: linear-gradient(120deg,
    color-mix(in srgb, var(--color-accent) 8%, var(--color-bg-alt)),
    var(--color-bg-alt));
}
```

- [ ] **Step 5: Verifizieren**

Server `:8000`, Playwright MCP:
- DE 1440, zur Results-Sektion scrollen (`browser_evaluate`: `document.querySelector('#results').scrollIntoView()`) → Screenshot `t4-de-results.png`: Kennzahlen zählen sichtbar hoch und stehen final auf 22 / 32 / 187.
- Hover über eine Case-Study / ein Testimonial → Lift sichtbar.
- EN 1440 → `t4-en.png`.
- `browser_console_messages`: leer.

Expected: ein dezenter Count-up (kein zweiter „Wow"-Effekt, der mit dem Hero konkurriert); Karten mit ruhiger Tiefe.

- [ ] **Step 6: Commit**

```bash
git add index.html en/index.html js/main.js css/styles.css
git commit -m "feat(results): Mono-Count-up + abgestimmte Karten-Tiefe"
```

---

### Task 5: EN-Konsolidierung, Min-Build & finale QA

Stellt sicher, dass DE und EN strukturell deckungsgleich sind, erzeugt die `.min`-Dateien neu, stellt das HTML auf die Minifikate zurück und führt die abschließende Cross-Viewport-/A11y-Verifikation durch.

**Files:**
- Modify: `index.html:44` + `:798` und `en/index.html:44` + `:797` (zurück auf `.min`)
- Regenerate: `css/styles.min.css`, `js/main.min.js`
- Verify: `en/index.html` (Struktur-Diff gegen `index.html`)

**Interfaces:**
- Consumes: alle vorherigen Tasks.
- Produces: aktuelle Minifikate; produktionsbereite HTML-Verweise.

- [ ] **Step 1: Struktur-Abgleich DE vs. EN**

Vergleiche die Klassen-Gerüste beider Seiten (Texte dürfen abweichen, Struktur nicht):

```bash
diff <(grep -oE 'class="[^"]+"' index.html) <(grep -oE 'class="[^"]+"' en/index.html) | head -40
```

Expected: keine **strukturellen** Unterschiede (gleiche Klassen in gleicher Reihenfolge). Abweichungen beheben, bis nur Textinhalte differieren.

- [ ] **Step 2: Minifikate neu erzeugen**

```bash
npx --yes esbuild css/styles.css --minify --outfile=css/styles.min.css
npx --yes esbuild js/main.js --minify --outfile=js/main.min.js
```

Expected: beide Befehle erfolgreich; `css/styles.min.css` und `js/main.min.js` aktualisiert.

- [ ] **Step 3: HTML auf Minifikate zurückstellen (DE + EN)**

`index.html`: `href="css/styles.min.css"` und `src="js/main.min.js"`.
`en/index.html`: `href="../css/styles.min.css"` und `src="../js/main.min.js"`.

- [ ] **Step 4: Finale QA-Matrix**

Server `:8000`, Playwright MCP. Für **DE und EN**, je **light + dark**, je **320 / 768 / 1440**:
- `browser_navigate`, `browser_resize`, Theme-Toggle, `browser_take_screenshot` (`t5-{de,en}-{light,dark}-{320,768,1440}.png`).
- Nach jedem Laden `browser_console_messages` → muss fehlerfrei sein.
- Tastatur-Fokus: `browser_press_key` Tab mehrfach → sichtbarer Fokusring auf Links/Buttons (`browser_take_screenshot` `t5-focus.png`).
- Hero-Animation läuft genau einmal beim Laden; Count-up beim Scrollen zu Results.

Expected: konsistentes Bild in allen 12 Kombinationen; keine Konsolenfehler; Fokus sichtbar.

- [ ] **Step 5: reduced-motion prüfen (Code + manuell)**

Code-Review: `initFlowLine()` und `initCountUp()` lesen `prefers-reduced-motion` und setzen den statischen Endzustand; CSS hat `@media (prefers-reduced-motion: reduce)` für `.flow-*`. Manueller Hinweis im Abschlussbericht: in macOS „Bewegung reduzieren" aktivieren → Hero zeigt statische Flow-Line, Zahlen stehen sofort final.

- [ ] **Step 6: Cal.com-Embed-Smoke**

DE-Seite, zur Kontakt-Sektion, Klick auf „Buchungskalender laden" → Platzhalter verschwindet, Kalender lädt, keine Konsolenfehler. (`brandColor: '#00D9FF'` im Embed-Script ist unabhängig vom Seiten-Akzent — optional auf `#1B4DFF` angleichen, wenn gewünscht; dann in **beiden** HTML-Dateien.)

- [ ] **Step 7: Commit**

```bash
git add index.html en/index.html css/styles.min.css js/main.min.js
git commit -m "build: Minifikate neu erzeugt, HTML auf .min zurückgestellt, QA abgeschlossen"
```

- [ ] **Step 8: Abschluss**

Nutze `superpowers:finishing-a-development-branch`, um über Merge/PR/Cleanup zu entscheiden. Im Bericht festhalten: Font-Download-Status (Task 1 Step 3), reduced-motion-Hinweis, optionale Cal.com-Farbangleichung.

---

## Self-Review

**1. Spec-Coverage** (gegen die abgestimmte Design-Direction):
- Veredelter Editorial-Look (Evolution) → Task 1 (Tokens/Typo), Task 3/4 (Tiefe). ✓
- Eine orchestrierte Signatur (Flow-Line) → Task 2. ✓
- Display+Body+Mono-Pairing → Task 1 Step 5–6. ✓
- Kobalt-Akzent statt Aqua → Task 1 (`--color-accent: #1B4DFF`). ✓
- `01/02/03`-Dopplung beheben → Task 3 (Services Glyph, Prozess behält Sequenz). ✓
- Mit Platzhaltern designen → Task 4 (About-Frame/Testimonials bleiben Platzhalter, nur veredelt). ✓
- Zweisprachigkeit + Min-Build-Realität → Task 2/3/4 spiegeln EN, Task 5 minifiziert. ✓
- A11y/reduced-motion → in jeder Animation (Task 2/4) + Task 5 Step 4–5. ✓

**2. Placeholder-Scan:** Kein „TBD/TODO/implement later". Alle Code-Schritte enthalten vollständigen Code; SVG-Glyph-Pfade sind ausgeschrieben. ✓ (Inhaltliche `[Name einsetzen]`-Platzhalter im Testimonial-Markup bleiben bewusst — sie sind echter Seiteninhalt, kein Plan-Platzhalter.)

**3. Typ-Konsistenz:** `initFlowLine` / `initCountUp` konsistent zwischen Definition (Task 2/4) und `DOMContentLoaded`-Aufruf benannt. CSS-Klassen `.flow-animate`/`.flow-static`/`.service-glyph` und `data-count` konsistent zwischen HTML/CSS/JS. ✓
```
