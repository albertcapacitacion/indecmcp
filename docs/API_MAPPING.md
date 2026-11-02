# INDEC API mapping

Generated from docs/api-1.json, OpenAPI 3.1.0, Catálogo API-INDEC 1.0.0.

Specification SHA-256: 999693b094c10243347c70ff82a470d26594ee621ab8db2b093e88795f2d21cf

Base URL: https://api.indec.gob.ar/v1/

Authentication: server-side Bearer JWT via INDEC_API_TOKEN. No token belongs in client configuration.

## Common behavior

- Maximum upstream page: 1000 rows, including if a larger limit is requested.
- Stable pagination requires the full documented key in order. Use limit/offset.
- Prefer: count=exact supplies Content-Range. Both 200 and 206 are successful.
- Filter values use PostgREST operators despite some query schemas being numeric.
- Published variations may differ from ratios of rounded API indices. Do not add monthly percentages.
- Missing fields are not made required by the supplied schema. Runtime adapters require the identifying fields needed for safe interpretation.
- Live observation on 2026-11-02: additional *_null fields carry statistical signs but are absent from this specification. Adapters preserve these fields and all other observation fields.

## GET /ipi_manufacturero

Índice de producción industrial manufacturero

Índice de producción industrial manufacturero (IPI manufacturero), nivel general y aperturas por actividad económica, base 2004=100. Incluye las series original, desestacionalizada y tendencia-ciclo, expresadas como números índice y variaciones porcentuales.
 
Este endpoint contiene información desde enero de 2016.
 
Para más información, se puede consultar la metodología INDEC N° 31, Metodología del índice de producción industrial manufacturero, a través del siguiente enlace: https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_ipi_manufacturero_2019.pdf

Operation: get_ipi_manufacturero. Schema: #/components/schemas/ipi_manufacturero.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: periodo,indicador,cuadro_web,codigo_CLaNAE_2004,descripcion,serie,tipo_de_indicador

| Field | Type | Description |
| --- | --- | --- |
| periodo | string | Período de referencia del dato, expresado en formato AAAAMM para meses |
| anio | number | Año correspondiente al período de referencia del dato |
| mes | number | Número del mes correspondiente al período de referencia. Utiliza valores comprendidos entre 1 (enero) y 12 (diciembre) |
| indicador | string | Nombre del indicador estadístico |
| cuadro_web | string | Número del cuadro estadístico publicado en el sitio web del INDEC al que corresponde el dato |
| codigo_CLaNAE_2004 | string | Código de Clasificación Nacional de Actividades Económicas 2004  |
| descripcion | string | Denominación de la categoría correspondiente al código informado |
| serie | string | Tipo de serie estadística: original, desestacionalizada o tendencia-ciclo |
| tipo_de_indicador | string | Tipo de cálculo o presentación del indicador, como índice, variación intermensual, variación interanual, variación acumulada, incidencia o peso promedio |
| unidad_de_medida | string | Unidad en la que se expresa el valor del indicador |
| valor | number or null | Valor del indicador para el período y las categorías informadas. |

Query/header parameters: select, order, limit, offset, Prefer, periodo, anio, mes, indicador, cuadro_web, codigo_CLaNAE_2004, descripcion, serie, tipo_de_indicador, unidad_de_medida, valor.

## GET /ipi_minero

Índice de producción industrial minero

IPI minero nivel general. Series original, desestacionalizada y tendencia-ciclo, base 2016=100. Este endpoint contiene información desde enero de 2017. Para más información, se puede consultar la metodología INDEC N° 41, Índice de producción industrial minero, a través del siguiente enlace: https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_ipi_minero.pdf


Operation: get_ipi_minero. Schema: #/components/schemas/ipi_minero.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: periodo,anio,mes,indicador,cuadro_web,codigo_ClaNAE_2010,codigo_CPC_2_1,serie,descripcion,tipo_de_indicador,unidad_de_medida

| Field | Type | Description |
| --- | --- | --- |
| periodo | string | Período de referencia del dato, expresado en formato AAAAMM para meses |
| anio | number | Año correspondiente al período de referencia del dato |
| mes | number | Número del mes correspondiente al período de referencia. Utiliza valores comprendidos entre 1 (enero) y 12 (diciembre) |
| indicador | string | Nombre del indicador estadístico |
| cuadro_web | string | Número del cuadro estadístico publicado en el sitio web del INDEC al que corresponde el dato |
| codigo_ClaNAE_2010 | string | Código ClaNAE 2010 |
| codigo_CPC_2_1 | string | Código CPC 2.1 |
| serie | string | Tipo de serie estadística: original, desestacionalizada o tendencia-ciclo |
| descripcion | string | Denominación de la categoría correspondiente al código informado |
| tipo_de_indicador | string | Tipo de cálculo o presentación del indicador, como índice, variación intermensual, variación interanual, variación acumulada, incidencia o precio promedio |
| unidad_de_medida | string | Unidad en la que se expresa el valor del indicador |
| valor | number or null | Valor del indicador para el período y las categorías informadas |

Query/header parameters: select, order, limit, offset, Prefer, periodo, anio, mes, indicador, cuadro_web, codigo_ClaNAE_2010, codigo_CPC_2_1, serie, descripcion, tipo_de_indicador, unidad_de_medida, valor.

## GET /estimaciones_poblacion_departamento_2022_2035

Estimaciones de población por departamento y sexo

Estimaciones de población al 1° de julio de cada año calendario, por sexo y departamento, con base en el Censo Nacional de Población, Hogares y Viviendas 2022. Años 2022-2035.   

Para más información, se pueden consultar la siguiente documentación metodológica:  
https://www.indec.gob.ar/ftp/cuadros/publicaciones/estimaciones_departamentos_2022_2035.pdf  

Operation: get_estimaciones_poblacion_departamento_2022_2035. Schema: #/components/schemas/estimaciones_poblacion_departamento_2022_2035.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: departamento_cod,sexo_cod,fecha

| Field | Type | Description |
| --- | --- | --- |
| jurisdiccion_cod | string | Código de dos posiciones que identifica a la jurisdicción de la República Argentina |
| jurisdiccion_nom | string | Nombre de la jurisdicción de la República Argentina |
| departamento_cod | string | Código de cinco posiciones que identifica al departamento, partido o comuna. Las dos primeras corresponden a la jurisdicción y las tres restantes al departamento, partido o comuna |
| departamento_nom | string | Nombre del departamento, partido o comuna |
| rmba | string | Indica si la jurisdicción, el departamento o el partido pertenece a la Región Metropolitana de Buenos Aires (RMBA) |
| sexo_cod | string | Código que identifica el sexo registrado al nacer |
| sexo_nom | string | Categoría de sexo registrado al nacer |
| poblacion | number or null | Cantidad de habitantes estimada (2022) o proyectada (2023-2040) para la fecha de referencia |
| fecha | string | Año correspondiente a la estimación o proyección de población, referida al 1 de julio |

Query/header parameters: select, order, limit, offset, Prefer, jurisdiccion_cod, jurisdiccion_nom, departamento_cod, departamento_nom, rmba, sexo_cod, sexo_nom, poblacion, fecha.

## GET /proyecciones_poblacion_jurisdiccion_2022_2040

Proyecciones de población por jurisdicción, sexo y edad

Estimaciones y proyecciones de población al 1° de julio de cada año calendario, por sexo y grupos de edad, con base en el Censo Nacional de Población, Hogares y Viviendas 2022. Jurisdicciones. Años 2022-2040.   

Para más información, se pueden consultar la siguiente documentación metodológica: https://www.indec.gob.ar/ftp/cuadros/publicaciones/proyecciones_jurisdicciones_2022_2040.pdf


Operation: get_proyecciones_poblacion_jurisdiccion_2022_2040. Schema: #/components/schemas/proyecciones_poblacion_jurisdiccion_2022_2040.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: jurisdiccion_cod,sexo_cod,edad_cod,fecha

| Field | Type | Description |
| --- | --- | --- |
| jurisdiccion_cod | string | Código de dos posiciones que identifica a la jurisdicción de la República Argentina |
| jurisdiccion_nom | string | Nombre de la jurisdicción de la República Argentina |
| sexo_cod | string | Código que identifica el sexo registrado al nacer |
| sexo_nom | string | Categoría de sexo registrado al nacer |
| edad_cod | string | Código que identifica al grupo quinquenal de edad |
| edad_nom | string | Intervalo de edad de cinco años correspondiente al código informado |
| poblacion | number or null | Cantidad de habitantes estimada (2022) o proyectada (2023-2040) para la fecha de referencia |
| fecha | string | Año correspondiente a la estimación o proyección de población, referida al 1 de julio |

Query/header parameters: select, order, limit, offset, Prefer, jurisdiccion_cod, jurisdiccion_nom, sexo_cod, sexo_nom, edad_cod, edad_nom, poblacion, fecha.

## GET /proyecciones_poblacion_nacional_2022_2040

Proyecciones nacionales de población por sexo y edad

Estimaciones y proyecciones de población al 1° de julio de cada año calendario, por sexo y edad, con base en el Censo Nacional de Población, Hogares y Viviendas 2022. Total del país. Años 2022-2040.   

Para más información, se pueden consultar la siguiente documentación metodológica: https://www.indec.gob.ar/ftp/cuadros/publicaciones/proyecciones_nacionales_2022_2040.pdf

Operation: get_proyecciones_poblacion_nacional_2022_2040. Schema: #/components/schemas/proyecciones_poblacion_nacional_2022_2040.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: edad,sexo_cod,fecha

| Field | Type | Description |
| --- | --- | --- |
| edad | number | Edad de las personas, expresada en años cumplidos |
| sexo_cod | string | Código que identifica al sexo registrado al nacer |
| sexo_nom | string | Categoría de sexo registrado al nacer |
| poblacion | number or null | Cantidad de habitantes estimada (2022) o proyectada (2023-2040) para la fecha de referencia |
| fecha | number | Año correspondiente a la estimación o proyección de población, referida al 1 de julio |

Query/header parameters: select, order, limit, offset, Prefer, edad, sexo_cod, sexo_nom, poblacion, fecha.

## GET /valorizacion_canastas_cba_cbt

Valorización de las canastas básicas (CBA y CBT)

Valorización mensual de la canasta básica alimentaria (CBA) y de la canasta básica total (CBT) desde abril de 2016. Gran Buenos Aires.
Para más información, se puede consultar la metodología INDEC N° 22, La medición de la pobreza y la indigencia en la Argentina, a través del siguiente enlace: https://www.indec.gob.ar/ftp/cuadros/sociedad/EPH_metodologia_22_pobreza.pdf

Operation: get_valorizacion_canastas_cba_cbt. Schema: #/components/schemas/valorizacion_canastas_cba_cbt.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: clasificador,nivel,codigo,descripcion,periodo,anio,mes,indicador,tipo_de_indicador,tipo_de_indicador_descripcion,region,unidad_de_medida

| Field | Type | Description |
| --- | --- | --- |
| clasificador | string | Clasificador utilizado para organizar y codificar las categorías del dato |
| nivel | string | Nivel de desagregación de la categoría dentro de la estructura del clasificador |
| codigo | string | Código asignado a la categoría de acuerdo con el clasificador utilizado |
| descripcion | string | Denominación de la categoría correspondiente al código informado |
| periodo | string | Período de referencia del dato, expresado en formato AAAAMM (meses) |
| anio | number | Año correspondiente al período de referencia del dato |
| mes | number | Número del mes correspondiente al período de referencia. Utiliza valores comprendidos entre 1 (enero) y 12 (diciembre) |
| indicador | string | Nombre del indicador estadístico |
| tipo_de_indicador | string | Tipo de cálculo o presentación del indicador, como índice, variación intermensual, variación interanual, variación acumulada, incidencia o precio promedio |
| tipo_de_indicador_descripcion | string | Descripción del tipo de indicador |
| region | string | Región estadística a la que corresponde el dato |
| unidad_de_medida | string | Unidad en la que se expresa el valor del indicador |
| valor | number or null | Valor del indicador para el período y las categorías informadas |
| observaciones | string or null | Notas necesarias para el valor informado |

Query/header parameters: select, order, limit, offset, Prefer, clasificador, nivel, codigo, descripcion, periodo, anio, mes, indicador, tipo_de_indicador, tipo_de_indicador_descripcion, region, unidad_de_medida, valor, observaciones.

## GET /ipc_nacional

Índice de Precios al Consumidor (IPC)

Índice de precios al consumidor (IPC) de la República Argentina, con aperturas por región, división, grupo, clase y subclase, desde diciembre de 2016.
Para más información, se puede consultar la metodología INDEC N° 32, Índice de precios al consumidor (IPC). Base diciembre 2016=100, a través del siguiente enlace:
https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_ipc_nacional_2019.pdf

Operation: get_ipc_nacional. Schema: #/components/schemas/ipc_nacional.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: clasificador,nivel,codigo,descripcion,periodo,anio,mes,indicador,tipo_de_indicador,tipo_de_indicador_descripcion,region,unidad_de_medida

| Field | Type | Description |
| --- | --- | --- |
| clasificador | string | Clasificador utilizado para organizar y codificar las categorías del dato |
| nivel | string | Nivel de desagregación de la categoría dentro de la estructura del clasificador |
| codigo | string | Código asignado a la categoría de acuerdo con el clasificador utilizado |
| descripcion | string | Denominación de la categoría correspondiente al código informado |
| periodo | string | Período de referencia del dato, expresado en formato AAAAMM (meses) |
| anio | number | Año correspondiente al período de referencia del dato |
| mes | number | Número del mes correspondiente al período de referencia. Utiliza valores comprendidos entre 1 (enero) y 12 (diciembre) |
| indicador | string | Nombre del indicador estadístico |
| tipo_de_indicador | string | Tipo de cálculo o presentación del indicador, como índice, variación intermensual, variación interanual, variación acumulada, incidencia o precio promedio  |
| tipo_de_indicador_descripcion | string | Descripción del tipo de indicador |
| region | string | Región estadística a la que corresponde el dato |
| unidad_de_medida | string | Unidad en la que se expresa el valor del indicador |
| valor | number or null | Valor del indicador para el período y las categorías informadas |
| observaciones | string or null | Notas necesarias para el valor informado |

Query/header parameters: select, order, limit, offset, Prefer, clasificador, nivel, codigo, descripcion, periodo, anio, mes, indicador, tipo_de_indicador, tipo_de_indicador_descripcion, region, unidad_de_medida, valor, observaciones.

## GET /redeterminacion_precios_contratos_obras_publicas

Redeterminación de precios de obras públicas

Aperturas del índice del costo de la construcción (ICC) y del índice de precios internos básicos al por mayor (IPIB) utilizadas para la redeterminación periódica de precios de contratos de obra pública, según el Decreto 1295/2002.
También incluye indicadores requeridos por el Decreto 634/2003, relativo a las Ampliaciones de Transporte de Energía Eléctrica en Alta Tensión y por Distribución Troncal.
Este endpoint contiene información desde diciembre de 2015.
Para más información, se puede consultar la información disponible en el sitio web del INDEC :https://www.indec.gob.ar/indec/web/Nivel4-Tema-3-5-112

Operation: get_redeterminacion_precios_contratos_obras_publicas. Schema: #/components/schemas/redeterminacion_precios_contratos_obras_publicas.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: indicador,operativo,inciso,descripcion_inciso,codigo_apertura,clasificador,nivel,descripcion,origen,periodo,anio,mes,tipo_de_indicador,tipo_de_indicador_descripcion,region,unidad_de_medida

| Field | Type | Description |
| --- | --- | --- |
| indicador | string | Nombre del indicador estadístico |
| operativo | string | Operativo estadístico del que proviene el dato |
| inciso | string | Código o denominación abreviada del inciso correspondiente al artículo 15 del Decreto 1295/2002 |
| descripcion_inciso | string | Denominación del inciso correspondiente al artículo 15 del Decreto 1295/2002 |
| codigo_apertura | string | Código que identifica el nivel de apertura o desagregación del dato |
| codigo_CPC_1 | string or null | Código de la Clasificación Central Provisional de Productos (CPC) elaborada por la Organización de las Naciones Unidas. |
| codigo_CIUU_3 | string or null | Código de la Clasificación Industrial Internacional Uniforme (CIIU), revisión 3 |
| clasificador | string | Clasificador utilizado para organizar y codificar las categorías del dato |
| nivel | string | Nivel de desagregación de la categoría dentro de la estructura del clasificador |
| descripcion | string | Denominación de la categoría correspondiente al código informado |
| origen | string | Origen nacional o importado del producto de referencia |
| periodo | string | Período de referencia del dato, expresado en formato AAAAMM (meses) |
| anio | number | Año correspondiente al período de referencia del dato |
| mes | number | Número del mes correspondiente al período de referencia. Utiliza valores comprendidos entre 1 (enero) y 12 (diciembre) |
| tipo_de_indicador | string | Tipo de cálculo o presentación del indicador, como índice, variación intermensual, variación interanual, variación acumulada, incidencia o precio promedio |
| tipo_de_indicador_descripcion | string | Descripción del tipo de indicador |
| region | string | Región estadística a la que corresponde el dato |
| unidad_de_medida | string | Unidad en la que se expresa el valor del indicador |
| valor | number or null | Valor del indicador para el período y las categorías informadas |
| observaciones | string or null | Notas necesarias para el valor informado |

Query/header parameters: select, order, limit, offset, Prefer, indicador, operativo, inciso, descripcion_inciso, codigo_apertura, codigo_CPC_1, codigo_CIUU_3, clasificador, nivel, descripcion, origen, periodo, anio, mes, tipo_de_indicador, tipo_de_indicador_descripcion, region, unidad_de_medida, valor, observaciones.

## GET /sipm_precios_mayoristas

Sistema de índices de precios mayoristas

El Sistema de índices de precios mayoristas (SIPM) está compuesto por el índice de precios internos al por mayor (IPIM), el índice de precios internos básicos al por mayor (IPIB) y el índice de precios básicos del productor (IPP). Este endpoint contiene información desde diciembre de 2015.
Para más información, se puede consultar la metodología INDEC N° 8, Sistema de Índices de Precios Mayoristas, base 1993, a través del siguiente enlace: https://www.indec.gob.ar/ftp/cuadros/economia/metodologia1_8_sipm.pdf

Operation: get_sipm_precios_mayoristas. Schema: #/components/schemas/sipm_precios_mayoristas.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: operativo,indicador,clasificador,nivel,codigo_apertura,descripcion,periodo,anio,mes,tipo_de_indicador,tipo_de_indicador_descripcion,region,unidad_de_medida

| Field | Type | Description |
| --- | --- | --- |
| operativo | string | Operativo estadístico del que proviene el dato |
| indicador | string | Nombre del indicador estadístico |
| clasificador | string | Clasificador utilizado para organizar y codificar las categorías del dato |
| nivel | string | Nivel de desagregación de la categoría dentro de la estructura del clasificador |
| codigo_apertura | string | Código que identifica el nivel de apertura o desagregación del dato |
| descripcion | string | Denominación de la categoría correspondiente al código informado |
| periodo | string | Período de referencia del dato, expresado en formato AAAAMM (meses) |
| anio | number | Año correspondiente al período de referencia del dato |
| mes | number | Número del mes correspondiente al período de referencia. Utiliza valores comprendidos entre 1 (enero) y 12 (diciembre) |
| tipo_de_indicador | string | Tipo de cálculo o presentación del indicador, como índice, variación intermensual, variación interanual, variación acumulada, incidencia o precio promedio |
| tipo_de_indicador_descripcion | string | Descripción del tipo de indicador |
| region | string | Región estadística a la que corresponde el dato |
| unidad_de_medida | string | Unidad en la que se expresa el valor del indicador |
| valor | number or null | Valor del indicador para el período y las categorías informadas |
| observaciones | string or null | Notas necesarias para el valor informado |

Query/header parameters: select, order, limit, offset, Prefer, operativo, indicador, clasificador, nivel, codigo_apertura, descripcion, periodo, anio, mes, tipo_de_indicador, tipo_de_indicador_descripcion, region, unidad_de_medida, valor, observaciones.

## GET /indice_salarios

Índice de salarios

El índice de salarios estima la evolución de los salarios pagados en la economía aislando el indicador de variaciones relacionadas con conceptos tales como la cantidad de horas trabajadas, descuentos por ausentismo, premios por productividad y todo otro concepto asociado al desempeño o a las características de los individuos concretos.
 
La serie muestra la evolución de los salarios pagados en los sectores privado registrado y público desde noviembre de 2015. A partir de octubre de 2016 se incorporó la serie del sector privado no registrado y el cálculo del índice de salarios total, que resulta de la agregación de los índices de salarios de los componentes mencionados.
 
Para más información, se puede consultar la metodología INDEC N° 16, Índice de salarios y coeficiente de variación salarial, a través del siguiente enlace: https://www.indec.gob.ar/ftp/cuadros/sociedad/cvs_metodologia.pdf

Operation: get_indice_salarios. Schema: #/components/schemas/indice_salarios.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: clasificador,nivel,codigo,descripcion,periodo,anio,mes,indicador,tipo_de_indicador,tipo_de_indicador_descripcion,unidad_de_medida

| Field | Type | Description |
| --- | --- | --- |
| clasificador | string | Clasificador utilizado para organizar y codificar las categorías del dato |
| nivel | string | Nivel de desagregación de la categoría dentro de la estructura del clasificador |
| codigo | string | Código asignado a la categoría de acuerdo con el clasificador utilizado |
| descripcion | string | Denominación de la categoría correspondiente al código informado |
| periodo | string | Período de referencia del dato, expresado en formato AAAAMM (meses) |
| anio | number | Año correspondiente al período de referencia del dato |
| mes | number | Número del mes correspondiente al período de referencia. Utiliza valores comprendidos entre 1 (enero) y 12 (diciembre) |
| indicador | string | Nombre del indicador estadístico |
| tipo_de_indicador | string | Tipo de cálculo o presentación del indicador, como índice, variación intermensual, variación interanual, variación acumulada, incidencia o precio promedio |
| tipo_de_indicador_descripcion | string | Descripción del tipo de indicador |
| unidad_de_medida | string | Unidad en la que se expresa el valor del indicador |
| valor | string or null | Valor del indicador para el período y las categorías informadas |
| observaciones | string or null | Notas necesarias para el valor informado  |

Query/header parameters: select, order, limit, offset, Prefer, clasificador, nivel, codigo, descripcion, periodo, anio, mes, indicador, tipo_de_indicador, tipo_de_indicador_descripcion, unidad_de_medida, valor, observaciones.

## GET /icc_precios_construccion

Índice del costo de la construcción

Índice del costo de la construcción (ICC) en el Gran Buenos Aires, base 1993. 
Este endpoint contiene información desde noviembre de 2015.
Para más información, se puede consultar la metodología INDEC N°  9, Índice del Costo de la Construcción en el Gran Buenos Aires, base 1993, a través del siguiente enlace: https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_icc.pdf 

Operation: get_icc_precios_construccion. Schema: #/components/schemas/icc_precios_construccion.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: indicador,codigo_apertura,codigo_CPC_1,clasificador,nivel,descripcion,periodo,anio,mes,tipo_de_indicador,tipo_de_indicador_descripcion,region,unidad_de_medida

| Field | Type | Description |
| --- | --- | --- |
| indicador | string | Nombre del indicador estadístico |
| codigo_apertura | string | Código que identifica el nivel de apertura o desagregación del dato |
| codigo_CPC_1 | string | Código de la Clasificación Central Provisional de Productos (CPC) elaborada por la Organización de las Naciones Unidas.  |
| clasificador | string | Clasificador utilizado para organizar y codificar las categorías del dato |
| nivel | string | Nivel de desagregación de la categoría dentro de la estructura del clasificador |
| descripcion | string | Denominación de la categoría correspondiente al código informado |
| periodo | string | Período de referencia del dato, expresado en formato AAAAMM (meses) |
| anio | number | Año correspondiente al período de referencia del dato |
| mes | number | Número del mes correspondiente al período de referencia. Utiliza valores comprendidos entre 1 (enero) y 12 (diciembre) |
| tipo_de_indicador | string | Tipo de cálculo o presentación del indicador, como índice, variación intermensual, variación interanual, variación acumulada, incidencia o precio promedio |
| tipo_de_indicador_descripcion | string | Descripción del tipo de indicador |
| region | string | Región estadística a la que corresponde el dato |
| unidad_de_medida | string | Unidad en la que se expresa el valor del indicador |
| valor | number or null | Valor del indicador para el período y las categorías informadas |
| observaciones | string or null | Notas necesarias para el valor informado  |

Query/header parameters: select, order, limit, offset, Prefer, indicador, codigo_apertura, codigo_CPC_1, clasificador, nivel, descripcion, periodo, anio, mes, tipo_de_indicador, tipo_de_indicador_descripcion, region, unidad_de_medida, valor, observaciones.

## GET /estimador-mensual-de-actividad-economica-nivel-general

Estimador mensual de actividad económica. Nivel general

Estimador mensual de actividad económica (EMAE), nivel general, base 2004=100. Incluye la serie original, desestacionalizada y tendencia-ciclo, expresadas como números índice y variaciones porcentuales.

Este endpoint contiene información desde enero de 2004.

Para más información, se puede consultar la metodología INDEC N° 20, Estimador Mensual de Actividad Económica (EMAE), Base año 2004, a través del siguiente enlace: https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_emae_ago_16.pdf


Operation: get_estimador-mensual-de-actividad-economica-nivel-general. Schema: #/components/schemas/estimador-mensual-de-actividad-economica-nivel-general.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: tipo_de_indicador_descripcion,anio,mes,periodo,tipo_de_indicador

| Field | Type | Description |
| --- | --- | --- |
| tipo_de_indicador_descripcion | string | Descripción del tipo de indicador |
| anio | number | Año correspondiente al período de referencia del dato |
| mes | number | Número del mes correspondiente al período de referencia. Utiliza valores comprendidos entre 1 (enero) y 12 (diciembre) |
| periodo | string | Período de referencia del dato, expresado en formato AAAAMM (meses) |
| tipo_de_indicador | string | Tipo de cálculo o presentación del indicador, como índice, variación intermensual, variación interanual, variación acumulada, incidencia o peso promedio |
| valor | number or null | Valor del indicador para el período y las categorías informadas |
| observaciones | string or null | Notas necesarias para el valor informado |

Query/header parameters: select, order, limit, offset, Prefer, tipo_de_indicador_descripcion, anio, mes, periodo, tipo_de_indicador, valor, observaciones.

## GET /estimador-mensual-de-actividad-economica-sectores

Estimador mensual de actividad económica. Sectores

Estimador mensual de actividad económica (EMAE) por sector de actividad económica, base 2004=100 (serie original). Incluye números índice y variaciones porcentuales interanuales para cada sector desde enero de 2004.

Para más información, se puede consultar la metodología INDEC N° 20, Estimador Mensual de Actividad Económica (EMAE), Base año 2004, a través del siguiente enlace: https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_emae_ago_16.pdf

Operation: get_estimador-mensual-de-actividad-economica-sectores. Schema: #/components/schemas/estimador-mensual-de-actividad-economica-sectores.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: anio,mes,codigo,descripcion,periodo,tipo_de_indicador

| Field | Type | Description |
| --- | --- | --- |
| anio | number | Año correspondiente al período de referencia del dato |
| mes | number | Número del mes correspondiente al período de referencia. Utiliza valores comprendidos entre 1 (enero) y 12 (diciembre) |
| codigo | string | Código letra de la Clasificación nacional de actividades económicas 2004 (ClaNAE04) |
| descripcion | string | Denominación de la categoría correspondiente al código informado |
| periodo | string | Período de referencia del dato, expresado en formato AAAAMM (meses) |
| tipo_de_indicador | string | Tipo de cálculo o presentación del indicador, como índice, variación intermensual, variación interanual, variación acumulada, incidencia o peso promedio |
| valor | number or null | Valor del indicador para el período y las categorías informadas |
| observaciones | string or null | Notas necesarias para el valor informado |

Query/header parameters: select, order, limit, offset, Prefer, anio, mes, codigo, descripcion, periodo, tipo_de_indicador, valor, observaciones.

## GET /pobreza_eph

Incidencia de la pobreza y la indigencia (EPH)

Incidencia de la pobreza y la indigencia en hogares y personas a partir de la Encuesta Permanente de Hogares (EPH) para el total de 31 aglomerados urbanos. La información se presenta con frecuencia semestral desde el segundo semestre de 2016.

Para más información, se puede consultar la metodología INDEC N° 22, la medición de la pobreza y la indigencia en la Argentina, a través del siguiente enlace: https://www.indec.gob.ar/ftp/cuadros/sociedad/metodologia_eph_continua.pdf . Y se puede acceder a los informes técnicos y datos complementarios en: https://www.indec.gob.ar/indec/web/Nivel4-Tema-4-31-58


Operation: get_pobreza_eph. Schema: #/components/schemas/pobreza_eph.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: area_geografica_nom,periodo

| Field | Type | Description |
| --- | --- | --- |
| area_geografica_nom | string | Denominación del área geográfica a la que corresponde el dato. |
| area_geografica_cod | number or null | Código que identifica el área geográfica a la que corresponde el dato. Ver diseño de registros y estructura para las bases preliminares (hogares y personas) de EPH en https://www.indec.gob.ar/indec/web/Institucional-Indec-BasesDeDatos . |
| periodo | string | Período de referencia del dato, expresado en formato AAAANS (número de semestre)   |
| anio | number | Año correspondiente al período de referencia del dato. |
| semestre | number | Número del semestre correspondiente al año de referencia. Utiliza los valores 1 (primer semestre) y 2 (segundo semestre). |
| tasa_pobreza_hogares | number or null | Porcentaje de hogares cuyos ingresos se encuentran por debajo de su respectiva línea de pobreza en relación con el total de hogares. |
| tasa_pobreza_personas | number or null | Porcentaje de personas que habitan en hogares cuyos ingresos se encuentran por debajo de su respectiva línea de pobreza en relación con el total de personas. |
| tasa_indigencia_hogares | number or null | Porcentaje de hogares cuyos ingresos se encuentran por debajo de su respectiva línea de indigencia en relación con el total de hogares. |
| tasa_indigencia_personas | number or null | Porcentaje de personas que habitan en hogares cuyos ingresos se encuentran por debajo de su respectiva línea de indigencia en relación con el total de personas. |
| observaciones | string or null | Notas vinculadas a los valores informados. |

Query/header parameters: select, order, limit, offset, Prefer, area_geografica_nom, area_geografica_cod, periodo, anio, semestre, tasa_pobreza_hogares, tasa_pobreza_personas, tasa_indigencia_hogares, tasa_indigencia_personas, observaciones.

## GET /mercado_trabajo_eph

Principales tasas del mercado de trabajo (EPH)

Principales tasas del mercado de trabajo estimadas a partir de la Encuesta Permanente de Hogares (EPH), correspondientes al total de 31 aglomerados urbanos. Incluye las tasas de actividad, empleo, empleo formal e informal, desocupación, ocupación demandante de empleo y subocupación. La información se presenta con frecuencia trimestral desde el segundo trimestre de 2016.
Para más información, se puede consultar la metodología INDEC de la EPH a través del siguiente enlace: https://www.indec.gob.ar/ftp/cuadros/sociedad/metodologia_eph_continua.pdf
Y acceder a informes técnicos y datos complementarios en: https://www.indec.gob.ar/indec/web/Nivel4-Tema-4-31-58 


Operation: get_mercado_trabajo_eph. Schema: #/components/schemas/mercado_trabajo_eph.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: area_geografica_nom,periodo

| Field | Type | Description |
| --- | --- | --- |
| area_geografica_nom | string | Denominación del área geográfica a la que corresponde el dato. |
| area_geografica_cod | number or null | Código que identifica el área geográfica a la que corresponde el dato. Ver diseño de registros y estructura para las bases preliminares (hogares y personas) de EPH en https://www.indec.gob.ar/indec/web/Institucional-Indec-BasesDeDatos . |
| periodo | string | Período de referencia del dato, expresado en formato AAAANT (número de trimestre que utiliza valores comprendidos entre 1 Y 4). |
| anio | number | Año correspondiente al período de referencia del dato. |
| trimestre | number | Número del trimestre correspondiente al año de referencia. Utiliza valores comprendidos entre 1 (primer trimestre) y 4 (cuarto trimestre). |
| tasa_de_actividad | number or null | Porcentaje de la población económicamente activa con respecto a la población total de referencia. |
| tasa_de_empleo | number or null | Porcentaje de la población ocupada con respecto a la población total de referencia. |
| tasa_de_empleo_formal | number or null | Porcentaje de la población ocupada con empleo formal con respecto a la población total de referencia. |
| tasa_de_empleo_informal | number or null | Porcentaje de la población ocupada con empleo informal con respecto a la población total de referencia. |
| tasa_de_desocupacion | number or null | Porcentaje de la población desocupada con respecto a la población económicamente activa. |
| tasa_de_ocupacion_demandante | number or null | Porcentaje de la población ocupada que busca activamente otra ocupación con respecto a la población económicamente activa. |
| tasa_de_subocupacion | number or null | Porcentaje de la población subocupada con respecto a la población económicamente activa. |
| tasa_de_subocupacion_demandante | number or null | Porcentaje de la población subocupada que busca activamente otra ocupación con respecto a la población económicamente activa. |
| tasa_de_subocupacion_no_demandante | number or null | Porcentaje de la población subocupada que busca activamente otra ocupación con respecto a la población económicamente activa. |
| observaciones | string or null | Notas vinculadas a los valores informados.  |

Query/header parameters: select, order, limit, offset, Prefer, area_geografica_nom, area_geografica_cod, periodo, anio, trimestre, tasa_de_actividad, tasa_de_empleo, tasa_de_empleo_formal, tasa_de_empleo_informal, tasa_de_desocupacion, tasa_de_ocupacion_demandante, tasa_de_subocupacion, tasa_de_subocupacion_demandante, tasa_de_subocupacion_no_demandante, observaciones.

## GET /canasta-crianza

Valorización de la canasta de crianza

Valorización mensual de la canasta de crianza de la primera infancia, la niñez y la adolescencia. Está conformada por el costo de los bienes y servicios, y la valorización del tiempo de cuidado. La estimación se realiza para cuatro tramos de edad: menores de 1 año, de 1 a 3 años, de 4 a 5 años y de 6 a 12 años. 

Gran Buenos Aires.

Este endpoint contiene información desde mayo de 2023. 

Para más información sobre la canasta de crianza, se puede consultar el siguiente enlace: https://www.indec.gob.ar/indec/web/Nivel4-Tema-4-43-173


Operation: get_canasta-crianza. Schema: #/components/schemas/canasta-crianza.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: Periodo

| Field | Type | Description |
| --- | --- | --- |
| anio | number | Año correspondiente al período de referencia del dato |
| Mes | number | Número del mes correspondiente al período de referencia. Utiliza valores comprendidos entre 1 (enero) y 12 (diciembre) |
| Periodo | string | Período de referencia del dato, expresado en formato AAAAMM (meses) |
| bys_men1 | number or null | Costo mensual de los bienes y servicios incluidos en la canasta de crianza para menores de 1 año, expresado en pesos argentinos |
| cuid_men1 | number or null | Valorización mensual del tiempo de cuidado requerido para menores de 1 año, expresado en pesos argentinos |
| tot_men1 | number or null | Valor mensual total de la canasta de crianza para menores de 1 año, expresado en pesos argentinos |
| bys_1a3 | number or null | Costo mensual de los bienes y servicios incluidos en la canasta de crianza para niñas y niños de 1 a 3 años, expresado en pesos argentinos |
| cuid_1a3 | number or null | Valorización mensual del tiempo de cuidado requerido para niñas y niños de 1 a 3 años, expresado en pesos argentinos |
| tot_1a3 | number or null | Valor mensual total de la canasta de crianza para niñas y niños de 1 a 3 años, expresado en pesos argentinos |
| bys_4a5 | number or null | Costo mensual de los bienes y servicios incluidos en la canasta de crianza para niñas y niños de 4 a 5 años, expresado en pesos argentinos |
| cuid_4a5 | number or null | Valorización mensual del tiempo de cuidado requerido para niñas y niños de 4 a 5 años, expresado en pesos argentinos |
| tot_4a5 | number or null | Valor mensual total de la canasta de crianza para niñas y niños de 4 a 5 años, expresado en pesos argentinos |
| bys_6a12 | number or null | Costo mensual de los bienes y servicios incluidos en la canasta de crianza para niñas, niños y adolescentes de 6 a 12 años, expresado en pesos argentinos |
| cuid_6a12 | number or null | Valorización mensual del tiempo de cuidado requerido para niñas, niños y adolescentes de 6 a 12 años, expresado en pesos argentinos |
| tot_6a12 | number or null | Valor mensual total de la canasta de crianza para niñas, niños y adolescentes de 6 a 12 años, expresado en pesos argentinos |

Query/header parameters: select, order, limit, offset, Prefer, anio, Mes, Periodo, bys_men1, cuid_men1, tot_men1, bys_1a3, cuid_1a3, tot_1a3, bys_4a5, cuid_4a5, tot_4a5, bys_6a12, cuid_6a12, tot_6a12.

## GET /comercio_exterior_nomenclaturas

Códigos y denominaciones de comercio exterior

Diccionario de códigos y nomenclaturas utilizados en los servicios de datos de comercio exterior de la Dirección Nacional de Estadísticas del Sector Externo y Cuentas Internacionales.
Incluye los códigos de país, grandes rubros y subrubros de las exportaciones, y los usos económicos y grandes categorías económicas de las importaciones.


Operation: get_comercio_exterior_nomenclaturas. Schema: #/components/schemas/comercio_exterior_nomenclaturas.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: nombre_columna,codigo

| Field | Type | Description |
| --- | --- | --- |
| nombre_columna | string | Nombre de la columna de los servicios de datos de comercio exterior en la que se utiliza el código |
| codigo | string | Código utilizado en la columna indicada de los servicios de datos de comercio exterior |
| codigo_descripcion | string | Denominación correspondiente al código informado |

Query/header parameters: select, order, limit, offset, Prefer, nombre_columna, codigo, codigo_descripcion.

## GET /comercio_exterior_exportacion_bienes

Exportaciones de bienes por rubros y países de destino

Exportaciones argentinas de bienes por grandes rubros, subrubros y país de destino desde enero de 1986. Incluye el valor FOB expresado en dólares estadounidenses y el peso neto de las mercaderías expresado en kilogramos. 
La información se presenta con frecuencia mensual. Se aplican criterios de supresión para resguardar el secreto estadístico y la confidencialidad de la información aduanera. El signo convencional “s” indica que se registraron operaciones, pero el número de operadores fue insuficiente para publicar el valor.

Para conocer los códigos de país, rubro y subrubro, se encuentra disponible el servicio de datos llamado “Códigos y nomencladores de comercio exterior” (https://api.indec.gob.ar/v1/comercio_exterior_nomenclaturas).

Para más información, se puede consultar la metodología INDEC N° 26, Metodología de comercio exterior, a través del siguiente enlace: https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_comex.pdf


Operation: get_comercio_exterior_exportacion_bienes. Schema: #/components/schemas/comercio_exterior_exportacion_bienes.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: Anio,Mes,Periodo,rubro_cod,subrubro_cod,pais_cod

| Field | Type | Description |
| --- | --- | --- |
| Anio | number | Año correspondiente al período de referencia del dato |
| Mes | number | Número del mes correspondiente al período de referencia. Utiliza valores comprendidos entre 1 (enero) y 12 (diciembre) |
| Periodo | string | Período de referencia del dato, expresado en formato AAAAMM (meses) |
| rubro_cod | string | Código que identifica el rubro al que pertenece la exportación |
| subrubro_cod | string | Código de tres posiciones que identifica el subrubro de exportación dentro del rubro correspondiente |
| pais_cod | string | Código que identifica el país de origen de las importaciones o de destino de las exportaciones |
| valor_FOB | number or null | Valor de las exportaciones a precios FOB, expresado en dólares estadounidenses |
| Peso_Neto | number or null | Peso neto de los bienes que componen el rubro o subrubro informado, expresado en kilogramos |

Query/header parameters: select, order, limit, offset, Prefer, Anio, Mes, Periodo, rubro_cod, subrubro_cod, pais_cod, valor_FOB, Peso_Neto.

## GET /comercio_exterior_importacion_bienes

Importaciones de bienes por uso económico y país de origen

Importaciones argentinas de bienes por uso económico, grandes categorías económica y país de origen. Incluye el valor CIF expresado en dólares estadounidenses y el peso neto de las mercaderías expresado en kilogramos. La información se presenta con frecuencia mensual. 

Este endpoint contiene información desde enero de 1986. 

Para conocer los códigos de país, uso económico y gran categoría económica, se encuentra disponible el servicio de datos llamado “Códigos y nomencladores de comercio exterior” (https://api.indec.gob.ar/v1/comercio_exterior_nomenclaturas).

Para más información, se puede consultar la metodología INDEC N° 26, Metodología de comercio exterior, a través del siguiente enlace: https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_comex.pdf


Operation: get_comercio_exterior_importacion_bienes. Schema: #/components/schemas/comercio_exterior_importacion_bienes.

Ordenamiento. Ej: id.desc,fecha.asc. Para paginar, incluya la clave completa: Anio,Mes,Periodo,uso_economico_cod,gce_cod,pais_cod

| Field | Type | Description |
| --- | --- | --- |
| Anio | number | Año correspondiente al período de referencia del dato |
| Mes | number | Número del mes correspondiente al período de referencia. Utiliza valores comprendidos entre 1 (enero) y 12 (diciembre) |
| Periodo | string | Período de referencia del dato, expresado en formato AAAAMM (meses) |
| uso_economico_cod | string | Código que identifica el uso económico de las importaciones |
| gce_cod | string | Código que identifica la gran categoría económica dentro del uso económico de importación correspondiente |
| pais_cod | string | Código que identifica el país de origen de las importaciones o de destino de las exportaciones |
| valor_CIF | number or null | Valor de las importaciones a precios CIF, expresado en dólares estadounidenses |
| peso_neto | number or null | Peso neto de los bienes que componen el uso económico o categoría económica informada, expresado en kilogramos |

Query/header parameters: select, order, limit, offset, Prefer, Anio, Mes, Periodo, uso_economico_cod, gce_cod, pais_cod, valor_CIF, peso_neto.

## V0 runtime mappings

| Tool | Endpoint | Live state on 2026-11-02 |
| --- | --- | --- |
| get_latest_inflation | /ipc_nacional | Verified national headline v_m |
| get_inflation_history | /ipc_nacional | Verified national Indice, v_m, v_ia, v_acum |
| get_wage_growth | /indice_salarios | HTTP 404; numerical results disabled |
| compare_wages_inflation | /indice_salarios and /ipc_nacional | Blocked by wage endpoint |
| get_basic_basket | /valorizacion_canastas_cba_cbt | Verified CBA/CBT, GBA, per adult equivalent |
| get_series | Closed catalog in src/catalog.ts | IPC, baskets, EMAE and EPH unemployment verified |

The presence of an endpoint in this document does not expose it through MCP. Only the closed runtime catalog is callable. Publication timestamps and archival vintages are not present in the relevant observation schemas.
