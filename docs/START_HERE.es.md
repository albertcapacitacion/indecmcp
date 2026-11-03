[<img src="https://flagcdn.com/w40/gb.png" alt="English" width="24"> EN](START_HERE.md) · **<img src="https://flagcdn.com/w40/ar.png" alt="Español" width="24"> ES** · [README](../README.es.md)

# Empezá acá: consultas cotidianas con INDEC MCP en ChatGPT

Usá INDEC MCP para consultar estadísticas oficiales de Argentina en tu conversación. Después, pedile a ChatGPT que las explique, haga gráficos, las compare con tus propios números o cree un archivo para guardar.

## Tu primera consulta

Abrí un chat nuevo en ChatGPT. Seleccioná **INDEC MCP** desde el menú de apps o escribí `@INDEC` y elegilo. Copiá esto:

> Usá INDEC MCP. ¿Cuál es el último dato disponible de inflación mensual en Argentina? Explicá qué significa con un ejemplo sencillo en pesos. Indicá el mes al que corresponde y la fuente oficial. Respondé en español.

Podés preguntar en el idioma que prefieras. Si la respuesta llega en otro idioma, agregá **“Respondé en español”** o indicá el idioma que quieras.

“Último dato disponible” puede referirse a un mes anterior. Si necesitás un mes en particular, nombralo y pedile a ChatGPT que indique si no está disponible.

## Elegí algo útil

Enviá los pasos de cada flujo como mensajes separados en el mismo chat. Reemplazá los montos y las fechas por los tuyos. Los números de los ejemplos de sueldo y gastos del hogar son ficticios.

### 1. Mirá el año completo y guardalo en Excel

Empezá con:

> Usá INDEC MCP. Mostrá los 12 meses de inflación nacional de Argentina de 2025, con el porcentaje mensual y el porcentaje acumulado oficial de cada mes. Mostrá la fuente y señalá las observaciones faltantes. Explicá la diferencia entre inflación mensual y acumulada. Respondé en español.

Después:

> Convertí los porcentajes mensuales en un gráfico de barras. Usá etiquetas cortas para los meses, un título claro y un eje en porcentajes. Incluí la fuente y el año. Entregá también un PNG descargable.

Después:

> Ahora mostrá cómo cambió el nivel general de precios durante 2025, partiendo de 100 en diciembre de 2024. Usá los niveles oficiales del IPC nacional, expresalos con esa base 100 e identificá los valores con nueva base como calculados. No reconstruyas el índice a partir de tasas mensuales de inflación redondeadas.

Guardá una copia editable:

> Creá un Excel descargable con la inflación nacional de 2025. Obtené las variaciones mensuales, las acumuladas oficiales y los niveles oficiales del IPC, incluido diciembre de 2024 como base. Incluí los valores originales, enlaces a las fuentes, períodos de referencia, un gráfico de barras mensual y un gráfico del nivel de precios con base diciembre de 2024 = 100. Calculá los niveles con nueva base directamente a partir de los índices oficiales, sin encadenar variaciones mensuales redondeadas. Conservá los datos faltantes en blanco. Si falta un dato necesario, dejá en blanco todos los resultados que dependan de él e indicá claramente que no están disponibles; nunca conviertas un dato faltante en cero. Mantené utilizables las observaciones que estén disponibles de forma independiente. Verificá esto en una copia temporal borrando el índice de un mes y luego el valor base de diciembre de 2024; restauralos antes de guardar. Usá etiquetas legibles para los meses. Respondé en español.

Verificá que el archivo tenga 12 filas mensuales, una base de diciembre de 2024 claramente identificada y enlaces a las fuentes. Si falta el índice de marzo, el resultado de marzo con nueva base debe quedar no disponible; los meses posteriores pueden seguir calculándose directamente con sus propios índices oficiales. Si falta la base, todos los resultados con nueva base deben quedar no disponibles.

### 2. ¿Mi sueldo le siguió el ritmo a la inflación?

Pegá tus ingresos mensuales o subí un archivo sencillo con columnas de mes y monto:

> Usá INDEC MCP para comparar mi sueldo de 2025 con la inflación nacional. Mis ingresos en pesos fueron: enero 1000000; febrero 1000000; marzo 1100000; abril 1100000; mayo 1150000; junio 1800000; julio 1200000; agosto 1200000; septiembre 1250000; octubre desconocido; noviembre 1300000; diciembre 2000000. Antes de calcular, preguntame por pagos extraordinarios, datos faltantes y a qué meses corresponden los pagos. Dejá en blanco los ingresos desconocidos. Respondé en español.

Para este ejemplo ficticio, aclará:

> Cada monto corresponde al mes indicado. Junio incluye un pago extraordinario de 600000 y diciembre uno de 650000. Octubre es desconocido. Compará el sueldo habitual por separado del ingreso total.

Después:

> Mostrá el sueldo habitual y el ingreso total en pesos de diciembre de 2024, usando niveles oficiales del IPC. Graficá el poder adquisitivo, explicá cuáles fueron los mejores y peores meses con datos conocidos y creá un Excel editable con los datos originales, fórmulas y fuentes. Dejá los montos faltantes y los resultados que dependan de ellos como no disponibles. Antes de guardar, verificá en una copia temporal que borrar un dato necesario no genere un cero falso.

Consulta opcional:

> Ayudame a redactar un resumen breve y basado en los datos para conversar sobre mi sueldo. Indicá las fechas y las limitaciones, y mantené un tono tranquilo.

### 3. ¿Esa cuota aumentó más que la inflación?

> Usá INDEC MCP. Una cuota mensual pasó de ARS 50000 en diciembre de 2024 a ARS 75000 en diciembre de 2025. Compará el aumento con la inflación oficial del mismo período. Mostrá el aumento porcentual, la cuota ajustada por inflación en pesos y la diferencia. Explicá por separado los puntos porcentuales y el cambio real. Aclará si usás la tasa publicada redondeada o el cociente completo entre índices. Respondé en español.

Después:

> Hacé un gráfico sencillo y una plantilla de Excel editable donde pueda agregar otros gastos con sus precios iniciales y finales. Mostrá las fechas, el método de cálculo y la fuente. Dejá los resultados como no disponibles cuando falte un precio necesario y verificá en una copia temporal que se pueda agregar un segundo gasto antes de guardar.

Esto compara los precios que proporcionás con la inflación general. No determina si un aumento específico está permitido legalmente.

### 4. Entendé los gastos de tu hogar

Subí un CSV o Excel con columnas de mes y gasto total. Quitá números de cuenta y otros datos que la comparación no necesite.

> Usá INDEC MCP para comparar este registro de gastos con la inflación nacional de los mismos meses. Antes de calcular, preguntame si cambiaron la cantidad de integrantes del hogar, los hábitos de compra o las compras grandes por única vez. Conservá mis números originales. No interpretes un mayor gasto por sí solo como prueba de mi tasa de inflación personal. Respondé en español.

Después de responder esas preguntas:

> Usá el gasto habitual del primer mes como presupuesto inicial y ajustalo con niveles oficiales del IPC. Mostrá el gasto habitual real, ese presupuesto ajustado por inflación y la diferencia. Separá las compras por única vez y explicá los límites de la comparación. Creá un Excel con datos originales, fórmulas, gráficos y fuentes. Si falta un dato necesario, los resultados que dependan de él deben quedar no disponibles, en lugar de mostrar cero.

### 5. Probá una calculadora de poder adquisitivo

> Usá INDEC MCP para obtener niveles oficiales del IPC nacional desde diciembre de 2024 hasta diciembre de 2025. Creá una calculadora interactiva de poder adquisitivo con un monto en pesos argentinos, un mes inicial y un mes final. Empezá con ARS 100000, de enero de 2025 a diciembre de 2025. Calculá el monto equivalente como monto * índice final / índice inicial. Distinguí un monto vacío de cero: si está vacío, mostrá "Ingresá un monto" y ningún resultado numérico; cero es válido y debe devolver cero. Exigí ambos meses, usá solo observaciones disponibles del índice e indicá claramente cuando falten datos. Mostrá los valores elegidos, el rango de fechas, la fórmula y la fuente oficial. Respondé en español.

Probá cambiar el monto y los meses. Borrá el monto: debe pedirte que ingreses uno. Ingresá `0`: el resultado debe ser cero. Elegí el mismo mes al inicio y al final: el resultado debe ser igual al monto ingresado.

Si no hay controles interactivos disponibles, pedí el mismo cálculo como tabla o archivo de Excel.

**Al exportar, repetí tus elecciones en el mensaje.** Una consulta posterior puede no recuperar los cambios que hiciste dentro de los controles interactivos:

> Creá una versión de Excel descargable con ARS 200000, desde diciembre de 2024 hasta diciembre de 2025. Mostrá claramente esos valores exactos y usá niveles oficiales del IPC. Hacé que el monto y los meses sean editables, con fórmulas que se recalculen. Un monto vacío debe mostrar "Ingresá un monto" y ningún resultado numérico; cero debe devolver cero. Los meses faltantes o inválidos y los índices necesarios faltantes deben generar un mensaje claro de no disponible y ningún resultado numérico. Verificá en una copia temporal los casos de vacío frente a cero, mismo mes, fechas modificadas y base faltante; restaurá los valores elegidos antes de guardar. Incluí los índices originales y enlaces a las fuentes. Respondé en español.

El ejemplo elegido debería dar aproximadamente **ARS 263097.52**. Verificá que cada etiqueta de índice esté junto al valor correcto y que los encabezados que muestran tus elecciones se actualicen al editarlas. Es el monto equivalente al nivel general de precios posterior, no un rendimiento de inversión ni una proyección.

Si las etiquetas o el encabezado están mal:

> Creá un archivo de Excel corregido por separado. Poné cada etiqueta del índice inicial y final en la misma fila que su valor correspondiente. Hacé que los encabezados que muestran el monto y las fechas elegidas se actualicen cuando cambien esos datos. Conservá los datos oficiales originales, las fuentes y los cálculos correctos. Verificá las etiquetas contra las fórmulas, probá cambiar los datos, restaurá mis valores iniciales elegidos y renderizá las hojas para revisarlas antes de entregar el archivo nuevo.

### 6. Compará salarios entre sectores

> Usá INDEC MCP para comparar los índices salariales del sector privado registrado, el sector público y el sector privado no registrado con el IPC nacional, desde diciembre de 2024 hasta diciembre de 2025. Expresá todas las series con base diciembre de 2024 = 100. Usá períodos idénticos, dejá las observaciones faltantes como no disponibles y mostrá las fuentes. Explicá el crecimiento salarial descontada la inflación mediante un cociente, por separado de la diferencia en puntos porcentuales. Respondé en español.

Después:

> Hacé un gráfico de cada sector salarial frente a la inflación, con ejes de la misma escala. Exportá un Excel con los índices originales, fórmulas, gráficos y enlaces a las fuentes. Protegé los cálculos ante observaciones o bases faltantes para que los resultados que dependan de ellas no se conviertan en cero.

Estos índices sectoriales describen grupos de trabajadores; no determinan qué pasó con tu propio sueldo.

### 7. Explicalo a tu familia, a un grupo o en una clase

Después de conversar sobre inflación:

> Convertí nuestra explicación de la inflación de 2025 en un PDF A4 de una página, con un gráfico, tres ideas principales y un ejemplo sencillo en pesos. Incluí los períodos de referencia y enlaces a las fuentes oficiales. Usá fuentes tipográficas incrustadas y fórmulas en texto plano con operadores ASCII como - y *. Revisá el PDF descargado para detectar símbolos faltantes, texto cortado y etiquetas poco legibles. Respondé en español.

Otras consultas:

> Redactá un mensaje breve de WhatsApp que explique estas cifras con palabras cotidianas. Incluí el año y la fuente. No lo envíes.

> Explicáselo a un adolescente con un ejemplo de mesada. Explicá por qué una inflación más baja puede seguir significando que los precios suben.

> Hacé una presentación descargable de tres diapositivas a partir de esta explicación: qué cambió, un ejemplo cotidiano y qué recordar. Incluí el gráfico, las fechas y las fuentes.

### 8. Compará dos años con el mismo criterio

> Usá INDEC MCP para comparar la inflación nacional mensual de 2024 y 2025. Mostrá los meses correspondientes uno al lado del otro y graficálos. Informá por separado la inflación anual oficial de cada año; no sumes los porcentajes mensuales para obtener el dato anual. Mostrá las fuentes y señalá los valores faltantes. Respondé en español.

Después:

> Exportá un Excel con hojas separadas para 2024 y 2025 y una hoja de comparación con gráficos. Separá las observaciones oficiales de los cálculos, usá etiquetas claras de porcentajes y dejá los resultados como no disponibles cuando falten datos necesarios.

### 9. Armá un resumen económico que puedas repetir

> Usá INDEC MCP para darme un resumen en lenguaje sencillo de los últimos datos disponibles de inflación, salarios comparados con inflación, canastas básicas alimentaria y total, desocupación y actividad económica. Mostrá el período de referencia, las unidades, la cobertura y la fuente oficial de cada indicador. Para comparar salarios usá fechas coincidentes. Explicá que las canastas corresponden a un adulto equivalente del Gran Buenos Aires y que la desocupación abarca 31 aglomerados urbanos. Incluí algunos gráficos útiles con observaciones comparables. Indicá cuando un dato solicitado no esté disponible. Respondé en español.

Después:

> Explicá por qué estos indicadores corresponden a distintos meses o trimestres y qué puedo comparar razonablemente.

Para guardar el resumen original en un archivo:

> Exportá el resumen económico original, incluidos sus gráficos, tabla de indicadores, períodos de referencia, cobertura y enlaces a las fuentes, como un PDF de dos páginas. Mantené las fechas visibles. Usá fuentes tipográficas incrustadas y fórmulas en texto plano con operadores ASCII, por ejemplo (1.3561 / 1.335 - 1) * 100. Esos números solo ilustran la notación; calculá con los datos reales de períodos coincidentes obtenidos para este resumen. Revisá el archivo descargado para detectar símbolos faltantes, texto cortado y gráficos poco legibles. Respondé en español.

Para la próxima vez:

> Dame una consulta reutilizable para repetir este resumen el mes que viene, obteniendo datos nuevos e indicando claramente qué períodos de referencia cambiaron.

Si el PDF descargado tiene texto cortado o demasiado cerca de los bordes:

> Generá un PDF nuevo con las mismas cifras, gráficos y fórmulas ASCII. Mantené todo el texto y los gráficos dentro de márgenes de al menos 15 mm en ambas páginas y reservá espacio para el pie de página. Si hace falta, acortá las explicaciones en lugar de cortar contenido. Conservá etiquetas legibles en los gráficos y enlaces a las fuentes que se puedan abrir. Renderizá y revisá ambas páginas antes de entregar el archivo nuevo.

## Antes de guardar o compartir un resultado

- Revisá el **mes o trimestre**, las unidades y a qué personas o lugares corresponde la estadística.
- Descargá el archivo y abrilo. Verificá los montos y las fechas elegidas, las fórmulas y las etiquetas de los gráficos. Una vista previa por sí sola no demuestra que el archivo exportado funcione.
- Pedí que los datos faltantes se mantengan como no disponibles. Un monto vacío y un cero real significan cosas distintas.
- Distinguí las observaciones oficiales de los cálculos de ChatGPT y de tus propios números.
- Los archivos reflejan los datos de ese momento. Para actualizarlos, pedile a ChatGPT que obtenga datos nuevos y cree otro archivo.

Los flujos se probaron en ChatGPT el 3 de noviembre de 2026. Los gráficos, controles interactivos y archivos descargables dependen de las funciones disponibles en tu chat. Estas consultas mejoran la confiabilidad; revisá el resultado generado antes de usarlo para tomar decisiones.
