# TerraSync Code – Satellite-Driven Crop Rotation & Soil Resilience Decision System
NASA Space Apps Challenge 2026 · Field Shift: Adapting Farms with NASA Data · Equipo TERRASYNC CODE

Plataforma estática (HTML/CSS/JS + Leaflet + Chart.js) con caso piloto Moquegua (Perú) y análisis en vivo de cualquier coordenada
(NASA POWER + ISRIC SoilGrids + elevación de terreno Open-Meteo). Interfaz en inglés por defecto, botón EN/ES.

## Estructura
- `ingest_data.py` – lee `datos_nasa/`, consulta APIs, crea `terrasync.db` (4 tablas) y exporta `data/moquegua_data.json` y `data/moquegua_data.js`.
- `index.html`, `styles.css`, `app.js` – aplicación web.
- `datos_nasa/` – tus archivos reales (POWER CSV, SoilGrids JSON, CSV AppEEARS SMAP y NDVI). Cualquier `*SMAP*NDVI*.csv` nuevo se detecta solo.

## Uso
1. `python ingest_data.py` (con internet: descarga NASA POWER y SoilGrids para Samegua, Torata y Omate; usa `--offline` para omitir APIs).
2. `python -m http.server 8000` y abre http://localhost:8000 (también funciona abriendo index.html directamente, gracias a `moquegua_data.js`).
3. Publicar: subir la carpeta a GitHub Pages o Vercel (sitio 100 % estático).

## Módulos de decisión
- **Biblioteca global de 30 cultivos:** cereales y pseudocereales, leguminosas, raíces y tubérculos, perennes/frutales y hortalizas/especiales. Permite buscar, filtrar por categoría/estado, seleccionar un cultivo para sincronizar calendario y simulador y agregar cultivos personalizados. Los parámetros pH, temperatura, ciclo, agua, fijación de N y tolerancia a sequía son rasgos agronómicos generales aproximados, estilo FAO; no son observaciones satelitales ni calibración local. Los cultivos personalizados se guardan en `localStorage` del navegador.
- Las tarjetas usan ilustraciones SVG originales generadas por la aplicación para los 30 cultivos y categorías. No cargan fotografías, imágenes externas ni recursos con licencias de terceros; también funcionan sin conexión y al abrir con `file:///`. Los cultivos personalizados reutilizan una ilustración de su categoría.
- **Resumen y semáforo de cultivos:** filtra la biblioteca mediante pH SoilGrids, aridez estimada, días NASA POWER por debajo de los umbrales de temperatura del cultivo y disponibilidad de agua seleccionada. Cada color muestra razones y valores; un rojo indica desajuste con este filtro, no una recomendación agronómica definitiva.
- **Calendario adaptable de 12 meses:** agrupa las normales mensuales disponibles de Tmin, Tmax, precipitación y estrés hídrico POWER. Al cambiar el cultivo activo, aplica sus umbrales generales de helada/calor y agua, y calcula una secuencia indicativa con su `cycle_months`. Los meses sin observaciones suficientes quedan sin clasificar. Las ventanas no son calendarios de cultivo observados ni recomendaciones locales.
- **Simulador adaptable de seis ciclos / tres años:** compara monocultivo continuo del cultivo activo frente a ese cultivo más un socio complementario seleccionado por fijación de nitrógeno, tolerancia a sequía, agua y semáforo local, para precipitación (-30 % a +20 %), temperatura (0 a +3 °C) y eficiencia (50 % / 85 %). Sus índices usan reglas deterministas y supuestos generales, no un modelo de aprendizaje automático, rendimiento medido ni garantía. El índice de suelo parte de SOC disponible (`40 + 2 × SOC`, limitado a 20–80) o 50; SMAP y NDVI piloto solo modifican levemente el estrés y sus píxeles mixtos no son mediciones de parcela.
- **Registro local de parcelas:** guarda en `localStorage` nombre, área, cultivo previo, fecha, notas y una instantánea del sitio (coordenadas, aridez, pH y estrategia principal). Permite inspeccionar/cargar, eliminar y exportar todos los registros como CSV o JSON. Los datos permanecen en el navegador; borrar sus datos locales los elimina.
- **Cobertura de observación:** distingue las fuentes disponibles para el sitio activo (POWER, SMAP, Terra MODIS, SoilGrids y elevación) de los productos aún no integrados (GPM IMERG, ECOSTRESS, Landsat 8/9, Sentinel-2, GLDAS y FAO GAEZ). SMAP y MODIS solo están incluidos para las zonas piloto.

## Elevación y operación sin servidor
- Cada análisis consulta `https://api.open-meteo.com/v1/elevation` para elevación del terreno (DEM global de 90 m basado en SRTM/Copernicus, servido por Open-Meteo). Si la llamada falla, el sitio muestra elevación desconocida y conserva por separado la elevación de la celda climática NASA POWER/MERRA-2; no las confunde.
- El bundle protegido `data/moquegua_data.js` sigue cargándose antes de `app.js`. La app acepta `window.MOQUEGUA_DATA` y el nombre existente `window.TERRASYNC_DATA`, asignando un alias en memoria para conservar apertura `file:///` sin modificar ni regenerar los datos.
- EN es el idioma inicial; todas las etiquetas añadidas tienen traducción ES. Las fuentes y valores no disponibles se indican en la interfaz.

## Fidelidad de datos (importante)
- El CSV de POWER incluido trae `ALLSKY_SFC_SW_DNI` (irradiancia directa normal), no `ALLSKY_SFC_SW_DWN`; 71 días finales con -999 se guardan como NULL. La radiación no se usa en ningún cálculo.
- La celda MERRA-2 del CSV tiene elevación media de 3851 m: las temperaturas (media ≈ 7.9 °C) no representan el fondo del valle. La app lo declara en "Data gaps".
- La elevación de terreno de Open-Meteo es una fuente distinta a la elevación media de la celda de reanálisis; la comparación no corrige ni sustituye temperaturas NASA POWER.
- No se inventa ni corrige ningún dato. Lo que falta aparece como "n/a" o con aviso. ET₀ (Hargreaves-Samani), índice de aridez e índice de estrés son estimaciones derivadas y están rotuladas así.
- SMAP/NDVI solo existen para las 4 zonas piloto; para otros puntos se usa humedad modelada MERRA-2 (GWETTOP).
- Los puntajes de estrategias son una heurística transparente; los atributos de cultivos son referencias agronómicas generales a validar con un agrónomo.

## Declaración de IA
Partes del código y la documentación fueron generadas con asistencia de IA (Anthropic Claude) y revisadas por el equipo.
