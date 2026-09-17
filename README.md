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
- Vor dem Veröffentlichen sollten die Social-Media-, WhatsApp- und Kontaktlinks auf die finalen Zielseiten zeigen.

## Cateringformate und nächster Ausbauschritt

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
- Die Anfrage erfolgt aktuell per E-Mail mit vorausgefülltem Format und Angaben zu Anlass,
  Datum, Ort und Gästezahl. Das Cateringformular folgt später auf
  `catering.html#event-anfragen`; dieser Anker ist bereits das Ziel der Anfragebuttons.
- Für dessen Vorauswahl besitzen die Angebotslinks stabile `data-catering-package`-Werte:
  `burger-bar`, `streetfood-buffet`, `event-stand` und `wunschmenue`. Bei der
  Formularintegration diese Auswahl übernehmen und die E-Mail als Ausweichkontakt erhalten.
- Inspiration für die Angebotsstruktur: [Käfer Feinkost Catering](https://www.feinkost-kaefer.de/pages/feinkost-catering)
  (gegliederte Speisenauswahl) und [Kuffler Catering](https://www.kuffler.de/de/catering/)
  (individuelle Planung nach Wünschen und Budget). Texte und Gestaltung sind für
  Just A Buck eigenständig umgesetzt.
