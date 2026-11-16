/* TerraSync Code – static decision-support app. Code written with AI assistance (see footer). */
(() => {
'use strict';

const I18N = {
en: {
  view_dashboard:'View Full Dashboard (All Sections)', guided_view:'Return to Guided Steps', welcome_kicker:'FIELD-READY DECISIONS · MOQUEGUA PILOT', welcome_title:'Grow resilience, one decision at a time.', welcome_subtitle:'Explore your farm’s climate, soil and crop options with NASA Earth data, then turn the evidence into a practical rotation plan.', badge_nasa:'NASA satellite data', badge_crops:'30 global crops', badge_languages:'English + Spanish', start_analysis:'Start Farm Analysis →', pilot_shortcuts:'Start with a pilot farm', pilot_moquegua:'Moquegua Valley', pilot_samegua:'Samegua', pilot_torata:'Torata', pilot_omate:'Omate',
  step_location:'Location & diagnosis', step_climate:'Climate & water', step_crops:'Crops & calendar', step_rotation:'Rotation & farm logbook', previous_step:'← Previous', next_step:'Next Step →',
  tagline:'Satellite-driven crop rotation & soil resilience', h1:'Which rotation will make this farm more resilient?',
  lead:'Explore how NASA climate and satellite data can inform crop rotation and inter-row management. Start with a Moquegua (Peru) pilot valley, or click anywhere on the map.',
  pilot_title:'Pilot zones – Moquegua, Peru', pilot_hint:'Calibrated demo sites with preloaded NASA data.',
  coords_title:'Any farm on Earth', lat:'Latitude', lon:'Longitude', analyze:'Analyze this location', map_hint:'Or click anywhere on the map. Live data comes from NASA POWER and ISRIC SoilGrids.',
  prio_title:'Farmer priorities', p_water:'Water conservation', p_soil:'Soil health & erosion control', p_market:'Market & income diversification',
  avail_title:'Water availability', low:'Low', medium:'Medium', high:'High',
  loading:'Loading NASA data…', ready:'Analysis ready', err_coords:'Enter a valid latitude (-90 to 90) and longitude (-180 to 180).',
  ind_title:'Site indicators at a glance', charts_title:'Climate, soil moisture and water stress',
  c_temp:'Monthly temperature (reanalysis grid)', c_sm:'Soil moisture', c_wb:'Monthly water balance and water stress index', c_ndvi:'Vegetation greenness (NDVI)',
  wb_note:'Derived estimate: ET₀ by the Hargreaves-Samani method from temperature and latitude; stress index = 1 − min(1, precipitation ÷ ET₀). Not a measurement.',
  sm_smap:'SMAP morning surface soil moisture, 9 km pixel (m³/m³) – only days with a successful retrieval', sm_gwet:'MERRA-2 modeled surface soil wetness (0–1) – model estimate, not a satellite retrieval',
  sm_none:'No soil-moisture series available for this location.', ndvi_none:'NDVI series is bundled only for the pilot zones in this static build.', ndvi_note:'MODIS MOD13Q1, 250 m, every 16 days.',
  strat_title:'Rotation strategies compared', strat_note:'Fit scores are a transparent heuristic (farmer priorities + water availability + estimated aridity), not a yield or profit prediction. Agronomic attributes are general reference values.',
  fit:'Fit score', best:'Best fit', comp:'Priority fit {a} · water-availability adjustment {b} · aridity adjustment {c}', crops_t:'Example crops', ph_warn:'pH outside reference range',
  ev:'Supporting satellite evidence', ben:'Expected agronomic benefits', gaps:'Data gaps & resolution uncertainty', risks:'Risks requiring local farmer/agronomist validation',
  notes_title:'Farmer field observations', notes_ph:'Write what you see on the ground: soil crusting, irrigation schedule, pests, markets, local knowledge…',
  export_csv:'Export summary (CSV)', print:'Print report',
  f_sources:'Data used in this build', f_ext:'Additional NASA/partner datasets recommended for the next version (not yet ingested)',
  f_ai_t:'AI assistance disclosure', f_ai:'Parts of this code and documentation were generated with the assistance of an AI model (Anthropic Claude) and reviewed by the TerraSync Code team, in line with the NASA Space Apps Challenge 2026 rules on AI use.',
  f_disc:'Decision support only. It does not replace the judgment of the farmer or the advice of a local agronomist. NASA does not endorse this project.',
  ai_cls:['hyper-arid','arid','semi-arid','dry sub-humid','humid'],
  i_arid:'Aridity index (P ÷ ET₀)', i_p:'Mean annual precipitation', i_t:'Mean temperature', i_sm:'Soil moisture (mean)', i_ndvi:'NDVI (mean)', i_ph:'Soil pH (0–5 cm)', i_tex:'Soil texture', i_soc:'Organic carbon (0–5 cm)', i_frost:'Days with Tmin < 0 °C',
  na:'n/a', mm:'mm/yr',
  ev_arid:'Estimated aridity index {ai} ({cls}): ≈{p} mm precipitation vs ≈{et} mm reference ET₀ per year, from {n} days of NASA POWER data.',
  ev_smap:'SMAP surface soil moisture (9 km): mean {m} m³/m³ over {n} valid retrievals; {dry}% of them below 0.10 m³/m³.',
  ev_gwet:'MERRA-2 modeled surface wetness (0–1): mean {m}. This is a model estimate, not a satellite retrieval.',
  ev_ndvi:'MODIS NDVI (250 m, 16-day): mean {m}, range {min}–{max} (swing {amp}). One pixel mixes crops, bare soil and desert, so it cannot show what a single field was doing on a given date.',
  ev_soil:'SoilGrids (250 m), 0–5 / 15–30 cm: {tex} texture (sand {sand}%, silt {silt}%, clay {clay}%), pH {ph}, organic carbon {soc} g/kg.',
  ev_frost:'Reanalysis minimum temperature fell below 0 °C on {n} days and maximum exceeded 30 °C on {h} days (grid-cell values).',
  ev_x:'No {x} available for this location.', x_ndvi:'NDVI series', x_sm:'soil-moisture series', x_soil:'soil data', x_clim:'climate data',
  g_res:'Resolution mismatch: climate grid ≈ 0.5° × 0.625° (~50 km), SMAP ≈ 9 km, MODIS NDVI ≈ 250 m, SoilGrids ≈ 250 m. A farm plot (often < 5 ha) is far smaller than one pixel, so these are area averages, not plot measurements.',
  g_elev:'The climate grid cell is characterized by an elevation of about {e} m ({note}). If your plot is much higher or lower, real temperatures can differ by several °C (≈6.5 °C per km).',
  g_smapcov:'SMAP returned a valid value on only {v} of {n} days (≈{pct}%); the rest are retrieval gaps.',
  g_nosat:'No SMAP/NDVI series is bundled for this location (pilot zones only); surface wetness shown comes from a model.',
  g_s1:'Satellites cannot tell whether a particular field was bare or cropped on a date; ask the farmer for the real calendar.',
  g_s2:'Cover-crop biomass and nitrogen fixation are not observable with these datasets; they need field sampling.',
  g_s3:'SMAP sees only the top few centimetres; deep-root benefits depend on the local soil profile, which these data do not show.',
  g_rad:'The bundled NASA POWER file contains direct-normal irradiance (ALLSKY_SFC_SW_DNI) with missing days, not global radiation; radiation is not used in any calculation here.',
  r_ph:'Soil pH {ph} is above the reference range of: {list}.', r_water:'This strategy needs more water than the “{a}” availability you selected.',
  w_fallback:'The live NASA POWER request failed or timed out. The Moquegua Valley reference series is shown and does NOT describe this location.',
  w_soil:'Soil properties could not be retrieved for this location (SoilGrids unavailable).',
  w_live:'Climate data downloaded live from NASA POWER (MERRA-2/CERES).', w_pilot:'Pilot zone with preloaded data.',
  w_pilot_live:'This pilot zone has no climate file bundled; the data were downloaded live. Run ingest_data.py with internet access to bundle them.',
  meta:'Lat {lat}, Lon {lon} · {src}', yrs:'record: {a} to {b}',
  summary_title:'Farmer decision brief', summary_desc:'Top rotation: {strategy}. Crop screen: {green} favorable, {yellow} conditional, {red} high risk.',
  crop_board_title:'Crop suitability traffic-light board', crop_board_note:'Screening heuristic using approximate FAO-style general crop traits, SoilGrids pH, NASA POWER climate, and selected water availability. These are not field-calibrated recommendations or yield guarantees.',
  calendar_title:'Planting & rotation calendar', calendar_note:'Monthly screening is specific to the active crop’s general pH, frost, water, and cycle traits plus this site’s climate record. Validate dates and varieties locally.',
  calendar_unknown:'No monthly climate data', calendar_green:'Optimal sowing / active growth', calendar_yellow:'Conditional / irrigation or frost protection needed', calendar_red:'High frost, heat, or water risk · avoid sowing',
  calendar_precip:'Rainfall', benefit_label:'Why grow this? · Agronomic benefit',
  cal_reason_green:'Lower frost and water stress in the climate record.', cal_reason_yellow:'Check irrigation, soil moisture, and local frost dates.', cal_reason_red:'Avoid sowing without frost protection or dependable irrigation.',
  cal_reason_unknown:'No adequate monthly climate observations are available.',
  sequence_title:'Indicative rotation sequence', phase_sow:'Sowing window', phase_growth:'Growth and field monitoring', phase_harvest:'Indicative harvest window', phase_cover:'Cover crop / biological habitat',
  season_note:'Indicative climate-based windows only; crop-cycle timing and local calendars are not observed by these datasets.',
  forecast_title:'Climate & rotation predictive simulator', forecast_disclaimer:'Transparent Agro-Climatic Heuristic Projection derived from NASA POWER, SMAP, MODIS, and SoilGrids baselines — not a black-box guarantee.',
  forecast_note:'Illustrative indices, not measured soil health or predicted yield. Baseline continuously plants the selected crop; diversified rotation pairs it with a complementary crop. Approximate crop traits, pH fit, and fixed scenario rules drive the indices. Available SMAP and MODIS mixed-pixel baselines add small stress modifiers only. One cycle represents six months.',
  precip_scenario:'Precipitation scenario', temp_shift:'Temperature shift', irrigation_efficiency:'Irrigation efficiency', surface_flood:'Surface / flood (50%)', drip_tech:'Drip / technified (85%)',
  metric_soil:'Soil health & organic matter index (0–100)', metric_water:'Cumulative irrigation water saved (%)', metric_yield:'Yield stability score (0–100)',
  baseline:'Baseline monoculture', rotation:'Best-fit rotation', forecast_axis:'Heuristic index / percent',
  farm_title:'Registered farm records', farm_name:'Plot / farm name', farm_area:'Area (ha)', previous_crop:'Previous crop sown', sowing_date:'Sowing date', field_notes:'Observed soil / irrigation notes',
  save_record:'Save record', records_title:'Saved records', inspect:'Load / inspect', delete:'Delete', export_records_csv:'Export all CSV', export_records_json:'Export all JSON',
  no_records:'No farm records saved yet.', record_required:'Enter a plot name and a valid area (ha).', record_saved:'Farm record saved on this device.', record_deleted:'Farm record deleted.', confirm_delete:'Delete this farm record?',
  print_report_title:'Agro-climatic farm report', print_site:'Site', print_selected_data:'Selected analysis', print_priorities:'Selected priorities', print_water_availability:'Selected water availability', print_selected_crop:'Selected crop', print_crop_category:'Category', print_ph_range:'Reference pH range', print_temperature_thresholds:'Reference Tmin thresholds: caution {caution} °C · lethal {lethal} °C', print_temp_thresholds_label:'Crop temperature thresholds', print_water_need:'Reference water need', print_crop_cycle:'Reference cycle', months_unit:'months', print_crop_status:'Site suitability screen', print_crop_reasons:'Screening reasons and evidence', print_crop_benefit:'Agronomic benefit', print_best_strategy:'Best-fit rotation', print_strategy_score:'Heuristic fit score', print_saved_records:'Saved farm records', print_no_saved_records:'No farm records have been saved.', print_no_notes:'No field notes recorded.', print_generated:'Report generated', print_record_location:'Location',
  snapshot_title:'Attached site snapshot', record_detail:'Record details', top_strategy:'Top recommended strategy', record_saved_at:'Saved', crop_select:'Select a crop', all_records_empty:'There are no records to export.',
  elevation_site:'Ground elevation (m a.s.l.)', elevation_grid:'Reanalysis grid elevation', elevation_compare:'Site is {difference} m {direction} the climate grid cell ({grid} m).', elevation_above:'above', elevation_below:'below', elevation_same:'at',
  elevation_source:'Open-Meteo elevation API · Copernicus / SRTM 90 m DEM', elevation_missing:'Ground elevation could not be retrieved; climate-grid elevation is shown separately where available.',
  coverage_title:'Earth observation data coverage', coverage_active:'Active / ingested or live for this build', coverage_next:'Next phase · not yet ingested', coverage_power:'NASA POWER (MERRA-2 / CERES)', coverage_smap:'NASA SMAP L3 soil moisture', coverage_modis:'NASA Terra MODIS NDVI', coverage_soil:'ISRIC SoilGrids 2.0', coverage_dem:'Copernicus / SRTM 90 m DEM elevation (via Open-Meteo)',
  coverage_gpm:'NASA GPM IMERG', coverage_ecostress:'NASA ECOSTRESS', coverage_landsat:'NASA Landsat 8/9', coverage_sentinel:'ESA Sentinel-2', coverage_gldas:'NASA GLDAS', coverage_gaez:'FAO GAEZ', coverage_present:'Available at this site', coverage_partial:'Pilot sites only', coverage_absent:'Unavailable for this site',
  crop_benefit_quinoa:'Drought-tolerant Andean grain; diversifies food-crop income.', crop_benefit_alfalfa:'Deep-rooted forage and nitrogen fixer; perennial establishment uses substantial water.', crop_benefit_oregano:'Regional perennial herb with local-market potential and relatively low water demand.', crop_benefit_olive:'Drought-tolerant perennial tree crop; long establishment period before production.', crop_benefit_sorghum:'Heat- and drought-tolerant deep-rooted cereal or forage.', crop_benefit_faba:'Grain legume that fixes nitrogen and can support rotation diversity.', crop_benefit_maize:'Familiar valley crop with established uses; sensitive to water deficit.', crop_benefit_tarwi:'Andean legume with a deep taproot and biological nitrogen fixation.',
  crop_reason_ok:'Reference pH fits; selected water and climate indicators show no strong mismatch.', crop_reason_ph:'SoilGrids pH {ph} is outside the reference range {min}–{max}.', crop_reason_water:'Selected water availability may not meet this crop’s reference water demand.', crop_reason_aridity:'Estimated aridity ({ai}) is severe for the crop’s drought-tolerance reference.', crop_reason_frost:'NASA POWER reanalysis indicates about {days} frost days per year; protect frost-sensitive stages.', crop_reason_data:'Some required indicators are unavailable, so confidence is limited.',
  reason_label:'Why this status', evidence_label:'Evidence used', soil_ph_evidence:'SoilGrids pH: {value}', aridity_evidence:'Estimated P/ET₀: {value}', frost_evidence:'POWER frost days/year: {value}', water_evidence:'Selected water: {value}', crop_status_label:'Suitability',
  status_green:'Optimal / Safe to sow', status_yellow:'Caution / Manage carefully', status_red:'Not recommended / High risk', storage_error:'Could not save this record in browser storage.',
  month_names:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], cycle_label:'Year {year} · Cycle {cycle}', scenario_drought:'Severe drought', scenario_wet:'Wet year',
  crop_library_title:'Global crop library', crop_library_controls:'Crop library controls', crop_search_label:'Search crops', crop_search:'Search 30 crops by name…', category_filter_label:'Filter by category',
  crop_image_alt:'Original crop illustration: {name}', illustration_caption:'Original TerraSync illustration · no third-party image', custom_image_caption:'Original category illustration for a custom crop',
  category_all:'All', category_green:'Green only', category_cereals:'Cereals & pseudocereals', category_legumes:'Legumes & nitrogen fixers', category_roots:'Roots & tubers', category_perennials:'Perennials, fruits & trees', category_vegetables:'Vegetables & specialty',
  custom_add_title:'Add custom crop', custom_name:'Crop name (English)', custom_name_es:'Crop name (Spanish)', custom_category:'Category', custom_ph_min:'Minimum pH', custom_ph_max:'Maximum pH', custom_water:'Water need', custom_frost:'Frost sensitivity', custom_cycle:'Cycle (months)', custom_add:'Add crop',
  frost_sensitive:'Sensitive', frost_moderate:'Moderate', frost_tolerant:'Tolerant', crop_added:'Custom crop added to the library.', crop_invalid:'Check both crop names, pH range, and cycle length.', crop_no_results:'No crops match these filters.', crop_selected:'Active crop', crop_card_aria:'{name}, {status}. Select to update calendar and simulator.', custom_crop_benefit:'Custom crop. Screening traits are user-entered references, not verified crop advice.', simulate_calendar:'Simulate & Calendar', active_crop:'Active selected crop',
  crop_reference_note:'Approximate FAO-style general agronomic reference traits for initial screening only. Not field-calibrated recommendations, satellite observations, or yield guarantees.',
  calendar_sowing:'Sowing window', calendar_growth:'Vegetative growth', calendar_harvest:'Harvest window', calendar_rest:'Nitrogen-fixing cover / soil rest', calendar_temp:'Monthly mean minimum temperature', calendar_stress:'Water-stress indicator', calendar_crop_cycle:'Reference cycle: {months} months', year_offset:'(+{years} yr)',
  crop_frost_lethal:'Minimum temperature reaches the crop reference lethal threshold ({value} °C).', crop_frost_caution:'Minimum temperature is near the crop reference caution threshold ({value} °C).', crop_frost_evidence:'POWER days at/below lethal {lethalTemp} °C: {lethal}; at/below caution {cautionTemp} °C: {caution}.', crop_heat:'Monthly maximum temperature exceeds the general heat-screen threshold (38 °C).', crop_water_red:'Severe estimated water stress exceeds the screening threshold for this crop.', crop_water_yellow:'Estimated water stress may need supplemental irrigation for this crop.',
  forecast_selected:'Continuous {crop}', forecast_rotation:'{crop} + {partner} rotation', forecast_pair:'Complementary partner: {partner}', forecast_ph:'pH fit: {value}', forecast_nitrogen:'Nitrogen-fixing crop', forecast_non_nitrogen:'Does not fix nitrogen', forecast_recurrent_penalty:'Repeating the crop adds a small soil and stability penalty in this illustrative projection.',
  pm:{'Sandy loam':'Sandy loam'}
},
es: {
  view_dashboard:'Ver panel completo (todas las secciones)', guided_view:'Volver a los pasos guiados', welcome_kicker:'DECISIONES PARA EL CAMPO · PILOTO MOQUEGUA', welcome_title:'Cultiva resiliencia, una decisión a la vez.', welcome_subtitle:'Explora el clima, el suelo y las opciones de cultivo de tu parcela con datos de observación de la Tierra de NASA; convierte la evidencia en un plan de rotación práctico.', badge_nasa:'Datos satelitales NASA', badge_crops:'30 cultivos globales', badge_languages:'Inglés + español', start_analysis:'Iniciar análisis de la granja →', pilot_shortcuts:'Comienza con una granja piloto', pilot_moquegua:'Valle de Moquegua', pilot_samegua:'Samegua', pilot_torata:'Torata', pilot_omate:'Omate',
  step_location:'Ubicación y diagnóstico', step_climate:'Clima y agua', step_crops:'Cultivos y calendario', step_rotation:'Rotación y registro', previous_step:'← Anterior', next_step:'Paso siguiente →',
  tagline:'Rotación de cultivos y resiliencia del suelo con datos satelitales', h1:'¿Qué rotación hará más resiliente a esta granja?',
  lead:'Explora cómo los datos climáticos y satelitales de la NASA pueden orientar la rotación de cultivos y el manejo entre hileras. Empieza con un valle piloto de Moquegua (Perú) o haz clic en cualquier punto del mapa.',
  pilot_title:'Zonas piloto – Moquegua, Perú', pilot_hint:'Sitios de demostración calibrados con datos NASA precargados.',
  coords_title:'Cualquier granja del planeta', lat:'Latitud', lon:'Longitud', analyze:'Analizar esta ubicación', map_hint:'O haz clic en el mapa. Los datos en vivo vienen de NASA POWER e ISRIC SoilGrids.',
  prio_title:'Prioridades del agricultor', p_water:'Conservación de agua', p_soil:'Salud del suelo y control de erosión', p_market:'Mercado y diversificación de ingresos',
  avail_title:'Disponibilidad de agua', low:'Baja', medium:'Media', high:'Alta',
  loading:'Cargando datos NASA…', ready:'Análisis listo', err_coords:'Ingresa una latitud (-90 a 90) y longitud (-180 a 180) válidas.',
  ind_title:'Indicadores del sitio de un vistazo', charts_title:'Clima, humedad del suelo y estrés hídrico',
  c_temp:'Temperatura mensual (grilla de reanálisis)', c_sm:'Humedad del suelo', c_wb:'Balance hídrico mensual e índice de estrés hídrico', c_ndvi:'Verdor de la vegetación (NDVI)',
  wb_note:'Estimación derivada: ET₀ por el método Hargreaves-Samani con temperatura y latitud; índice de estrés = 1 − min(1, precipitación ÷ ET₀). No es una medición.',
  sm_smap:'Humedad superficial SMAP (mañana), píxel de 9 km (m³/m³) – solo días con recuperación exitosa', sm_gwet:'Humedad superficial modelada MERRA-2 (0–1) – estimación de modelo, no recuperación satelital',
  sm_none:'No hay serie de humedad del suelo para esta ubicación.', ndvi_none:'En esta versión estática la serie NDVI solo está incluida para las zonas piloto.', ndvi_note:'MODIS MOD13Q1, 250 m, cada 16 días.',
  strat_title:'Comparación de estrategias de rotación', strat_note:'Los puntajes son una heurística transparente (prioridades + disponibilidad de agua + aridez estimada), no una predicción de rendimiento ni de ganancias. Los atributos agronómicos son valores generales de referencia.',
  fit:'Puntaje de ajuste', best:'Mejor ajuste', comp:'Ajuste por prioridades {a} · ajuste por disponibilidad de agua {b} · ajuste por aridez {c}', crops_t:'Cultivos de ejemplo', ph_warn:'pH fuera del rango de referencia',
  ev:'Evidencia satelital de respaldo', ben:'Beneficios agronómicos esperados', gaps:'Vacíos de datos e incertidumbre de resolución', risks:'Riesgos que requieren validación local del agricultor/agrónomo',
  notes_title:'Observaciones de campo del agricultor', notes_ph:'Escribe lo que ves en campo: encostramiento, calendario de riego, plagas, mercados, conocimiento local…',
  export_csv:'Exportar resumen (CSV)', print:'Imprimir reporte',
  f_sources:'Datos usados en esta versión', f_ext:'Otros datos NASA/aliados recomendados para la siguiente versión (aún no ingeridos)',
  f_ai_t:'Declaración de asistencia de IA', f_ai:'Partes de este código y documentación fueron generadas con asistencia de un modelo de IA (Anthropic Claude) y revisadas por el equipo TerraSync Code, conforme a las reglas de uso de IA del NASA Space Apps Challenge 2026.',
  f_disc:'Solo apoyo a la decisión. No reemplaza el criterio del agricultor ni la asesoría de un agrónomo local. La NASA no respalda este proyecto.',
  ai_cls:['hiperárido','árido','semiárido','subhúmedo seco','húmedo'],
  i_arid:'Índice de aridez (P ÷ ET₀)', i_p:'Precipitación media anual', i_t:'Temperatura media', i_sm:'Humedad del suelo (media)', i_ndvi:'NDVI (media)', i_ph:'pH del suelo (0–5 cm)', i_tex:'Textura del suelo', i_soc:'Carbono orgánico (0–5 cm)', i_frost:'Días con Tmín < 0 °C',
  na:'n/d', mm:'mm/año',
  ev_arid:'Índice de aridez estimado {ai} ({cls}): ≈{p} mm de precipitación frente a ≈{et} mm de ET₀ de referencia por año, con {n} días de datos NASA POWER.',
  ev_smap:'Humedad superficial SMAP (9 km): media {m} m³/m³ en {n} recuperaciones válidas; {dry}% por debajo de 0.10 m³/m³.',
  ev_gwet:'Humedad superficial modelada MERRA-2 (0–1): media {m}. Es una estimación de modelo, no una recuperación satelital.',
  ev_ndvi:'NDVI MODIS (250 m, 16 días): media {m}, rango {min}–{max} (variación {amp}). Un píxel mezcla cultivos, suelo desnudo y desierto, por lo que no muestra qué hacía una parcela concreta en una fecha.',
  ev_soil:'SoilGrids (250 m), 0–5 / 15–30 cm: textura {tex} (arena {sand}%, limo {silt}%, arcilla {clay}%), pH {ph}, carbono orgánico {soc} g/kg.',
  ev_frost:'La temperatura mínima de reanálisis bajó de 0 °C en {n} días y la máxima superó 30 °C en {h} días (valores de la celda).',
  ev_x:'No hay {x} para esta ubicación.', x_ndvi:'serie NDVI', x_sm:'serie de humedad del suelo', x_soil:'datos de suelo', x_clim:'datos climáticos',
  g_res:'Diferencia de resolución: grilla climática ≈ 0.5° × 0.625° (~50 km), SMAP ≈ 9 km, NDVI MODIS ≈ 250 m, SoilGrids ≈ 250 m. Una parcela (a menudo < 5 ha) es mucho menor que un píxel, así que son promedios de área, no mediciones en parcela.',
  g_elev:'La celda climática se caracteriza por una elevación de unos {e} m ({note}). Si tu parcela está mucho más alta o baja, las temperaturas reales pueden diferir varios °C (≈6.5 °C por km).',
  g_smapcov:'SMAP devolvió un valor válido en solo {v} de {n} días (≈{pct}%); el resto son vacíos de recuperación.',
  g_nosat:'No hay serie SMAP/NDVI incluida para esta ubicación (solo zonas piloto); la humedad mostrada proviene de un modelo.',
  g_s1:'Los satélites no indican si un campo concreto estaba desnudo o cultivado en una fecha; pregunta al agricultor por el calendario real.',
  g_s2:'La biomasa de la cobertura y la fijación de nitrógeno no son observables con estos datos; requieren muestreo en campo.',
  g_s3:'SMAP solo ve unos centímetros superficiales; los beneficios de raíces profundas dependen del perfil de suelo local, que estos datos no muestran.',
  g_rad:'El archivo NASA POWER incluido contiene irradiancia directa normal (ALLSKY_SFC_SW_DNI) con días faltantes, no radiación global; la radiación no se usa en ningún cálculo aquí.',
  r_ph:'El pH del suelo {ph} supera el rango de referencia de: {list}.', r_water:'Esta estrategia necesita más agua que la disponibilidad «{a}» seleccionada.',
  w_fallback:'La consulta en vivo a NASA POWER falló o tardó demasiado. Se muestra la serie de referencia del Valle de Moquegua y NO describe esta ubicación.',
  w_soil:'No se pudieron obtener propiedades del suelo para esta ubicación (SoilGrids no disponible).',
  w_live:'Datos climáticos descargados en vivo de NASA POWER (MERRA-2/CERES).', w_pilot:'Zona piloto con datos precargados.',
  w_pilot_live:'Esta zona piloto no tiene archivo climático incluido; los datos se descargaron en vivo. Ejecuta ingest_data.py con internet para incluirlos.',
  meta:'Lat {lat}, Lon {lon} · {src}', yrs:'registro: {a} a {b}',
  summary_title:'Resumen para decidir en campo', summary_desc:'Rotación principal: {strategy}. Semáforo de cultivos: {green} favorables, {yellow} condicionales, {red} de alto riesgo.',
  crop_board_title:'Semáforo de aptitud de cultivos', crop_board_note:'Filtro heurístico con rasgos generales aproximados estilo FAO, pH SoilGrids, clima NASA POWER y disponibilidad de agua seleccionada. No son recomendaciones calibradas en campo ni garantías de rendimiento.',
  calendar_title:'Calendario de siembra y rotación', calendar_note:'El filtro mensual usa los rasgos generales de pH, heladas, agua y ciclo del cultivo activo junto con el registro climático del sitio. Valida fechas y variedades localmente.',
  calendar_unknown:'Sin datos climáticos mensuales', calendar_green:'Siembra óptima / crecimiento activo', calendar_yellow:'Condicional / requiere riego o protección contra heladas', calendar_red:'Riesgo alto de helada, calor o agua · evitar siembra',
  calendar_precip:'Precipitación', benefit_label:'¿Por qué sembrarlo? · Beneficio agronómico',
  cal_reason_green:'Menos heladas y estrés hídrico en el registro climático.', cal_reason_yellow:'Verifica riego, humedad del suelo y fechas locales de helada.', cal_reason_red:'Evita sembrar sin protección contra heladas o riego confiable.',
  cal_reason_unknown:'No hay observaciones climáticas mensuales suficientes.',
  sequence_title:'Secuencia de rotación indicativa', phase_sow:'Ventana de siembra', phase_growth:'Crecimiento y monitoreo del campo', phase_harvest:'Ventana indicativa de cosecha', phase_cover:'Cultivo de cobertura / hábitat biológico',
  season_note:'Ventanas climáticas indicativas; estos datos no observan ciclos del cultivo ni calendarios locales.',
  forecast_title:'Simulador climático y de rotación', forecast_disclaimer:'Proyección heurística agroclimática transparente derivada de líneas base NASA POWER, SMAP, MODIS y SoilGrids; no es una garantía de caja negra.',
  forecast_note:'Índices ilustrativos, no salud del suelo medida ni rendimiento predicho. La línea base siembra continuamente el cultivo seleccionado; la rotación diversificada lo combina con un cultivo complementario. Los índices usan rasgos generales aproximados, ajuste de pH y reglas de escenario fijas. Las líneas base SMAP y MODIS disponibles, con píxeles mixtos, solo añaden pequeños modificadores de estrés. Un ciclo equivale a seis meses.',
  precip_scenario:'Escenario de precipitación', temp_shift:'Cambio de temperatura', irrigation_efficiency:'Eficiencia de riego', surface_flood:'Superficial / inundación (50 %)', drip_tech:'Goteo / tecnificado (85 %)',
  metric_soil:'Índice de salud del suelo y materia orgánica (0–100)', metric_water:'Ahorro acumulado de agua de riego (%)', metric_yield:'Puntaje de estabilidad del rendimiento (0–100)',
  baseline:'Monocultivo de referencia', rotation:'Rotación de mejor ajuste', forecast_axis:'Índice heurístico / porcentaje',
  farm_title:'Registro histórico de parcelas', farm_name:'Nombre de parcela / granja', farm_area:'Área (ha)', previous_crop:'Cultivo sembrado anteriormente', sowing_date:'Fecha de siembra', field_notes:'Observaciones de suelo / riego',
  save_record:'Guardar registro', records_title:'Registros guardados', inspect:'Cargar / inspeccionar', delete:'Eliminar', export_records_csv:'Exportar todo a CSV', export_records_json:'Exportar todo a JSON',
  no_records:'Aún no hay registros de parcelas.', record_required:'Ingresa el nombre de la parcela y un área válida (ha).', record_saved:'Registro guardado en este dispositivo.', record_deleted:'Registro eliminado.', confirm_delete:'¿Eliminar este registro de parcela?',
  print_report_title:'Reporte agroclimático de la parcela', print_site:'Ubicación', print_selected_data:'Análisis seleccionado', print_priorities:'Prioridades seleccionadas', print_water_availability:'Disponibilidad de agua seleccionada', print_selected_crop:'Cultivo elegido', print_crop_category:'Categoría', print_ph_range:'Rango de pH de referencia', print_temperature_thresholds:'Umbrales Tmin de referencia: precaución {caution} °C · letal {lethal} °C', print_temp_thresholds_label:'Umbrales de temperatura del cultivo', print_water_need:'Necesidad de agua de referencia', print_crop_cycle:'Ciclo de referencia', months_unit:'meses', print_crop_status:'Filtro de aptitud para el sitio', print_crop_reasons:'Razones y evidencia del filtro', print_crop_benefit:'Beneficio agronómico', print_best_strategy:'Rotación de mejor ajuste', print_strategy_score:'Puntaje heurístico de ajuste', print_saved_records:'Registros de parcelas guardados', print_no_saved_records:'No hay registros de parcelas guardados.', print_no_notes:'Sin observaciones de campo registradas.', print_generated:'Reporte generado', print_record_location:'Ubicación',
  snapshot_title:'Resumen satelital adjunto', record_detail:'Detalle del registro', top_strategy:'Estrategia recomendada principal', record_saved_at:'Guardado', crop_select:'Selecciona un cultivo', all_records_empty:'No hay registros para exportar.',
  elevation_site:'Elevación del terreno (m s. n. m.)', elevation_grid:'Elevación de celda de reanálisis', elevation_compare:'El sitio está {difference} m {direction} de la celda climática ({grid} m).', elevation_above:'por encima', elevation_below:'por debajo', elevation_same:'a la altura',
  elevation_source:'API de elevación Open-Meteo · DEM Copernicus / SRTM de 90 m', elevation_missing:'No se pudo obtener la elevación del terreno; la elevación de la celda climática se muestra por separado si está disponible.',
  coverage_title:'Cobertura de observación de la Tierra', coverage_active:'Activo / integrado o consultado en vivo', coverage_next:'Siguiente fase · aún no integrado', coverage_power:'NASA POWER (MERRA-2 / CERES)', coverage_smap:'Humedad de suelo NASA SMAP L3', coverage_modis:'NDVI NASA Terra MODIS', coverage_soil:'ISRIC SoilGrids 2.0', coverage_dem:'DEM Copernicus / SRTM de 90 m (vía Open-Meteo)',
  coverage_gpm:'NASA GPM IMERG', coverage_ecostress:'NASA ECOSTRESS', coverage_landsat:'NASA Landsat 8/9', coverage_sentinel:'ESA Sentinel-2', coverage_gldas:'NASA GLDAS', coverage_gaez:'FAO GAEZ', coverage_present:'Disponible en este sitio', coverage_partial:'Solo sitios piloto', coverage_absent:'No disponible en este sitio',
  crop_benefit_quinoa:'Grano andino tolerante a sequía; diversifica el ingreso alimentario.', crop_benefit_alfalfa:'Forraje de raíz profunda y fijador de nitrógeno; su establecimiento perenne consume mucha agua.', crop_benefit_oregano:'Hierba perenne regional con potencial de mercado local y demanda de agua relativamente baja.', crop_benefit_olive:'Frutal perenne tolerante a sequía; requiere años de establecimiento antes de producir.', crop_benefit_sorghum:'Cereal o forraje de raíz profunda, tolerante al calor y la sequía.', crop_benefit_faba:'Leguminosa de grano que fija nitrógeno y favorece la diversidad de la rotación.', crop_benefit_maize:'Cultivo conocido del valle, con usos establecidos; sensible al déficit de agua.', crop_benefit_tarwi:'Leguminosa andina de raíz pivotante profunda y fijación biológica de nitrógeno.',
  crop_reason_ok:'El pH de referencia es compatible; agua e indicadores climáticos no muestran un desajuste fuerte.', crop_reason_ph:'El pH {ph} de SoilGrids está fuera del rango de referencia {min}–{max}.', crop_reason_water:'La disponibilidad de agua seleccionada puede no cubrir la demanda de referencia del cultivo.', crop_reason_aridity:'La aridez estimada ({ai}) es severa para la tolerancia a sequía de referencia del cultivo.', crop_reason_frost:'La reanálisis NASA POWER indica cerca de {days} días de helada al año; protege las etapas sensibles.', crop_reason_data:'Faltan algunos indicadores necesarios, por lo que la confianza es limitada.',
  reason_label:'Motivo del estado', evidence_label:'Evidencia utilizada', soil_ph_evidence:'pH SoilGrids: {value}', aridity_evidence:'P/ET₀ estimado: {value}', frost_evidence:'Días de helada/año POWER: {value}', water_evidence:'Agua seleccionada: {value}', crop_status_label:'Aptitud',
  status_green:'Óptimo / Apto para siembra', status_yellow:'Precaución / Requiere manejo', status_red:'No recomendado / Alto riesgo', storage_error:'No se pudo guardar el registro en el almacenamiento del navegador.',
  month_names:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'], cycle_label:'Año {year} · Ciclo {cycle}', scenario_drought:'Sequía severa', scenario_wet:'Año húmedo',
  crop_library_title:'Biblioteca global de cultivos', crop_library_controls:'Controles de la biblioteca de cultivos', crop_search_label:'Buscar cultivos', crop_search:'Buscar 30 cultivos por nombre…', category_filter_label:'Filtrar por categoría',
  crop_image_alt:'Ilustración original del cultivo: {name}', illustration_caption:'Ilustración original TerraSync · sin imagen de terceros', custom_image_caption:'Ilustración original de categoría para un cultivo personalizado',
  category_all:'Todos', category_green:'Solo verdes', category_cereals:'Cereales y pseudocereales', category_legumes:'Leguminosas y fijadoras de nitrógeno', category_roots:'Raíces y tubérculos', category_perennials:'Perennes, frutales y árboles', category_vegetables:'Hortalizas y especiales',
  custom_add_title:'Añadir cultivo personalizado', custom_name:'Nombre del cultivo (inglés)', custom_name_es:'Nombre del cultivo (español)', custom_category:'Categoría', custom_ph_min:'pH mínimo', custom_ph_max:'pH máximo', custom_water:'Necesidad de agua', custom_frost:'Sensibilidad a heladas', custom_cycle:'Ciclo (meses)', custom_add:'Añadir cultivo',
  frost_sensitive:'Sensible', frost_moderate:'Moderada', frost_tolerant:'Tolerante', crop_added:'Cultivo personalizado añadido a la biblioteca.', crop_invalid:'Revisa ambos nombres, el rango de pH y la duración del ciclo.', crop_no_results:'Ningún cultivo coincide con estos filtros.', crop_selected:'Cultivo activo', crop_card_aria:'{name}, {status}. Selecciona para actualizar el calendario y el simulador.', custom_crop_benefit:'Cultivo personalizado. Los rasgos de filtro son referencias ingresadas por el usuario, no asesoría de cultivo verificada.', simulate_calendar:'Simular y calendario', active_crop:'Cultivo seleccionado',
  crop_reference_note:'Rasgos agronómicos generales aproximados, estilo FAO, solo para filtro inicial. No son recomendaciones calibradas en campo, observaciones satelitales ni garantías de rendimiento.',
  calendar_sowing:'Ventana de siembra', calendar_growth:'Crecimiento vegetativo', calendar_harvest:'Ventana de cosecha', calendar_rest:'Cobertura fijadora de nitrógeno / descanso del suelo', calendar_temp:'Temperatura mínima media del mes', calendar_stress:'Indicador de estrés hídrico', calendar_crop_cycle:'Ciclo de referencia: {months} meses', year_offset:'(+{years} año/s)',
  crop_frost_lethal:'La temperatura mínima alcanza el umbral letal de referencia del cultivo ({value} °C).', crop_frost_caution:'La temperatura mínima se acerca al umbral de precaución de referencia ({value} °C).', crop_frost_evidence:'Días POWER en/por debajo del umbral letal {lethalTemp} °C: {lethal}; en/por debajo de precaución {cautionTemp} °C: {caution}.', crop_heat:'La temperatura máxima mensual supera el umbral general de filtro por calor (38 °C).', crop_water_red:'El estrés hídrico estimado supera el umbral de filtro severo para este cultivo.', crop_water_yellow:'El estrés hídrico estimado podría requerir riego suplementario para este cultivo.',
  forecast_selected:'Monocultivo continuo de {crop}', forecast_rotation:'Rotación de {crop} + {partner}', forecast_pair:'Complemento: {partner}', forecast_ph:'Ajuste de pH: {value}', forecast_nitrogen:'Cultivo fijador de nitrógeno', forecast_non_nitrogen:'No fija nitrógeno', forecast_recurrent_penalty:'La repetición del cultivo añade una pequeña penalización de suelo y estabilidad en esta proyección ilustrativa.',
  pm:{'Sandy loam':'Franco arenoso'}
}};
function crop(code,name_en,name_es,category,ph_min,ph_max,tmin_caution,tmin_lethal,water_need,cycle_months,n_fixer,drought_tolerant,benefit_en,benefit_es){
  return {code,name_en,name_es,category,ph_min,ph_max,tmin_caution,tmin_lethal,water_need,cycle_months,n_fixer,drought_tolerant,benefit_en,benefit_es,tmax_caution:38,custom:false};
}
const CROP_LIBRARY=[
  crop('quinoa','Quinoa','Quinua','cereals',6,8.5,2,-3,'medium',5,false,true,'Andean grain with useful drought tolerance and diverse food markets.','Grano andino con tolerancia útil a sequía y diversos mercados alimentarios.'),
  crop('maize','Maize','Maíz','cereals',5.5,8,10,3,'high',5,false,false,'Widely used grain and feed crop; irrigation planning is important.','Grano y forraje de uso extendido; es importante planificar el riego.'),
  crop('wheat','Wheat','Trigo','cereals',5.5,7.5,5,-5,'medium',5,false,true,'Adaptable staple grain with broad food and feed uses.','Grano básico adaptable con amplios usos alimentarios y forrajeros.'),
  crop('rice','Rice (upland / irrigated)','Arroz (secano / irrigado)','cereals',5.5,7,12,5,'high',5,false,false,'Important staple; upland and irrigated systems have very different water needs.','Alimento básico; el secano y el riego tienen necesidades de agua muy distintas.'),
  crop('barley','Barley','Cebada','cereals',6,8.5,3,-8,'low',5,false,true,'Cool-season grain with relatively low water need and broad end uses.','Grano de estación fresca, de necesidad de agua relativamente baja y usos diversos.'),
  crop('sorghum','Sorghum','Sorgo','cereals',5.5,8.5,12,5,'low',4,false,true,'Heat- and drought-adapted grain or forage crop.','Grano o forraje adaptado al calor y la sequía.'),
  crop('pearl-millet','Pearl millet','Mijo perla','cereals',5,8,12,5,'low',4,false,true,'Traditional dryland cereal suited to hot, low-rainfall regions.','Cereal tradicional de secano, apto para regiones cálidas y poco lluviosas.'),
  crop('oats','Oats','Avena','cereals',5,7.5,5,-7,'medium',5,false,false,'Cool-season grain and forage crop with flexible uses.','Grano y forraje de estación fresca con usos flexibles.'),
  crop('alfalfa','Alfalfa','Alfalfa','legumes',6.5,8.5,5,-5,'high',12,true,true,'Deep-rooted perennial forage that fixes nitrogen; water demand can be high.','Forraje perenne de raíz profunda que fija nitrógeno; puede demandar mucha agua.'),
  crop('faba','Faba bean','Haba','legumes',6,8,5,-5,'medium',5,true,false,'Protein-rich legume that fixes nitrogen and diversifies rotations.','Leguminosa rica en proteína que fija nitrógeno y diversifica rotaciones.'),
  crop('tarwi','Andean lupin (tarwi)','Tarwi','legumes',5,7.5,4,-4,'medium',6,true,true,'Andean nitrogen-fixing legume with a deep root system.','Leguminosa andina fijadora de nitrógeno y con sistema radical profundo.'),
  crop('soybean','Soybean','Soja','legumes',6,7.5,12,5,'high',4,true,false,'High-protein and oilseed legume that can fix nitrogen.','Leguminosa de alto contenido proteico y oleaginoso que puede fijar nitrógeno.'),
  crop('chickpea','Chickpea','Garbanzo','legumes',6,8,8,0,'low',4,true,true,'Drought-adapted pulse that supports protein production and rotation diversity.','Legumbre adaptada a sequía que aporta proteína y diversidad a la rotación.'),
  crop('lentil','Lentil','Lenteja','legumes',6,8,5,-4,'low',4,true,true,'Cool-season pulse with modest water needs and nitrogen fixation.','Legumbre de estación fresca, consumo moderado de agua y fijación de nitrógeno.'),
  crop('common-bean','Common bean','Frijol común','legumes',6,7.5,10,2,'medium',3,true,false,'Versatile food legume that contributes protein and can fix nitrogen.','Leguminosa alimentaria versátil que aporta proteína y puede fijar nitrógeno.'),
  crop('vetch','Common vetch','Vicia común','legumes',6,8,5,-5,'medium',4,true,true,'Cover-crop legume that fixes nitrogen and protects soil between cash crops.','Leguminosa de cobertura que fija nitrógeno y protege el suelo entre cultivos comerciales.'),
  crop('potato','Potato','Papa','roots',5,6.5,5,-2,'medium',4,false,false,'High-value tuber with broad food uses; performs best in cool conditions.','Tubérculo de valor alimentario amplio; suele rendir mejor en condiciones frescas.'),
  crop('sweet-potato','Sweet potato','Camote','roots',5.5,6.5,12,5,'medium',5,false,true,'Nutritious root crop with heat tolerance and flexible harvest use.','Raíz nutritiva tolerante al calor y con usos flexibles en cosecha.'),
  crop('cassava','Cassava (yuca)','Yuca','roots',5,7,12,8,'low',12,false,true,'Tropical starchy root crop that tolerates dry spells after establishment.','Raíz feculenta tropical que tolera periodos secos una vez establecida.'),
  crop('sugar-beet','Sugar beet','Remolacha azucarera','roots',6,8,5,-3,'high',6,false,false,'Cool-season root crop used for sugar and animal feed.','Raíz de estación fresca usada para azúcar y alimentación animal.'),
  crop('olive','Olive','Olivo','perennials',6,8.5,5,-5,'low',12,false,true,'Long-lived drought-adapted fruit tree with established oil markets.','Frutal longevo adaptado a sequía y con mercados establecidos para aceite.'),
  crop('avocado','Avocado','Aguacate','perennials',5.5,7,10,3,'high',12,false,false,'High-value fruit crop; establishment and reliable water supply are important.','Frutal de alto valor; son importantes el establecimiento y un suministro confiable de agua.'),
  crop('grapevine','Grapevine','Vid','perennials',5.5,7.5,5,-5,'low',12,false,true,'Perennial fruit with fresh-market and processing uses.','Frutal perenne para mercado fresco y transformación.'),
  crop('coffee','Coffee (Arabica)','Café (arábica)','perennials',5,6,12,5,'medium',12,false,false,'Shade-compatible perennial beverage crop with established global value chains.','Cultivo perenne de bebida compatible con sombra y cadenas globales establecidas.'),
  crop('cacao','Cacao','Cacao','perennials',6,7,18,12,'high',12,false,false,'Tropical perennial whose beans supply chocolate markets.','Cultivo tropical perenne cuyos granos abastecen mercados de chocolate.'),
  crop('citrus','Citrus (orange)','Cítricos (naranja)','perennials',5.5,7.5,8,0,'medium',12,false,true,'Perennial fruit crop with fresh, juice, and processing markets.','Frutal perenne con mercados de fruta fresca, jugo y transformación.'),
  crop('oregano','Oregano','Orégano','vegetables',6,8,5,-5,'low',12,false,true,'Regional perennial herb with culinary uses and local-market potential.','Hierba perenne regional de uso culinario y potencial de mercado local.'),
  crop('tomato','Tomato','Tomate','vegetables',6,7,10,3,'medium',4,false,false,'Versatile vegetable with fresh and processing markets.','Hortaliza versátil con mercados frescos y de transformación.'),
  crop('onion','Onion','Cebolla','vegetables',6,7,5,-3,'medium',5,false,false,'Widely used vegetable with storage and market flexibility.','Hortaliza de uso extendido, con flexibilidad de almacenamiento y mercado.'),
  crop('garlic','Garlic','Ajo','vegetables',6,7.5,5,-5,'low',6,false,true,'High-value specialty crop with culinary and storage uses.','Cultivo especializado de valor, uso culinario y buena conservación.')
];
const CROP_ART={quinoa:'grain',maize:'corn',wheat:'ear',rice:'rice',barley:'ear',sorghum:'panicle','pearl-millet':'grain',oats:'ear',alfalfa:'sprout',faba:'pod',tarwi:'pod',soybean:'bean-pod',chickpea:'beans',lentil:'beans','common-bean':'beans',vetch:'pod',potato:'tubers','sweet-potato':'root',cassava:'root','sugar-beet':'beet',olive:'olive',avocado:'avocado',grapevine:'grapes',coffee:'coffee',cacao:'cacao',citrus:'orange',oregano:'herb',tomato:'tomato',onion:'onion',garlic:'garlic'};
const CROP_CATEGORY_ART={cereals:'ear',legumes:'pod',roots:'tubers',perennials:'grapes',vegetables:'tomato'};
const TEX_ES={'Sand':'Arena','Loamy sand':'Arena franca','Sandy loam':'Franco arenoso','Loam':'Franco','Silt loam':'Franco limoso','Silt':'Limo','Sandy clay loam':'Franco arcillo-arenoso','Clay loam':'Franco arcilloso','Silty clay loam':'Franco arcillo-limoso','Sandy clay':'Arcillo-arenoso','Silty clay':'Arcillo-limoso','Clay':'Arcilla'};
const SOURCES_USED=['NASA POWER – MERRA-2 / CERES daily climate (power.larc.nasa.gov)','NASA SMAP L3 Enhanced Soil Moisture SPL3SMP_E v006, 9 km (via NASA AppEEARS)','MODIS MOD13Q1 v061 NDVI, 250 m, 16-day (via NASA AppEEARS; Terra MODIS)','ISRIC SoilGrids 2.0, 250 m (soilgrids.org)'];
const SOURCES_EXT='GPM IMERG (precipitation) · ECOSTRESS (land-surface temperature & evapotranspiration) · Landsat · SRTM (elevation/slope) · ESA Sentinel-2 · FAO GAEZ (agro-ecological suitability).';

let lang='en';
let currentStep=1;
const t=(k,v)=>{let s=(I18N[lang][k]??I18N.en[k]??k);if(v&&typeof s==='string')for(const x in v)s=s.replaceAll('{'+x+'}',v[x]);return s;};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=(x,d=2)=>x==null||Number.isNaN(x)?t('na'):Number(x).toFixed(d);
const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;

const S={data:null,site:null,ind:null,map:null,marker:null,charts:{},forecastCharts:{},printAnimations:new Map(),printPrepared:false,token:0,activeZone:null,activeCropId:null,cropFilter:'all',cropQuery:'',customCrops:[]};

function setGuidedStep(step,scroll=true){
  currentStep=Math.max(1,Math.min(4,step));
  document.body.classList.remove('full-dashboard');
  $('#welcomeView').hidden=true;
  $('#step1').hidden=false;
  $('#stepper').hidden=false;
  $('#stepNavigation').hidden=false;
  $('#dashboardToggle').setAttribute('aria-pressed','false');
  $('#dashboardToggle').textContent=t('view_dashboard');
  $('#step1').classList.toggle('active',currentStep===1);
  document.querySelectorAll('[data-step-content]').forEach(panel=>panel.classList.toggle('active',Number(panel.dataset.stepContent)===currentStep));
  document.querySelectorAll('[data-step-indicator]').forEach(item=>{
    const active=Number(item.dataset.stepIndicator)===currentStep;
    if(active)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');
    item.classList.toggle('complete',Number(item.dataset.stepIndicator)<currentStep);
  });
  $('#previousStep').disabled=currentStep===1;
  $('#nextStep').disabled=currentStep===4;
  requestAnimationFrame(()=>{
    if(currentStep===1&&S.map)S.map.invalidateSize();
    if(currentStep===2||currentStep===4){
      Object.values(S.charts).forEach(item=>item.resize());
      Object.values(S.forecastCharts).forEach(item=>item.resize());
    }
  });
  if(scroll)window.scrollTo({top:0,behavior:'smooth'});
}

function openFullDashboard(){
  const show=!document.body.classList.contains('full-dashboard');
  if(!show){setGuidedStep(currentStep);return;}
  document.body.classList.toggle('full-dashboard',show);
  $('#welcomeView').hidden=show;
  $('#step1').hidden=false;
  $('#stepper').hidden=true;
  $('#stepNavigation').hidden=true;
  $('#dashboardToggle').setAttribute('aria-pressed',String(show));
  $('#dashboardToggle').textContent=t(show?'guided_view':'view_dashboard');
  requestAnimationFrame(()=>{
    if(S.map)S.map.invalidateSize();
    Object.values(S.charts).forEach(item=>item.resize());
    Object.values(S.forecastCharts).forEach(item=>item.resize());
  });
}

function openPilot(slug){
  const zone=S.data.zones.find(item=>item.slug===slug);
  if(!zone)return;
  setGuidedStep(1,false);
  goTo(zone.lat,zone.lon,zone,11);
}

/* ---------- data helpers ---------- */
async function loadData(){
  window.MOQUEGUA_DATA=window.MOQUEGUA_DATA||window.TERRASYNC_DATA;
  if(window.MOQUEGUA_DATA)return window.MOQUEGUA_DATA;
  const r=await fetch('data/moquegua_data.json');if(!r.ok)throw new Error('Data bundle unavailable');return r.json();
}
async function fetchJSON(url,ms=20000){
  const c=new AbortController();const id=setTimeout(()=>c.abort(),ms);
  try{const r=await fetch(url,{signal:c.signal});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json();}finally{clearTimeout(id);}
}
async function livePower(lat,lon){
  const end=new Date(Date.now()-6*864e5);const e=end.toISOString().slice(0,10).replaceAll('-','');
  const u=`https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,RH2M,ALLSKY_SFC_SW_DWN,GWETTOP,GWETROOT&community=AG&longitude=${lon}&latitude=${lat}&start=20250101&end=${e}&format=JSON`;
  const j=await fetchJSON(u,25000);const par=j.properties.parameter;const keys=Object.keys(par);
  const dk=Object.keys(par[keys[0]]).sort();const vars={},units={};
  keys.forEach(k=>{vars[k]=dk.map(d=>par[k][d]===-999?null:par[k][d]);units[k]=(j.parameters[k]||{}).units;});
  return {power:{source:'NASA POWER (MERRA-2 / CERES) - live API',units,dates:dk.map(d=>`${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6)}`),vars},elev:(j.geometry.coordinates||[])[2]};
}
async function liveSoil(lat,lon){
  const u=`https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=clay&property=phh2o&property=sand&property=silt&property=soc&depth=0-5cm&depth=15-30cm&value=mean`;
  const j=await fetchJSON(u,25000);const map={clay:'clay_pct',sand:'sand_pct',silt:'silt_pct',phh2o:'ph',soc:'soc_g_kg'};const soil={};
  j.properties.layers.forEach(l=>{const k=map[l.name];if(!k)return;const df=l.unit_measure.d_factor||1;soil[k]={};l.depths.forEach(d=>{const v=d.values.mean;soil[k][d.label]=v==null?null:Math.round(v/df*100)/100;});});
  return soil;
}
async function liveElevation(lat,lon){
  const q=new URLSearchParams({latitude:String(lat),longitude:String(lon)});
  const j=await fetchJSON(`https://api.open-meteo.com/v1/elevation?${q}`,15000);
  const elevation=j.elevation?.[0];if(typeof elevation!=='number'||!Number.isFinite(elevation))throw new Error('Elevation unavailable');
  return elevation;
}

/* ---------- science helpers ---------- */
function texture(s,si,c){
  if(si+1.5*c<15)return 'Sand';
  if(si+1.5*c>=15&&si+2*c<30)return 'Loamy sand';
  if((c>=7&&c<20&&s>52&&si+2*c>=30)||(c<7&&si<50&&si+2*c>=30))return 'Sandy loam';
  if(c>=7&&c<27&&si>=28&&si<50&&s<=52)return 'Loam';
  if((si>=50&&c>=12&&c<27)||(si>=50&&si<80&&c<12))return 'Silt loam';
  if(si>=80&&c<12)return 'Silt';
  if(c>=20&&c<35&&si<28&&s>45)return 'Sandy clay loam';
  if(c>=27&&c<40&&s>20&&s<=45)return 'Clay loam';
  if(c>=27&&c<40&&s<=20)return 'Silty clay loam';
  if(c>=35&&s>45)return 'Sandy clay';
  if(c>=40&&si>=40)return 'Silty clay';
  if(c>=40)return 'Clay';
  return 'Loam';
}
const texName=n=>lang==='es'?(TEX_ES[n]||n):n;
function extraRad(latDeg,doy){
  const p=latDeg*Math.PI/180,dr=1+0.033*Math.cos(2*Math.PI*doy/365),d=0.409*Math.sin(2*Math.PI*doy/365-1.39);
  const x=Math.min(1,Math.max(-1,-Math.tan(p)*Math.tan(d)));const ws=Math.acos(x);
  return (24*60/Math.PI)*0.0820*dr*(ws*Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.sin(ws));
}
function doy(iso){const d=new Date(iso+'T00:00:00Z');return Math.round((d-Date.UTC(d.getUTCFullYear(),0,0))/864e5);}
function aridClass(ai){return ai<0.05?0:ai<0.2?1:ai<0.5?2:ai<0.65?3:4;}

function computeIndicators(site){
  const c=site.climate,v=c.vars,ind={monthly:[],n:0};
  const M={};let P=0,E=0,days=0,frost=0,hot=0,tm=[];
  c.dates.forEach((d,i)=>{
    const tx=v.T2M_MAX?.[i],tn=v.T2M_MIN?.[i],ta=v.T2M?.[i],p=v.PRECTOTCORR?.[i];
    if(tn!=null&&tn<0)frost++;if(tx!=null&&tx>30)hot++;
    if(ta!=null)tm.push(ta);
    if([tx,tn,ta,p].some(x=>x==null))return;
    const et=Math.max(0,0.0023*extraRad(site.lat,doy(d))*0.408*(ta+17.8)*Math.sqrt(Math.max(0,tx-tn)));
    const k=d.slice(0,7);const m=M[k]||(M[k]={k,p:0,et:0,n:0,tx:[],tn:[],ta:[]});
    m.p+=p;m.et+=et;m.n++;m.tx.push(tx);m.tn.push(tn);m.ta.push(ta);P+=p;E+=et;days++;
  });
  ind.monthly=Object.values(M).filter(m=>m.n>=15).map(m=>({k:m.k,p:m.p,et:m.et,tx:mean(m.tx),tn:mean(m.tn),ta:mean(m.ta),stress:m.et>0?1-Math.min(1,m.p/m.et):null}));
  ind.n=days;ind.pYear=days?P/(days/365.25):null;ind.etYear=days?E/(days/365.25):null;ind.ai=E>0?P/E:null;
  ind.tmean=mean(tm);ind.frost=frost;ind.frostPerYear=frost/Math.max(1,(new Date(c.dates[c.dates.length-1]+'T00:00:00Z')-new Date(c.dates[0]+'T00:00:00Z'))/864e5/365.25);ind.hot=hot;ind.range=[c.dates[0],c.dates[c.dates.length-1]];
  const sm=site.smap?.points||[];ind.smN=sm.length;ind.smTotal=site.smap?.total_days||null;
  ind.sm=sm.length?mean(sm.map(p=>p[1])):null;ind.smDry=sm.length?sm.filter(p=>p[1]<0.10).length/sm.length*100:null;
  const g=v.GWETTOP?v.GWETTOP.filter(x=>x!=null):[];ind.gwet=g.length?mean(g):null;
  const nd=(site.ndvi?.points||[]).map(p=>p[1]);
  if(nd.length){ind.ndvi=mean(nd);ind.ndMin=Math.min(...nd);ind.ndMax=Math.max(...nd);}
  const so=site.soil;
  if(so&&so.ph){const g0=k=>so[k]?.['0-5cm'];ind.ph0=g0('ph');ind.ph1=so.ph['15-30cm'];
    ind.sand=g0('sand_pct');ind.silt=g0('silt_pct');ind.clay=g0('clay_pct');ind.soc=g0('soc_g_kg');
    if([ind.sand,ind.silt,ind.clay].every(x=>x!=null))ind.tex=texture(ind.sand,ind.silt,ind.clay);}
  return ind;
}

/* ---------- scoring ---------- */
function priorities(){return [...document.querySelectorAll('input[name=prio]:checked')].map(x=>x.value);}
function availability(){return +document.querySelector('input[name=avail]:checked').value;}
function scoreAll(){
  const pr=priorities(),av=availability(),ai=S.ind.ai;
  return S.data.strategies.map(s=>{
    const vals=pr.map(p=>s['score_'+p]);const a=Math.round(mean(vals)/5*100);
    const b=s.water_demand>av?-15*(s.water_demand-av):0;
    let c=0;if(ai!=null&&ai<0.2){if(s.code==='S2')c=-5;if(s.code==='S3')c=5;}
    return {s,a,b,c,total:Math.max(0,Math.min(100,a+b+c))};
  });
}

/* ---------- UI text builders ---------- */
function evidence(code){
  const I=S.ind,L=[];
  const arid=()=>I.ai!=null?L.push(t('ev_arid',{ai:fmt(I.ai),cls:t('ai_cls')[aridClass(I.ai)],p:fmt(I.pYear,0),et:fmt(I.etYear,0),n:I.n})):L.push(t('ev_x',{x:t('x_clim')}));
  const sm=()=>I.sm!=null?L.push(t('ev_smap',{m:fmt(I.sm,3),n:I.smN,dry:fmt(I.smDry,0)})):I.gwet!=null?L.push(t('ev_gwet',{m:fmt(I.gwet)})):L.push(t('ev_x',{x:t('x_sm')}));
  const nd=()=>I.ndvi!=null?L.push(t('ev_ndvi',{m:fmt(I.ndvi),min:fmt(I.ndMin),max:fmt(I.ndMax),amp:fmt(I.ndMax-I.ndMin)})):L.push(t('ev_x',{x:t('x_ndvi')}));
  const so=()=>I.tex?L.push(t('ev_soil',{tex:texName(I.tex),sand:fmt(I.sand,1),silt:fmt(I.silt,1),clay:fmt(I.clay,1),ph:`${fmt(I.ph0,1)} / ${fmt(I.ph1,1)}`,soc:fmt(I.soc,1)+(S.site.soil.soc_g_kg['15-30cm']!=null?' / '+fmt(S.site.soil.soc_g_kg['15-30cm'],1):'')})):L.push(t('ev_x',{x:t('x_soil')}));
  const fr=()=>L.push(t('ev_frost',{n:I.frost,h:I.hot}));
  if(code==='S1'){nd();sm();so();}
  else if(code==='S2'){so();sm();nd();}
  else{arid();fr();sm();}
  return L;
}
function gaps(code){
  const I=S.ind,site=S.site,L=[t('g_res')];
  if(site.gridElevation!=null)L.push(t('g_elev',{e:fmt(site.gridElevation,0),note:site.elevNote||''}));
  if(I.smN)L.push(t('g_smapcov',{v:I.smN,n:I.smTotal,pct:fmt(I.smN/I.smTotal*100,0)}));
  else L.push(t('g_nosat'));
  L.push(t(code==='S1'?'g_s1':code==='S2'?'g_s2':'g_s3'));
  if(site.climate.vars.ALLSKY_SFC_SW_DNI&&code==='S3')L.push(t('g_rad'));
  return L;
}
function cropChips(s){
  const ph=S.ind.ph0;const bad=[];
  const chips=s.crops.map(cd=>{const c=S.data.crops.find(x=>x.code===cd);if(!c)return '';
    const out=ph!=null&&(ph>c.ph_max||ph<c.ph_min);if(out)bad.push(c['name_'+lang]);
    return `<span class="crop${out?' warn':''}"${out?` title="${esc(t('ph_warn'))}"`:''}>${out?'⚠ ':''}${esc(c['name_'+lang])}</span>`;}).join('');
  return {chips,bad};
}

/* ---------- render ---------- */
function siteName(){const s=S.site;return s.zone?s.zone['name_'+lang]:`${s.lat.toFixed(3)}, ${s.lon.toFixed(3)}`;}
function render(){
  if(!S.site)return;
  ensureActiveCrop();renderCropSelector();
  $('#results').hidden=false;
  const I=S.ind,site=S.site;
  $('#siteName').textContent=siteName();
  $('#siteMeta').textContent=t('meta',{lat:site.lat.toFixed(3),lon:site.lon.toFixed(3),src:site.climate.source})+' · '+t('yrs',{a:I.range[0],b:I.range[1]});
  const al=[];
  if(site.flags.includes('fallback'))al.push(['bad',t('w_fallback')]);
  if(site.flags.includes('nosoil'))al.push(['',t('w_soil')]);
  if(site.flags.includes('live'))al.push(['',site.zone?t('w_pilot_live'):t('w_live')]);
  if(site.flags.includes('pilot'))al.push(['',t('w_pilot')]);
  if(site.elevation==null)al.push(['',t('elevation_missing')]);
  $('#alerts').innerHTML=al.map(a=>`<div class="alert ${a[0]}">${esc(a[1])}</div>`).join('');
  const cards=[
    [t('i_arid'),fmt(I.ai),I.ai!=null?t('ai_cls')[aridClass(I.ai)]:''],
    [t('i_p'),I.pYear!=null?fmt(I.pYear,0)+' '+t('mm'):t('na'),''],
    [t('i_t'),I.tmean!=null?fmt(I.tmean,1)+' °C':t('na'),''],
    [t('i_frost'),I.frost,''],
    [t('i_sm'),I.sm!=null?fmt(I.sm,3)+' m³/m³ (SMAP)':I.gwet!=null?fmt(I.gwet)+' (MERRA-2)':t('na'),''],
    [t('i_ndvi'),I.ndvi!=null?fmt(I.ndvi):t('na'),''],
    [t('i_ph'),I.ph0!=null?fmt(I.ph0,1):t('na'),''],
    [t('elevation_site'),site.elevation!=null?fmt(site.elevation,0)+' m':t('na'),site.elevation!=null?t('elevation_source'):t('elevation_missing')],
    [t('i_tex'),I.tex?texName(I.tex):t('na'),I.soc!=null?t('i_soc')+': '+fmt(I.soc,1)+' g/kg':'']];
  $('#indicators').innerHTML=cards.map(c=>`<div class="card"><small>${esc(c[0])}</small><b>${esc(c[1])}</b><em>${esc(c[2])}</em></div>`).join('');
  const comparison=$('#elevationComparison');
  comparison.textContent=site.gridElevation==null?t('elevation_grid')+': '+t('na'):site.elevation==null?t('elevation_grid')+': '+fmt(site.gridElevation,0)+' m':t('elevation_compare',{difference:fmt(Math.abs(site.elevation-site.gridElevation),0),direction:site.elevation>site.gridElevation?t('elevation_above'):site.elevation<site.gridElevation?t('elevation_below'):t('elevation_same'),grid:fmt(site.gridElevation,0)});
  renderExecutive();renderCropBoard();renderCalendar();renderCharts();renderStrategies();renderSimulator();renderCoverage();renderFarmRecords();renderPrintReport();
}
function renderStrategies(){
  const sc=scoreAll();const best=Math.max(...sc.map(x=>x.total));const av=availability();
  const avName=[t('low'),t('medium'),t('high')][av-1].toLowerCase();
  $('#strategies').innerHTML=sc.map(({s,a,b,c,total})=>{
    const {chips,bad}=cropChips(s);
    const risks=s['risks_'+lang].slice();
    if(bad.length)risks.push(t('r_ph',{ph:fmt(S.ind.ph0,1),list:bad.join(', ')}));
    if(s.water_demand>av)risks.push(t('r_water',{a:avName}));
    const li=a=>a.map(x=>`<li>${esc(x)}</li>`).join('');
    return `<article class="strat"><h3>${esc(s['name_'+lang])}${total===best?`<span class="best">${esc(t('best'))}</span>`:''}</h3>
      <p class="d">${esc(s['desc_'+lang])}</p>
      <div class="score"><span>${esc(t('fit'))}</span><div class="bar"><i style="width:${total}%"></i></div><b>${total}</b></div>
      <p class="comp">${esc(t('comp',{a:a,b:b,c:c}))}</p>
      <h4>${esc(t('crops_t'))}</h4><div class="crops">${chips}</div>
      <h4>1. ${esc(t('ev'))}</h4><ul>${li(evidence(s.code))}</ul>
      <h4>2. ${esc(t('ben'))}</h4><ul>${li(s['benefits_'+lang])}</ul>
      <h4>3. ${esc(t('gaps'))}</h4><ul>${li(gaps(s.code))}</ul>
      <h4>4. ${esc(t('risks'))}</h4><ul>${li(risks)}</ul></article>`;}).join('');
}
const CUSTOM_CROP_KEY='terrasync_custom_crops_v1';
function loadCustomCrops(){
  try{const items=JSON.parse(localStorage.getItem(CUSTOM_CROP_KEY)||'[]');return Array.isArray(items)?items.filter(item=>item&&item.custom&&item.code&&item.name_en&&item.name_es):[];}catch(e){return [];}
}
function saveCustomCrops(){try{localStorage.setItem(CUSTOM_CROP_KEY,JSON.stringify(S.customCrops));return true;}catch(e){return false;}}
function allCrops(){return CROP_LIBRARY.concat(S.customCrops);}
function cropById(id){return allCrops().find(item=>item.code===id)||null;}
function activeCrop(){return cropById(S.activeCropId);}
function assessCrops(){
  const I=S.ind,av=availability();
  return allCrops().map(crop=>{
    const reasons=[],evidence=[];let status='green';
    const worsen=next=>{if(next==='red'||(next==='yellow'&&status==='green'))status=next;};
    if(I.ph0!=null){evidence.push(t('soil_ph_evidence',{value:fmt(I.ph0,1)}));if(I.ph0<crop.ph_min||I.ph0>crop.ph_max){reasons.push(t('crop_reason_ph',{ph:fmt(I.ph0,1),min:fmt(crop.ph_min,1),max:fmt(crop.ph_max,1)}));worsen('red');}}
    else{evidence.push(t('soil_ph_evidence',{value:t('na')}));reasons.push(t('crop_reason_data'));worsen('yellow');}
    if(I.ai!=null){evidence.push(t('aridity_evidence',{value:fmt(I.ai)}));if(I.ai<0.05&&!crop.drought_tolerant){reasons.push(t('crop_reason_aridity',{ai:fmt(I.ai)}));worsen('red');}else if(I.ai<0.2&&!crop.drought_tolerant){reasons.push(t('crop_reason_aridity',{ai:fmt(I.ai)}));worsen('yellow');}}
    else{evidence.push(t('aridity_evidence',{value:t('na')}));reasons.push(t('crop_reason_data'));worsen('yellow');}
    const tmin=S.site.climate.vars.T2M_MIN||[],lethalDays=tmin.filter(value=>value!=null&&value<=crop.tmin_lethal).length,cautionDays=tmin.filter(value=>value!=null&&value<=crop.tmin_caution).length;
    if(tmin.some(value=>value!=null)){evidence.push(t('crop_frost_evidence',{lethal:lethalDays,caution:cautionDays,lethalTemp:fmt(crop.tmin_lethal,1),cautionTemp:fmt(crop.tmin_caution,1)}));if(lethalDays>0){reasons.push(t('crop_frost_lethal',{value:fmt(crop.tmin_lethal,1)}));worsen('red');}else if(cautionDays>0){reasons.push(t('crop_frost_caution',{value:fmt(crop.tmin_caution,1)}));worsen('yellow');}}
    else evidence.push(t('crop_frost_evidence',{lethal:t('na'),caution:t('na'),lethalTemp:fmt(crop.tmin_lethal,1),cautionTemp:fmt(crop.tmin_caution,1)}));
    evidence.push(t('water_evidence',{value:[t('low'),t('medium'),t('high')][av-1]}));
    const need={low:1,medium:2,high:3}[crop.water_need]||2;
    if(need>av){reasons.push(t('crop_reason_water'));worsen(need===3&&av===1&&I.ai!=null&&I.ai<0.1?'red':'yellow');}
    if(!reasons.length)reasons.push(t('crop_reason_ok'));
    return {crop,status,reasons,evidence};
  });
}
function recommendedCrop(){
  const rank={green:0,yellow:1,red:2};
  return assessCrops().sort((a,b)=>rank[a.status]-rank[b.status]||({low:1,medium:2,high:3}[a.crop.water_need]-{low:1,medium:2,high:3}[b.crop.water_need])||Number(b.crop.drought_tolerant)-Number(a.crop.drought_tolerant))[0]||null;
}
function ensureActiveCrop(){if(!cropById(S.activeCropId))S.activeCropId=recommendedCrop()?.crop.code||CROP_LIBRARY[0].code;}
function selectActiveCrop(id){if(!cropById(id))return;S.activeCropId=id;renderCropSelector();renderCropBoard();renderCalendar();renderSimulator();}
function renderExecutive(){
  const assessed=assessCrops(),counts={green:0,yellow:0,red:0};assessed.forEach(x=>counts[x.status]++);
  const best=scoreAll().sort((a,b)=>b.total-a.total)[0];
  const topCrop=recommendedCrop();
  const host=$('#executiveSummary');if(!host)return;
  host.innerHTML=`<div class="executive-copy"><p class="eyebrow">${esc(t('summary_title'))}</p><h2>${esc(best.s['name_'+lang])}</h2><p>${esc(t('summary_desc',{strategy:best.s['name_'+lang],green:counts.green,yellow:counts.yellow,red:counts.red}))}</p></div><div class="executive-pick"><small>${esc(t('crop_status_label'))}</small><strong>${topCrop?esc(topCrop.crop['name_'+lang]):esc(t('na'))}</strong><span>${topCrop?esc(t('status_'+topCrop.status)):''}</span></div>`;
}
const CROP_ART_SHAPES={
  grain:'<g fill="#d5a840"><ellipse cx="198" cy="134" rx="8" ry="15" transform="rotate(-35 198 134)"/><ellipse cx="216" cy="118" rx="8" ry="15" transform="rotate(-28 216 118)"/><ellipse cx="237" cy="105" rx="8" ry="15" transform="rotate(-20 237 105)"/><ellipse cx="258" cy="98" rx="8" ry="15" transform="rotate(-12 258 98)"/><ellipse cx="278" cy="102" rx="8" ry="15" transform="rotate(12 278 102)"/><ellipse cx="296" cy="115" rx="8" ry="15" transform="rotate(27 296 115)"/><ellipse cx="313" cy="134" rx="8" ry="15" transform="rotate(38 313 134)"/><path d="M255 106v140" fill="none" stroke="#668449" stroke-width="7" stroke-linecap="round"/></g>',
  corn:'<g><path d="M250 74c-39 17-52 79-32 145 11 38 53 53 77 17 26-40 24-122-9-155-9-9-22-12-36-7Z" fill="#edc84f" stroke="#bc8d31" stroke-width="5"/><path d="M210 186c-48 12-55 51-76 79 48 4 79-10 103-45m56-15c44 12 55 42 79 68-45 8-77-4-102-35" fill="#6f9663" stroke="#4b7250" stroke-width="6" stroke-linejoin="round"/><g fill="#f7dc75">'+Array.from({length:6},(_,r)=>Array.from({length:4},(_,c)=>`<ellipse cx="${229+c*13+(r%2)*5}" cy="${111+r*18}" rx="5" ry="7"/>`).join('')).join('')+'</g></g>',
  ear:'<g fill="#c79b42" stroke="#9f7633" stroke-width="3"><path d="M250 246V97" fill="none" stroke="#668449" stroke-width="7" stroke-linecap="round"/><path d="M249 104c-33-10-47-33-49-54 25 4 43 15 52 37 10-25 28-37 52-41-3 27-21 49-54 58Z"/><ellipse cx="218" cy="127" rx="8" ry="15" transform="rotate(-38 218 127)"/><ellipse cx="282" cy="127" rx="8" ry="15" transform="rotate(38 282 127)"/><ellipse cx="215" cy="158" rx="8" ry="15" transform="rotate(-38 215 158)"/><ellipse cx="285" cy="158" rx="8" ry="15" transform="rotate(38 285 158)"/><ellipse cx="218" cy="189" rx="8" ry="15" transform="rotate(-38 218 189)"/><ellipse cx="282" cy="189" rx="8" ry="15" transform="rotate(38 282 189)"/></g>',
  rice:'<g fill="#f2e8c7" stroke="#c5a96c" stroke-width="3"><path d="M197 111c16-18 40-12 40 11s-26 56-39 70c-11-18-17-62-1-81Zm61-20c17-17 42-9 40 14s-32 53-47 64c-9-18-10-62 7-78Zm35 41c16-14 40-6 36 16s-36 49-53 57c-6-20 1-59 17-73Zm-88 51c18-12 39-2 32 19s-40 44-59 50c-3-21 9-58 27-69Z"/></g>',
  panicle:'<g fill="#b87636"><path d="M250 245c0-59 0-98 8-145" fill="none" stroke="#668449" stroke-width="7" stroke-linecap="round"/><path d="m253 140-48-48m47 70 65-68m-63 95-76-55m76 33 83-42m-86 69-53-19m53 13 62-4" fill="none" stroke="#8e682f" stroke-width="5" stroke-linecap="round"/><g>'+Array.from({length:16},(_,i)=>`<circle cx="${186+(i*37)%140}" cy="${99+(i*23)%100}" r="7"/>`).join('')+'</g></g>',
  sprout:'<g fill="#4f8d5b" stroke="#376d46" stroke-width="4"><path d="M250 242c-6-47-6-88 1-131" fill="none" stroke-width="8" stroke-linecap="round"/><path d="M248 176c-62 7-91-21-99-66 48-3 86 13 103 52m2-18c13-54 48-75 95-74-7 45-36 77-89 87m-10 49c-45 7-67-11-76-42 38-4 64 7 78 27m8-18c10-38 34-52 67-52-5 32-26 51-66 62"/></g>',
  pod:'<g><path d="M144 169c27-54 69-82 123-84 50-2 91 22 107 62-31 63-75 96-132 98-47 2-82-23-98-76Z" fill="#74a95f" stroke="#4e7d4c" stroke-width="6"/><path d="M172 170c49-43 113-64 176-27" fill="none" stroke="#b6cf8a" stroke-width="5" stroke-linecap="round"/><g fill="#c8a05b"><circle cx="207" cy="163" r="13"/><circle cx="247" cy="146" r="13"/><circle cx="286" cy="139" r="13"/><circle cx="324" cy="146" r="13"/></g></g>',
  'bean-pod':'<g><path d="M144 169c27-54 69-82 123-84 50-2 91 22 107 62-31 63-75 96-132 98-47 2-82-23-98-76Z" fill="#79a75d" stroke="#4e7d4c" stroke-width="6"/><path d="M172 170c49-43 113-64 176-27" fill="none" stroke="#b6cf8a" stroke-width="5" stroke-linecap="round"/><g fill="#d8c477"><ellipse cx="207" cy="163" rx="12" ry="15"/><ellipse cx="247" cy="146" rx="12" ry="15"/><ellipse cx="286" cy="139" rx="12" ry="15"/><ellipse cx="324" cy="146" rx="12" ry="15"/></g></g>',
  beans:'<g fill="#c39a58"><path d="M184 128c-26-18-50 13-38 39 15 33 51 24 54 0 2-16-3-31-16-39Zm62 53c-29-10-45 24-25 45 24 26 54 9 50-15-3-15-10-25-25-30Zm59-70c-27-15-49 17-34 41 18 29 53 17 52-7-1-15-6-27-18-34Z"/><path d="M155 103c16 9 27 9 36 2m25 111c16 8 28 8 39 1m34-122c14 8 26 8 37 1" fill="none" stroke="#8d673b" stroke-width="4" stroke-linecap="round"/></g>',
  tubers:'<g fill="#bd9b68" stroke="#8c704d" stroke-width="5"><path d="M145 153c2-32 34-49 73-36 28 9 38 43 17 67-24 27-91 15-90-31Zm129-29c5-32 41-43 69-21 25 20 17 55-12 69-34 16-62-15-57-48Zm-87 92c8-29 44-35 67-12 22 21 9 52-21 59-33 8-54-18-46-47Z"/><g fill="#8b704b" stroke="none"><circle cx="185" cy="139" r="4"/><circle cx="221" cy="174" r="4"/><circle cx="321" cy="133" r="4"/><circle cx="276" cy="223" r="4"/></g></g>',
  root:'<g><path d="M235 89c48-6 71 30 55 75-14 38-36 74-43 115-27-31-57-71-62-111-6-45 15-73 50-79Z" fill="#d29b62" stroke="#9d7048" stroke-width="6"/><path d="M249 94c-5-26-1-47 10-67m-20 58c-30-25-49-28-73-25m95 27c22-31 45-40 70-41m-90 35c-6-30-2-50 13-72" fill="none" stroke="#5d8a53" stroke-width="8" stroke-linecap="round"/></g>',
  beet:'<g><path d="M249 120c49-26 85 5 64 57-16 39-44 66-64 91-25-26-50-55-64-91-20-52 16-83 64-57Z" fill="#ba5256" stroke="#873d47" stroke-width="5"/><path d="M249 125c-35-43-32-66-22-90 27 13 40 39 32 78 15-45 38-57 64-58-4 36-25 63-69 82m-10-15c-31-31-57-33-78-24 13 31 39 48 82 43" fill="#62915a" stroke="#487449" stroke-width="5" stroke-linejoin="round"/></g>',
  olive:'<g fill="#789253"><ellipse cx="190" cy="159" rx="21" ry="31" transform="rotate(-35 190 159)"/><ellipse cx="239" cy="127" rx="21" ry="31" transform="rotate(20 239 127)"/><ellipse cx="287" cy="157" rx="21" ry="31" transform="rotate(-18 287 157)"/><ellipse cx="331" cy="131" rx="21" ry="31" transform="rotate(32 331 131)"/><path d="M156 208c52-63 117-101 191-108" fill="none" stroke="#50744a" stroke-width="7" stroke-linecap="round"/></g>',
  avocado:'<g><path d="M250 78c45 0 78 46 72 97-6 49-31 85-72 105-41-20-66-56-72-105-6-51 27-97 72-97Z" fill="#58804a" stroke="#426d42" stroke-width="6"/><path d="M250 112c26 0 47 29 43 61-4 31-20 55-43 70-23-15-39-39-43-70-4-32 17-61 43-61Z" fill="#a8ba65"/><circle cx="250" cy="197" r="23" fill="#81563b"/></g>',
  grapes:'<g fill="#75628d" stroke="#5b4b73" stroke-width="3"><circle cx="222" cy="128" r="25"/><circle cx="267" cy="125" r="25"/><circle cx="309" cy="142" r="25"/><circle cx="199" cy="170" r="25"/><circle cx="245" cy="170" r="25"/><circle cx="291" cy="178" r="25"/><circle cx="222" cy="211" r="25"/><circle cx="266" cy="215" r="25"/><circle cx="246" cy="253" r="22"/><path d="M252 102c-4-28 1-47 19-64m-19 31c-22-14-38-16-54-8" fill="none" stroke="#66844f" stroke-width="8" stroke-linecap="round"/></g>',
  coffee:'<g fill="#7b5136" stroke="#5d3c2b" stroke-width="3"><ellipse cx="190" cy="143" rx="22" ry="33" transform="rotate(25 190 143)"/><ellipse cx="242" cy="122" rx="22" ry="33" transform="rotate(-18 242 122)"/><ellipse cx="298" cy="145" rx="22" ry="33" transform="rotate(31 298 145)"/><ellipse cx="215" cy="201" rx="22" ry="33" transform="rotate(-25 215 201)"/><ellipse cx="270" cy="207" rx="22" ry="33" transform="rotate(18 270 207)"/><path d="M190 144c10-4 18-11 24-21m28 0c-8 9-13 18-14 28m69-6c8-5 14-13 18-22m-100 78c8-7 14-15 17-25m38 31c-5-10-7-19-6-29" fill="none" stroke="#d5a77c" stroke-width="4" stroke-linecap="round"/></g>',
  cacao:'<g><path d="M250 81c47-27 90 2 75 54-13 47-42 91-75 137-33-46-62-90-75-137-15-52 28-81 75-54Z" fill="#8d613e" stroke="#64472f" stroke-width="6"/><path d="M250 90v166m-30-151 30 25m29-25-29 25m-19 18 19 20m20-20-20 20m-20 22 20 20m20-20-20 20" fill="none" stroke="#bd9060" stroke-width="5" stroke-linecap="round"/></g>',
  orange:'<g><circle cx="220" cy="170" r="68" fill="#ef9a37" stroke="#ce6f28" stroke-width="6"/><circle cx="319" cy="175" r="53" fill="#f1a13d" stroke="#ce6f28" stroke-width="5"/><path d="M220 101c4-26 19-40 43-46m54 68c12-17 27-24 46-22" fill="none" stroke="#5e8a4d" stroke-width="9" stroke-linecap="round"/><path d="M222 113v114m-55-57h108m-91-39 76 77m0-77-76 77" stroke="#ffd178" stroke-width="5" opacity=".8"/></g>',
  herb:'<g fill="#5b9559" stroke="#477747" stroke-width="3"><path d="M247 250c1-71 8-129 25-183" fill="none" stroke-width="8" stroke-linecap="round"/><path d="M257 197c-54 0-78-24-79-59 41 0 67 15 81 44m2-37c9-41 33-61 69-62-3 35-23 56-68 70m-18 80c-42-5-60-23-58-52 32 5 52 19 62 40m25-51c8-31 29-46 57-47-2 27-18 44-57 56"/></g>',
  tomato:'<g><path d="M250 107c-24-21-51-13-57 5-33-11-61 12-61 46 0 55 41 91 118 91s118-36 118-91c0-34-28-57-61-46-6-18-33-26-57-5Z" fill="#d85e4e" stroke="#b54842" stroke-width="6"/><path d="m249 111 5-37m-5 46c-22-27-44-31-66-25 11 23 30 34 63 33m15-7c19-25 40-30 61-23-10 22-27 33-59 33" fill="#5c8c4c" stroke="#477342" stroke-width="5" stroke-linejoin="round"/></g>',
  onion:'<g><path d="M250 93c-53 31-82 72-76 116 5 42 35 64 76 64s71-22 76-64c6-44-23-85-76-116Z" fill="#c9a477" stroke="#a27a55" stroke-width="6"/><path d="M250 98c-9-35-3-59 15-82m-17 82c-31-33-56-42-80-37m97 38c24-35 49-47 75-44" fill="none" stroke="#688c55" stroke-width="8" stroke-linecap="round"/><path d="M225 138c-16 27-18 62-9 91m43-94c15 29 15 60 4 89" fill="none" stroke="#e1c59e" stroke-width="4"/></g>',
  garlic:'<g><path d="M250 117c-19-33-49-33-62-7-26 4-39 30-28 59-13 26-3 56 24 67 10 27 40 39 66 22 26 17 56 5 66-22 27-11 37-41 24-67 11-29-2-55-28-59-13-26-43-26-62 7Z" fill="#eee3ca" stroke="#c9b99a" stroke-width="6"/><path d="M250 116c-15-35-10-62 4-91m-4 95c-25-27-49-35-70-28m74 29c21-31 43-41 66-37m-80 54c-10 31-12 66-1 104m18-104c12 33 15 67 4 103" fill="none" stroke="#72915b" stroke-width="7" stroke-linecap="round"/><path d="M250 122v141" stroke="#d4c6a9" stroke-width="4"/></g>'
};
const CROP_ART_COLORS={cereals:['#f5edda','#d5a840'],legumes:['#e8efe3','#6f995b'],roots:['#f2e7dc','#bd8b5a'],perennials:['#e9eee2','#71854b'],vegetables:['#f5eadf','#d27748']};
function cropIllustration(crop){
  const [paper,accent]=CROP_ART_COLORS[crop.category]||CROP_ART_COLORS.vegetables;
  const shape=CROP_ART_SHAPES[CROP_ART[crop.code]||CROP_CATEGORY_ART[crop.category]]||CROP_ART_SHAPES.sprout;
  return `<svg class="crop-photo-image" viewBox="0 0 500 320" role="img" aria-label="${esc(t('crop_image_alt',{name:crop['name_'+lang]}))}" xmlns="http://www.w3.org/2000/svg"><rect width="500" height="320" fill="${paper}"/><path d="M0 263c83-33 150-23 233 4s157 20 267-17v70H0Z" fill="${accent}" opacity=".14"/><circle cx="90" cy="75" r="34" fill="${accent}" opacity=".1"/><circle cx="414" cy="83" r="21" fill="${accent}" opacity=".12"/><g>${shape}</g></svg>`;
}
function renderCropBoard(){
  const labels={green:t('status_green'),yellow:t('status_yellow'),red:t('status_red')};
  const query=S.cropQuery.trim().toLocaleLowerCase();
  const crops=assessCrops().filter(item=>(S.cropFilter==='all'||(S.cropFilter==='green'?item.status==='green':item.crop.category===S.cropFilter))&&(!query||`${item.crop.name_en} ${item.crop.name_es}`.toLocaleLowerCase().includes(query)));
  if(!crops.length){$('#cropBoard').innerHTML=`<p class="hint">${esc(t('crop_no_results'))}</p>`;return;}
  $('#cropBoard').innerHTML=crops.map(({crop,status,reasons,evidence})=>{
    const active=crop.code===S.activeCropId,benefit=crop[`benefit_${lang}`]||t('custom_crop_benefit');
    return `<article class="crop-card status-${status}${active?' selected':''}" data-crop-id="${esc(crop.code)}" tabindex="0" aria-label="${esc(t('crop_card_aria',{name:crop['name_'+lang],status:labels[status]}))}"${active?' aria-current="true"':''}><div class="crop-card-head"><span class="traffic-light ${status}" aria-hidden="true"></span><h3>${esc(crop['name_'+lang])}</h3><span class="status-pill ${status}">${esc(labels[status])}</span></div><span class="category-label">${esc(t('category_'+crop.category))}</span><figure class="crop-photo">${cropIllustration(crop)}<figcaption>${esc(crop.custom?t('custom_image_caption'):t('illustration_caption'))}</figcaption></figure><h4>${esc(t('benefit_label'))}</h4><p class="crop-benefit">${esc(benefit)}</p><h4>${esc(t('reason_label'))}</h4><ul>${reasons.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h4>${esc(t('evidence_label'))}</h4><ul>${evidence.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><button class="select-crop-pill" type="button" data-select-crop="${esc(crop.code)}">${esc(t('simulate_calendar'))}</button></article>`;
  }).join('');
  $('#cropBoard').querySelectorAll('.crop-card').forEach(card=>{
    card.addEventListener('click',event=>{if(!event.target.closest('button'))selectActiveCrop(card.dataset.cropId);});
    card.addEventListener('keydown',event=>{if(event.target===card&&(event.key==='Enter'||event.key===' ')){event.preventDefault();selectActiveCrop(card.dataset.cropId);}});
  });
  $('#cropBoard').querySelectorAll('[data-select-crop]').forEach(button=>button.addEventListener('click',()=>selectActiveCrop(button.dataset.selectCrop)));
}
function renderCropSelector(){
  const select=$('#activeCropSelect');if(!select)return;
  select.innerHTML=allCrops().map(crop=>`<option value="${esc(crop.code)}">${esc(crop['name_'+lang])}</option>`).join('');
  select.value=S.activeCropId;
}
function monthlyClimate(){
  const crop=activeCrop(),buckets=Array.from({length:12},()=>[]);
  S.ind.monthly.forEach(m=>{const month=Number(m.k.slice(5,7))-1;if(month>=0&&month<12)buckets[month].push(m);});
  return buckets.map((values,index)=>{
    if(!values.length)return {index,status:'unknown',reasons:[t('cal_reason_unknown')]};
    const tn=mean(values.map(x=>x.tn).filter(Number.isFinite)),tx=mean(values.map(x=>x.tx).filter(Number.isFinite)),stress=mean(values.map(x=>x.stress).filter(Number.isFinite)),precip=mean(values.map(x=>x.p).filter(Number.isFinite));
    const need={low:1,medium:2,high:3}[crop.water_need]||2,irrigation={1:-0.08,2:0,3:0.12}[availability()]||0;
    const stressLimit=({1:0.42,2:0.56,3:0.7}[need]||0.56)+irrigation,reasons=[];let status='green';
    const worsen=next=>{if(next==='red'||(next==='yellow'&&status==='green'))status=next;};
    if(tn!=null&&tn<=crop.tmin_lethal){reasons.push(t('crop_frost_lethal',{value:fmt(crop.tmin_lethal,1)}));worsen('red');}
    else if(tn!=null&&tn<=crop.tmin_caution){reasons.push(t('crop_frost_caution',{value:fmt(crop.tmin_caution,1)}));worsen('yellow');}
    if(tx!=null&&tx>=crop.tmax_caution){reasons.push(t('crop_heat'));worsen(tx>=42?'red':'yellow');}
    if(stress!=null&&stress>=Math.min(0.95,stressLimit+0.25)){reasons.push(t('crop_water_red'));worsen('red');}
    else if(stress!=null&&stress>stressLimit){reasons.push(t('crop_water_yellow'));worsen('yellow');}
    if(!reasons.length)reasons.push(t('cal_reason_green'));
    return {index,status,tn,tx,stress,precip,reasons};
  });
}
function renderCalendar(){
  const crop=activeCrop();if(!crop)return;
  const months=monthlyClimate(),names=t('month_names');
  const sow=months.findIndex(m=>m.status==='green'),fallback=months.findIndex(m=>m.status==='yellow'),start=sow>=0?sow:fallback;
  $('#plantingCalendar').innerHTML=months.map(m=>{
    const offset=start<0?-1:(m.index-start+12)%12,phase=offset===0?'calendar_sowing':offset>0&&offset<crop.cycle_months-1?'calendar_growth':offset===crop.cycle_months-1?'calendar_harvest':offset===crop.cycle_months?'calendar_rest':'';
    const climate=[m.tn==null?'':`${t('calendar_temp')}: ${fmt(m.tn,1)} °C`,m.precip==null?'':`${t('calendar_precip')}: ${fmt(m.precip,1)} mm`,m.stress==null?'':`${t('calendar_stress')}: ${fmt(m.stress,2)}`].filter(Boolean).join(' · ');
    return `<article class="month status-${m.status}${crop.code===S.activeCropId?'':''}" data-month="${m.index}"><strong>${esc(names[m.index])}</strong><span class="month-state">${esc(t(m.status==='unknown'?'calendar_unknown':'calendar_'+m.status))}</span>${phase?`<span class="month-phase">${esc(t(phase))}</span>`:''}<small>${esc(climate)}</small><small>${esc(m.reasons.join(' '))}</small></article>`;
  }).join('');
  $('#activeCropSelect').value=crop.code;
  $('#calendarCropCycle').textContent=t('calendar_crop_cycle',{months:crop.cycle_months});
  const host=$('#rotationSequence');
  if(start<0){host.innerHTML=`<p class="hint">${esc(t('calendar_unknown'))}</p>`;return;}
  const cover=allCrops().filter(item=>item.n_fixer&&item.code!==crop.code).sort((a,b)=>Number(assessCrops().find(x=>x.crop.code===a.code)?.status!=='green')-Number(assessCrops().find(x=>x.crop.code===b.code)?.status!=='green'))[0];
  const month=(offset)=>`${esc(names[(start+offset)%12])}${offset>=12?` ${esc(t('year_offset',{years:Math.floor(offset/12)}))}`:''}`;
  const growthEnd=Math.max(1,crop.cycle_months-2),range=growthEnd>1?`${month(1)}–${month(growthEnd)}`:month(1);
  host.innerHTML=`<p class="sequence-note">${esc(t('season_note'))}</p><ol class="sequence"><li><b>${esc(t('calendar_sowing'))}</b><span>${month(0)} · ${esc(crop['name_'+lang])}</span></li><li><b>${esc(t('calendar_growth'))}</b><span>${range} · ${esc(crop['name_'+lang])}</span></li><li><b>${esc(t('calendar_harvest'))}</b><span>${month(crop.cycle_months-1)} · ${esc(crop['name_'+lang])}</span></li><li><b>${esc(t('calendar_rest'))}</b><span>${month(crop.cycle_months)} · ${esc(cover?cover['name_'+lang]:t('soil_rest_only'))}</span></li></ol>`;
}
function forecastSeries(){
  const precipitation=Number($('#precipScenario').value),temperature=Number($('#tempScenario').value),efficiency=Number(document.querySelector('input[name=efficiency]:checked').value)/100;
  const selected=activeCrop(),assessed=assessCrops(),statusRank={green:0,yellow:1,red:2};
  const partner=allCrops().filter(item=>item.code!==selected.code).sort((a,b)=>{
    const aFit=assessed.find(item=>item.crop.code===a.code),bFit=assessed.find(item=>item.crop.code===b.code);
    const aRole=selected.n_fixer?(a.drought_tolerant&&!a.n_fixer):(a.n_fixer||a.drought_tolerant),bRole=selected.n_fixer?(b.drought_tolerant&&!b.n_fixer):(b.n_fixer||b.drought_tolerant);
    return Number(bRole)-Number(aRole)||statusRank[aFit.status]-statusRank[bFit.status]||Number(b.drought_tolerant)-Number(a.drought_tolerant)||({low:1,medium:2,high:3}[a.water_need]-{low:1,medium:2,high:3}[b.water_need]);
  })[0]||selected;
  const selectedStatus=assessed.find(item=>item.crop.code===selected.code)?.status||'yellow',partnerStatus=assessed.find(item=>item.crop.code===partner.code)?.status||'yellow';
  const phFit=S.ind.ph0==null?null:S.ind.ph0>=selected.ph_min&&S.ind.ph0<=selected.ph_max;
  const partnerPhFit=S.ind.ph0==null?null:S.ind.ph0>=partner.ph_min&&S.ind.ph0<=partner.ph_max;
  const soilStart=S.ind.soc==null?50:Math.max(20,Math.min(80,40+S.ind.soc*2));
  const baselineSoil=[soilStart],rotationSoil=[soilStart],baselineYield=[Math.max(10,50-(phFit===false?14:0))],rotationYield=[Math.max(10,55-(phFit===false?8:0)-(partnerPhFit===false?3:0))],saved=[0];
  let cumulativeSaved=0,cumulativeBaseline=0;
  const climateStress=Math.max(0,-precipitation/30+temperature/3*0.6+(S.ind.ai!=null&&S.ind.ai<0.2?0.25:0)+(S.ind.sm!=null&&S.ind.sm<0.1?0.2:0)+(S.ind.ndvi!=null&&S.ind.ndvi<0.2?0.1:0));
  const demandFactor={low:0.9,medium:1.55,high:2.35};
  const effectiveWater=crop=>Math.max(0.1,demandFactor[crop.water_need]*(1+temperature*0.06)*(1-precipitation/100)-Math.max(0,S.ind.ai??0.25)*0.15);
  const baselineDemand=effectiveWater(selected),rotationDemand=(effectiveWater(selected)+effectiveWater(partner))*0.5;
  const rotationSoilGain=0.3+(selected.n_fixer?0.15:0)+(partner.n_fixer?0.55:0)+(selectedStatus==='green'?0.15:0)-(phFit===false?0.25:0);
  const baselineSoilChange=(selected.n_fixer?0.05:-0.8)-(phFit===false?0.25:0);
  const droughtPenalty=crop=>crop.drought_tolerant?0.55:1.25;
  for(let cycle=1;cycle<=6;cycle++){
    const cycleBase=baselineDemand/efficiency,cycleRotation=rotationDemand/efficiency,cycleSaved=cycleBase-cycleRotation;
    cumulativeBaseline+=cycleBase;cumulativeSaved+=cycleSaved;
    saved.push(cumulativeBaseline?100*cumulativeSaved/cumulativeBaseline:0);
    baselineSoil.push(Math.max(0,Math.min(100,baselineSoil.at(-1)+baselineSoilChange-climateStress*0.5)));
    rotationSoil.push(Math.max(0,Math.min(100,rotationSoil.at(-1)+rotationSoilGain-climateStress*0.15)));
    baselineYield.push(Math.max(0,Math.min(100,baselineYield.at(-1)-1.2-climateStress*droughtPenalty(selected)-(phFit===false?0.7:0))));
    rotationYield.push(Math.max(0,Math.min(100,rotationYield.at(-1)-0.5-climateStress*(droughtPenalty(selected)+droughtPenalty(partner))/2-(partnerPhFit===false?0.3:0))));
  }
  return {labels:[t('baseline'),...Array.from({length:6},(_,i)=>t('cycle_label',{year:Math.floor(i/2)+1,cycle:i%2+1}))],baselineLabel:t('forecast_selected',{crop:selected['name_'+lang]}),rotationLabel:t('forecast_rotation',{crop:selected['name_'+lang],partner:partner['name_'+lang]}),selected,partner,selectedStatus,partnerStatus,phFit,baselineSoil,rotationSoil,waterSaved:saved,baselineWater:Array(7).fill(0),baselineYield,rotationYield,precipitation,temperature,efficiency};
}
function renderSimulator(){
  const output=$('#scenarioReadout');if(!output)return;
  const series=forecastSeries(),p=series.precipitation;
  $('#precipValue').textContent=`${p>0?'+':''}${p}% · ${p<=-30?t('scenario_drought'):p>=20?t('scenario_wet'):''}`;
  $('#tempValue').textContent=`+${fmt(series.temperature,1)} °C`;
  const labels=[t('metric_soil'),t('metric_water'),t('metric_yield')];output.textContent=`${t('active_crop')}: ${series.selected['name_'+lang]} · ${t('forecast_pair',{partner:series.partner['name_'+lang]})} · ${t('forecast_ph',{value:series.phFit==null?t('na'):series.phFit?t('status_green'):t('status_red')})} · ${series.selected.n_fixer?t('forecast_nitrogen'):t('forecast_non_nitrogen')} · ${labels[0]} · ${labels[1]} · ${labels[2]} · ${fmt(series.efficiency*100,0)}%`;
  if(typeof Chart==='undefined')return;
  const draw=(id,title,baseline,rotation,max)=>{
    if(S.forecastCharts[id])S.forecastCharts[id].destroy();
    S.forecastCharts[id]=new Chart(document.getElementById(id),{type:'line',data:{labels:series.labels,datasets:[{label:series.baselineLabel,data:baseline,borderColor:'#b45309',pointRadius:2,tension:.25},{label:series.rotationLabel,data:rotation,borderColor:'#15803d',pointRadius:2,tension:.25}]},options:{responsive:true,maintainAspectRatio:false,plugins:{title:{display:true,text:title},legend:{labels:{boxWidth:12,font:{size:11}}}},scales:{y:{min:id==='chForecastWater'?-50:0,max,ticks:{font:{size:10}}},x:{ticks:{font:{size:9},maxRotation:35}}}}});
  };
  draw('chForecastSoil',t('metric_soil'),series.baselineSoil,series.rotationSoil,100);
  draw('chForecastWater',t('metric_water'),series.baselineWater,series.waterSaved,100);
  draw('chForecastYield',t('metric_yield'),series.baselineYield,series.rotationYield,100);
}
function renderCoverage(){
  const site=S.site,active=[
    ['coverage_power',!!site.climate?.dates?.length,false],['coverage_smap',!!site.smap?.points?.length,true],['coverage_modis',!!site.ndvi?.points?.length,true],['coverage_soil',site.soil?.ph?.['0-5cm']!=null,false],['coverage_dem',site.elevation!=null,false]
  ];
  const next=['coverage_gpm','coverage_ecostress','coverage_landsat','coverage_sentinel','coverage_gldas','coverage_gaez'];
  $('#coverageActive').innerHTML=active.map(([key,present,partial])=>`<div class="coverage-item"><span class="coverage-dot ${present?'available':'unavailable'}"></span><span>${esc(t(key))}</span><small>${esc(t(present?(partial?'coverage_partial':'coverage_present'):'coverage_absent'))}</small></div>`).join('');
  $('#coverageNext').innerHTML=next.map(key=>`<div class="coverage-item planned"><span class="coverage-dot unavailable"></span><span>${esc(t(key))}</span><small>${esc(t('coverage_absent'))}</small></div>`).join('');
}
const RECORD_KEY='terrasync_farm_records_v1';
function farmRecords(){try{return JSON.parse(localStorage.getItem(RECORD_KEY)||'[]').filter(x=>x&&x.id);}catch(e){return [];}}
function saveFarmRecords(records){try{localStorage.setItem(RECORD_KEY,JSON.stringify(records));return true;}catch(e){return false;}}
function bestStrategy(){return scoreAll().sort((a,b)=>b.total-a.total)[0]?.s||null;}
function renderFarmRecords(){
  const records=farmRecords(),host=$('#savedRecords');if(!host)return;
  if(!records.length){host.innerHTML=`<p class="hint">${esc(t('no_records'))}</p>`;return;}
  host.innerHTML=records.slice().reverse().map(record=>`<article class="record-row"><div><strong>${esc(record.name)}</strong><small>${esc(record.area)} ha · ${esc(record.previousCrop||'—')} · ${esc(record.savedAt||'')}</small></div><div class="record-actions"><button class="btn record-inspect" type="button" data-record-id="${esc(record.id)}">${esc(t('inspect'))}</button><button class="btn record-delete" type="button" data-record-id="${esc(record.id)}">${esc(t('delete'))}</button></div></article>`).join('');
  host.querySelectorAll('.record-inspect').forEach(button=>button.addEventListener('click',()=>inspectRecord(button.dataset.recordId)));
  host.querySelectorAll('.record-delete').forEach(button=>button.addEventListener('click',()=>deleteRecord(button.dataset.recordId)));
}
function renderPrintReport(){
  if(!S.site||!S.ind)return;
  const crop=activeCrop(),assessment=assessCrops().find(item=>item.crop.code===crop.code),availabilityName=[t('low'),t('medium'),t('high')][availability()-1];
  const selectedPriorities=priorities().map(value=>t(`p_${value}`)).join(', ');
  const efficiency=Number(document.querySelector('input[name=efficiency]:checked').value)===85?t('drip_tech'):t('surface_flood');
  const generated=new Date().toLocaleString(lang==='es'?'es-PE':'en-US');
  const facts=[
    [t('print_site'),`${siteName()} · ${S.site.lat.toFixed(3)}, ${S.site.lon.toFixed(3)}`],
    [t('print_selected_crop'),crop['name_'+lang]],
    [t('print_priorities'),selectedPriorities||t('na')],
    [t('print_water_availability'),availabilityName],
    [t('precip_scenario'),`${Number($('#precipScenario').value)>0?'+':''}${$('#precipScenario').value}%`],
    [t('temp_shift'),`+${fmt(Number($('#tempScenario').value),1)} °C`],
    [t('irrigation_efficiency'),efficiency],
    [t('i_arid'),fmt(S.ind.ai)],
    [t('i_ph'),fmt(S.ind.ph0,1)],
    [t('print_generated'),generated]
  ];
  $('#printContextFacts').innerHTML=facts.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('');
  $('#printSelectedCrop').innerHTML=`<h2>${esc(t('print_selected_crop'))}</h2><article class="print-crop-card">${cropIllustration(crop)}<div class="print-crop-copy"><h3>${esc(crop['name_'+lang])}</h3><p><strong>${esc(t('print_crop_status'))}:</strong> ${esc(t('status_'+assessment.status))}</p><dl><div><dt>${esc(t('print_crop_category'))}</dt><dd>${esc(t('category_'+crop.category))}</dd></div><div><dt>${esc(t('print_ph_range'))}</dt><dd>${fmt(crop.ph_min,1)}–${fmt(crop.ph_max,1)}</dd></div><div><dt>${esc(t('print_temp_thresholds_label'))}</dt><dd>${esc(t('print_temperature_thresholds',{caution:fmt(crop.tmin_caution,1),lethal:fmt(crop.tmin_lethal,1)}))}</dd></div><div><dt>${esc(t('print_water_need'))}</dt><dd>${esc(t(crop.water_need))}</dd></div><div><dt>${esc(t('print_crop_cycle'))}</dt><dd>${crop.cycle_months} ${esc(t('months_unit'))}</dd></div></dl><h4>${esc(t('print_crop_benefit'))}</h4><p>${esc(crop[`benefit_${lang}`]||t('custom_crop_benefit'))}</p><h4>${esc(t('print_crop_reasons'))}</h4><ul>${assessment.reasons.concat(assessment.evidence).map(item=>`<li>${esc(item)}</li>`).join('')}</ul><p class="print-reference-note">${esc(t('crop_reference_note'))}</p></div></article>`;
  const best=scoreAll().sort((a,b)=>b.total-a.total)[0];
  $('#printSelectedStrategy').innerHTML=`<h2>${esc(t('print_best_strategy'))}</h2><article class="print-strategy"><h3>${esc(best.s['name_'+lang])}</h3><p>${esc(best.s['desc_'+lang])}</p><p><strong>${esc(t('print_strategy_score'))}:</strong> ${best.total}/100</p><ul>${best.s['benefits_'+lang].slice(0,3).map(item=>`<li>${esc(item)}</li>`).join('')}</ul></article>`;
  const records=farmRecords();
  $('#printSavedRecords').innerHTML=`<h2>${esc(t('print_saved_records'))}</h2>${records.length?records.map(record=>{
    const recordedCrop=cropById(record.previousCrop)?.[`name_${lang}`]||record.previousCrop||t('na'),snapshot=record.snapshot||{};
    return `<article class="print-record"><h3>${esc(record.name)}</h3><dl><div><dt>${esc(t('farm_area'))}</dt><dd>${esc(record.area)} ha</dd></div><div><dt>${esc(t('previous_crop'))}</dt><dd>${esc(recordedCrop)}</dd></div><div><dt>${esc(t('sowing_date'))}</dt><dd>${esc(record.sowingDate||t('na'))}</dd></div><div><dt>${esc(t('print_record_location'))}</dt><dd>${esc(fmt(snapshot.lat,3))}, ${esc(fmt(snapshot.lon,3))}</dd></div><div><dt>${esc(t('top_strategy'))}</dt><dd>${esc(snapshot.strategy||t('na'))}</dd></div><div><dt>${esc(t('i_arid'))}</dt><dd>${esc(fmt(snapshot.aridity))}</dd></div><div><dt>${esc(t('i_ph'))}</dt><dd>${esc(fmt(snapshot.ph,1))}</dd></div></dl><h4>${esc(t('field_notes'))}</h4><p>${esc(record.notes||t('print_no_notes'))}</p></article>`;
  }).join(''):`<p>${esc(t('print_no_saved_records'))}</p>`}`;
}
function resizeChartsForPrint(){
  const charts=[...Object.values(S.charts),...Object.values(S.forecastCharts)];
  charts.forEach(item=>{if(!S.printAnimations.has(item))S.printAnimations.set(item,item.options.animation);item.options.animation=false;item.resize();item.update('none');});
}
function renderPrintChartImages(){
  const climate=[['chTemp','c_temp'],['chSM','c_sm'],['chWB','c_wb'],['chNDVI','c_ndvi']];
  const forecast=[['chForecastSoil','metric_soil'],['chForecastWater','metric_water'],['chForecastYield','metric_yield']];
  const renderGroup=(charts,selector)=>{
    $(selector).innerHTML=charts.map(([id,label])=>{
      const canvas=document.getElementById(id),instance=Chart.getChart(canvas);if(!instance)return '';
      const container=canvas.closest('.cv'),bounds=container.getBoundingClientRect();
      if(bounds.width<1||bounds.height<1)return '';
      instance.resize();instance.update('none');
      const image=instance.toBase64Image('image/png',1);
      return `<figure><figcaption>${esc(t(label))}</figcaption><img src="${image}" alt="${esc(t(label))}"></figure>`;
    }).join('');
  };
  if(typeof Chart==='undefined')return;
  document.body.classList.add('rendering-print-charts');resizeChartsForPrint();
  renderGroup(climate,'#printClimateCharts');renderGroup(forecast,'#printForecastCharts');
  document.body.classList.remove('rendering-print-charts');
}
function preparePrintReport(){
  document.body.classList.add('printing-report');renderPrintReport();resizeChartsForPrint();renderPrintChartImages();
}
async function waitForPrintImages(){
  const images=[...document.querySelectorAll('#printClimateCharts img,#printForecastCharts img')];
  await Promise.all(images.map(image=>image.decode().catch(()=>null)));
}
function restoreChartsAfterPrint(){
  document.body.classList.remove('printing-report');$('#printClimateCharts').replaceChildren();$('#printForecastCharts').replaceChildren();S.printPrepared=false;
  S.printAnimations.forEach((animation,item)=>{if(item.canvas?.isConnected){item.options.animation=animation;item.resize();item.update('none');}});S.printAnimations.clear();
}
async function printReport(){
  preparePrintReport();
  await waitForPrintImages();
  S.printPrepared=true;
  window.print();
}
function inspectRecord(id){
  const record=farmRecords().find(item=>item.id===id);if(!record)return;
  $('#recordName').value=record.name;$('#recordArea').value=record.area;$('#recordCrop').value=record.previousCrop||'';$('#recordSowingDate').value=record.sowingDate||'';$('#recordNotes').value=record.notes||'';
  const snapshot=record.snapshot||{};
  $('#recordInspection').innerHTML=`<h3>${esc(t('record_detail'))}: ${esc(record.name)}</h3><p>${esc(t('snapshot_title'))}: ${esc(t('meta',{lat:fmt(snapshot.lat,3),lon:fmt(snapshot.lon,3),src:snapshot.source||t('na')}))}</p><p>${esc(t('i_arid'))}: ${esc(fmt(snapshot.aridity))} · ${esc(t('i_ph'))}: ${esc(fmt(snapshot.ph,1))} · ${esc(t('top_strategy'))}: ${esc(snapshot.strategy||t('na'))}</p>`;
}
function saveFarmRecord(){
  if(!S.site)return;
  const name=$('#recordName').value.trim(),area=Number($('#recordArea').value);
  if(!name||!Number.isFinite(area)||area<=0){setStatus(t('record_required'));return;}
  const strategy=bestStrategy(),record={id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`,name,area,previousCrop:$('#recordCrop').value,sowingDate:$('#recordSowingDate').value,notes:$('#recordNotes').value.trim(),savedAt:new Date().toISOString(),snapshot:{lat:S.site.lat,lon:S.site.lon,aridity:S.ind.ai,ph:S.ind.ph0,strategy:strategy?.['name_'+lang]||null,strategyCode:strategy?.code||null,elevation:S.site.elevation,source:S.site.climate.source}};
  const records=farmRecords();records.push(record);if(!saveFarmRecords(records)){setStatus(t('storage_error'));return;}
  setStatus(t('record_saved'));renderFarmRecords();
}
function deleteRecord(id){
  if(!window.confirm(t('confirm_delete')))return;
  saveFarmRecords(farmRecords().filter(record=>record.id!==id));$('#recordInspection').textContent='';renderFarmRecords();setStatus(t('record_deleted'));
}
function downloadFile(filename,content,type){
  const url=URL.createObjectURL(new Blob([content],{type})),link=document.createElement('a');link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportFarmRecords(format){
  const records=farmRecords();if(!records.length){setStatus(t('all_records_empty'));return;}
  if(format==='json'){downloadFile('terrasync_farm_records.json',JSON.stringify(records,null,2),'application/json');return;}
  const columns=['name','area','previousCrop','sowingDate','notes','savedAt','latitude','longitude','aridityIndex','soilPH','topStrategy'];
  const rows=[columns,...records.map(r=>[r.name,r.area,r.previousCrop,r.sowingDate,r.notes,r.savedAt,r.snapshot?.lat,r.snapshot?.lon,r.snapshot?.aridity,r.snapshot?.ph,r.snapshot?.strategy])];
  downloadFile('terrasync_farm_records.csv','\ufeff'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');
}
function chart(id,cfg){if(S.charts[id])S.charts[id].destroy();S.charts[id]=new Chart(document.getElementById(id),cfg);}
function renderCharts(){
  if(typeof Chart==='undefined')return;
  const I=S.ind,site=S.site,m=I.monthly,labels=m.map(x=>x.k);
  const base={responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{boxWidth:12,font:{size:11}}}},scales:{x:{ticks:{maxTicksLimit:8,font:{size:10}}}}};
  chart('chTemp',{type:'line',data:{labels,datasets:[
    {label:'Tmax (°C)',data:m.map(x=>x.tx),borderColor:'#c4574a',pointRadius:0,tension:.3},
    {label:'Tmean (°C)',data:m.map(x=>x.ta),borderColor:'#1f4d36',pointRadius:0,tension:.3},
    {label:'Tmin (°C)',data:m.map(x=>x.tn),borderColor:'#2563a6',pointRadius:0,tension:.3}]},options:base});
  let smLabels=[],smData=[],smTitle='';
  if(site.smap?.points?.length){smLabels=site.smap.points.map(p=>p[0]);smData=site.smap.points.map(p=>p[1]);smTitle=t('sm_smap');}
  else if(site.climate.vars.GWETTOP){const idx=site.climate.dates.map((d,i)=>i).filter(i=>site.climate.vars.GWETTOP[i]!=null&&i%3===0);smLabels=idx.map(i=>site.climate.dates[i]);smData=idx.map(i=>site.climate.vars.GWETTOP[i]);smTitle=t('sm_gwet');}
  $('#smNote').textContent=smData.length?smTitle:t('sm_none');
  chart('chSM',{type:'line',data:{labels:smLabels,datasets:[{label:smTitle||'—',data:smData,borderColor:'#2563a6',backgroundColor:'#dbe9f7',fill:true,pointRadius:1.5,tension:.2}]},options:{...base,plugins:{legend:{display:false}}}});
  chart('chWB',{data:{labels,datasets:[
    {type:'bar',label:'P (mm)',data:m.map(x=>x.p),backgroundColor:'#6fb1e6',yAxisID:'y'},
    {type:'line',label:'ET₀ (mm)',data:m.map(x=>x.et),borderColor:'#8a6a45',pointRadius:0,tension:.3,yAxisID:'y'},
    {type:'line',label:lang==='es'?'Índice de estrés':'Stress index',data:m.map(x=>x.stress),borderColor:'#c4574a',borderDash:[5,3],pointRadius:2,yAxisID:'y2'}]},
    options:{...base,scales:{x:base.scales.x,y:{title:{display:true,text:'mm'}},y2:{position:'right',min:0,max:1,grid:{drawOnChartArea:false}}}}});
  const nd=site.ndvi?.points||[];
  $('#ndviNote').textContent=nd.length?t('ndvi_note'):t('ndvi_none');
  chart('chNDVI',{type:'line',data:{labels:nd.map(p=>p[0]),datasets:[{label:'NDVI',data:nd.map(p=>p[1]),borderColor:'#3f7d58',backgroundColor:'#3f7d5833',fill:true,pointRadius:2,tension:.25}]},options:{...base,plugins:{legend:{display:false}},scales:{x:base.scales.x,y:{min:0,max:1}}}});
}

/* ---------- analysis ---------- */
function setStatus(msg,on=true){const s=$('#status');s.textContent=msg;s.classList.toggle('on',on&&!!msg);}
async function analyze(lat,lon,zone){
  const tok=++S.token;setStatus(t('loading'));
  const elevationRequest=liveElevation(lat,lon).catch(()=>null);
  const site={lat,lon,zone:zone||null,flags:[],climate:null,soil:null,smap:zone?.smap||null,ndvi:zone?.ndvi||null,elevation:null,gridElevation:null,elevNote:''};
  const ref=S.data.zones.find(z=>z.slug==='valle-moquegua');
  if(zone?.power){site.climate=zone.power;site.gridElevation=zone.elevation_m;site.elevNote=zone.elevation_note||'';site.flags.push('pilot');}
  else{
    try{const r=await livePower(lat,lon);site.climate=r.power;site.gridElevation=r.elev;site.elevNote='NASA POWER';site.flags.push('live');}
    catch(e){site.climate=ref.power;site.gridElevation=ref.elevation_m;site.elevNote=ref.elevation_note||'';site.smap=null;site.ndvi=null;site.flags.push('fallback');}
  }
  if(zone?.soil)site.soil=zone.soil;
  else if(!site.flags.includes('fallback')){try{site.soil=await liveSoil(lat,lon);}catch(e){}}
  else site.soil=null;
  site.elevation=await elevationRequest;
  if(!site.soil||!site.soil.ph)site.flags.push('nosoil');
  if(tok!==S.token)return;
  S.site=site;S.ind=computeIndicators(site);render();setStatus(t('ready'));setTimeout(()=>setStatus('',false),1800);
  if(window.innerWidth<1000)$('#results').scrollIntoView({behavior:'smooth'});
}
function goTo(lat,lon,zone,zoom){
  $('#lat').value=lat;$('#lon').value=lon;S.activeZone=zone?zone.slug:null;
  document.querySelectorAll('.chip').forEach(b=>b.classList.toggle('on',b.dataset.slug===S.activeZone));
  if(S.map){if(S.marker)S.marker.setLatLng([lat,lon]);else S.marker=L.marker([lat,lon]).addTo(S.map);S.map.setView([lat,lon],zoom||Math.max(S.map.getZoom(),8));}
  analyze(lat,lon,zone);
}

/* ---------- export ---------- */
function csvCell(x){const raw=String(x??''),s=typeof x==='string'&&/^[\t\r ]*[=+\-@]/.test(raw)?"'"+raw:raw;return /[",\n]/.test(s)?'"'+s.replaceAll('"','""')+'"':s;}
function exportCSV(){
  if(!S.site)return;const I=S.ind,site=S.site,rows=[['section','item','value']];
  rows.push(['site','name',siteName()],['site','latitude',site.lat],['site','longitude',site.lon],['site','climate_source',site.climate.source],['site','flags',site.flags.join('|')]);
  rows.push(['inputs','priorities',priorities().join('|')],['inputs','water_availability(1=low,3=high)',availability()]);
  [['aridity_index',I.ai],['mean_annual_precip_mm',I.pYear],['mean_annual_ET0_mm_estimated',I.etYear],['mean_temp_C',I.tmean],['days_Tmin_below_0C',I.frost],['smap_mean_m3m3',I.sm],['smap_valid_days',I.smN],['gwettop_mean',I.gwet],['ndvi_mean',I.ndvi],['soil_ph_0-5cm',I.ph0],['soil_ph_15-30cm',I.ph1],['soil_texture',I.tex],['soil_soc_g_kg_0-5cm',I.soc]].forEach(r=>rows.push(['indicator',r[0],r[1]==null?'':(typeof r[1]==='number'?+r[1].toFixed(4):r[1])]));
  scoreAll().forEach(x=>{const s=x.s,n=s['name_'+lang];rows.push(['strategy',n+' | fit_score',x.total],['strategy',n+' | breakdown',`priority ${x.a}; water ${x.b}; aridity ${x.c}`]);
    evidence(s.code).forEach(e=>rows.push(['evidence',n,e]));s['benefits_'+lang].forEach(e=>rows.push(['benefit',n,e]));gaps(s.code).forEach(e=>rows.push(['data_gap',n,e]));s['risks_'+lang].forEach(e=>rows.push(['risk',n,e]));});
  rows.push(['farmer','field_observations',$('#recordNotes').value],['meta','generated',new Date().toISOString()],['meta','disclaimer',t('f_disc')]);
  const blob=new Blob(['\ufeff'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`terrasync_report_${site.lat.toFixed(3)}_${site.lon.toFixed(3)}.csv`;document.body.appendChild(a);a.click();a.remove();
}

/* ---------- i18n + init ---------- */
function applyLang(){
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
  document.querySelectorAll('[data-i18n-ph]').forEach(e=>e.placeholder=t(e.dataset.i18nPh));
  document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===lang));
  $('#srcUsed').innerHTML=SOURCES_USED.map(x=>`<li>${esc(x)}</li>`).join('');$('#srcExt').textContent=SOURCES_EXT;
  if(S.data){document.querySelectorAll('.chip').forEach(b=>{const z=S.data.zones.find(x=>x.slug===b.dataset.slug);b.textContent=z['name_'+lang];});}
  if(S.data)renderCropOptions();
  $('#dashboardToggle').textContent=t(document.body.classList.contains('full-dashboard')?'guided_view':'view_dashboard');
  render();
}
function renderCropOptions(){
  const select=$('#recordCrop');if(!select)return;
  const selected=select.value;
  select.innerHTML=`<option value="">${esc(t('crop_select'))}</option>`+S.data.crops.map(c=>`<option value="${esc(c.code)}">${esc(c['name_'+lang])}</option>`).join('');
  allCrops().forEach(c=>{if(!S.data.crops.some(item=>item.code===c.code))select.insertAdjacentHTML('beforeend',`<option value="${esc(c.code)}">${esc(c['name_'+lang])}</option>`);});
  select.value=selected;
}
function addCustomCrop(event){
  event.preventDefault();
  const nameEn=$('#customName').value.trim(),nameEs=$('#customNameEs').value.trim()||nameEn,phMin=Number($('#customPhMin').value),phMax=Number($('#customPhMax').value),cycleMonths=Number($('#customCycle').value);
  if(!nameEn||phMin>=phMax||cycleMonths<3||cycleMonths>36){setStatus(t('crop_invalid'));return;}
  const frost={sensitive:{caution:10,lethal:2},moderate:{caution:5,lethal:-1},tolerant:{caution:0,lethal:-5}}[$('#customFrost').value];
  const item=crop(`custom-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,nameEn,nameEs,$('#customCategory').value,phMin,phMax,frost.caution,frost.lethal,$('#customWater').value,cycleMonths,false,false,I18N.en.custom_crop_benefit,I18N.es.custom_crop_benefit);
  item.custom=true;S.customCrops.push(item);if(!saveCustomCrops()){S.customCrops.pop();setStatus(t('storage_error'));return;}S.cropFilter='all';S.cropQuery='';$('#cropSearch').value='';$('#customCropForm').reset();
  selectActiveCrop(item.code);setStatus(t('crop_added'));
}
async function init(){
  S.data=await loadData();
  S.customCrops=loadCustomCrops();
  $('#startAnalysis').addEventListener('click',()=>setGuidedStep(1));
  $('#dashboardToggle').addEventListener('click',openFullDashboard);
  document.querySelectorAll('[data-pilot]').forEach(button=>button.addEventListener('click',()=>openPilot(button.dataset.pilot)));
  $('#previousStep').addEventListener('click',()=>setGuidedStep(currentStep-1));
  $('#nextStep').addEventListener('click',()=>setGuidedStep(currentStep+1));
  $('#presets').innerHTML=S.data.zones.map(z=>`<button type="button" class="chip" data-slug="${z.slug}">${esc(z.name_en)}</button>`).join('');
  document.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{const z=S.data.zones.find(x=>x.slug===b.dataset.slug);goTo(z.lat,z.lon,z,11);}));
  document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.lang;try{localStorage.setItem('ts_lang',lang);}catch(e){}applyLang();}));
  document.querySelectorAll('input[name=prio]').forEach(c=>c.addEventListener('change',()=>{if(!priorities().length)c.checked=true;if(S.site)render();}));
  document.querySelectorAll('input[name=avail]').forEach(c=>c.addEventListener('change',()=>S.site&&render()));
  renderCropOptions();
  $('#cropSearch').addEventListener('input',event=>{S.cropQuery=event.target.value;renderCropBoard();});
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{S.cropFilter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(item=>{const selected=item===button;item.classList.toggle('active',selected);item.setAttribute('aria-pressed',String(selected));});renderCropBoard();}));
  $('#customCropForm').addEventListener('submit',addCustomCrop);
  $('#activeCropSelect').addEventListener('change',event=>selectActiveCrop(event.target.value));
  $('#saveRecord').addEventListener('click',saveFarmRecord);
  $('#recordsCsv').addEventListener('click',()=>exportFarmRecords('csv'));
  $('#recordsJson').addEventListener('click',()=>exportFarmRecords('json'));
  $('#precipScenario').addEventListener('input',renderSimulator);$('#tempScenario').addEventListener('input',renderSimulator);
  document.querySelectorAll('input[name=efficiency]').forEach(input=>input.addEventListener('change',renderSimulator));
  $('#goBtn').addEventListener('click',()=>{const la=parseFloat($('#lat').value),lo=parseFloat($('#lon').value);
    if(!(la>=-90&&la<=90&&lo>=-180&&lo<=180)){setStatus(t('err_coords'));return;}
    const z=S.data.zones.find(x=>Math.abs(x.lat-la)<0.002&&Math.abs(x.lon-lo)<0.002);goTo(la,lo,z||null);});
  $('#csvBtn').addEventListener('click',exportCSV);$('#printBtn').addEventListener('click',printReport);
  window.addEventListener('beforeprint',()=>{if(!S.printPrepared)preparePrintReport();});
  window.addEventListener('afterprint',restoreChartsAfterPrint);
  const printMedia=window.matchMedia('print');
  if(printMedia.addEventListener)printMedia.addEventListener('change',event=>{if(event.matches){if(!S.printPrepared)preparePrintReport();}else restoreChartsAfterPrint();});
  if(typeof L!=='undefined'){
    const osm=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap contributors'});
    const sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:18,attribution:'Imagery &copy; Esri, Maxar, Earthstar Geographics'});
    S.map=L.map('map',{layers:[sat]}).setView([-17.1,-70.9],9);L.control.layers({'Satellite':sat,'Streets':osm}).addTo(S.map);
    S.data.zones.forEach(z=>L.circleMarker([z.lat,z.lon],{radius:7,color:'#fff',weight:2,fillColor:'#3f7d58',fillOpacity:1}).addTo(S.map).bindTooltip(z.name_en));
    S.map.on('click',e=>{const la=+e.latlng.lat.toFixed(3),lo=+(((e.latlng.lng+540)%360)-180).toFixed(3);goTo(la,lo,null);});
  }else setStatus('Map library unavailable (offline?). Use the presets or coordinates.');
  applyLang();
  const z=S.data.zones[0];goTo(z.lat,z.lon,z,10);
}
init().catch(e=>{console.error(e);setStatus('Could not load data/moquegua_data.js');});
})();
