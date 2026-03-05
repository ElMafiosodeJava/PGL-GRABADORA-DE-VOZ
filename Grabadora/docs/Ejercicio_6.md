Ejercicio 6 — Sensor (movimiento) como dato en pantalla

Este ejercicio no es porque la grabadora lo necesite, sino para que practiques integrar una API del móvil.

Cómo lo enfoqué

Elegí acelerómetro porque es el ejemplo más directo: da valores x/y/z.

Me suscribí con Accelerometer.addListener(...) y actualicé estado.

Mostré los valores formateados en un Text.

Lo educativo aquí:

Aprendes el patrón de sensores: suscripción → actualizar estado → cleanup.

Aprendes que hay que “desuscribirse” en el return del useEffect, o tendrás fugas de listeners.