Ejercicio 5 — Componente de carga + estados de “trabajando”

Aquí ya entramos en UX profesional: si algo tarda, el usuario debe verlo.

Cómo lo enfoqué

Creé un componente reutilizable: LoadingIndicator.

Esto es didáctico porque aprendes a componer: no metes spinners repetidos por todos lados.

Luego definí dos momentos distintos donde “cargar” tiene sentido:

isLoadingInitial: cuando arrancas la app y estás reconstruyendo los audios desde storage.

isRecordingBusy: cuando estás empezando/parando una grabación (son operaciones async).

Esto enseña una idea buena:

“Loading no es solo uno. Puede haber varios estados de carga con sentidos diferentes.”