Ejercicio 1.

Primero dejé clara la idea principal de estado:

recording: cuando estás grabando, guardas el objeto Audio.Recording.

recordings: cuando paras, esa grabación “pasa” a la lista como un elemento reproducible (con sound, duration, file).

Luego completé lo que faltaba de funcionalidad típica:

Un indicador visual de “estoy grabando” (aunque sea simple: un texto tipo ● Recording...).
Esto es importante porque en apps reales el usuario necesita feedback inmediato.

# Añadí borrado individual y borrado total:

## Borrar individual: eliminas un elemento del array, pero además es buena práctica liberar recursos (sound.unloadAsync()).

## Borrar todo: lo mismo, pero recorriendo todos los sonidos antes de vaciar la lista.

En resumen: primero funcionalidad (grabar/parar), luego UX (indicador), luego mantenimiento (borrados + liberar recursos), y por último el detalle de tipos/props.