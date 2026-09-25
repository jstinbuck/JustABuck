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
  video/       Video-Dateien
css/
  site.css     Gemeinsame Styles aller Hauptseiten
  catering.css Styles der Catering-Unterseite
  merchdrop.css Styles der Merch-Drop-Seite
scripts/       JavaScript für die Seiten
*.html         Seiten der Website
```

## Konventionen

- Neue Medien gehören in `assets/` und verwenden Kleinbuchstaben sowie Bindestriche im Dateinamen.
- Gemeinsame Styles kommen in `css/site.css`; seitenbezogene Styles erhalten eine eigene CSS-Datei.
- Alle internen Pfade werden relativ zum Projektstamm angegeben, zum Beispiel `assets/images/logo.png`.
- Vor dem Veröffentlichen sollten die Social-Media- und Kontaktlinks auf die finalen Zielseiten zeigen.

## Cateringformate und Anfrageformular

- Die Startseite zeigt einen kompakten Catering-Einstieg mit Links auf `catering.html`.
  Die drei Formate stehen unter `catering.html#catering-angebote`: Burger-Bar (`#burger-bar`)
  mit Burgern und Fries, Streetfood-Buffet (`#streetfood-buffet`) mit zusätzlichem Chicken
  und Loaded Fries sowie Event-Stand (`#event-stand`) für öffentliche Veranstaltungen.
  Beim Streetfood-Buffet erklärt der Text die frische Ausgabe an einer Station.
- Die Cateringseite lädt auch kleine private Runden zur Anfrage ein. Sie nennt keine
  pauschalen Mindestgästezahlen, festen Ausgabezeiten oder garantierten Kapazitäten.
  Auswahl, Umfang, Aufbau und Verfügbarkeit werden persönlich abgestimmt; die Einladung
  zur Anfrage ist keine Zusage für jede Gruppengröße.
- Die Übersicht besteht aus einem kurzen Einstieg, drei kompakten Formatkarten,
  einmalig genannten gemeinsamen Leistungen, einer offenen Wunschmenü-Option
  (`#wunschmenue`), drei Planungsschritten und fünf nativen FAQ-Aufklappern.
  Praktische Fragen zu kleinen Feiern, Menü, Einsatzgebiet, Aufbau und Vorlauf bleiben
  zunächst eingeklappt. Zusätzliche Angebots- und Ausstattungslisten entfallen.
- Die Übersicht und ihre Styles sind in `catering.html` und `css/catering.css` umgesetzt.
  Die Anfrage-Section, deren Styles und `scripts/catering.js` wurden bei dieser
  Überarbeitung unverändert übernommen. Die bestehenden Formatnamen und Anker bleiben
  mit dem Formular und den Links von Startseite und Speisekarte kompatibel.
- Das Anfrageformular steht auf `catering.html#event-anfragen`. Pflichtangaben sind Datum
  (alternativ „Termin steht noch nicht fest“), Ort, ungefähre Gäste-/Besucherzahl, Name und
  E-Mail. Format, Anlass, Telefon und Wünsche sind freiwillig. Zusätzliche Angaben bleiben
  zunächst eingeklappt.
- `scripts/catering.js` übernimmt die Formatwahl aus den Angebotsbuttons anhand der Werte
  `burger-bar`, `streetfood-buffet`, `event-stand` und `wunschmenue`. Auch ein Direktlink wie
  `catering.html?format=burger-bar#event-anfragen` wählt das passende Format vor.
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
- Die Preise stehen an drei Stellen und müssen gemeinsam geändert werden: Formatkarten
  (`.catering-format-price`) und Satz „Wir kümmern uns drum“ in `catering.html` sowie die
  Formatliste der Startseite (`.catering-teaser-price` in `index.html`).
- Bewusst nur „ab“-Preise: Details zu Mengen und Abrechnung klärt das persönliche Gespräch.
  Ein Budget-Rechner wurde getestet und wieder entfernt, weil er bei kleinen Runden hohe Preise
  pro Person zeigt und die Seite überfrachtet.
- Vorbilder: [Holy Dogs](https://holydogs.de/privates-catering-partyservice/hochzeit/) für
  „ab … pro Person zzgl. Bereitstellungsgebühr“ und
  [Trucking Good](https://truckinggood.de/journal/foodtruck-catering-muenchen-kosten/) für einen
  transparent ausgewiesenen Block für Anfahrt und Aufbau. Zahlen fremder Anbieter werden nicht übernommen.

## Instagram auf der Startseite

- Ein kompakter Abschnitt am Ende der Startseite ersetzt die bisherigen Plattformkarten.
  Der Anker `#community` bleibt für bestehende Direktlinks erhalten; der Menüpunkt entfällt.
- Abschnitt, Pop-up-Terminanzeige und Startseiten-Footer verlinken vorläufig auf
  `https://www.instagram.com/jstin.buck/`. Sobald das Markenprofil existiert, alle drei Links
  in `index.html` ersetzen. Das vorläufige persönliche Profil wird nicht als `sameAs`
  der Marke in den strukturierten Daten ausgezeichnet.
- `assets/images/social-placeholder.svg` ist ein bewusst neutraler Bildplatzhalter.
  Später durch ein eigenes Foto ersetzen, den Alternativtext passend zum Foto ergänzen
  und die Bildunterschrift „Bildplatzhalter“ entfernen. Der Bildbereich verwendet 4:3.
- Instagram wird nur verlinkt; es gibt keinen eingebetteten Feed oder Social-Media-Skripte.

## Öffentliche Pop-ups

- `index.html#locations` zeigt einen Bereich ohne Bild mit großer Plakattypografie und einer Terminanzeige
  im Ticket-Stil. Ein ausdrücklicher Hinweis erklärt,
  dass noch kein öffentlicher Termin feststeht. Der bestehende Navigationsanker bleibt erhalten.
- Direkt bei der Terminanzeige führt „Vom ersten Pop-up erfahren“ zum bestehenden
  Instagram-Profil. Der sichtbare Zusatz „Auf Instagram dabei sein“ erklärt das Ziel;
  der Link öffnet einen neuen Tab. Es gibt keine automatische Terminbenachrichtigung.
- Die Einleitung von `menu.html` erklärt die Auswahl für Caterings und öffentliche
  Pop-ups. „Pop-up-Termine ansehen“ führt direkt zu `index.html#locations` und bleibt
  auch auf kleinen Bildschirmen sichtbar.
- „Entdecke die Speisekarte“ führt zu `menu.html`; „Stand anfragen“ öffnet
  `catering.html?format=event-stand#event-anfragen`. Das bestehende Catering-Skript wählt
  dort den Event-Stand vor. Ohne JavaScript bleibt das Format manuell auswählbar.
- Sobald ein Termin bestätigt ist, den Hinweis in `.popups-dates` durch Veranstaltungsname,
  Datum, Uhrzeit, genaue Adresse und einen Routenlink ersetzen. Angaben zu Eintritt oder
  Tickets ergänzen, wenn sie für den Besuch relevant sind. Bis dahin keine Beispieldaten anzeigen.

## Zahlungsarten und Krypto

- Außerhalb von `zahlung.html#krypto` erscheint Krypto wie jede andere Zahlungsart: gleiche Kachel im
  Block „Bezahlen am Stand“ unter `index.html#locations` und gleicher Eintrag in der Übersicht der
  Zahlungsseite, ohne Sticker, Farbfläche oder Zusatzabzeichen.
- Nur `zahlung.html#krypto` stellt Krypto ausführlich vor: ein Gründerzitat erklärt, warum Just A Buck
  Krypto annimmt, danach folgen die Coins je Anlass und der Ablauf. Die Coin-Auswahl steht nur dort.
- Krypto wird sachlich als zusätzliche, freiwillige Option beschrieben, ohne Kursprognosen oder
  Anlagetipps.
