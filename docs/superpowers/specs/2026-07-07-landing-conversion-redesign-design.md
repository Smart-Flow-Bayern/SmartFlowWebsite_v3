# Landing-Page Conversion-Schärfung — Design-Spec

**Datum:** 2026-07-07
**Basis:** `feat/frontend-veredelung` (Stand `9778d19`), umgesetzt auf Branch `feat/landing-conversion`
**Ansatz:** A — Conversion-Schärfung auf bestehendem Design-System (Ansatz vom User freigegeben)

## Ziel

Mehr qualifizierte Anfragen und Cal.com-Terminbuchungen über die bestehende Landing Page. Das visuelle System (Flow-Line-Hero, Glyph-Karten, Design-Tokens, CTA-Banner) bleibt erhalten; verändert werden Struktur (2 neue Sections), sämtliche Copy, das CTA-System und die Microcopy rund um die Buchung.

**Zielgruppe (geklärt):** KMU im Raum Regensburg/Bayern — Handwerksbetriebe, Praxen und lokale Dienstleister, Hausverwaltungen, Selbstständige/Agenturen, Onlineshops. KEIN Dachdecker-Nischenfokus (Missverständnis „DACH-Raum" vs. „Dachbereich" wurde geklärt).

**Trust-Lage (geklärt):** Es existieren noch keine Kundenstimmen, Google-Bewertungen oder freigegebene Referenzen. Die Seite baut Vertrauen daher über Prozess-Transparenz, ehrliche Sprache, persönliche Erreichbarkeit und ein risikofreies Einstiegsangebot auf. Testimonial-Slots werden NICHT eingebaut (nichts erfinden); sobald echte Stimmen existieren, ist Platz dafür nach der „Für wen"-Section vorgesehen (Follow-up, nicht Teil dieser Umsetzung).

## Erfolgskriterien (prüfbar)

1. Alle CTAs zur Buchung führen auf `#contact` und heißen einheitlich „Kostenloses Erstgespräch buchen" (Kurzform „Erstgespräch buchen" nur in Nav, Mobile-Menü und Sticky-CTA).
2. Keine unbelegten Kennzahlen und keine ★★★★★-Zeile mehr auf der Seite.
3. Neue Sections „Problem/Nutzen" und „Für wen" existieren auf DE- und EN-Seite und nutzen bestehende Komponenten/Tokens (keine neuen Farbwerte, keine neue Font).
4. FAQ um 2 Einwand-Fragen ergänzt; FAQPage-JSON-LD ist synchron zum sichtbaren FAQ.
5. Seite validiert: keine Konsolenfehler, bestehende Funktionalität (Theme-Toggle, Mobile-Menü, Cal-Click-to-Load, Sticky-CTA) unverändert funktionsfähig.
6. Visuelle Prüfung per Screenshot: Desktop (1440px) und Mobil (390px), Light + Dark, DE + EN.

## Seitenstruktur (freigegeben)

| # | Section | Status |
|---|---|---|
| 1 | Hero | überarbeitet |
| 2 | Problem/Nutzen „Kommt Ihnen das bekannt vor?" | **NEU** |
| 3 | Leistungen | Copy geschärft |
| 4 | CTA-Banner 1 | Text neu |
| 5 | Für wen | **NEU** |
| 6 | Prozess | Copy geschärft |
| 7 | About (Leon) | verschoben hinter Prozess, leicht geschärft |
| 8 | CTA-Banner 2 (Einwand-Brücke) | Text neu |
| 9 | FAQ | +2 Fragen |
| 10 | Buchung (Cal.com) | Microcopy neu |

Reihenfolge-Änderung gegenüber heute: About rückt von Position 4 (nach CTA-Banner 1) hinter den Prozess. CTA-Banner 1 rückt hinter die Leistungen (wie bisher), „Für wen" kommt dazwischen — Journey: Aufmerksamkeit → Problem → Lösung → Identifikation → Vertrauen (wie/wer) → Einwände → Handlung.

---

## Section 1 — Hero

**Copy:**

- Eyebrow: `Digitalisierung & Prozessoptimierung · Regensburg`
- H1 (3 Zeilen, Accent auf Zeile 3):
  `Weniger Verwaltungsaufwand.` / `Mehr Zeit fürs` / `Kerngeschäft.` (Accent-Span um „Kerngeschäft.")
- Subheadline:
  „Wir digitalisieren und automatisieren die Abläufe von Handwerksbetrieben, Praxen, Hausverwaltungen und Mittelständlern in Bayern — von der ersten Kundenanfrage bis zur Rechnung. Und zwar pragmatisch: Wo Ihre bestehenden Systeme reichen, drängen wir Ihnen keine neue Software auf."
- Primärer CTA: `Kostenloses Erstgespräch buchen →` → `#contact`
- Sekundärer CTA: `Wie wir arbeiten` → `#process`
- Trust-Zeile (ersetzt die ★★★★★-Zeile ersatzlos):
  `Sitz in Regensburg · Antwort innerhalb von 24 h · 30 Minuten, kostenlos & unverbindlich`

**Design:** Layout, Flow-Line-Visual und Animationen unverändert. `hero-trust-stars`-Markup und zugehöriges CSS entfernen (verwaist durch diese Änderung).

## Section 2 — Problem/Nutzen (NEU)

**Zweck:** Besucher erkennt sein Alltagsproblem wieder, bevor Leistungen erklärt werden.

**Copy:**

- Label: `Der Alltag`
- H2: `Kommt Ihnen das bekannt vor?`
- 4 Problem-Karten (Titel + 1–2 Sätze):
  1. **Anfragen bleiben liegen** — „Eine Anfrage kommt per E-Mail, eine per Telefon, eine über das Kontaktformular. Bis alle beantwortet sind, hat der schnellste Wettbewerber den Auftrag."
  2. **Alles wird doppelt getippt** — „Angebot in Word, Auftrag in Excel, Rechnung im Buchhaltungstool: dieselben Daten, dreimal eingegeben — und dreimal eine Fehlerquelle."
  3. **Termine kosten Telefonzeit** — „Jede Terminvereinbarung heißt hin- und herschreiben, telefonieren, verschieben, neu ansetzen. Zeit, die im Tagesgeschäft fehlt."
  4. **Der Überblick fehlt** — „Welcher Vorgang steht wo? Wer wartet auf Antwort? Das weiß nur, wer sich durch Postfächer und Ordner sucht."
- Überleitung (Nutzen-Block unter den Karten), Titel: `Was sich mit SmartFlow ändert` + 4 Punkte:
  - „Anfragen laufen an einer Stelle zusammen und werden automatisch erfasst und beantwortet."
  - „Termine buchen sich über Ihren Online-Kalender von selbst — inklusive Erinnerungen."
  - „Daten fließen ohne Abtippen von der Anfrage bis zur Rechnung."
  - „Sie sehen jederzeit, wo jeder Vorgang steht — ohne zu suchen."

**Design:** 2×2-Kartengrid (Desktop), 1 Spalte mobil; gedämpfte Kartenfläche (bestehende Surface-Token), Glyph-Icons im Stil der Service-Glyphs (Stroke 1.75, 24er-Viewbox). Nutzen-Block als schlichte Liste mit Häkchen-Glyphs, Accent-Farbe. Keine neuen Farbwerte.

## Section 3 — Leistungen (Copy geschärft)

Struktur, Glyphs und Feature-Listen bleiben. Neue Beschreibungen (ergebnisorientiert):

1. **Prozessoptimierung:** „Wir nehmen Ihre Abläufe auseinander und setzen sie so wieder zusammen, dass nichts mehr hakt: klare Zuständigkeiten, keine Doppelarbeit, messbare Durchlaufzeiten. Sie gewinnen Zeit zurück, ohne mehr Personal."
2. **Digitalisierung:** „Papierablage, Excel-Listen und Insellösungen ersetzen wir durch Werkzeuge, die zusammenspielen — von der Software-Auswahl über die Datenübernahme bis zur Einarbeitung Ihres Teams. Sicher aufgesetzt und so gebaut, dass es in fünf Jahren noch trägt."
3. **Automatisierung:** „Wiederkehrende Aufgaben — Anfragen beantworten, Termine koordinieren, Daten übertragen, Berichte erstellen — erledigt künftig das System. Ihr Team macht die Arbeit, für die Sie es eingestellt haben."

Die zugehörigen Service-Beschreibungen im Schema.org-`Service`-JSON-LD werden auf denselben Wortlaut aktualisiert.

## Section 4 — CTA-Banner 1

- Titel: `In 30 Minuten wissen Sie, wo Ihr größter Zeitfresser sitzt.`
- Sub: `Kostenloses Erstgespräch — persönlich, unverbindlich, aus Regensburg.`
- Button: `Kostenloses Erstgespräch buchen →`

## Section 5 — Für wen (NEU)

- Label: `Für wen`
- H2: `Für Betriebe, die ihre Zeit nicht in Verwaltung stecken wollen`
- 5 Karten (Zielgruppe + Alltagsbeispiel + was sich ändert):
  1. **Handwerksbetriebe** — „Angebote entstehen nach Feierabend, Anfragen warten im Anrufbeantworter, Baustellenfotos liegen im privaten Chat. Wir bringen Anfragen, Aufträge und Dokumentation in einen durchgehenden Ablauf — vom ersten Kontakt bis zur Rechnung."
  2. **Praxen & lokale Dienstleister** — „Das Telefon klingelt mitten in der Behandlung, Termine werden dreimal verschoben. Online-Terminbuchung und automatische Erinnerungen entlasten die Anmeldung — und reduzieren Ausfälle."
  3. **Hausverwaltungen** — „Schadensmeldungen kommen per Anruf, E-Mail und Brief — und jede muss von Hand erfasst werden. Wir digitalisieren Meldewege und Freigaben, damit jeder Vorgang nachvollziehbar durchläuft."
  4. **Selbstständige & Agenturen** — „Zwischen Kundenarbeit und Akquise bleibt die eigene Organisation liegen. Automatisierte Angebots-, Onboarding- und Rechnungsabläufe halten Ihnen den Rücken frei."
  5. **Onlineshops** — „Bestellstatus-Anfragen, Retouren, Lagerabgleich: Vieles läuft noch per Hand. Wir verbinden Shop, Versand und Buchhaltung, damit Standardfälle sich selbst erledigen."

**Design:** Kartengrid — Desktop 2 Spalten (letzte Karte volle Breite oder zentriert), mobil 1 Spalte. Gleiches Kartenmuster wie Problem-Karten, je ein Glyph-Icon pro Zielgruppe (Werkzeug/Stethoskop-abstrakt/Gebäude/Person/Warenkorb — im bestehenden Stroke-Stil). Kein Hover-Gimmick.

## Section 6 — Prozess (Copy geschärft)

4 Schritte bleiben. Schritt 01 koppelt explizit ans Erstgespräch:

1. **Analyse** — „Los geht es mit dem kostenlosen Erstgespräch. Danach schauen wir uns Ihre Abläufe im Detail an — vor Ort oder remote — und finden die Stellen, an denen Zeit und Aufträge verloren gehen."
2. **Konzept** — „Sie bekommen ein Konzept mit konkreten Maßnahmen, Zeitplan und dem, was es kostet. Klar priorisiert: zuerst, was am meisten bringt."
3. **Umsetzung** — unverändert (Bestandstext bleibt).
4. **Optimierung** — „Nach der Einführung messen wir, was die Umstellung tatsächlich bringt, justieren nach und lassen Sie erst allein, wenn alles rundläuft."

## Section 7 — About (verschoben, leicht geschärft)

Rückt hinter den Prozess. Text bleibt bis auf Credentials-Ergänzung unverändert (TODO echter Werdegang + Foto bleibt bestehen):

- Credentials-Liste ergänzt um: `Ein fester Ansprechpartner — vom ersten Gespräch bis zum Go-Live`
- CTA bleibt `Kennenlernen →` → `#contact`

## Section 8 — CTA-Banner 2 (Einwand-Brücke)

- Titel: `„Dafür habe ich gerade keine Zeit."`
- Sub: `Verständlich — genau deshalb dauert das Erstgespräch nur 30 Minuten. Die Umsetzung übernehmen wir, Ihr Tagesgeschäft läuft weiter.`
- Button: `Kostenloses Erstgespräch buchen →`

## Section 9 — FAQ (+2 Fragen)

Bestehende 5 Fragen bleiben. Neu (sichtbar UND im FAQPage-JSON-LD):

6. **„Ich habe keine Zeit für so ein Projekt — lohnt sich das trotzdem?"**
   „Gerade dann. Wir planen die Einführung so, dass Ihr Tagesgeschäft weiterläuft: Vorbereitung und Umsetzung übernehmen wir, Sie treffen die Entscheidungen. Ihr Zeiteinsatz ist planbar und überschaubar — und die Zeitfresser, die Sie heute bremsen, sind danach weg."
7. **„Wir haben schon eine Website und einzelne Tools — brauchen wir das trotzdem?"**
   „Eine Website und einzelne Tools sind der Anfang. Entscheidend ist, ob sie zusammenspielen: Wenn Anfragen von der Website von Hand in Excel übertragen werden oder Termine weiter übers Telefon laufen, verschenken Sie den größten Teil des Nutzens. Genau diese Verbindungen bauen wir."

## Section 10 — Buchung (Cal.com) — Microcopy

- Label: `Kostenlos & unverbindlich`
- H2: `Kostenloses Erstgespräch buchen`
- Subtitle: „30 Minuten, telefonisch oder per Video. Sie schildern Ihre Abläufe, Sie bekommen eine ehrliche Einschätzung — und entscheiden danach in Ruhe."
- NEU: Erwartungs-Setting über dem Embed, 3 kompakte Punkte (`So läuft das Gespräch`):
  1. „Sie wählen online einen Termin — ohne Anruf, ohne E-Mail-Pingpong."
  2. „Wir klären gemeinsam, wo bei Ihnen Zeit verloren geht und was sich automatisieren lässt."
  3. „Sie bekommen eine klare Empfehlung — auch wenn sie lautet: Das können Sie selbst lösen."
- Click-to-Load-Placeholder: rechtlicher Text und Ablauf bleiben (DSGVO), Button bleibt `Buchungskalender laden →`.
- Fallback-Zeile unter dem Embed bleibt; Wortlaut: `Lieber direkt? info@smartflow.bayern · +49 173 4487550 — Antwort innerhalb von 24 h.`
- Fehlerfall (Embed lädt nicht — neue kleine JS-Prüfung ist NICHT nötig; stattdessen bleibt der Placeholder-Alt-Kontakt immer sichtbar unterhalb des Wrappers): keine zusätzliche Logik einbauen.
- Cal.com-Konfiguration (außerhalb des Repos, als Hinweis für Leon dokumentiert): Bestätigungstext im Event „smartflow-erstgespraech" auf: „Vielen Dank — Ihr Termin ist eingetragen. Sie erhalten alle Details per E-Mail. Vorbereitung ist keine nötig: Bringen Sie nur Ihre größten Zeitfresser mit."

## Navigation & Sticky-CTA

- Nav-Links: `Leistungen`, `Für wen` (NEU → `#audiences`), `Kontakt`; Nav-CTA: `Erstgespräch buchen` (unverändert kurz).
- Sticky-CTA mobil: Text `Erstgespräch buchen` (statt „Termin sichern"), Verhalten unverändert.
- Section-IDs: Problem/Nutzen = `#pains`, Für wen = `#audiences`.

## Mobile

- Kartengrids kollabieren auf 1 Spalte; Problem-Karten mobil max. 2 Sätze (Copy ist entsprechend kurz gehalten).
- Tap-Targets ≥ 44 px (bestehende Buttons erfüllen das; neue Karten sind nicht klickbar).
- Sticky-CTA bleibt einzige fixe Fläche; kein zusätzliches mobiles Element.
- Hero-Trust-Zeile darf mobil umbrechen (Separator-Punkte als `·` mit `wrap`-freundlichen Abständen).

## EN-Seite

`en/index.html` wird strukturell 1:1 nachgezogen (gleiche Sections, gleiche IDs), Texte sinngemäß übersetzt (professionelles Business-Englisch, „you"). JSON-LD der EN-Seite entsprechend synchron.

## Nicht im Scope

- Kein Testimonial-/Logo-/Case-Bereich (keine echten Assets vorhanden — nichts erfinden).
- Keine neuen Farb-Tokens, Fonts oder Animationssysteme; kein Redesign des Hero-Visuals.
- Keine Änderungen an Impressum/Datenschutz/AGB, robots, sitemap (außer ggf. lastmod), CNAME.
- Kein Deployment/Push ohne ausdrückliche Freigabe.

## Risiken / Annahmen (gekennzeichnet)

- **Annahme:** „Antwort innerhalb von 24 h" ist ein Versprechen, das Leon halten kann (stand schon vorher auf der Seite). Falls nicht: Zeile anpassen.
- **Annahme:** Die Zielgruppen-Auswahl (Handwerk, Praxen, Hausverwaltungen, Selbstständige/Agenturen, Onlineshops) deckt sich mit Leons realer Akquise; Hausverwaltungen/Praxen stammen aus der bestehenden Seite („Erfahrung in Hausverwaltung, Gesundheitswesen und Handwerk").
- CSS-Aufwand für 2 neue Kartengrids ist bewusst klein gehalten (bestehende Token/Muster wiederverwenden); `styles.min.css` muss nach Änderungen neu erzeugt werden (gleicher Minify-Weg wie bisher, siehe js/main.min.js-Pendant).
