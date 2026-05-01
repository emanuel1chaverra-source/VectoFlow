# Bitácora

## Entrada #01 — Vie 17 Abril 2025
¿Qué hice?
Inicialicé el framework del proyecto VectoFlow con Node.js y Express. Creé el repositorio en GitHub con toda la estructura de carpetas definida (`src/config`, `controllers`, `middlewares`, `models`, `routes`, `services`) y subí los archivos base (`app.js`, `server.js`, `.env.example`, `package.json`). Redacté el `README.md` completo del proyecto.

¿Qué problema encontré?
Al hacer `git pull origin main` salía el error `fatal: not a git repository` porque la carpeta no estaba inicializada como repositorio Git.

¿Cómo lo resolví?
Cloné el repositorio directamente con `git clone https://github.com/mario07-07/VectoFlow` y entré a la carpeta correcta.

¿Usé IA? Sí — Usé IA para guiarme en la configuración inicial del framework y resolver el error de Git. Ajusté la estructura de carpetas según el Diagrama de Componentes del proyecto.

__________________________

## Entrada #02 — Vie 25 Abril 2025
¿Qué hice?
Creé la base de datos `vectoflow` en MySQL ejecutando el script DDL con las 12 tablas en 3FN: `ROLES`, `USUARIOS`, `SESIONES`, `CATEGORIAS_EJERCICIO`, `EJERCICIOS`, `ASIGNACIONES`, `DIMENSION`, `VECTORES`, `DETALLE_VECTOR`, `OPERACIONES_SUMA`, `INTENTOS_EJERCICIO`, `METRICAS_DESEMPENO`. Definí los modelos/entidades en el framework dentro de la carpeta `models/` y establecí las relaciones entre entidades en el código.

¿Qué problema encontré?
Al clonar el repositorio salía el error `fatal: destination path 'VectoFlow' already exists` porque la carpeta ya existía en el escritorio.

¿Cómo lo resolví?
Entré a la carpeta existente con `cd VectoFlow` y ejecuté el `git clone` desde ahí correctamente.

¿Usé IA? Sí — Usé IA para diseñar el MER en 3FN con las 12 tablas, generar el Diagrama de Clases, el Diagrama de Estados y el Mapa de Navegación actualizados. Verifiqué que las relaciones entre entidades fueran coherentes con el DD.