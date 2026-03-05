# PGL-GRABADORA-DE-VOZ

# Grabadora de Audio con React Native y Expo

## Descripción general

Esta aplicación es una grabadora de audio desarrollada con **React Native** utilizando el ecosistema **Expo**. Su objetivo es demostrar el uso de diferentes APIs del dispositivo móvil, incluyendo grabación de audio, almacenamiento local, sensores y gestión de estados asíncronos dentro de una interfaz de usuario sencilla.

La aplicación permite grabar audio desde el micrófono del dispositivo, almacenar las grabaciones localmente para que persistan entre sesiones, reproducirlas posteriormente y eliminarlas si el usuario lo desea. Además, incorpora indicadores de estado durante procesos asíncronos y muestra datos provenientes del acelerómetro del dispositivo.

El proyecto está orientado al aprendizaje del desarrollo móvil con React Native, integrando varias funcionalidades del dispositivo en una única aplicación.

---

## Funcionalidades principales

### Grabación de audio

La aplicación permite iniciar y detener grabaciones utilizando la API de audio proporcionada por **expo-av**. Cuando el usuario inicia una grabación, se solicita permiso para acceder al micrófono del dispositivo. Si el permiso es concedido, la aplicación comienza a grabar audio con una configuración de alta calidad.

Al detener la grabación:

- El archivo de audio se guarda en el almacenamiento interno del dispositivo.
- Se calcula la duración de la grabación.
- Se añade a la lista de grabaciones disponibles en la interfaz.

---

### Listado de grabaciones

Todas las grabaciones realizadas se muestran en una lista desplazable. Cada elemento de la lista incluye:

- Un identificador de la grabación.
- La duración formateada en minutos y segundos.
- Un botón para reproducir el audio.
- Un botón para eliminar la grabación individualmente.

El listado permite gestionar múltiples grabaciones sin limitar la cantidad de elementos visibles en pantalla.

---

### Reproducción de audio

Cada grabación almacenada puede reproducirse individualmente. La reproducción se realiza utilizando el objeto `Audio.Sound` de Expo, que permite cargar el archivo desde su URI y reproducirlo directamente desde la aplicación.

---

### Eliminación de grabaciones

La aplicación permite eliminar grabaciones de dos formas:

- **Eliminación individual:** se puede borrar una grabación específica desde la lista.
- **Eliminación total:** se pueden eliminar todas las grabaciones almacenadas.

Antes de eliminar una grabación, se libera el recurso de audio asociado para evitar mantener objetos de sonido activos en memoria.

---

### Persistencia de datos

Las grabaciones se almacenan utilizando **AsyncStorage**, lo que permite mantener la información incluso después de cerrar la aplicación.

En lugar de almacenar los objetos de audio completos, se guardan únicamente:

- La URI del archivo de audio.
- La duración de la grabación.

Cuando la aplicación se inicia, se recuperan estos datos y se reconstruyen los objetos de sonido necesarios para reproducir los archivos almacenados.

---

### Indicadores de carga

La aplicación incluye un componente reutilizable de carga (`LoadingIndicator`) que se utiliza en diferentes momentos:

- Durante la carga inicial de las grabaciones guardadas.
- Mientras se realizan operaciones asíncronas relacionadas con la grabación.

Esto permite mejorar la experiencia de usuario mostrando claramente cuándo la aplicación está procesando una operación.

---

### Indicador de grabación activa

Cuando una grabación está en curso, la interfaz muestra un indicador visual que informa al usuario de que el micrófono se encuentra grabando en ese momento.

---

### Sensor de movimiento

La aplicación también integra el uso del **acelerómetro** mediante el módulo `expo-sensors`.

El acelerómetro proporciona información sobre el movimiento del dispositivo en tres ejes:

- X
- Y
- Z

Estos valores se actualizan periódicamente y se muestran en la interfaz para demostrar la lectura de datos de sensores del dispositivo.

---

## Tecnologías utilizadas

- **React Native**
- **Expo**
- **expo-av** para grabación y reproducción de audio
- **expo-sensors** para acceder al acelerómetro
- **AsyncStorage** para almacenamiento persistente
- **TypeScript**

---

## Objetivo educativo

Este proyecto está diseñado como una práctica de aprendizaje en desarrollo móvil. A través de su implementación se trabajan conceptos fundamentales como:

- Gestión de estados en React
- Uso de APIs nativas del dispositivo
- Manejo de operaciones asíncronas
- Persistencia de datos en aplicaciones móviles
- Integración de sensores
- Diseño de interfaces básicas en React Native

El resultado es una aplicación sencilla pero completa que combina varias capacidades del dispositivo dentro de un mismo proyecto.

##Ejercicios
[Ejercicio_1](https://github.com/ElMafiosodeJava/PGL-GRABADORA-DE-VOZ/blob/main/Grabadora/docs/Ejercicio_1.md)
[Ejercicio_2](https://github.com/ElMafiosodeJava/PGL-GRABADORA-DE-VOZ/blob/main/Grabadora/docs/Ejercicio_2.md)
[Ejercicio_3](https://github.com/ElMafiosodeJava/PGL-GRABADORA-DE-VOZ/blob/main/Grabadora/docs/Ejercicio_3.md)
[Ejercicio_4](https://github.com/ElMafiosodeJava/PGL-GRABADORA-DE-VOZ/blob/main/Grabadora/docs/Ejercicio_4.md)
[Ejercicio_5](https://github.com/ElMafiosodeJava/PGL-GRABADORA-DE-VOZ/blob/main/Grabadora/docs/Ejercicio_5.md)
[Ejercicio_6](https://github.com/ElMafiosodeJava/PGL-GRABADORA-DE-VOZ/blob/main/Grabadora/docs/Ejercicio_6.md)
