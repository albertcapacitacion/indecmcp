# Wage mapping and verification — 2026-11-03

The official [wage endpoint documentation](https://api.indec.gob.ar/docs#tag/direcci%C3%B3n-de-%C3%ADndices-de-precios-de-la-producci%C3%B3n/GET/indice_salarios) was inspected in a rendered browser, including the expanded response schema. Authenticated console curl requests returned 200 for a minimal query and 206 with Prefer: count=exact. The earlier observed 404 no longer reproduces; its original cause has not been established.

The original `api-1.json` is retained unchanged. It declares wage `valor` as string|null. The current official documentation declares number|null, confirmed by actual JSON observations. The wage adapter uses the current numeric schema and preserves nulls, extra statistical signs and observations. It rejects numeric strings rather than silently coercing a changed contract.

Endpoint: GET https://api.indec.gob.ar/v1/indice_salarios. Shared filters: clasificador=IS 2001; indicador=Índice de salarios (IS). There is no region field in this endpoint. Coverage is Argentina, national, for the selected sector. No seasonal adjustment is advertised.

| Input sector | nivel | codigo | Official descripcion |
| --- | --- | --- | --- |
| total | 0 | 0 | Nivel general |
| private_registered | 2 | 110 | Sector privado registrado |
| public | 2 | 120 | Sector público |
| private_unregistered | 1 | 200 | Total no registrado |

The API labels the unregistered component Total no registrado. The official description identifies the underlying component as private unregistered wages. It is distinct from Total registrado (100), which is not mapped to total wages.

| Measure | tipo_de_indicador | Official description | Unit |
| --- | --- | --- | --- |
| index | Indice | Nivel del período, base octubre 2016=100 | Unidad |
| monthly | v_m | Variación porcentual respecto del período anterior | Porcentaje |
| year_over_year | v_ia | Variación porcentual respecto del mismo período del año anterior | Porcentaje |
| year_to_date | v_acum | Variación porcentual acumulada desde diciembre del año anterior | Porcentaje |

Every combination above was verified through a real HTTP MCP call. Series IDs are wages.<sector>.<measure>. Filtering matches every identifying dimension, and order includes the full documented primary key. Month format is YYYYMM upstream and YYYY-MM in MCP. The official methodology is [INDEC methodology 16](https://www.indec.gob.ar/ftp/cuadros/sociedad/cvs_metodologia.pdf). Registered private/public series begin in November 2015; total/unregistered components begin in October 2016 according to the official description. Exact missing periods remain unavailable.

Growth tools return official published measures directly. The comparison matches the same reference month and window on both sides, using national headline IPC v_m/v_ia/v_acum. Monthly baselines are the prior month, annual baselines are 12 months earlier, and accumulated baselines are prior December. No monthly rates are added. The real change is ((1+w/100)/(1+p/100)-1)*100; w-p is separately reported in percentage points. Calculations use the published rounded rates and are labeled calculated. Each input retains its own retrieval time and cache state; this is not an immutable historical publication vintage.

With no requested end_period, the tool takes the earlier of the latest wage and IPC reference months and requires that exact month on both sides. It does not find an older non-null result if data at the cutoff are missing. The output reports latest_available_periods and the period-selection rule explicitly.

New local integration evidence: `examples/live-2026-11-03T05-49-24.663Z.json` contains 24 real MCP calls, including all six tools and all 16 wage mappings. Earlier recordings are preserved as evidence of what actually happened at those times, including the 404s; they are not replaced or reinterpreted as current availability.
