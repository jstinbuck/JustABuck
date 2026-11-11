# Just A Buck Website

Statische Website ohne Build-Schritt. Zum lokalen Testen genügt ein beliebiger Webserver, zum Beispiel:

```powershell
python -m http.server 8000
```

Danach ist die Startseite unter `http://localhost:8000/index.html` erreichbar.

## Projektstruktur

```text
assets/
  fonts/       Lokale Webfonts
  images/      Bilder und Social-Media-Icons
  vendor/      Lokal eingebundene Bibliotheken (three.js r128 für zahlung.html)
  video/       Video-Dateien
css/
  site.css     Gemeinsame Styles aller Hauptseiten
  catering.css Styles der Catering-Unterseite
scripts/       JavaScript für die Seiten
*.html         Seiten der Website
```

## Keine externen Ressourcen

- Die Seiten laden nichts von fremden Servern: Schriften liegen in `assets/fonts/`, three.js für
  den Partikeleffekt auf `zahlung.html` in `assets/vendor/three.min.js` (r128, MIT-Lizenz,
  Prüfsumme beim Herunterladen mit der von cdnjs veröffentlichten abgeglichen). Keine Google
  Fonts, CDNs oder eingebetteten Skripte Dritter ergänzen; sonst muss die Datenschutzerklärung
  den Anbieter nennen.
- Ohne WebGL entfällt auf `zahlung.html` nur der Partikeleffekt, die Seite bleibt vollständig.
- Die Merch-Drop-Seite mit dem Spiel und die alte Bild-Speisekarte (mit Preisen) wurden im
  November 2026 entfernt; sie waren nicht verlinkt, aber öffentlich erreichbar. Sie liegen noch
  in der Git-Historie (Commit `7d90a45` und früher).
- Die rote Leiste oben (`.site-announcement`) trägt auf allen Seiten denselben Text und ist
  mindestens 12 px groß (unter 340 px Breite 11,5 px, damit sie einzeilig bleibt).

## Konventionen

- Neue Medien gehören in `assets/` und verwenden Kleinbuchstaben sowie Bindestriche im Dateinamen.
- Gemeinsame Styles kommen in `css/site.css`; seitenbezogene Styles erhalten eine eigene CSS-Datei.
- Alle internen Pfade werden relativ zum Projektstamm angegeben, zum Beispiel `assets/images/logo.png`.
- Vor dem Veröffentlichen sollten die Social-Media- und Kontaktlinks auf die finalen Zielseiten zeigen.
- Justin wird nur an zentralen Stellen namentlich genannt: Über-uns-Bereich der Startseite,
  „Dein Ansprechpartner“ am Catering-Formular und das Krypto-Zitat auf `zahlung.html`.
  Sonst sprechen die Texte als „wir“.

## Auffindbarkeit (SEO)

- Zieladresse ist `https://justabuck.de/`. Canonical-Angaben, `og:url`, das Vorschaubild, die
  strukturierten Daten, `robots.txt` und `sitemap.xml` nennen alle diese Adresse. Sie wirken erst,
  wenn die Domain direkt mit GitHub Pages verbunden ist (Stand November 2026: nur eine
  http-Weiterleitung beim Domain-Anbieter, https antwortet nicht). Dafür beim Anbieter die
  Weiterleitung entfernen, vier A-Einträge auf 185.199.108.153 bis 185.199.111.153 und einen
  CNAME-Eintrag `www` auf `jstinbuck.github.io` setzen, dann in GitHub unter Settings, Pages die
  Domain eintragen und „Enforce HTTPS“ aktivieren. Keine `CNAME`-Datei von Hand anlegen, solange
  die DNS-Einträge nicht stehen; sonst ist die Seite nicht mehr erreichbar.
- Jede Seite hat genau einen Titel, eine Beschreibung und eine Canonical-Angabe. Die Startseite
  zielt auf „Burger-Catering Kempten/Allgäu“, `catering.html` auf Geburtstag und Privatfeier,
  `firmen.html` auf Firmen-Catering, `hochzeit.html` auf den Mitternachtsburger. Titel nicht
  doppelt vergeben. Die Beschreibungen von Startseite, `catering.html` und `hochzeit.html` nennen
  Preise und gehören zur Liste unter „Richtpreise“.
- `impressum.html` und `datenschutz.html` tragen `noindex, follow` und stehen nicht in der Sitemap.
- Vorschaubild beim Teilen ist für alle Seiten `assets/images/og-image.jpg` (1200 × 630, rund
  80 KB): lila Karte mit „Burger-Catering“ und dem Cheeseburger Royal. Es ist ein Bildschirmfoto
  einer kleinen HTML-Seite; ändern sich Claim oder Hauptprodukt, neu erzeugen.
- Die strukturierten Daten in `index.html` (`FoodEstablishment`) nennen Einsatzgebiet, Gründer,
  E-Mail und die drei Catering-Angebote mit ihren Seiten, bewusst ohne Preise und ohne Telefon,
  solange die Nummer ein Platzhalter ist. Das persönliche Instagram-Profil steht nicht in `sameAs`.
- `sitemap.xml` listet sieben Seiten. Neue Seiten dort ergänzen und `lastmod` bei größeren
  Änderungen anpassen.
- Bilder für die Ladezeit (November 2026): `catering.jpg` war eine PNG-Datei mit JPG-Endung
  (1,7 MB) und ist jetzt ein echtes JPEG (rund 270 KB). Der Cheeseburger Royal liegt als
  transparentes WebP vor (`cheeseburger-royal.webp`, rund 65 KB statt 1,2 MB), Logo und
  Aufbau-Foto sind verkleinert. Offen bleibt das Hero-Video mit 3,5 MB.
- Außerhalb der Website noch zu tun: Google Search Console einrichten und die Sitemap einreichen,
  ein Google-Unternehmensprofil mit Einsatzgebiet statt Ladenadresse anlegen.

## Navigation

- Startseite, Catering-, Firmen-, Hochzeits-, Produkt- und Zahlungsseite haben dieselbe Kopfzeile:
  Logo (führt zur Startseite), „Catering“ mit Untermenü, „Produkte“, „Pop-ups“, „Über uns“ und
  rechts der Button „Event anfragen“. Einen Menüpunkt „Startseite“ gibt es nicht.
- Das Untermenü „Catering“ zeigt Privatfeier (`catering.html`), Firmenfeier (`firmen.html`) und
  Hochzeit (`hochzeit.html`) mit je einer kurzen Zeile sowie „Alle Formate & Preise“
  (`catering.html#catering-angebote`). Am Desktop öffnet es beim Überfahren und per Klick oder
  Tastatur (Escape schließt), mobil steht es offen als Gruppe im Menü.
- „Pop-ups“ und „Über uns“ springen zu `index.html#locations` und `index.html#about`; auf der
  Startseite selbst stehen nur die Anker, damit die aktive Markierung beim Scrollen funktioniert.
- Die aktuelle Seite trägt `aria-current="page"`; gehört sie zum Catering, ist auch „Catering“ markiert.
- Der Button „Event anfragen“ führt zu `catering.html#event-anfragen`; auf der Firmenseite mit
  `?anlass=firmenfeier`, auf der Hochzeitsseite mit `?format=mitternachtsburger&anlass=hochzeit`.
- Mobil (bis 900 px) klappt das Menü unter der Kopfzeile auf einer lila Fläche auf; der Menüknopf
  wird dabei zum Schließen-Symbol. Die Logik steht in `scripts/nav.js`, die Styles im Abschnitt
  „Header / Navbar“ von `css/site.css`. Neue Seiten mit Kopfzeile binden `scripts/nav.js` ein.
- Die Produktseite nutzt die gemeinsame Kopfzeile; `--catalog-header-height` in `css/menu.css`
  entspricht ihrer Höhe (108 px, mobil 80 px), damit die mitlaufende Kategorienleiste anschließt.

## Impressum und Musterhinweis

- `impressum.html` kennzeichnet die Website oben als Musterseite: Angebote, Preise, Produkte, Termine
  sowie Angaben zu Leistungen, Versicherung und Anmeldungen sind Beispiele, Abbildungen können
  Symbolbilder sein, und die Telefon-/WhatsApp-Nummer ist ein Platzhalter.
- Anbieter ist Justin Buck, Kempten (Allgäu). Erfundene Angaben (Musteradresse, Mustername,
  Umsatzsteuer-ID, Handelsregister) werden nicht verwendet. Der Verantwortliche in `datenschutz.html`
  nennt dieselben Angaben.
- Vor dem Start: vollständige Anschrift in Impressum und Datenschutz ergänzen, Umsatzsteuer-ID und
  Registereintrag nur aufnehmen, wenn sie vorliegen, und den Hinweis `.legal-notice` entfernen.

## Über uns auf der Startseite

- `index.html#about` zeigt links ein Porträt mit Namensschild und rechts die Überschrift
  „Frisch gegründet. Ernst gemeint.“, einen kurzen Text in Ich-Form, drei Zusagen
  (ein Ansprechpartner, Antwort in 24 Stunden, sauber abgesichert) sowie Anfrage- und WhatsApp-Button.
  Die Namensgeschichte (JAB = Just A Buck = Justin Alexander Buck) steht als kleiner Geldschein
  über der unteren Ecke des Porträts. Unter 960 px stehen Überschrift, Porträt und Text untereinander.
- Das Porträt ist vorläufig eine lila Fläche mit „JAB“ (`.about-portrait-placeholder`). Für das
  echte Foto `assets/images/justin-buck.jpg` ablegen (Hochformat 4:5, Gesicht im oberen Drittel)
  und den Platzhalter durch das `<img>` aus dem Kommentar im Markup ersetzen. Mobil wird das Foto
  auf 4:3 zugeschnitten.
- Keine Kennzahlen, Kundenstimmen oder Logos ergänzen, solange es sie nicht wirklich gibt.

## Cateringformate und Anfrageformular

- Der Button „Event anfragen“ in der Kopfzeile bleibt auch mobil sichtbar
  (`.navbar--mobile-inquiry`, siehe „Navigation“). Auf Firmen- und Hochzeitsseite
  wählt sein Link den Anlass im Formular vor. Ein Klick schließt auch ein offenes Mobilmenü.
- Die Startseite zeigt einen kompakten Catering-Einstieg mit Links auf `catering.html`.
  Die drei Formate stehen unter `catering.html#catering-angebote`: Burger-Bar (`#burger-bar`)
  mit Burgern und Fries, Streetfood-Buffet (`#streetfood-buffet`) mit zusätzlichem Chicken
  und Loaded Fries sowie Event-Stand (`#event-stand`) für öffentliche Veranstaltungen.
  Beim Streetfood-Buffet erklärt der Text die frische Ausgabe an einer Station.
- Vor den Cateringformaten auf Startseite und Cateringseite stehen drei vollständig
  anklickbare Anlasskarten: „Privatfeier“ führt zu `catering.html#catering-angebote`
  (auf der Cateringseite zum lokalen Anker), „Firmenfeier“ zu `firmen.html` und
  „Hochzeit“ zu `hochzeit.html`. Die gemeinsame `.occasion-picker`-Navigation wird in
  `css/site.css` gestaltet; unter 760 px stehen die Karten untereinander.
- Die Cateringseite lädt auch kleine private Runden zur Anfrage ein. Sie nennt keine
  pauschalen Mindestgästezahlen oder garantierten Kapazitäten. Was jeder Gast bekommt und
  dass zwei Stunden Ausgabe im Preis enthalten sind, steht seit November 2026 fest dabei
  (siehe „Richtpreise“). Extras, Aufbau und Verfügbarkeit werden persönlich abgestimmt; die
  Einladung zur Anfrage ist keine Zusage für jede Gruppengröße.
- Die Übersicht besteht aus einem kurzen Einstieg, drei Formatkarten mit der Leistung pro
  Gast (`.catering-format-includes`), dem Preisaufbau mit Rechenbeispiel (`#preise`,
  `.catering-pricing`), einer offenen Wunschmenü-Option
  (`#wunschmenue`), drei Planungsschritten und sechs nativen FAQ-Aufklappern. Drei Fragen sind
  sichtbar, die übrigen liegen gesammelt hinter „3 weitere Fragen anzeigen“ (`.catering-answers-more`,
  ebenso auf `firmen.html`). Themen: kleine Feiern, Menü, Einsatzgebiet, Aufbau, Vorlauf sowie
  Versicherung und Hygiene. Zusätzliche Angebots- und Ausstattungslisten entfallen.
- Die Übersicht und ihre Styles sind in `catering.html` und `css/catering.css` umgesetzt.
  Die Anfrage-Section, deren Styles und `scripts/catering.js` wurden bei dieser
  Überarbeitung unverändert übernommen. Die bestehenden Formatnamen und Anker bleiben
  mit dem Formular und den Links von Startseite und Speisekarte kompatibel.
- Das Anfrageformular steht auf `catering.html#event-anfragen`. Pflichtangaben sind Datum
  (alternativ „Termin steht noch nicht fest“), Ort, ungefähre Gäste-/Besucherzahl, Name und
  E-Mail. Format, Anlass, Firma, Telefon und Wünsche sind freiwillig. Zusätzliche Angaben bleiben
  zunächst eingeklappt.
- `scripts/catering.js` übernimmt die Formatwahl aus den Angebotsbuttons anhand der Werte
  `burger-bar`, `streetfood-buffet`, `event-stand`, `mitternachtsburger`, `burger-tag` und `wunschmenue`.
  Auch ein Direktlink wie `catering.html?format=burger-bar#event-anfragen` wählt das passende Format vor.
  `?anlass=firmenfeier` bzw. `?anlass=hochzeit` setzt zusätzlich den Anlass; bei Firmen klappen die
  weiteren Angaben mit dem Feld „Firma“ automatisch auf.
- Der Versand nutzt den bereits konfigurierten Web3Forms-Zugang. Der öffentliche
  `access_key` in `catering.html` bestimmt den im Web3Forms-Konto hinterlegten Empfänger;
  die eingegebene E-Mail-Adresse wird als Antwortadresse übertragen. Eine separate
  Markenadresse ist damit noch nicht eingerichtet. Als E-Mail-Alternative bleibt
  `justin.buck@sportbuck.com` erhalten, mit den eingegebenen Angaben als Entwurf.
- Die Bestätigung erscheint nur bei erfolgreicher HTTP-Antwort mit `success: true`.
  Fehler und ein Timeout nach 20 Sekunden erhalten die Eingaben; es gibt keine automatischen
  Wiederholungen. Personenbezogene Formulardaten werden nicht in Browser-Speicher geschrieben.
  Ohne JavaScript bleibt der normale Formularversand an Web3Forms mit dessen Bestätigungsseite
  möglich; die Angebotsbuttons öffnen dann weiterhin E-Mail-Entwürfe.
- Der Browsercheck verwendet simulierte Serverantworten, damit keine Testanfragen versendet
  werden. Die tatsächliche Zustellung an das hinterlegte Postfach ist damit nicht geprüft.
- Inspiration für die vereinfachte Angebotsstruktur (September 2026):
  [Käfer Party Service](https://www.feinkost-kaefer.de/pages/party-service) für den Einstieg
  über Anlässe und die ausdrückliche Ansprache kleiner Feiern,
  [Kuffler Catering](https://www.kuffler.de/de/catering/) für ein knappes Portfolio mit
  persönlicher Abstimmung und [Chipotle Catering](https://catering.chipotle.com/?zipCode=1)
  für wenige verständliche Essensformate mit direkten Handlungsbuttons. Texte und
  Gestaltung sind eigenständig; Mengen, Konditionen und Leistungsversprechen fremder
  Anbieter werden nicht übernommen. Auch weitere Gestaltungsänderungen sollen sich
  auf Wunsch des Nutzers an passenden etablierten Catering- oder Gastronomieanbietern
  orientieren.
- Die Gliederung des Formulars orientiert sich an [Kuffler Catering](https://www.kuffler.de/de/catering/anfrage/)
  (Veranstaltungs- und Kontaktdaten) und [Käfer](https://dachgarten-restaurant.feinkost-kaefer.de/Veranstaltungsformular/)
  (Angebotsauswahl, flexible Termine und Bestätigung), mit weniger Pflichtfeldern für die erste Anfrage.

## Richtpreise

- Vorläufige Richtpreise (September 2026, bewusst günstig angesetzt und noch nicht final):
  Burger-Bar ab 14 €, Streetfood-Buffet ab 19 € pro Person, dazu einmalig ab 150 € für Anfahrt
  und Aufbau. Alle Angaben inkl. MwSt. Beim Event-Stand zahlen die Gäste selbst.
- Leistung pro Gast (November 2026, als erste Annahme gesetzt; vor dem Livegang mit dem
  Wareneinsatz abgleichen): Burger-Bar = 1 Smashburger nach Wahl (auch vegetarisch), Classic
  Fries satt, Dips und Saucen. Streetfood-Buffet = Smashburger, Chicken Fingers, Loaded Fries
  und Classic Fries satt, Dips und Saucen. Immer inklusive: persönliche Planung, Grill und
  Equipment, zwei Stunden Ausgabe, Schalen und Servietten, Aufbau und Abbau. Getränke sind
  nicht enthalten und lassen sich dazubuchen.
- Weitere Annahmen vom November 2026: Die „ab“-Preise gelten für die Klassiker; Double Smash,
  Cheeseburger Royal und Extras kosten mehr und stehen im Angebot. Anfahrt und Aufbau kosten
  150 € im Umkreis von 30 km um Kempten, darüber nach Entfernung. Die Pauschale gilt auch für
  den Mitternachtsburger. Beim Event-Stand hängen die Konditionen von der Besucherzahl ab.
- Positionierung: gutes Preis-Leistungs-Verhältnis, günstig, aber nicht verschenkt. Der
  Abstand zwischen 14 € (ein Burger, Fries satt) und 19 € (alles satt) soll das Buffet zur
  naheliegenden Wahl machen. Marktvergleich November 2026: Burger-Flatrates großer
  Foodtruck-Anbieter kosten etwa 19 € pro Person für drei Stunden bei rund 1.000 €
  Mindestbestellwert, Smashburger-Caterer nennen 18 bis 28 € pro Person.
- Rechenbeispiele statt Rechner: `catering.html#preise` rechnet 40 Gäste vor (Burger-Bar ab
  710 €, Streetfood-Buffet ab 910 €), `firmen.html#preise` 60 Personen (ab 990 € und ab
  1.290 €), die Budget-Karte in `hochzeit.html` 80 Gäste (960 € plus Pauschale).
- Preise und Leistungen stehen an mehreren Stellen und müssen gemeinsam geändert werden:
  Formatkarten (`.catering-format-price`, `.catering-format-includes`) und Preisaufbau
  (`.catering-pricing`) in `catering.html`, Formatliste und Hinweis darunter auf der
  Startseite (`.catering-teaser-price`, `.catering-teaser-note` in `index.html`), Kennzahl
  „ab 14 €“, „Passt dazu“-Zeilen und Preisaufbau in `firmen.html`, Einstieg und
  Budget-Karte in `hochzeit.html` sowie die Meta-Beschreibungen von `index.html`,
  `catering.html` und `hochzeit.html`.
- `menu.html` kennzeichnet Gerichte mit Tags: „Vegetarisch“ (`--plant`) und „Scharf“ (`--hot`).
  Vegane Gerichte und eine Kids-Kategorie gibt es derzeit bewusst nicht. Allergenangaben sind
  vorläufig und müssen mit den tatsächlich verwendeten Produkten (Bun, Käse, Saucen, Patty)
  abgeglichen werden. Ein Hinweis
  am Kartenende nennt die gemeinsame Küche mit Fleisch und Chicken.
- `menu.html` zeigt keine Einzelpreise mehr: Catering wird pro Person abgerechnet, Pop-up-Preise
  können je nach Standort variieren und stehen am Stand. Die alte `speisekarte.html` samt
  Kartenbild mit Preisen ist entfernt.
- Bewusst nur „ab“-Preise: Den verbindlichen Preis nennt das schriftliche Angebot.
  Ein Budget-Rechner wurde getestet und wieder entfernt, weil er bei kleinen Runden hohe Preise
  pro Person zeigt und die Seite überfrachtet. Feste Rechenbeispiele zeigen stattdessen die
  Größenordnung.
- Vorbilder: [Holy Dogs](https://holydogs.de/privates-catering-partyservice/hochzeit/) für
  „ab … pro Person zzgl. Bereitstellungsgebühr“,
  [Trucking Good](https://truckinggood.de/journal/foodtruck-catering-muenchen-kosten/) für einen
  transparent ausgewiesenen Block für Anfahrt und Aufbau und ein vorgerechnetes Beispiel,
  [Foodtruck-Profi](https://www.foodtruck-profi.de/angebote) für Karten mit „ab“-Preis, Dauer
  und Leistungsliste sowie [holy truck](https://holytruck.de/smashburger-catering/) für
  Standardbeilagen und Saucen im Preis. Zahlen fremder Anbieter werden nicht übernommen.

## Hochzeit und Mitternachtsburger

- `hochzeit.html` ist eine kurze Landingpage für Hochzeiten rund um den „Mitternachtsburger“:
  Einstieg, drei Gründe, drei Schritte und eine Abschluss-Anfrage. Sie nutzt die Bausteine aus
  `css/catering.css`; Abweichungen stehen in `css/hochzeit.css`.
- Die Auswahl ist bewusst offen formuliert: klassisch ein Smashburger pro Gast, alles Weitere
  individuell. Vorläufiger Richtpreis ab 12 € pro Gast (September 2026, noch nicht final);
  er steht im Einstieg, in der Budget-Karte und in der Meta-Beschreibung. Die Budget-Karte
  rechnet 80 Gäste vor und nennt die Pauschale ab 150 € für Anfahrt und Aufbau.
- Alle Anfrage-Buttons führen zu `catering.html?format=mitternachtsburger&anlass=hochzeit#event-anfragen`,
  wo Format und Anlass im Formular vorausgewählt sind.
- Drei FAQ (Versicherung und Hygiene, Anforderungen an die Location, Vorlauf) stehen vor der Abschluss-Box.
- Die Seite ist nicht in der Hauptnavigation. Die Anlasskarte „Hochzeit“ vor den
  Cateringformaten auf Startseite und `catering.html` verlinkt sie direkt.
- Das Hero-Foto ist vorläufig das Catering-Setup. Später durch ein Nachtfoto mit Burger und
  Lichterketten oder Tanzfläche ersetzen und den Alternativtext anpassen.
- Vorbilder: [holy truck](https://holytruck.de/foodtruck-hochzeit/) für den Mitternachtssnack als
  Aufhänger und [Trucking Good](https://truckinggood.de/hochzeit-catering-muenchen/) für eine
  kurze Hochzeitsseite mit wiederholtem „Hochzeit anfragen“. Texte sind eigenständig.

## WhatsApp und Telefon

- Platzhalter-Nummer: 0171 3920012 (`tel:+491713920012`, `https://wa.me/491713920012`), eine von der
  Bundesnetzagentur für Medien reservierte, nie vergebene „Drama-Nummer“. Vor dem Livegang durch die
  echte Geschäftsnummer ersetzen: alle Vorkommen von `491713920012` und `0171&nbsp;3920012` in
  Startseite, `catering.html`, `hochzeit.html`, `menu.html` und `zahlung.html`.
- WhatsApp-Buttons (`.whatsapp-btn`) stehen neben den Anfrage-Buttons: im Über-uns-Bereich der
  Startseite, bei „Dein Ansprechpartner“ auf `catering.html` (zusätzlich mit Telefonnummer) und im
  Abschluss von `hochzeit.html`. Der Footer der Hauptseiten enthält einen WhatsApp-Link.
- Jeder Link öffnet einen vorausgefüllten Text; Catering und Hochzeit fragen dabei Datum, Ort und
  ungefähre Gästezahl ab. Die Texte stehen URL-kodiert im `text`-Parameter der Links.
- Es gibt kein eingebettetes WhatsApp-Widget und kein Skript des Anbieters. `datenschutz.html#whatsapp`
  beschreibt die Kontaktaufnahme per Telefon und WhatsApp.

## Firmenkunden

- `firmen.html` spricht Firmen an (HR, Office-Management): Einstieg „Euer Team. Unser Grill.“,
  Kennzahlen (`.firmen-facts`: 24 h Antwort, ab 14 € pro Person, ein Ansprechpartner, Rechnung),
  drei Anlässe mit passendem Format und Preis, der Preisaufbau mit Rechenbeispiel für
  60 Personen (`#preise`), der „Burger-Tag im Betrieb“ (`#burger-tag`), drei Schritte,
  sechs FAQ (drei davon aufklappbar gesammelt) und eine Abschluss-Box. Bausteine aus `css/catering.css`, Eigenes in `css/firmen.css`.
- Der Burger-Tag ist ein wiederkehrender Mittagsstand auf dem Firmengelände; Mitarbeitende zahlen
  selbst oder mit Arbeitgeberzuschuss. Anfrage über `?format=burger-tag&anlass=firmenfeier`,
  im Formular heißt die Personenzahl dann „Mitarbeitende vor Ort“.
- Abrechnung laut Seite: fester Preis pro Person oder Verzehrbons, schriftliches Angebot,
  Rechnung und Überweisung. Referenzen (Logos, Zitate) vor der Abschluss-Box ergänzen, sobald vorhanden.
- Die FAQ auf `catering.html`, `firmen.html` und `hochzeit.html` nennen Betriebshaftpflicht inkl. Produkthaftpflicht,
  Belehrung nach § 43 IfSG, angemeldetes Gewerbe und geprüfte Gasanlage (Firmen zusätzlich die
  Registrierung bei der Lebensmittelüberwachung). Die Zusage „Sauber abgesichert“ in `index.html#about`
  fasst Gewerbe, Haftpflicht und § 43 IfSG kurz zusammen. Diese Angaben müssen vor dem Livegang zutreffen.
- Vorbilder: [ezCater](https://www.ezcater.com/company/corporate-solutions/) für Nutzenversprechen
  aus Sicht der Einkaufenden und FAQ, [Eurest](https://eurest.co.uk/food-services/corporate-office-catering/)
  für Teamkultur als Argument und [Chidonkey](https://foodtruck-catering.chidonkey.de/) für
  Anlässe, Kennzahlen und Ablauf. Texte und Zahlen sind eigenständig.

## Antwortzeit und Verfügbarkeit

- Auch der Spot-Vorschlag im Pop-up-Ticket (`index.html`, Hinweistext und Bestätigung) nennt
  die Antwort in 24 Stunden.
- Versprechen einer persönlichen Antwort innerhalb von 24 Stunden: unter dem Absenden-Button, bei
  „Dein Ansprechpartner“, in der Erfolgsmeldung des Formulars (`catering.html`), im Abschluss
  von `hochzeit.html` und in den Zusagen von `index.html#about`. Ändert sich die Antwortzeit,
  alle Stellen gemeinsam anpassen.
- Knappheit wird ehrlich begründet statt mit einer festen Zahl: Justin betreut jedes Event
  persönlich, daher nur wenige Events pro Wochenende (`.catering-availability` am Formular,
  Abschluss von `hochzeit.html`). Eine konkrete Zahl nur nennen, wenn sie tatsächlich gilt.
- Der Saisonhinweis `.availability-note` („Sommer 2027“, „Hochzeitssaison 2027“) steht im Einstieg
  von `catering.html` und `hochzeit.html`. Die Jahreszahl nach jeder Saison aktualisieren.

## Social Media auf der Startseite

- `index.html#community` ist ein kompakter Abschluss mit der Überschrift „Bleib hungrig.
  Bleib dabei.“ Instagram und Facebook stehen zusammen, LinkedIn und X in einer kleineren
  zweiten Zeile. Rechts steht ein hervorgehobener Bereich für den geplanten WhatsApp-Kanal;
  mobil stehen die Bereiche untereinander. Styles stehen in `css/site.css`.
- Abschnitt, Pop-up-Terminanzeige und Startseiten-Footer verlinken vorläufig auf
  `https://www.instagram.com/jstin.buck/`. Sobald das Markenprofil existiert, alle drei Links
  in `index.html` ersetzen. Das vorläufige persönliche Profil wird nicht als `sameAs`
  der Marke in den strukturierten Daten ausgezeichnet.
- Für Facebook, LinkedIn, X und den WhatsApp-Kanal liegen noch keine bestätigten Profil-URLs
  vor. Sie sind als geplant gekennzeichnet und ohne Link, Buttonrolle oder Tastaturfokus
  dargestellt. Keine Plattform-Startseiten, erfundenen Handles oder `#`-Ersatzlinks einsetzen.
- Sobald die URLs vorliegen: die betreffenden Profil-Spans in Links umwandeln, die
  „Demnächst“-Hinweise entfernen und „Auch hier bald dabei“ zu „Auch hier vernetzt“ ändern.
  Neue externe Links erhalten `target="_blank"`, `rel="noopener"` und einen verständlichen
  Hinweis auf den neuen Tab. Für den WhatsApp-Kanal ersetzt ein Link mit `.social-channel-cta`
  und dem Text „Pop-up-Updates erhalten“ den Status `.social-channel-status`.
- Der Kanal braucht eine eigene `whatsapp.com/channel/`-URL. Der bisherige `wa.me`-Link bleibt
  persönlicher Kontakt und heißt im Startseiten-Footer ausdrücklich „WhatsApp-Kontakt“.
  Die Terminanzeige kann nach dem Kanalstart ebenfalls auf den Kanal verweisen.
- Der bisherige Foto-Platzhalter wird in diesem Abschnitt nicht mehr verwendet. Es gibt
  weiterhin keine eingebetteten Feeds, Social-Media-Skripte oder automatische Abonnements.
- Gestalterisches Vorbild: [Feinkost Käfer](https://www.feinkost-kaefer.de/) verlinkt Facebook
  und Instagram im Footer mit kompakten SVG-Symbolen (`list-social__link`, `icon-facebook`,
  `icon-instagram`; geprüft September 2026). Hier stehen kleine, einfarbige SVG-Symbole
  zusätzlich zum lesbaren Plattformnamen. Die großen PNG-Logos unter `assets/images/social/`
  werden dafür nicht geladen; Texte und Layout sind eigenständig.

## Öffentliche Pop-ups und Pop-up-Abstimmung

- `index.html#locations` zeigt einen Bereich ohne Bild mit großer Plakattypografie. Im Ticket
  (`.popups-dates.popups-vote`) steht statt eines Termins die Abstimmung „Wo soll das erste Pop-up hin?“
  mit Warteliste. Das Ticket ist dafür nicht gedreht, damit die Eingabefelder ruhig wirken.
- Der Bereich ist seit November 2026 bewusst kurz (am Desktop eine Bildschirmhöhe): links Einstieg
  und darunter die schlanke Zeile „Für Veranstalter“ (`.popups-facts`), rechts das Ticket. Mobil
  folgen Einstieg, Ticket und Kurzinfo aufeinander. Der frühere große Block „Dein Event. Unser
  Stand.“ und der Button „Entdecke unsere Produkte“ entfallen. Neue Inhalte hier knapp halten.
- Die Zahlungsarten gehören nicht mehr zum Pop-up-Bereich. Sie stehen direkt darunter in einer
  eigenen Leiste (`#bezahlen`, `.pay-bar`), die für alles gilt, Stand und Catering: Überschrift
  „Zahl, wie du willst.“, fünf gleich gestaltete Einträge und der Link „Alle Details zur Zahlung“
  zu `zahlung.html`. Die Kurzzeile sagt, wo die Zahlungsart gilt: Karte und PayPal am Stand,
  Überweisung beim Catering, Bar und Krypto bei beidem. Ändert sich das auf `zahlung.html`,
  die Leiste mit anpassen. Ab 961 px stehen fünf Kacheln nebeneinander, darunter eine Liste in
  einer Karte. Vorbild sind die Zahlungsleisten großer Händler und Lieferdienste, die
  Zahlungsarten als einheitliche Reihe zeigen.
- Das Ticket hat seit November 2026 zwei Wege, umschaltbar über „Pop-up wünschen“ und „Spot
  anbieten“ (`.popups-mode`, reines CSS mit `:has()`; ohne Unterstützung stehen beide Formulare
  untereinander). „Pop-up wünschen“ ist die Abstimmung mit Warteliste. „Spot anbieten“
  (`#popupSpotForm`) richtet sich an Veranstalter und Flächenbesitzer: Art des Spots (Festival
  oder Markt, Firmengelände, Laden oder Gastronomie, Verein oder Sportplatz, etwas anderes), Ort
  oder Adresse, Name und E-Mail sind Pflicht; Besucher am Tag, Event oder Location und „Wann?“
  sind freiwillig. Die Vorschläge kommen mit dem Betreff „Spot-Vorschlag: <Art> in <Ort>“ an und
  versprechen eine Antwort in 24 Stunden (siehe „Antwortzeit und Verfügbarkeit“).
  `datenschutz.html#kontaktaufnahme` beschreibt die Angaben. Der Link „Spot anbieten“ in der
  Zeile „Für Veranstalter“ schaltet das Ticket um.
- Felder: PLZ oder Ort und E-Mail für die Warteliste (beide Pflicht, nebeneinander, sobald das
  Ticket breit genug ist), „Wann passt es dir?“ mit den Schaltern Mittags, Feierabend und
  Wochenende (optional; „Mittags“ wird als „Mittags (Mo–Fr)“ übermittelt) und eine Einwilligung
  zur Ankündigung des ersten Pop-ups per E-Mail (Pflicht). Im Abriss des Tickets führt
  „Ohne E-Mail: Instagram“ zum Instagram-Profil.
- Versand über Web3Forms mit demselben Zugangsschlüssel wie das Cateringformular. `scripts/popups.js`
  prüft die Eingaben, sendet ohne Seitenwechsel und zeigt danach eine Bestätigung mit dem Ort.
  Ohne JavaScript sendet das Formular direkt an Web3Forms.
- Jede Stimme kommt als E-Mail mit dem Betreff „Pop-up-Stimme: <Ort>“ an; die Zeitwünsche stehen
  gesammelt im Feld „Wann“. Zum Auswerten im Postfach nach dem Betreff filtern und pro Ort nur
  eindeutige E-Mail-Adressen zählen. Nach außen (Vermieter, Bank, Veranstalter) nur zusammengefasste
  Zahlen nennen, nie Kontaktdaten; so steht es in `datenschutz.html#popup-warteliste`.
- Das kostenlose Web3Forms-Kontingent ist begrenzt und gilt für Catering-Anfragen und Stimmen
  zusammen. Bei vielen Stimmen den Tarif prüfen oder auf ein eigenes Formular-Backend wechseln.
- Wer sich austragen möchte, antwortet auf die Ankündigung; die Adresse dann aus der eigenen
  Liste löschen. Es gibt kein automatisches Double-Opt-in.
- Die Einleitung von `menu.html` verweist mit „Pop-up mitbestimmen“ auf `index.html#locations`.
- Für ein Event mit festem Datum verlinkt die Zeile „Für Veranstalter“ zusätzlich die
  „Stand-Anfrage“ unter `catering.html?format=event-stand#event-anfragen`. Das bestehende Catering-Skript wählt
  dort den Event-Stand vor. Ohne JavaScript bleibt das Format manuell auswählbar.
- Sobald der erste Termin feststeht: Veranstaltungsname, Datum, Uhrzeit, genaue Adresse und einen
  Routenlink im Ticket zeigen und die Warteliste per E-Mail informieren. Die Abstimmung kann für
  weitere Standorte bleiben. Bis dahin keine Beispieldaten anzeigen.

## Zahlungsarten und Krypto

- Außerhalb von `zahlung.html#krypto` erscheint Krypto wie jede andere Zahlungsart: gleicher Eintrag in
  der Leiste „Bezahlen bei Just A Buck“ (`index.html#bezahlen`) und gleicher Eintrag in der Übersicht der
  Zahlungsseite, ohne Sticker, Farbfläche oder Zusatzabzeichen.
- Nur `zahlung.html#krypto` stellt Krypto ausführlich vor: ein Gründerzitat erklärt, warum Just A Buck
  Krypto annimmt, danach folgen die Coins je Anlass und der Ablauf. Die Coin-Auswahl steht nur dort.
- Krypto wird sachlich als zusätzliche, freiwillige Option beschrieben, ohne Kursprognosen oder
  Anlagetipps.
