# Bitácora

## Entrada #01 — [Semana 1 | 20/04/2026]
¿Qué hice?
Inicialicé el framework del proyecto VectoFlow con Node.js y Express. Creé el repositorio en GitHub con toda la estructura de carpetas definida (`src/config`, `controllers`, `middlewares`, `models`, `routes`, `services`) y subí los archivos base (`app.js`, `server.js`, `.env.example`, `package.json`). Redacté el `README.md` completo del proyecto.

¿Qué problema encontré?
Al hacer `git pull origin main` salía el error `fatal: not a git repository` porque la carpeta no estaba inicializada como repositorio Git.

¿Cómo lo resolví?
Cloné el repositorio directamente con `git clone https://github.com/mario07-07/VectoFlow` y entré a la carpeta correcta.

¿Usé IA? Sí — Usé IA para guiarme en la configuración inicial del framework y resolver el error de Git. Ajusté la estructura de carpetas según el Diagrama de Componentes del proyecto.

__________________________

## Entrada #02 — [Semana 3 | 2/05/2026]
¿Qué hice?
Creé la base de datos `vectoflow` en MySQL ejecutando el script DDL con las 12 tablas en 3FN: `ROLES`, `USUARIOS`, `SESIONES`, `CATEGORIAS_EJERCICIO`, `EJERCICIOS`, `ASIGNACIONES`, `DIMENSION`, `VECTORES`, `DETALLE_VECTOR`, `OPERACIONES_SUMA`, `INTENTOS_EJERCICIO`, `METRICAS_DESEMPENO`. Definí los modelos/entidades en el framework dentro de la carpeta `models/` y establecí las relaciones entre entidades en el código.

¿Qué problema encontré?
Al clonar el repositorio salía el error `fatal: destination path 'VectoFlow' already exists` porque la carpeta ya existía en el escritorio.

¿Cómo lo resolví?
Entré a la carpeta existente con `cd VectoFlow` y ejecuté el `git clone` desde ahí correctamente.

¿Usé IA? Sí — Usé IA para diseñar el MER en 3FN con las 12 tablas, generar el Diagrama de Clases, el Diagrama de Estados y el Mapa de Navegación actualizados. Verifiqué que las relaciones entre entidades fueran coherentes con el DD.

## Entrada #02 — [Semana 4 | 19/05/2026]
**¿Qué hice?**
Implementé el sistema de autenticación completo: registro de usuarios, login con JWT, y protección de rutas mediante middleware. También creé las tablas `USUARIOS` y `ROLES` en la base de datos según el MER en 3FN.

**¿Qué problema encontré?**
El token JWT llegaba al frontend pero al enviarlo en las peticiones `fetch` el servidor respondía `401 Unauthorized`. El middleware no lo estaba leyendo correctamente.

**¿Cómo lo resolví?**
Descubrí que el frontend enviaba el header como `bearer` (minúscula) y el middleware esperaba `Bearer` (mayúscula). Normalicé la lectura con `.split(' ')` para ignorar la capitalización.

**¿Usé IA?** Sí — El asistente me sugirió revisar el header Authorization. Tuve que adaptar el código porque el ejemplo usaba `req.headers.authorization` pero en mi versión de Express era necesario también manejar el caso `undefined`.

___________________________________

## Entrada #03 — [Semana 5 | 26/05/2025]
**¿Qué hice?**
Desarrollé la funcionalidad principal del proyecto: el módulo de suma de vectores. Implementé el endpoint `POST /api/operaciones`, la lógica de inserción en `VECTORES`, `DETALLE_VECTOR` y `HISTORIAL_SUMAS`, y la página `detalle-vector.html` con visualización atómica índice por índice.

**¿Qué problema encontré?**
La página `detalle-vector.html` mostraba siempre "Cargando datos..." aunque el backend respondía correctamente con `200 OK`. El problema era que el `rol` guardado en `localStorage` era un número (`2`) pero el JS lo comparaba como string (`'Estudiante'`).

**¿Cómo lo resolví?**
Corregí todas las comparaciones de rol en `detalle-vector.js` para usar números enteros (`rol === 2`, `rol === 3`) en lugar de strings. También separé la lectura del token del objeto sesión, ya que el login los guarda en claves distintas de `localStorage`.

**¿Usé IA?** Sí — El asistente identificó el error de tipo de dato en la comparación del rol y me entregó el archivo `detalle-vector.js` corregido y documentado. Verifiqué cada función antes de reemplazar el archivo original.