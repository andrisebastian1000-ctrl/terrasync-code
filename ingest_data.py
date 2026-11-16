#!/usr/bin/env python3
"""
TerraSync Code - Data ingestion pipeline (NASA Space Apps 2026, "Field Shift").

Reads the real files stored in datos_nasa/ :
  * POWER_Point_Daily_*.csv          NASA POWER daily point data (parsed as delivered; -999 -> NULL)
  * soilgrids_*.json                 ISRIC SoilGrids point query (values divided by d_factor)
  * *SMAP*NDVI*.csv                  AppEEARS exports (SMAP SPL3SMP_E and MODIS MOD13Q1 detected by column names)
Queries the NASA POWER / SoilGrids APIs for the pilot zones that have no local file.
Stores everything in SQLite (terrasync.db) and exports data/moquegua_data.json (+ .js wrapper) for the static web app.

No data is invented: whatever cannot be read or downloaded stays empty (NULL / null) and is reported.
Only the Python standard library is required.   Usage:  python ingest_data.py [--offline]
"""
import argparse, csv, glob, json, os, re, sqlite3, sys, urllib.parse, urllib.request
from datetime import date, datetime, timedelta, timezone

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE, "datos_nasa")
OUT_DIR = os.path.join(BASE, "data")
DB_PATH = os.path.join(BASE, "terrasync.db")
POWER_START, POWER_END = "20250101", "20261109"
POWER_PARAMS = "T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,RH2M,ALLSKY_SFC_SW_DWN,GWETTOP,GWETROOT"
POWER_SRC = "NASA POWER (MERRA-2 / CERES)"

ZONES = [
    dict(codigo="MOQ-01", slug="valle-moquegua", nombre_en="Moquegua Valley", nombre_es="Valle de Moquegua", lat=-17.193, lon=-70.935),
    dict(codigo="SAM-02", slug="samegua", nombre_en="Samegua", nombre_es="Samegua", lat=-17.177, lon=-70.896),
    dict(codigo="TOR-03", slug="torata", nombre_en="Torata", nombre_es="Torata", lat=-17.077, lon=-70.843),
    dict(codigo="OMA-04", slug="omate", nombre_en="Omate", nombre_es="Omate", lat=-16.674, lon=-70.971),
]

CROPS = [
    # codigo, en, es, tipo, fija_N, sequia(1-5), raiz_cm, ph_min, ph_max, ciclo_dias, demanda_hidrica(1-3), nota_en, nota_es
    ("vetch", "Common vetch (Vicia sativa)", "Vicia (Vicia sativa)", "cover", 1, 3, 80, 6.0, 8.0, "120-180", 2, "Annual legume cover crop.", "Leguminosa anual de cobertura."),
    ("tarwi", "Andean lupin (Lupinus mutabilis, tarwi)", "Tarwi (Lupinus mutabilis)", "cover", 1, 4, 100, 5.0, 7.5, "180-240", 2, "Andean legume; usually prefers neutral-to-acid soils.", "Leguminosa andina; suele preferir suelos neutros a ácidos."),
    ("faba", "Faba bean (Vicia faba)", "Haba (Vicia faba)", "cover", 1, 2, 100, 6.0, 8.0, "120-180", 2, "Grain legume that also fixes nitrogen.", "Leguminosa de grano que también fija nitrógeno."),
    ("alfalfa", "Alfalfa (Medicago sativa)", "Alfalfa (Medicago sativa)", "forage", 1, 4, 200, 6.5, 8.5, "perennial", 3, "Very deep roots but high water use.", "Raíces muy profundas pero alto consumo de agua."),
    ("quinoa", "Quinoa (Chenopodium quinoa)", "Quinua (Chenopodium quinoa)", "cash", 0, 5, 100, 6.0, 8.5, "120-180", 1, "Drought-tolerant Andean grain.", "Grano andino tolerante a sequía."),
    ("sorghum", "Sorghum (Sorghum bicolor)", "Sorgo (Sorghum bicolor)", "cash", 0, 4, 150, 5.5, 8.5, "100-130", 1, "Deep-rooted, heat and drought tolerant cereal/forage.", "Cereal/forraje de raíz profunda, tolerante a calor y sequía."),
    ("oregano", "Oregano (Origanum vulgare)", "Orégano (Origanum vulgare)", "cash", 0, 4, 50, 6.0, 8.0, "perennial", 1, "Regional perennial herb with local market.", "Hierba perenne regional con mercado local."),
    ("olive", "Olive (Olea europaea)", "Olivo (Olea europaea)", "cash", 0, 5, 200, 6.0, 8.5, "perennial", 1, "Drought-tolerant tree crop; slow to reach production.", "Frutal tolerante a sequía; tarda en producir."),
    ("maize", "Maize (Zea mays)", "Maíz (Zea mays)", "cash", 0, 2, 100, 5.8, 8.0, "120-180", 3, "Common valley crop; sensitive to water deficit.", "Cultivo común del valle; sensible al déficit hídrico."),
]

STRATEGIES = [
    dict(codigo="S1", en="Current Practice (Monoculture / Bare Soil Periods)", es="Práctica actual (monocultivo / periodos de suelo desnudo)",
         desc_en="Baseline: one main crop year after year, with bare or sparsely covered soil between cycles.",
         desc_es="Línea base: un cultivo principal año tras año, con suelo desnudo o poco cubierto entre ciclos.",
         cultivos=["maize", "alfalfa"], agua=2, suelo=1, mercado=1, demanda=2,
         ben_en=["Familiar to the farmer: no new seed, equipment or know-how needed", "Lowest short-term labor and cost", "Serves as the reference for judging the alternatives"],
         ben_es=["Conocida por el agricultor: no requiere semillas, equipos ni conocimientos nuevos", "Menor costo y mano de obra a corto plazo", "Sirve como referencia para juzgar las alternativas"],
         rie_en=["Bare-soil periods leave topsoil exposed to wind and irrigation erosion", "Continuous monoculture can deplete nutrients and build up pests and diseases", "Income and climate risk depend on a single crop"],
         rie_es=["Los periodos de suelo desnudo exponen el suelo superficial a la erosión por viento y riego", "El monocultivo continuo puede agotar nutrientes y acumular plagas y enfermedades", "El ingreso y el riesgo climático dependen de un solo cultivo"]),
    dict(codigo="S2", en="Nitrogen-Fixing Cover Crops & Biological Control Habitat", es="Cultivos de cobertura fijadores de nitrógeno y hábitat de control biológico",
         desc_en="Legume cover crops and flowering inter-row strips keep the soil covered and support beneficial insects.",
         desc_es="Leguminosas de cobertura y franjas florales entre hileras mantienen el suelo cubierto y atraen insectos benéficos.",
         cultivos=["vetch", "faba", "tarwi"], agua=2, suelo=5, mercado=3, demanda=2,
         ben_en=["Legumes can add biologically fixed nitrogen and reduce fertilizer needs", "Ground cover reduces erosion and evaporation from bare soil", "Flowering inter-rows can host beneficial insects for biological pest control", "Residues add organic matter over time"],
         ben_es=["Las leguminosas pueden aportar nitrógeno fijado biológicamente y reducir el uso de fertilizante", "La cobertura reduce la erosión y la evaporación del suelo desnudo", "Las franjas florales pueden albergar insectos benéficos para el control biológico", "Los residuos aportan materia orgánica con el tiempo"],
         rie_en=["Cover crops use water while establishing; in arid sites they can compete with the main crop unless irrigation is adjusted", "Seed, rhizobium inoculant and labor must be available locally", "Terminating or incorporating the cover needs correct timing and equipment", "Poorly managed covers can host pests"],
         rie_es=["Las coberturas consumen agua al establecerse; en zonas áridas pueden competir con el cultivo principal si no se ajusta el riego", "Semilla, inoculante de rizobio y mano de obra deben estar disponibles localmente", "Terminar o incorporar la cobertura requiere momento y equipo adecuados", "Una cobertura mal manejada puede hospedar plagas"]),
    dict(codigo="S3", en="Drought-Tolerant & Deep-Rooted Crop Rotation", es="Rotación de cultivos tolerantes a sequía y de raíz profunda",
         desc_en="Rotate drought-tolerant, deep-rooted crops to use less water and diversify income.",
         desc_es="Rotar cultivos tolerantes a sequía y de raíz profunda para usar menos agua y diversificar ingresos.",
         cultivos=["quinoa", "sorghum", "oregano", "olive"], agua=5, suelo=3, mercado=4, demanda=1,
         ben_en=["Lower crop water requirement per cycle", "Deep roots reach moisture and nutrients below the surface and can improve soil structure", "Several species spread income and climate risk", "Breaks pest and disease cycles of the previous crop"],
         ben_es=["Menor requerimiento de agua por ciclo", "Las raíces profundas alcanzan humedad y nutrientes bajo la superficie y pueden mejorar la estructura del suelo", "Varias especies reparten el riesgo de ingresos y clima", "Rompe ciclos de plagas y enfermedades del cultivo anterior"],
         rie_en=["Market access and prices for alternative crops must be checked locally", "Yield and quality under local frost, heat and salinity are not tested by this tool", "Perennials (olive, oregano) need establishment years before income", "Water savings depend on the irrigation system, not only the crop"],
         rie_es=["El acceso a mercado y los precios de cultivos alternativos deben verificarse localmente", "Esta herramienta no prueba rendimiento ni calidad bajo heladas, calor y salinidad locales", "Los perennes (olivo, orégano) necesitan años de establecimiento antes de generar ingreso", "El ahorro de agua depende del sistema de riego, no solo del cultivo"]),
]

SOIL_KEYS = {"clay": "clay_pct", "sand": "sand_pct", "silt": "silt_pct", "phh2o": "ph", "soc": "soc_g_kg"}


def http_json(url, timeout=45):
    req = urllib.request.Request(url, headers={"User-Agent": "TerraSyncCode/1.0 (NASA Space Apps 2026)"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def num(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def zone_for(lat, lon, tol=0.02):
    for z in ZONES:
        if abs(z["lat"] - lat) <= tol and abs(z["lon"] - lon) <= tol:
            return z
    return None


# ---------- readers ----------
def parse_power_csv(path):
    with open(path, encoding="utf-8-sig", newline="") as fh:
        lines = fh.read().splitlines()
    end = next(i for i, l in enumerate(lines) if l.strip() == "-END HEADER-")
    header = lines[:end]
    joined = " ".join(header)
    m = re.search(r"latitude\s+(-?[\d.]+)\s+longitude\s+(-?[\d.]+)", joined)
    lat, lon = float(m.group(1)), float(m.group(2))
    em = re.search(r"=\s*([\d.]+)\s*meters", joined)
    units = {}
    for l in header:
        pm = re.match(r"^([A-Z0-9_]+)\s{2,}.*\(([^()]*)\)\s*$", l.strip())
        if pm:
            units[pm.group(1)] = pm.group(2)
    dates, vars_ = [], {}
    for row in csv.DictReader(lines[end + 1:]):
        d = date(int(row["YEAR"]), 1, 1) + timedelta(days=int(row["DOY"]) - 1)
        dates.append(d.isoformat())
        for k, v in row.items():
            if k in ("YEAR", "DOY"):
                continue
            x = num(v)
            vars_.setdefault(k, []).append(None if x is None or x == -999 else x)
    return dict(lat=lat, lon=lon, elev=float(em.group(1)) if em else None, units=units, dates=dates, vars=vars_)


def parse_soilgrids(obj):
    lon, lat = obj["geometry"]["coordinates"][:2]
    soil = {}
    for layer in obj["properties"]["layers"]:
        key = SOIL_KEYS.get(layer["name"])
        if not key:
            continue
        df = layer["unit_measure"].get("d_factor") or 1
        soil[key] = {}
        for dep in layer["depths"]:
            v = dep["values"].get("mean")
            soil[key][dep["label"]] = None if v is None else round(v / df, 2)
    return lat, lon, soil


def parse_appeears(path):
    with open(path, encoding="utf-8-sig", newline="") as fh:
        rows = list(csv.DictReader(fh))
    if not rows:
        return []
    cols = list(rows[0].keys())
    out = []
    if any("SPL3SMP" in c for c in cols):
        for per in ("AM", "PM"):
            vc = next((c for c in cols if c.endswith(f"{per}_soil_moisture_scav")), None)
            if not vc:
                continue
            qc = next((c for c in cols if f"{per}_retrieval_qual_flag_scav" in c and c.endswith("Recommended_Quality_Description")), None)
            for r in rows:
                v = num(r[vc])
                if v is None or v < 0:  # -9999 = no retrieval
                    continue
                out.append((r["ID"], r["Date"], "NASA SMAP SPL3SMP_E v006 (AppEEARS)", f"SM_{per}", v, "m3/m3", r.get(qc) if qc else None))
    elif any("MOD13Q1" in c for c in cols):
        vc = next(c for c in cols if c.endswith("_NDVI"))
        qc = next((c for c in cols if c.endswith("VI_Quality_MODLAND_Description")), None)
        for r in rows:
            v = num(r[vc])
            if v is None or v < -1:  # fill value
                continue
            out.append((r["ID"], r["Date"], "MODIS MOD13Q1 v061 (AppEEARS)", "NDVI", v, "index", r.get(qc) if qc else None))
    return out


# ---------- API clients ----------
def fetch_power(lat, lon):
    q = dict(parameters=POWER_PARAMS, community="AG", longitude=lon, latitude=lat, start=POWER_START, end=POWER_END, format="JSON")
    j = http_json("https://power.larc.nasa.gov/api/temporal/daily/point?" + urllib.parse.urlencode(q), 90)
    par = j["properties"]["parameter"]
    dates = sorted(next(iter(par.values())).keys())
    vars_ = {k: [None if series[d] == -999 else series[d] for d in dates] for k, series in par.items()}
    units = {k: j.get("parameters", {}).get(k, {}).get("units") for k in par}
    iso = [f"{d[:4]}-{d[4:6]}-{d[6:]}" for d in dates]
    elev = j.get("geometry", {}).get("coordinates", [None, None, None])[2]
    return dict(lat=lat, lon=lon, elev=elev, units=units, dates=iso, vars=vars_)


def fetch_soilgrids(lat, lon):
    q = [("lon", lon), ("lat", lat)] + [("property", p) for p in SOIL_KEYS] + [("depth", "0-5cm"), ("depth", "15-30cm"), ("value", "mean")]
    return parse_soilgrids(http_json("https://rest.isric.org/soilgrids/v2.0/properties/query?" + urllib.parse.urlencode(q), 90))[2]


# ---------- database ----------
SCHEMA = """
DROP TABLE IF EXISTS series_observacion; DROP TABLE IF EXISTS zonas_agricolas;
DROP TABLE IF EXISTS catalogo_cultivos; DROP TABLE IF EXISTS estrategias_rotacion;
CREATE TABLE zonas_agricolas(id INTEGER PRIMARY KEY, codigo TEXT UNIQUE NOT NULL, slug TEXT, nombre_en TEXT, nombre_es TEXT,
  latitud REAL NOT NULL, longitud REAL NOT NULL, elevacion_m REAL, elevacion_nota TEXT, suelo_json TEXT, suelo_fuente TEXT);
CREATE TABLE series_observacion(id INTEGER PRIMARY KEY, zona_id INTEGER NOT NULL REFERENCES zonas_agricolas(id),
  fecha TEXT NOT NULL, fuente TEXT NOT NULL, variable TEXT NOT NULL, valor REAL, unidad TEXT, calidad TEXT);
CREATE INDEX idx_series ON series_observacion(zona_id, variable, fecha);
CREATE TABLE catalogo_cultivos(id INTEGER PRIMARY KEY, codigo TEXT UNIQUE, nombre_en TEXT, nombre_es TEXT, tipo TEXT,
  fija_nitrogeno INTEGER, tolerancia_sequia INTEGER, raiz_profunda_cm INTEGER, ph_min REAL, ph_max REAL, ciclo_dias TEXT,
  demanda_hidrica INTEGER, nota_en TEXT, nota_es TEXT, fuente TEXT);
CREATE TABLE estrategias_rotacion(id INTEGER PRIMARY KEY, codigo TEXT UNIQUE, nombre_en TEXT, nombre_es TEXT, descripcion_en TEXT,
  descripcion_es TEXT, cultivos_json TEXT, puntaje_agua INTEGER, puntaje_suelo INTEGER, puntaje_mercado INTEGER, demanda_hidrica INTEGER,
  beneficios_en TEXT, beneficios_es TEXT, riesgos_en TEXT, riesgos_es TEXT);
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--offline", action="store_true", help="do not call NASA POWER / SoilGrids APIs")
    args = ap.parse_args()
    log = []
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    con = sqlite3.connect(DB_PATH)
    con.executescript(SCHEMA)
    zid = {}
    for z in ZONES:
        cur = con.execute("INSERT INTO zonas_agricolas(codigo,slug,nombre_en,nombre_es,latitud,longitud) VALUES(?,?,?,?,?,?)",
                          (z["codigo"], z["slug"], z["nombre_en"], z["nombre_es"], z["lat"], z["lon"]))
        zid[z["codigo"]] = cur.lastrowid
    have_power, have_soil = set(), set()

    def put_power(z, p, src, local):
        rows = []
        for var, vals in p["vars"].items():
            unit = p["units"].get(var)
            for d, v in zip(p["dates"], vals):
                rows.append((zid[z["codigo"]], d, src, var, v, unit, None if v is not None else "missing (-999)"))
        con.executemany("INSERT INTO series_observacion(zona_id,fecha,fuente,variable,valor,unidad,calidad) VALUES(?,?,?,?,?,?,?)", rows)
        if p.get("elev") is not None:
            note = "MERRA-2 grid-cell average elevation (0.5 x 0.625 deg), not plot elevation" if local else "Elevation reported by the NASA POWER API"
            con.execute("UPDATE zonas_agricolas SET elevacion_m=?, elevacion_nota=? WHERE id=?", (p["elev"], note, zid[z["codigo"]]))
        have_power.add(z["codigo"])
        log.append(f"POWER {z['codigo']}: {len(p['dates'])} days, variables {sorted(p['vars'])} [{src}]")

    for f in sorted(glob.glob(os.path.join(DATA_DIR, "POWER_Point_Daily_*.csv"))):
        p = parse_power_csv(f)
        z = zone_for(p["lat"], p["lon"])
        if z:
            put_power(z, p, POWER_SRC + " - local CSV", True)
        else:
            log.append(f"WARNING: {os.path.basename(f)} does not match any pilot zone")
    for f in sorted(glob.glob(os.path.join(DATA_DIR, "soilgrids_*.json"))):
        with open(f, encoding="utf-8") as fh:
            lat, lon, soil = parse_soilgrids(json.load(fh))
        z = zone_for(lat, lon)
        if z:
            con.execute("UPDATE zonas_agricolas SET suelo_json=?, suelo_fuente=? WHERE id=?", (json.dumps(soil), "ISRIC SoilGrids 250 m (local JSON)", zid[z["codigo"]]))
            have_soil.add(z["codigo"])
            log.append(f"SoilGrids {z['codigo']}: {sorted(soil)} from {os.path.basename(f)}")
    for f in sorted(glob.glob(os.path.join(DATA_DIR, "*SMAP*NDVI*.csv"))):
        obs = parse_appeears(f)
        ok = [(zid[o[0]],) + o[1:] for o in obs if o[0] in zid]
        con.executemany("INSERT INTO series_observacion(zona_id,fecha,fuente,variable,valor,unidad,calidad) VALUES(?,?,?,?,?,?,?)", ok)
        log.append(f"AppEEARS {os.path.basename(f)}: {len(ok)} valid observations")

    if not args.offline:
        for z in ZONES:
            if z["codigo"] not in have_power:
                try:
                    put_power(z, fetch_power(z["lat"], z["lon"]), POWER_SRC + " - API", False)
                except Exception as e:
                    log.append(f"POWER API failed for {z['codigo']}: {e}")
            if z["codigo"] not in have_soil:
                try:
                    soil = fetch_soilgrids(z["lat"], z["lon"])
                    con.execute("UPDATE zonas_agricolas SET suelo_json=?, suelo_fuente=? WHERE id=?", (json.dumps(soil), "ISRIC SoilGrids 250 m (API)", zid[z["codigo"]]))
                    have_soil.add(z["codigo"])
                    log.append(f"SoilGrids API ok for {z['codigo']}")
                except Exception as e:
                    log.append(f"SoilGrids API failed for {z['codigo']}: {e}")
    else:
        log.append("Offline mode: API queries skipped (re-run without --offline to download the missing zones).")

    con.executemany("INSERT INTO catalogo_cultivos(codigo,nombre_en,nombre_es,tipo,fija_nitrogeno,tolerancia_sequia,raiz_profunda_cm,ph_min,ph_max,ciclo_dias,demanda_hidrica,nota_en,nota_es,fuente) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [c + ("Approximate general agronomic reference ranges; must be validated by a local agronomist",) for c in CROPS])
    for s in STRATEGIES:
        con.execute("INSERT INTO estrategias_rotacion(codigo,nombre_en,nombre_es,descripcion_en,descripcion_es,cultivos_json,puntaje_agua,puntaje_suelo,puntaje_mercado,demanda_hidrica,beneficios_en,beneficios_es,riesgos_en,riesgos_es) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    (s["codigo"], s["en"], s["es"], s["desc_en"], s["desc_es"], json.dumps(s["cultivos"]), s["agua"], s["suelo"], s["mercado"], s["demanda"],
                     json.dumps(s["ben_en"], ensure_ascii=False), json.dumps(s["ben_es"], ensure_ascii=False),
                     json.dumps(s["rie_en"], ensure_ascii=False), json.dumps(s["rie_es"], ensure_ascii=False)))
    con.commit()

    # ---------- export ----------
    total_days = (date(2026, 11, 9) - date(2025, 1, 1)).days + 1
    zones_out = []
    for r in con.execute("SELECT id,codigo,slug,nombre_en,nombre_es,latitud,longitud,elevacion_m,elevacion_nota,suelo_json,suelo_fuente FROM zonas_agricolas ORDER BY id").fetchall():
        zi, cod, slug, ne, ns, lat, lon, elev, enota, sj, sf = r
        series = {}
        for fuente, var, fecha, val, unit, cal in con.execute("SELECT fuente,variable,fecha,valor,unidad,calidad FROM series_observacion WHERE zona_id=? ORDER BY fecha", (zi,)):
            series.setdefault((fuente, var), dict(unit=unit, rows=[]))["rows"].append((fecha, val, cal))
        power = None
        pv = {k: v for k, v in series.items() if k[0].startswith("NASA POWER")}
        if pv:
            dates = sorted({d for v in pv.values() for d, _, _ in v["rows"]})
            vars_, units = {}, {}
            for (f, var), v in pv.items():
                m = {d: x for d, x, _ in v["rows"]}
                vars_[var] = [m.get(d) for d in dates]
                units[var] = v["unit"]
            power = dict(source=next(iter(pv))[0], units=units, dates=dates, vars=vars_)

        def pts(var):
            for (f, v), s in series.items():
                if v == var:
                    return dict(source=f, unit=s["unit"], points=[[d, x, c] for d, x, c in s["rows"]])
            return None

        smap = pts("SM_AM")
        if smap:
            smap["total_days"] = total_days
        zones_out.append(dict(id=cod, slug=slug, name_en=ne, name_es=ns, lat=lat, lon=lon, elevation_m=elev, elevation_note=enota,
                              soil=json.loads(sj) if sj else None, soil_source=sf, power=power, smap=smap, ndvi=pts("NDVI")))
    ckeys = ["code", "name_en", "name_es", "type", "n_fixing", "drought_tolerance", "root_depth_cm", "ph_min", "ph_max", "cycle_days", "water_demand", "note_en", "note_es", "source"]
    crops_out = [dict(zip(ckeys, c)) for c in con.execute("SELECT codigo,nombre_en,nombre_es,tipo,fija_nitrogeno,tolerancia_sequia,raiz_profunda_cm,ph_min,ph_max,ciclo_dias,demanda_hidrica,nota_en,nota_es,fuente FROM catalogo_cultivos")]
    strat_out = []
    for r in con.execute("SELECT codigo,nombre_en,nombre_es,descripcion_en,descripcion_es,cultivos_json,puntaje_agua,puntaje_suelo,puntaje_mercado,demanda_hidrica,beneficios_en,beneficios_es,riesgos_en,riesgos_es FROM estrategias_rotacion"):
        strat_out.append(dict(code=r[0], name_en=r[1], name_es=r[2], desc_en=r[3], desc_es=r[4], crops=json.loads(r[5]), score_water=r[6], score_soil=r[7],
                              score_market=r[8], water_demand=r[9], benefits_en=json.loads(r[10]), benefits_es=json.loads(r[11]), risks_en=json.loads(r[12]), risks_es=json.loads(r[13])))
    out = dict(meta=dict(generated_utc=datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), period=[POWER_START, POWER_END], ingest_log=log),
               zones=zones_out, crops=crops_out, strategies=strat_out)
    os.makedirs(OUT_DIR, exist_ok=True)
    txt = json.dumps(out, ensure_ascii=False, separators=(",", ":"))
    with open(os.path.join(OUT_DIR, "moquegua_data.json"), "w", encoding="utf-8") as fh:
        fh.write(txt)
    with open(os.path.join(OUT_DIR, "moquegua_data.js"), "w", encoding="utf-8") as fh:
        fh.write("window.TERRASYNC_DATA=" + txt + ";\n")
    con.close()
    print("\n".join(log))
    print(f"\nOK -> {DB_PATH}\nOK -> data/moquegua_data.json ({len(txt) // 1024} KB) + data/moquegua_data.js")


if __name__ == "__main__":
    sys.exit(main())
