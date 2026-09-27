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
- Justin wird nur an zentralen Stellen namentlich genannt: Über-uns-Bereich der Startseite,
  „Dein Ansprechpartner“ am Catering-Formular und das Krypto-Zitat auf `zahlung.html`.
  Sonst sprechen die Texte als „wir“.

## Cateringformate und Anfrageformular

- Auf Startseite, Catering-, Firmen- und Hochzeitsseite bleibt der vorhandene
  Anfragebutton bis 900 px Bildschirmbreite in der festen Kopfzeile sichtbar
  (`.navbar--mobile-inquiry`). Logo und Abstände sind dafür nur mobil kompakter.
  Die jeweiligen Anfrageziele und Vorwahlen bleiben erhalten. Ein Klick schließt
  auch ein offenes Mobilmenü. Die Speisekarte hat bereits einen eigenen festen CTA;
  die Desktopdarstellung bleibt unverändert.
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
  pauschalen Mindestgästezahlen, festen Ausgabezeiten oder garantierten Kapazitäten.
  Auswahl, Umfang, Aufbau und Verfügbarkeit werden persönlich abgestimmt; die Einladung
  zur Anfrage ist keine Zusage für jede Gruppengröße.
- Die Übersicht besteht aus einem kurzen Einstieg, drei kompakten Formatkarten,
  einmalig genannten gemeinsamen Leistungen, einer offenen Wunschmenü-Option
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
- Die Preise stehen an mehreren Stellen und müssen gemeinsam geändert werden: Formatkarten
  (`.catering-format-price`) und Satz „Wir kümmern uns drum“ in `catering.html`, die
  Formatliste der Startseite (`.catering-teaser-price` in `index.html`) und die Kennzahl
  „ab 14 €“ in `firmen.html`.
- `menu.html` kennzeichnet Gerichte mit Tags: „Vegetarisch“ (`--plant`), „Vegan“ (`--vegan`) und
  „Mit Überraschung“ (`--kids`). Vegan: Vegan Buck und Vegan Loaded Fries; die Kategorie Kids (`#kids`)
  enthält Kids Box und Kids Box Veggie. Allergenangaben dieser Gerichte sind vorläufig und müssen mit
  den tatsächlich verwendeten Produkten (Bun, Käse, Saucen, Patty) abgeglichen werden. Ein Hinweis
  am Kartenende nennt die gemeinsame Küche mit Fleisch und Chicken.
- `menu.html` zeigt keine Einzelpreise mehr: Catering wird pro Person abgerechnet, Pop-up-Preise
  können je nach Standort variieren und stehen am Stand. `speisekarte.html` mit dem alten Kartenbild
  (`assets/images/speisekarte.jpg`, enthält Preise) ist nicht mehr verlinkt.
- Bewusst nur „ab“-Preise: Details zu Mengen und Abrechnung klärt das persönliche Gespräch.
  Ein Budget-Rechner wurde getestet und wieder entfernt, weil er bei kleinen Runden hohe Preise
  pro Person zeigt und die Seite überfrachtet.
- Vorbilder: [Holy Dogs](https://holydogs.de/privates-catering-partyservice/hochzeit/) für
  „ab … pro Person zzgl. Bereitstellungsgebühr“ und
  [Trucking Good](https://truckinggood.de/journal/foodtruck-catering-muenchen-kosten/) für einen
  transparent ausgewiesenen Block für Anfahrt und Aufbau. Zahlen fremder Anbieter werden nicht übernommen.

## Hochzeit und Mitternachtsburger

- `hochzeit.html` ist eine kurze Landingpage für Hochzeiten rund um den „Mitternachtsburger“:
  Einstieg, drei Gründe, drei Schritte und eine Abschluss-Anfrage. Sie nutzt die Bausteine aus
  `css/catering.css`; Abweichungen stehen in `css/hochzeit.css`.
- Die Auswahl ist bewusst offen formuliert: klassisch ein Smashburger pro Gast, alles Weitere
  individuell. Vorläufiger Richtpreis ab 12 € pro Gast (September 2026, noch nicht final);
  er steht im Einstieg, in der Budget-Karte und in der Meta-Beschreibung.
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
  drei Anlässe mit passendem Format, der „Burger-Tag im Betrieb“ (`#burger-tag`), drei Schritte,
  sechs FAQ (drei davon aufklappbar gesammelt) und eine Abschluss-Box. Bausteine aus `css/catering.css`, Eigenes in `css/firmen.css`.
- Der Burger-Tag ist ein wiederkehrender Mittagsstand auf dem Firmengelände; Mitarbeitende zahlen
  selbst oder mit Arbeitgeberzuschuss. Anfrage über `?format=burger-tag&anlass=firmenfeier`,
  im Formular heißt die Personenzahl dann „Mitarbeitende vor Ort“.
- Abrechnung laut Seite: fester Preis pro Person oder Verzehrbons, schriftliches Angebot,
  Rechnung und Überweisung. Referenzen (Logos, Zitate) vor der Abschluss-Box ergänzen, sobald vorhanden.
- Die FAQ auf `catering.html`, `firmen.html` und `hochzeit.html` nennen Betriebshaftpflicht inkl. Produkthaftpflicht,
  Belehrung nach § 43 IfSG, angemeldetes Gewerbe und geprüfte Gasanlage (Firmen zusätzlich die
  Registrierung bei der Lebensmittelüberwachung). Diese Angaben müssen vor dem Livegang zutreffen.
- Vorbilder: [ezCater](https://www.ezcater.com/company/corporate-solutions/) für Nutzenversprechen
  aus Sicht der Einkaufenden und FAQ, [Eurest](https://eurest.co.uk/food-services/corporate-office-catering/)
  für Teamkultur als Argument und [Chidonkey](https://foodtruck-catering.chidonkey.de/) für
  Anlässe, Kennzahlen und Ablauf. Texte und Zahlen sind eigenständig.

## Antwortzeit und Verfügbarkeit

- Versprechen einer persönlichen Antwort innerhalb von 24 Stunden: unter dem Absenden-Button, bei
  „Dein Ansprechpartner“, in der Erfolgsmeldung des Formulars (`catering.html`) und im Abschluss
  von `hochzeit.html`. Ändert sich die Antwortzeit, alle Stellen gemeinsam anpassen.
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
