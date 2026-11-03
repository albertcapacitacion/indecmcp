# INDEC MCP

Official Argentine statistics in your conversations. / Estadísticas oficiales de Argentina en tus conversaciones.

[English](#english) · [Español](#español) · [Screenshots / Capturas](#screenshots)

## English

### What is this?

**INDEC MCP** connects ChatGPT, Codex and compatible MCP clients with official statistics from Argentina's National Institute of Statistics and Censuses (INDEC). Ask a question in everyday language and get figures with their sources, reference periods and coverage.

The connector retrieves the numbers. ChatGPT can help you explain them, build charts, compare them with your own figures, and create Excel files, PDFs or presentations, depending on the capabilities available in your chat.

**This is the first version (0.1.0), and we are looking for feedback.** Tell us what worked, what was confusing, which prompts failed, and what you would like to do next through [GitHub Issues](https://github.com/albertcapacitacion/indecmcp/issues).

This is an independent, open-source project under the [Apache-2.0 license](LICENSE). It uses official INDEC data; it is not an INDEC product or endorsement.

### What can I use it for?

- Understand inflation and see how prices changed over a whole year.
- Compare your salary or a fee increase with inflation over matching dates.
- Explore wage indices, basic food and total baskets, unemployment and economic activity.
- Turn a conversation into charts, editable spreadsheets or an explanation you can share.

The first version supports a selected set of indicators, rather than the entire INDEC catalogue. See the [tool contract](docs/TOOL_CONTRACT.md) for its scope.

### Try it in ChatGPT

Once INDEC MCP is connected, select it from the apps menu or type `@INDEC` and choose **INDEC MCP**. Then try:

> What is the latest available monthly inflation figure for Argentina? Explain it with a simple example in pesos. Show the reference month and official source.

> Show Argentina's monthly inflation for every month of 2025 as a bar chart. Include the year, percentage labels and source.

> A monthly fee rose from ARS 50000 in December 2024 to ARS 75000 in December 2025. Did it rise faster than national inflation over the same period? Explain the difference in pesos and percentages.

> Create a downloadable Excel file with the 2025 inflation data and charts. Include original figures, reference periods and source links. Keep missing inputs and dependent results unavailable, rather than turning them into zero.

For nine complete workflows, including salary comparisons, uploads, a purchasing-power calculator and PDF exports, read the [Start Here guide](docs/START_HERE.md) (English). You can ask ChatGPT to answer in English or Spanish.

The first version was tested through a private ChatGPT installation. Public directory approval is pending; see the [documented deployment status](docs/DEPLOYMENT.md).

### Where do the numbers come from?

The source is the official [INDEC API catalogue](https://api.indec.gob.ar/). The connector reads statistical data without changing the source. It preserves available source links, reference periods and missing-data indicators.

The latest available figure can describe an earlier month or quarter. Basic-basket figures cover Greater Buenos Aires per adult equivalent, and unemployment covers 31 urban agglomerations. ChatGPT's calculations and your own numbers should remain distinguishable from official observations. Check the dates, units and downloaded files before sharing a result.

### Feedback and development

[Open an issue](https://github.com/albertcapacitacion/indecmcp/issues/new) with your prompt, expected result and what happened. Mention the reference period and attach a screenshot if useful. Remove personal information and credentials before posting.

For setup, the six tools, tests, safeguards and deployment details, see the [development and technical reference](docs/DEVELOPMENT.md). More information: [security](SECURITY.md), [privacy](docs/PRIVACY.md), and [integration examples](docs/EXAMPLES.md).

## Español

### ¿Qué es este proyecto?

**INDEC MCP** conecta ChatGPT, Codex y otros clientes compatibles con MCP con estadísticas oficiales del Instituto Nacional de Estadística y Censos de Argentina (INDEC). Podés hacer preguntas con tus propias palabras y obtener cifras con sus fuentes, períodos de referencia y cobertura.

El conector obtiene los números. ChatGPT puede ayudarte a explicarlos, crear gráficos, compararlos con tus propios datos y generar archivos de Excel, PDF o presentaciones, según las funciones disponibles en tu chat.

**Esta es la primera versión (0.1.0) y buscamos comentarios para mejorarla.** Contanos qué funcionó, qué resultó confuso, qué consultas fallaron y qué te gustaría poder hacer a través de [GitHub Issues](https://github.com/albertcapacitacion/indecmcp/issues).

Es un proyecto independiente y de código abierto con [licencia Apache-2.0](LICENSE). Utiliza datos oficiales del INDEC; no es un producto del INDEC ni cuenta con su aval.

### ¿Para qué sirve?

- Entender la inflación y ver cómo cambiaron los precios a lo largo de un año.
- Comparar tu sueldo o el aumento de una cuota con la inflación entre las mismas fechas.
- Consultar índices de salarios, canastas básicas alimentaria y total, desocupación y actividad económica.
- Convertir una conversación en gráficos, planillas editables o una explicación para compartir.

La primera versión permite consultar una selección de indicadores, no todo el catálogo del INDEC. El alcance está detallado en el [contrato de herramientas](docs/TOOL_CONTRACT.md) (en inglés).

### Probalo en ChatGPT

Una vez conectado INDEC MCP, seleccionalo desde el menú de apps o escribí `@INDEC` y elegí **INDEC MCP**. Después, probá estas consultas:

> ¿Cuál es el último dato disponible de inflación mensual en Argentina? Explicámelo con un ejemplo sencillo en pesos. Indicá el mes de referencia y la fuente oficial.

> Mostrame la inflación mensual de Argentina de todos los meses de 2025 en un gráfico de barras. Incluí el año, los porcentajes y la fuente.

> Una cuota mensual pasó de ARS 50000 en diciembre de 2024 a ARS 75000 en diciembre de 2025. ¿Subió más que la inflación nacional entre esas mismas fechas? Explicá la diferencia en pesos y porcentajes.

> Creá un archivo de Excel descargable con los datos de inflación de 2025 y sus gráficos. Incluí las cifras originales, los períodos de referencia y los enlaces a las fuentes. Si falta un dato necesario, dejá ese dato y los resultados que dependan de él como no disponibles, sin convertirlos en cero.

La [guía para empezar](docs/START_HERE.md) (en inglés) incluye nueve flujos completos: comparación de sueldos, carga de archivos, una calculadora de poder adquisitivo y exportación a PDF. Podés pedirle a ChatGPT que responda en español o en inglés.

La primera versión se probó mediante una instalación privada en ChatGPT. La aprobación en el directorio público está pendiente; consultá el [estado de despliegue documentado](docs/DEPLOYMENT.md) (en inglés).

### ¿De dónde salen los números?

La fuente es el [Catálogo API-INDEC oficial](https://api.indec.gob.ar/). El conector consulta estadísticas sin modificar los datos de origen. Conserva los enlaces disponibles a las fuentes, los períodos de referencia y las indicaciones de datos faltantes.

El último dato disponible puede corresponder a un mes o trimestre anterior. Las canastas básicas corresponden al Gran Buenos Aires y se expresan por adulto equivalente; la desocupación abarca 31 aglomerados urbanos. Los cálculos de ChatGPT y tus propios números deben distinguirse de las observaciones oficiales. Revisá las fechas, unidades y archivos descargados antes de compartir un resultado.

### Comentarios y desarrollo

[Abrí un issue](https://github.com/albertcapacitacion/indecmcp/issues/new) con tu consulta, el resultado que esperabas y lo que ocurrió. Indicá el período de referencia y agregá una captura si ayuda a entenderlo. Quitá la información personal y las credenciales antes de publicar.

La [referencia técnica y de desarrollo](docs/DEVELOPMENT.md) (en inglés) conserva las instrucciones de instalación, las seis herramientas, las pruebas, las protecciones y el despliegue. Más información: [seguridad](SECURITY.md), [privacidad](docs/PRIVACY.md) y [ejemplos de integración](docs/EXAMPLES.md), en inglés.

## Screenshots

Capturas de uso / Usage screenshots. Real examples from the ChatGPT workflow tests on November 3, 2026. Screenshots are cropped to the relevant content; the interface and response language may vary.

Ejemplos reales de las pruebas en ChatGPT del 3 de noviembre de 2026. Las capturas muestran solo el contenido relevante; el idioma de la interfaz y de las respuestas puede variar.

### Purchasing power / Poder adquisitivo

Change the amount and dates to calculate an equivalent amount using official price-index levels.

Cambiá el monto y las fechas para calcular un monto equivalente a partir de los niveles oficiales del índice de precios.

![Purchasing-power calculator in ChatGPT / Calculadora de poder adquisitivo en ChatGPT](docs/images/purchasing-power-chatgpt.png)

### Charts and Excel / Gráficos y Excel

Keep a full year of official data, calculated price levels and charts in an editable Excel workbook.

Guardá un año completo de datos oficiales, niveles de precios calculados y gráficos en una planilla de Excel editable.

![2025 inflation workbook preview in ChatGPT / Vista previa en ChatGPT de la planilla de inflación de 2025](docs/images/inflation-excel-chatgpt.png)
