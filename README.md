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
  für private Feiern, Streetfood-Buffet (`#streetfood-buffet`) für Vereins- und Sommerfeste
  sowie Event-Stand (`#event-stand`) als Verkaufsstand bei Festen mit offenem Publikum.
  Ein Wunschmenü ist unter `#wunschmenue` als individuelle Option verlinkt. Extras,
  Rahmenbedingungen (Gästezahl, Vorlauf, Einsatzgebiet, Platz und Anschlüsse, Mengen)
  und Ablauf werden ebenfalls auf dieser Unterseite erklärt.
- Preise stehen weiterhin nicht auf der Seite (Preis pro Gast, Angebot nach Anfrage). In den
  Formatkarten ist per HTML-Kommentar ein Platz für einen späteren Richtwert ("ab X € pro Gast")
  vorbereitet.
- Gästezahlen, Ausgabezeiten, Vorlauf, Einsatzradius, Platz- und Strombedarf, der eingeplante
  Vegetarier-Anteil sowie die Antwortzeit "innerhalb eines Werktags" sind erste Annahmen und
  vor dem Livegang zu prüfen.
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
- Inspiration für die Angebotsstruktur: [Käfer Feinkost Catering](https://www.feinkost-kaefer.de/pages/feinkost-catering)
  (gegliederte Speisenauswahl) und [Kuffler Catering](https://www.kuffler.de/de/catering/)
  (individuelle Planung nach Wünschen und Budget). Texte und Gestaltung sind für
  Just A Buck eigenständig umgesetzt.
- Die Gliederung des Formulars orientiert sich an [Kuffler Catering](https://www.kuffler.de/de/catering/anfrage/)
  (Veranstaltungs- und Kontaktdaten) und [Käfer](https://dachgarten-restaurant.feinkost-kaefer.de/Veranstaltungsformular/)
  (Angebotsauswahl, flexible Termine und Bestätigung), mit weniger Pflichtfeldern für die erste Anfrage.

## Instagram auf der Startseite

- Ein kompakter Abschnitt am Ende der Startseite ersetzt die bisherigen Plattformkarten.
  Der Anker `#community` bleibt für bestehende Direktlinks erhalten; der Menüpunkt entfällt.
- Abschnitt und Startseiten-Footer verlinken auf ausdrücklichen Wunsch vorläufig auf
  `https://www.instagram.com/jstin.buck/`. Sobald das Markenprofil existiert, beide Links
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
- „Entdecke die Speisekarte“ führt zu `menu.html`; „Stand anfragen“ öffnet
  `catering.html?format=event-stand#event-anfragen`. Das bestehende Catering-Skript wählt
  dort den Event-Stand vor. Ohne JavaScript bleibt das Format manuell auswählbar.
- Sobald ein Termin bestätigt ist, den Hinweis in `.popups-dates` durch Veranstaltungsname,
  Datum, Uhrzeit, genaue Adresse und einen Routenlink ersetzen. Angaben zu Eintritt oder
  Tickets ergänzen, wenn sie für den Besuch relevant sind. Bis dahin keine Beispieldaten anzeigen.
