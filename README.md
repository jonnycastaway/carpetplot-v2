# Carpet Plot v2 – Grafana Panel

Ein modernes React-Plugin für Grafana 10+. Zeigt Zeitreihen als farbcodiertes Raster – ideal, um Verbrauchs- oder Erzeugungsmuster über mehrere Tage zu erkennen.

| Tag → | 01.01 | 02.01 | 03.01 | … |
|-------|-------|-------|-------|---|
| 00:00 | █     | █     | █     | … |
| 01:00 | █     | █     | █     | … |
| …     | …     | …     | …     | … |
| 23:00 | █     | █     | █     | … |

X-Achse = **Datum**, Y-Achse = **Stunde**, Farbe = **Messwert**.

## Features

- Zeitauflösung wählbar: Stunde, 15 Minuten, Minute
- Aggregation wählbar: Mittelwert, Summe, Min, Max, Count, erster/letzter Wert
- Mehrere Farbschemata (RdYlGn, Spectral, Blues, Oranges, PuBuGn, …)
- Anpassbare Farben im Custom-Modus
- Tooltip mit Detailwerten
- Skalierungsbereich manuell einstellbar
- Kompatibel mit Grafana 10+

## Installation

```bash
# Repository klonen
git clone https://github.com/jonnycastaway/carpetplot-v2.git carpet-panel-v2
cd carpet-panel-v2

# Plugin-Verzeichnis anlegen
sudo mkdir -p /var/lib/grafana/plugins/carpetplot-v2

# Nur die benötigten Dateien kopieren
sudo cp plugin.json /var/lib/grafana/plugins/carpetplot-v2/
sudo cp dist/module.js /var/lib/grafana/plugins/carpetplot-v2/
sudo cp -r dist/img /var/lib/grafana/plugins/carpetplot-v2/
sudo chown -R grafana:grafana /var/lib/grafana/plugins/carpetplot-v2/
```

## Unsigned Plugin erlauben

Da das Plugin nicht von Grafana signiert ist, muss es in der Konfiguration erlaubt werden:

```ini
# /etc/grafana/grafana.ini
[plugins]
allow_loading_unsigned_plugins = carpetplot-v2
```

Bei Docker:
```bash
-e GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=carpetplot-v2
```

## Grafana neustarten

```bash
sudo systemctl restart grafana-server
```

Danach steht in Grafana unter **Visualizations** das Panel **"Carpet Plot v2"** zur Verfügung.

## Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Plugin bauen
npx webpack --mode production
```

Die Ausgabe liegt danach in `dist/module.js`.

## Lizenz

ISC – siehe `LICENSE`

## Danksagung

Basiert auf dem ursprünglichen [grafana-carpetplot](https://github.com/petrslavotinek/grafana-carpetplot) von Petr Slavotinek.

---

**Repo**: https://github.com/jonnycastaway/carpetplot-v2
