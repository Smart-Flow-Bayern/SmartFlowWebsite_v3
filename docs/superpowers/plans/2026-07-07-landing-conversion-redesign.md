# Landing-Page Conversion-Schärfung — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Landing Page conversion-stärker machen: 2 neue Sections (Problem/Nutzen, Für wen), komplette Copy-Überarbeitung, einheitliches CTA-System, ehrliche Trust-Elemente, Cal.com-Microcopy — auf DE- und EN-Seite.

**Architecture:** Statische Seite ohne Build-Framework. `index.html` (DE) und `en/index.html` (EN) teilen sich `css/styles.css` und `js/main.js`; die HTML-Dateien laden die Minifikate `css/styles.min.css` / `js/main.min.js`, die nach Änderungen per esbuild neu erzeugt werden. HTML-Strukturänderungen müssen in beiden Sprachdateien gespiegelt werden; CSS wirkt automatisch auf beide.

**Tech Stack:** Vanilla HTML/CSS/JS, esbuild (Minify via npx), Schema.org JSON-LD, Cal.com Click-to-Load-Embed.

**Spec:** `docs/superpowers/specs/2026-07-07-landing-conversion-redesign-design.md`

## Global Constraints

- Branch: `feat/landing-conversion`. NIEMALS pushen — nur lokal committen.
- Alle Buchungs-CTAs führen auf `#contact` und heißen exakt `Kostenloses Erstgespräch buchen` (mit `&rarr;` bei Buttons). Kurzform exakt `Erstgespräch buchen` NUR in: Desktop-Nav-CTA, Mobile-Menü-CTA, Sticky-CTA.
- Keine unbelegten Kennzahlen, keine Sterne/Bewertungs-Optik, keine erfundenen Referenzen.
- Nur bestehende Design-Tokens verwenden (`--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--text-*`, `--section-gap`, `--container-max`). Keine neuen Farbwerte, keine neuen Fonts.
- Kundengerichtete Texte: Deutsch in Sie-Form, keine Emojis, keine Floskeln („innovative Lösungen", „ganzheitlicher Ansatz" verboten). EN-Texte: professionelles Business-Englisch mit „you".
- Neue Sections bekommen `fade-in`-Klassen wie die bestehenden (IntersectionObserver in `js/main.js` greift automatisch auf `.fade-in`).
- `css/styles.min.css` und `js/main.min.js` werden erst in Task 8 EINMAL regeneriert (nicht pro Task).
- Zum lokalen Prüfen: `python3 -m http.server 4173` im Repo-Root, dann `http://localhost:4173/`. Hinweis: Die HTML-Seiten laden `styles.min.css` — zum visuellen Prüfen vor Task 8 einmalig `npx --yes esbuild css/styles.css --minify --outfile=css/styles.min.css` laufen lassen oder erst ab Task 8 visuell prüfen. Verifikation in Tasks 1–7 läuft über grep.

---

### Task 1: DE Hero überarbeiten + CTA-System vereinheitlichen

**Files:**
- Modify: `index.html` (Hero Zeilen ~258–282, Nav ~219, Mobile-Menü ~245, Sticky-CTA ~691–693)
- Modify: `css/styles.css` (Block `.hero-trust-stars`, Zeilen ~628–633)

**Interfaces:**
- Produces: CTA-Wortlaut `Kostenloses Erstgespräch buchen &rarr;` (Buttons) bzw. `Erstgespräch buchen` (Nav/Sticky), von Tasks 5 und 7 wiederverwendet.

- [ ] **Step 1: Hero-Copy ersetzen**

In `index.html` den Block `hero-eyebrow` bis einschließlich `hero-trust` (Zeilen 261–281) ersetzen durch:

```html
          <p class="hero-eyebrow">Digitalisierung &amp; Prozessoptimierung · Regensburg</p>
          <h1 class="hero-title">
            Weniger Verwaltungsaufwand.<br>
            Mehr Zeit fürs<br>
            <span class="accent">Kerngeschäft.</span>
          </h1>
          <p class="hero-subtitle">
            Wir digitalisieren und automatisieren die Abläufe von Handwerksbetrieben,
            Praxen, Hausverwaltungen und Mittelständlern in Bayern — von der ersten
            Kundenanfrage bis zur Rechnung. Und zwar pragmatisch: Wo Ihre bestehenden
            Systeme reichen, drängen wir Ihnen keine neue Software auf.
          </p>
          <div class="hero-actions">
            <a href="#contact" class="btn-cta">Kostenloses Erstgespräch buchen &rarr;</a>
            <a href="#process" class="btn-secondary">Wie wir arbeiten</a>
          </div>
          <p class="hero-trust">
            Sitz in Regensburg · Antwort innerhalb von 24 h · 30 Minuten, kostenlos &amp; unverbindlich
          </p>
```

(Der `sr-only`-Span „5 Sterne" und der `hero-trust-stars`-Span entfallen ersatzlos.)

- [ ] **Step 2: Nav-, Mobile- und Sticky-CTA umbenennen**

In `index.html` alle drei Stellen ändern:
- Zeile ~219: `<a href="#contact" class="nav-cta">Termin buchen</a>` → `<a href="#contact" class="nav-cta">Erstgespräch buchen</a>`
- Zeile ~245 (Mobile-Menü): identisch `Termin buchen` → `Erstgespräch buchen`
- Sticky-CTA (~691): `aria-label="Erstgespräch buchen"` bleibt, sichtbarer Text `Termin sichern` → `Erstgespräch buchen`

- [ ] **Step 3: Verwaistes CSS entfernen**

In `css/styles.css` den Block löschen:

```css
.hero-trust-stars {
  color: var(--color-accent);
  letter-spacing: 0.1em;
  margin-right: var(--space-xs);
}
```

- [ ] **Step 4: Verifizieren**

```bash
grep -c "hero-trust-stars" index.html css/styles.css; grep -cE "Termin sichern|Termin buchen" index.html; grep -c "Erstgespräch buchen" index.html
```
Erwartet: `index.html:0`, `css/styles.css:0`; „Termin sichern/buchen" nur noch in CTA-Banner-2-Aria/Kommentaren falls vorhanden — Ziel: `0` Treffer außer ggf. HTML-Kommentar (dann Kommentar mit anpassen); „Erstgespräch buchen" ≥ 4.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat(hero,cta): ehrliche Trust-Zeile statt Sterne, einheitlicher Erstgespräch-CTA (DE)"
```

---

### Task 2: Problem/Nutzen-Section `#pains` (DE) + Shared-Tile-CSS

**Files:**
- Modify: `index.html` (neue Section direkt nach `</section>` des Hero, vor `<!-- SECTION 2 — SERVICES -->`)
- Modify: `css/styles.css` (neue Blöcke nach den Services-Styles, vor `.process-section`)

**Interfaces:**
- Produces: CSS-Klassen `.pains-section`, `.tile-grid`, `.tile`, `.tile-wide`, `.tile-glyph`, `.tile-title`, `.tile-text`, `.benefits-block`, `.benefits-title`, `.benefits-list` — Task 3 (Für wen) und Task 6 (Gesprächsablauf-Liste) verwenden sie wieder.

- [ ] **Step 1: CSS für Tiles + Benefits ergänzen**

In `css/styles.css` nach dem Ende der Services-Styles (nach `.service-feature`-Blöcken, vor `.process-section`) einfügen:

```css
/* ---- Pains & Audiences: geteilte Karten ---- */
.pains-section,
.audiences-section {
  padding: var(--section-gap) var(--space-lg);
}

.pains-section {
  background: var(--color-bg-alt);
}

.pains-container,
.audiences-container {
  max-width: var(--container-max);
  margin: 0 auto;
}

.tile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  margin-top: var(--space-xl);
}

.tile {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.tile-wide {
  grid-column: 1 / -1;
}

.tile-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
  color: var(--color-accent);
  margin-bottom: var(--space-xs);
}

.tile-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
}

.tile-text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.benefits-block {
  margin-top: var(--space-xl);
}

.benefits-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.benefits-list li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-xs);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.benefits-list li::before {
  content: '✓';
  color: var(--color-accent);
  font-weight: 700;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .tile-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Section-HTML einfügen**

In `index.html` direkt nach dem schließenden `</section>` des Hero:

```html
    <!-- ================================================
         SECTION 1.5 — PROBLEM / NUTZEN
         ================================================ -->
    <section class="pains-section" id="pains">
      <div class="pains-container">
        <div class="fade-in">
          <p class="section-label">Der Alltag</p>
          <h2 class="section-title">Kommt Ihnen das bekannt vor?</h2>
        </div>

        <div class="tile-grid">
          <div class="tile fade-in">
            <span class="tile-glyph" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
            </span>
            <h3 class="tile-title">Anfragen bleiben liegen</h3>
            <p class="tile-text">Eine Anfrage kommt per E-Mail, eine per Telefon, eine über das Kontaktformular. Bis alle beantwortet sind, hat der schnellste Wettbewerber den Auftrag.</p>
          </div>

          <div class="tile fade-in">
            <span class="tile-glyph" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </span>
            <h3 class="tile-title">Alles wird doppelt getippt</h3>
            <p class="tile-text">Angebot in Word, Auftrag in Excel, Rechnung im Buchhaltungstool: dieselben Daten, dreimal eingegeben — und dreimal eine Fehlerquelle.</p>
          </div>

          <div class="tile fade-in">
            <span class="tile-glyph" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </span>
            <h3 class="tile-title">Termine kosten Telefonzeit</h3>
            <p class="tile-text">Jede Terminvereinbarung heißt hin- und herschreiben, telefonieren, verschieben, neu ansetzen. Zeit, die im Tagesgeschäft fehlt.</p>
          </div>

          <div class="tile fade-in">
            <span class="tile-glyph" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <h3 class="tile-title">Der Überblick fehlt</h3>
            <p class="tile-text">Welcher Vorgang steht wo? Wer wartet auf Antwort? Das weiß nur, wer sich durch Postfächer und Ordner sucht.</p>
          </div>
        </div>

        <div class="benefits-block fade-in">
          <h3 class="benefits-title">Was sich mit SmartFlow ändert</h3>
          <ul class="benefits-list" role="list">
            <li>Anfragen laufen an einer Stelle zusammen und werden automatisch erfasst und beantwortet.</li>
            <li>Termine buchen sich über Ihren Online-Kalender von selbst — inklusive Erinnerungen.</li>
            <li>Daten fließen ohne Abtippen von der Anfrage bis zur Rechnung.</li>
            <li>Sie sehen jederzeit, wo jeder Vorgang steht — ohne zu suchen.</li>
          </ul>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Verifizieren**

```bash
grep -c 'id="pains"' index.html && grep -c "tile-grid\|benefits-list" css/styles.css && grep -c "class=\"tile fade-in\"" index.html
```
Erwartet: 1 / ≥ 2 / 4.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat(pains): Problem/Nutzen-Section mit Karten und Nutzen-Liste (DE)"
```

---

### Task 3: Für-wen-Section `#audiences` (DE) + Nav-Link

**Files:**
- Modify: `index.html` (neue Section direkt nach dem CTA-Banner-1-`</aside>`, vor der About-Section; Nav + Mobile-Menü)

**Interfaces:**
- Consumes: `.audiences-section`, `.tile*`-Klassen aus Task 2.

- [ ] **Step 1: Section-HTML einfügen**

Direkt nach dem schließenden `</aside>` von CTA-Banner 1:

```html
    <!-- ================================================
         SECTION 2.7 — FÜR WEN
         ================================================ -->
    <section class="audiences-section" id="audiences">
      <div class="audiences-container">
        <div class="fade-in">
          <p class="section-label">Für wen</p>
          <h2 class="section-title">Für Betriebe, die ihre Zeit nicht in Verwaltung stecken wollen</h2>
        </div>

        <div class="tile-grid">
          <div class="tile fade-in">
            <span class="tile-glyph" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </span>
            <h3 class="tile-title">Handwerksbetriebe</h3>
            <p class="tile-text">Angebote entstehen nach Feierabend, Anfragen warten im Anrufbeantworter, Baustellenfotos liegen im privaten Chat. Wir bringen Anfragen, Aufträge und Dokumentation in einen durchgehenden Ablauf — vom ersten Kontakt bis zur Rechnung.</p>
          </div>

          <div class="tile fade-in">
            <span class="tile-glyph" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/></svg>
            </span>
            <h3 class="tile-title">Praxen &amp; lokale Dienstleister</h3>
            <p class="tile-text">Das Telefon klingelt mitten in der Behandlung, Termine werden dreimal verschoben. Online-Terminbuchung und automatische Erinnerungen entlasten die Anmeldung — und reduzieren Ausfälle.</p>
          </div>

          <div class="tile fade-in">
            <span class="tile-glyph" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/></svg>
            </span>
            <h3 class="tile-title">Hausverwaltungen</h3>
            <p class="tile-text">Schadensmeldungen kommen per Anruf, E-Mail und Brief — und jede muss von Hand erfasst werden. Wir digitalisieren Meldewege und Freigaben, damit jeder Vorgang nachvollziehbar durchläuft.</p>
          </div>

          <div class="tile fade-in">
            <span class="tile-glyph" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <h3 class="tile-title">Selbstständige &amp; Agenturen</h3>
            <p class="tile-text">Zwischen Kundenarbeit und Akquise bleibt die eigene Organisation liegen. Automatisierte Angebots-, Onboarding- und Rechnungsabläufe halten Ihnen den Rücken frei.</p>
          </div>

          <div class="tile tile-wide fade-in">
            <span class="tile-glyph" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </span>
            <h3 class="tile-title">Onlineshops</h3>
            <p class="tile-text">Bestellstatus-Anfragen, Retouren, Lagerabgleich: Vieles läuft noch per Hand. Wir verbinden Shop, Versand und Buchhaltung, damit Standardfälle sich selbst erledigen.</p>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Nav-Link ergänzen (Desktop + Mobile)**

In beiden Nav-Blöcken nach dem Link `Leistungen` einfügen:

```html
        <a href="#audiences" class="nav-link">Für wen</a>
```

- [ ] **Step 3: Verifizieren**

```bash
grep -c 'id="audiences"' index.html && grep -c 'href="#audiences"' index.html && grep -c "tile-wide" index.html
```
Erwartet: 1 / 2 / 1.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(audiences): Für-wen-Section mit fünf Zielgruppen-Karten + Nav-Link (DE)"
```

---

### Task 4: Leistungen- und Prozess-Copy schärfen + Services-JSON-LD sync (DE)

**Files:**
- Modify: `index.html` (3 `service-description`-Absätze; Services-JSON-LD `description`-Felder; Prozess-Schritte 01, 02, 04)

- [ ] **Step 1: Service-Beschreibungen ersetzen (HTML)**

Die drei `<p class="service-description">`-Texte ersetzen durch:

1. Prozessoptimierung: `Wir nehmen Ihre Abläufe auseinander und setzen sie so wieder zusammen, dass nichts mehr hakt: klare Zuständigkeiten, keine Doppelarbeit, messbare Durchlaufzeiten. Sie gewinnen Zeit zurück, ohne mehr Personal.`
2. Digitalisierung: `Papierablage, Excel-Listen und Insellösungen ersetzen wir durch Werkzeuge, die zusammenspielen — von der Software-Auswahl über die Datenübernahme bis zur Einarbeitung Ihres Teams. Sicher aufgesetzt und so gebaut, dass es in fünf Jahren noch trägt.`
3. Automatisierung: `Wiederkehrende Aufgaben — Anfragen beantworten, Termine koordinieren, Daten übertragen, Berichte erstellen — erledigt künftig das System. Ihr Team macht die Arbeit, für die Sie es eingestellt haben.`

- [ ] **Step 2: Dieselben Texte in das Services-JSON-LD übernehmen**

Im `<script type="application/ld+json">` mit `@graph` die drei `"description"`-Werte auf exakt denselben Wortlaut setzen (Gedankenstriche `—` als Zeichen sind im JSON erlaubt).

- [ ] **Step 3: Prozess-Schritte 01/02/04 ersetzen**

- 01 Analyse: `Los geht es mit dem kostenlosen Erstgespräch. Danach schauen wir uns Ihre Abläufe im Detail an — vor Ort oder remote — und finden die Stellen, an denen Zeit und Aufträge verloren gehen.`
- 02 Konzept: `Sie bekommen ein Konzept mit konkreten Maßnahmen, Zeitplan und dem, was es kostet. Klar priorisiert: zuerst, was am meisten bringt.`
- 03 Umsetzung: UNVERÄNDERT lassen.
- 04 Optimierung: `Nach der Einführung messen wir, was die Umstellung tatsächlich bringt, justieren nach und lassen Sie erst allein, wenn alles rundläuft.`

- [ ] **Step 4: Verifizieren**

```bash
python3 -c "
import json, re, pathlib
html = pathlib.Path('index.html').read_text()
blocks = re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.S)
[json.loads(b) for b in blocks]
print('JSON-LD ok:', len(blocks), 'Blöcke')
"
grep -c "ohne mehr Personal" index.html
```
Erwartet: `JSON-LD ok: 3 Blöcke` (kein Parse-Fehler) und `2` (HTML + JSON-LD).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "content(services,process): ergebnisorientierte Beschreibungen, Schema sync (DE)"
```

---

### Task 5: About hinter Prozess verschieben, Credential ergänzen, CTA-Banner-Texte (DE)

**Files:**
- Modify: `index.html` (About-Section-Block komplett ausschneiden und nach dem `</section>` der Prozess-Section wieder einfügen; Credentials-Liste; beide CTA-Banner)

- [ ] **Step 1: About-Section verschieben**

Den kompletten Block von `<!-- SECTION 2.5 — ABOUT` bis zu dessen schließendem `</section>` ausschneiden und direkt NACH dem schließenden `</section>` der Prozess-Section (`process-section`) und VOR dem CTA-Banner 2 (`cta-banner-alt`) einfügen. Kommentar-Nummer auf `SECTION 3.5 — ABOUT` ändern. Inhalt unverändert lassen, außer:

- [ ] **Step 2: Credential ergänzen**

In `about-credentials` als dritte Zeile:

```html
              <li>Ein fester Ansprechpartner — vom ersten Gespräch bis zum Go-Live</li>
```

- [ ] **Step 3: CTA-Banner 1 ersetzen**

```html
    <!-- CTA Banner #1: nach Für-wen -->
    <aside class="cta-banner fade-in" aria-label="Kostenloses Erstgespräch buchen">
      <div class="cta-banner-inner">
        <div class="cta-banner-text">
          <h2 class="cta-banner-title">In 30 Minuten wissen Sie, wo Ihr größter Zeitfresser sitzt.</h2>
          <p class="cta-banner-sub">Kostenloses Erstgespräch — persönlich, unverbindlich, aus Regensburg.</p>
        </div>
        <a href="#contact" class="btn-cta">Kostenloses Erstgespräch buchen &rarr;</a>
      </div>
    </aside>
```

Hinweis Reihenfolge: CTA-Banner 1 bleibt zwischen Services und `#audiences` (Spec-Reihenfolge: Leistungen → Banner → Für wen). Falls Task 3 die Section bereits nach dem Banner eingefügt hat, ist die Reihenfolge korrekt — nur Texte tauschen.

- [ ] **Step 4: CTA-Banner 2 ersetzen**

```html
    <!-- CTA Banner #2: Einwand-Brücke nach About -->
    <aside class="cta-banner cta-banner-alt fade-in" aria-label="Kostenloses Erstgespräch buchen">
      <div class="cta-banner-inner">
        <div class="cta-banner-text">
          <h2 class="cta-banner-title">„Dafür habe ich gerade keine Zeit."</h2>
          <p class="cta-banner-sub">Verständlich — genau deshalb dauert das Erstgespräch nur 30 Minuten. Die Umsetzung übernehmen wir, Ihr Tagesgeschäft läuft weiter.</p>
        </div>
        <a href="#contact" class="btn-cta">Kostenloses Erstgespräch buchen &rarr;</a>
      </div>
    </aside>
```

- [ ] **Step 5: Verifizieren**

```bash
python3 - <<'EOF'
import pathlib, re
h = pathlib.Path('index.html').read_text()
order = [m for m in re.findall(r'id="(pains|services|audiences|about|process|faq|contact)"|class="cta-banner', h)]
print(order)
EOF
grep -c "Zeitfresser sitzt" index.html
```
Erwartet: Reihenfolge pains → services → (banner) → audiences → process → about → (banner) → faq → contact; Treffer `1`.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(structure): About hinter Prozess, Einwand-Banner, neue Banner-Texte (DE)"
```

---

### Task 6: FAQ +2 Fragen und Buchungs-Microcopy (DE)

**Files:**
- Modify: `index.html` (FAQ-Liste + FAQPage-JSON-LD; Contact-Section)

**Interfaces:**
- Consumes: `.benefits-list` aus Task 2 (für die Gesprächsablauf-Liste).

- [ ] **Step 1: Zwei FAQ-Items anhängen (sichtbar)**

Vor dem schließenden `</div>` von `faq-list` (Chevron-SVG identisch zu den bestehenden Items):

```html
          <details class="faq-item fade-in">
            <summary class="faq-question">
              <span>Ich habe keine Zeit für so ein Projekt — lohnt sich das trotzdem?</span>
              <svg class="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            </summary>
            <div class="faq-answer">
              <p>Gerade dann. Wir planen die Einführung so, dass Ihr Tagesgeschäft weiterläuft: Vorbereitung und Umsetzung übernehmen wir, Sie treffen die Entscheidungen. Ihr Zeiteinsatz ist planbar und überschaubar — und die Zeitfresser, die Sie heute bremsen, sind danach weg.</p>
            </div>
          </details>

          <details class="faq-item fade-in">
            <summary class="faq-question">
              <span>Wir haben schon eine Website und einzelne Tools — brauchen wir das trotzdem?</span>
              <svg class="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            </summary>
            <div class="faq-answer">
              <p>Eine Website und einzelne Tools sind der Anfang. Entscheidend ist, ob sie zusammenspielen: Wenn Anfragen von der Website von Hand in Excel übertragen werden oder Termine weiter übers Telefon laufen, verschenken Sie den größten Teil des Nutzens. Genau diese Verbindungen bauen wir.</p>
            </div>
          </details>
```

- [ ] **Step 2: Dieselben Q/A ins FAQPage-JSON-LD anhängen** (als 6. und 7. `Question`, Wortlaut identisch zum sichtbaren Text).

- [ ] **Step 3: Contact-Microcopy ersetzen**

Label/Titel/Subtitle ersetzen durch:

```html
        <p class="contact-label fade-in">Kostenlos &amp; unverbindlich</p>
        <h2 class="contact-title fade-in">Kostenloses Erstgespräch buchen</h2>
        <p class="contact-subtitle fade-in">
          30 Minuten, telefonisch oder per Video. Sie schildern Ihre Abläufe, Sie bekommen
          eine ehrliche Einschätzung — und entscheiden danach in Ruhe.
        </p>

        <ul class="benefits-list contact-flow fade-in" role="list" aria-label="So läuft das Gespräch">
          <li>Sie wählen online einen Termin — ohne Anruf, ohne E-Mail-Pingpong.</li>
          <li>Wir klären gemeinsam, wo bei Ihnen Zeit verloren geht und was sich automatisieren lässt.</li>
          <li>Sie bekommen eine klare Empfehlung — auch wenn sie lautet: Das können Sie selbst lösen.</li>
        </ul>
```

Dazu in `css/styles.css` (direkt nach `.benefits-list li::before`):

```css
.contact-flow {
  max-width: 560px;
  margin: 0 auto var(--space-xl);
  text-align: left;
}
```

- [ ] **Step 4: Fallback-Zeile anpassen**

`contact-fallback`-Inhalt ersetzen durch:

```html
          <span>Lieber direkt?</span>
          <a href="mailto:info@smartflow.bayern">info@smartflow.bayern</a>
          <a href="tel:+491734487550">+49 173 4487550</a>
          <span>— Antwort innerhalb von 24 h.</span>
```

Cal-Placeholder (rechtlicher Text, Button `Buchungskalender laden &rarr;`) UNVERÄNDERT lassen.

- [ ] **Step 5: Verifizieren**

```bash
python3 -c "
import json, re, pathlib
html = pathlib.Path('index.html').read_text()
faq = [json.loads(b) for b in re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.S) if 'FAQPage' in b][0]
print('FAQ-Einträge:', len(faq['mainEntity']))
"
grep -c "faq-item" index.html
```
Erwartet: `FAQ-Einträge: 7` und `7`.

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css
git commit -m "content(faq,contact): Einwand-FAQs, Gesprächsablauf und Buchungs-Microcopy (DE)"
```

---

### Task 7: EN-Seite strukturell und textlich nachziehen

**Files:**
- Modify: `en/index.html` (alle Änderungen aus Tasks 1–6 gespiegelt)

**Interfaces:**
- Consumes: CSS-Klassen aus Task 2/6 (wirken automatisch); Struktur/IDs identisch zur DE-Seite (`#pains`, `#audiences`).

**Vorgehen:** `en/index.html` vollständig lesen, dann dieselben Struktur-Operationen wie Tasks 1–6 ausführen (Sections an identischer Stelle, identische Klassen/IDs/SVGs), mit folgender EN-Copy. JSON-LD-Blöcke der EN-Seite analog synchronisieren (Service-Descriptions, FAQ +2). Bestehende Sprachkonventionen der EN-Seite (z. B. amerikanische vs. britische Schreibung) übernehmen; Standard unten ist en-US-nah.

**Hero:** Eyebrow `Digitalization & process optimization · Regensburg`; H1 `Less admin work.` / `More time for your` / `core business.` (Accent auf `core business.`); Subtitle: `We digitalize and automate the workflows of trade businesses, medical practices, property managers and SMEs in Bavaria — from the first customer inquiry to the final invoice. And we keep it pragmatic: where your existing systems are good enough, we won't push new software on you.`; CTAs `Book a free consultation &rarr;` / `How we work`; Trust: `Based in Regensburg · Reply within 24 h · 30 minutes, free & non-binding`.

**Nav/Sticky (Kurzform):** Nav-Links `Services`, `Who it's for` (→ `#audiences`), `Contact`; Nav-/Mobile-/Sticky-CTA: `Book a consultation`.

**Pains:** Label `Everyday reality`; H2 `Sound familiar?`; Tiles:
1. `Inquiries slip through` — `One inquiry arrives by email, one by phone, one through the contact form. By the time they're all answered, the fastest competitor has won the job.`
2. `Everything is typed twice` — `Quote in Word, order in Excel, invoice in the accounting tool: the same data entered three times — and three chances for errors.`
3. `Scheduling eats phone time` — `Every appointment means writing back and forth, calling, rescheduling. Time your day-to-day business doesn't have.`
4. `No overview` — `Which job is at what stage? Who's waiting for a reply? Only whoever digs through inboxes and folders knows.`
Benefits-Titel `What changes with SmartFlow`: `Inquiries arrive in one place and are captured and answered automatically.` / `Appointments book themselves through your online calendar — reminders included.` / `Data flows from inquiry to invoice without retyping.` / `You can see the status of every job at any time — without searching.`

**Services:** 1. `We take your workflows apart and put them back together so nothing gets stuck: clear responsibilities, no duplicate work, measurable throughput times. You win back time without hiring.` 2. `We replace paper filing, Excel lists and isolated tools with systems that work together — from software selection and data migration to training your team. Set up securely and built to still hold up in five years.` 3. `Recurring tasks — answering inquiries, coordinating appointments, transferring data, creating reports — are handled by the system from now on. Your team does the work you hired them for.`

**Banner 1:** `In 30 minutes you'll know where your biggest time sink is.` / `Free consultation — personal, non-binding, from Regensburg.` / `Book a free consultation &rarr;`

**Audiences:** Label `Who it's for`; H2 `For businesses that don't want to spend their time on admin`; Tiles:
1. `Trade businesses` — `Quotes get written after hours, inquiries wait on the answering machine, site photos live in a private chat. We turn inquiries, orders and documentation into one continuous workflow — from first contact to invoice.`
2. `Practices & local services` — `The phone rings mid-treatment, appointments get moved three times. Online booking and automatic reminders take the pressure off your front desk — and reduce no-shows.`
3. `Property managers` — `Damage reports arrive by phone, email and letter — and every single one is logged by hand. We digitalize reporting and approval workflows so every case moves through traceably.`
4. `Freelancers & agencies` — `Between client work and sales, your own organization falls behind. Automated quoting, onboarding and invoicing workflows keep your back free.`
5. `Online shops` (tile-wide) — `Order-status questions, returns, stock reconciliation: much of it is still manual. We connect shop, shipping and accounting so standard cases handle themselves.`

**Process:** 01 `It starts with the free consultation. Then we look at your workflows in detail — on site or remote — and find where time and orders are being lost.` 02 `You receive a concept with concrete measures, a timeline and the costs. Clearly prioritized: what delivers the most comes first.` 03 unverändert. 04 `After the rollout we measure what the change actually delivers, fine-tune, and only step back once everything runs smoothly.`

**About:** Credential ergänzen: `One dedicated contact — from the first conversation to go-live` (Section analog hinter Process verschieben).

**Banner 2:** `"I don't have time for this right now."` / `Understandable — that's exactly why the consultation takes just 30 minutes. We handle the implementation while your day-to-day business keeps running.` / `Book a free consultation &rarr;`

**FAQ +2:** 6. `I don't have time for a project like this — is it still worth it?` — `Especially then. We plan the rollout so your day-to-day business keeps running: we handle preparation and implementation, you make the decisions. Your time investment is predictable and manageable — and the time sinks slowing you down today are gone afterwards.` 7. `We already have a website and a few tools — do we still need this?` — `A website and individual tools are the start. What matters is whether they work together: if website inquiries are copied into Excel by hand or appointments are still arranged over the phone, you're giving away most of the benefit. Those connections are exactly what we build.` (JSON-LD sync.)

**Contact:** Label `Free & non-binding`; H2 `Book a free consultation`; Subtitle `30 minutes, by phone or video. You describe your workflows, you get an honest assessment — and then decide at your own pace.`; Flow-Liste (`benefits-list contact-flow`): `You pick a time online — no calls, no email ping-pong.` / `Together we identify where you're losing time and what can be automated.` / `You get a clear recommendation — even if it is: you can solve this yourself.`; Fallback: `Prefer direct contact?` + Mail/Tel + `— reply within 24 h.`

- [ ] **Step 1:** `en/index.html` lesen und alle obigen Änderungen strukturidentisch zur DE-Seite umsetzen (gleiche Einfügepunkte, gleiche Klassen/IDs/SVGs, About verschoben, Sterne raus, CTAs vereinheitlicht).
- [ ] **Step 2: Verifizieren**

```bash
python3 -c "
import json, re, pathlib
html = pathlib.Path('en/index.html').read_text()
blocks = re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.S)
[json.loads(b) for b in blocks]
faq = [json.loads(b) for b in blocks if 'FAQPage' in b][0]
print('JSON ok, FAQ:', len(faq['mainEntity']))
"
grep -cE 'id="pains"|id="audiences"' en/index.html; grep -c "hero-trust-stars" en/index.html; grep -c "Book a free consultation" en/index.html
```
Erwartet: `JSON ok, FAQ: 7`; `2`; `0`; ≥ 4.

- [ ] **Step 3: Commit**

```bash
git add en/index.html
git commit -m "feat(en): mirror conversion redesign — pains, audiences, copy, CTAs, FAQ"
```

---

### Task 8: Minify regenerieren + Gesamtverifikation + Screenshots

**Files:**
- Modify: `css/styles.min.css`, `js/main.min.js` (regeneriert)

- [ ] **Step 1: Minifikate erzeugen**

```bash
npx --yes esbuild css/styles.css --minify --outfile=css/styles.min.css
npx --yes esbuild js/main.js --minify --outfile=js/main.min.js
```

- [ ] **Step 2: Lokalen Server starten**

```bash
python3 -m http.server 4173 &
```

- [ ] **Step 3: Beide Seiten mit Playwright prüfen** (Konsole muss fehlerfrei sein; Theme-Toggle, Mobile-Menü, FAQ-Accordion und Cal-Placeholder-Button stichprobenartig klicken). Screenshots erzeugen:
  - DE Desktop 1440×900 (Light + Dark), volle Seite
  - DE Mobil 390×844 (Light), volle Seite
  - EN Desktop 1440×900 (Light), volle Seite

- [ ] **Step 4: Checks gegen Erfolgskriterien der Spec**

```bash
grep -c "★" index.html en/index.html                 # erwartet je 0
grep -c "30 %" index.html                              # erwartet 0 (unbelegte Kennzahl weg)
grep -o 'href="#contact" class="btn-cta">[^<]*' index.html | sort -u   # nur EIN Wortlaut
```

- [ ] **Step 5: Commit**

```bash
git add css/styles.min.css js/main.min.js
git commit -m "build: minifizierte Assets regeneriert"
```

- [ ] **Step 6:** Server stoppen, Screenshots dem User zeigen. NICHT pushen — Freigabe abwarten.
