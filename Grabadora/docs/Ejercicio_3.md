Ejercicio 3

Este ejercicio va de aprender una regla básica en móvil:

“No asumas permisos. Pídelos justo cuando los necesitas.”

Cómo lo enfoqué

Los permisos los gestioné en el lugar correcto: startRecording().

Primero pido permiso (requestPermissionsAsync)

Si no lo dan, no sigo (return) y muestro mensaje.

Y lo más importante a nivel educativo:
no es solo pedir permisos, es aprender el patrón:

pedir → 2, validar → 3, actuar.