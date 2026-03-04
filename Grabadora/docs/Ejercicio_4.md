Ejercicio 4 — Persistencia (que no se pierdan al cerrar la app)

Este ejercicio ya es “vida real”: si cierras y abres la app, quieres que tus grabaciones sigan ahí.

Cómo lo enfoqué

Separé lo que es “dato persistible” de lo que es “objeto en memoria”:

Persistible: URI del archivo + duración (valores simples).

No persistible: Audio.Sound (eso es un objeto del runtime).

Por eso guardé en AsyncStorage solo:

{ uri, durationMillis }

Y al iniciar la app (useEffect):

leo AsyncStorage

recorro esas URIs

y creo de nuevo los Audio.Sound con Audio.Sound.createAsync({ uri }).

Este ejercicio enseña algo clave:

“Persistes referencias/datos, y reconstruyes los objetos cuando arrancas.”