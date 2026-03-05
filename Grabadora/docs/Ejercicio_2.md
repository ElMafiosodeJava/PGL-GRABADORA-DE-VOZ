
Ejercicio 2

Aquí el problema no era “hacer más features”, sino que la UI no se vuelva inutilizable cuando la lista crece.

Cómo lo enfoqué

Una lista de grabaciones puede crecer mucho, así que si la pones en un View normal, se puede salir de pantalla.

La solución mínima y limpia fue meter el listado dentro de un ScrollView.

Esto es un concepto importante:
cuando un requisito es “diseño”, muchas veces es “comportamiento de la UI” (scroll, alineación, espacio, etc.), no solo colores.