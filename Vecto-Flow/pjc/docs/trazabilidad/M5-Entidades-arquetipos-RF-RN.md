## Tabla 5 — Entidades → Arquetipos → RF → Reglas de negocio

| Entidad          | Arquetipo             | RF Asociado      | Regla de Negocio                                                                                 |
|------------------|-----------------------|------------------|--------------------------------------------------------------------------------------------------|
| ROLES            | Administrador         | RF-024           | Solo existen tres roles válidos: Estudiante, Docente, Administrador                              |
| ROLES            | Administrador         | RF-024           | No se pueden eliminar roles con usuarios activos asociados                                       |
| ROLES            | Administrador         | RF-024           | El nombre del rol debe ser único en el sistema                                                   |
| USUARIOS         | Administrador         | RF-024           | El correo electrónico debe ser único por usuario                                                 |
| USUARIOS         | Administrador         | RF-024           | Los usuarios no se eliminan físicamente; se desactivan (Estado=0)                                |
| USUARIOS         | Administrador         | RF-024           | Solo un Administrador puede crear, modificar o desactivar usuarios                               |
| USUARIOS         | Estudiante, Docente   | RF-024           | Un usuario solo puede tener un rol activo a la vez                                               |
| USUARIOS         | Todos                 | RF-012           | La contraseña debe almacenarse cifrada (SHA-256 o superior)                                      |
| EJERCICIOS       | Docente               | RF-020           | Solo usuarios con rol Docente pueden crear y asignar ejercicios                                  |
| EJERCICIOS       | Docente               | RF-020           | Un ejercicio no puede asignarse con vectores de dimensiones distintas                            |
| EJERCICIOS       | Docente               | RF-020           | El título del ejercicio es obligatorio y no puede estar vacío                                    |
| EJERCICIOS       | Docente               | RF-020           | Los ejercicios no se eliminan físicamente; se desactivan (Estado=0)                              |
| VECTORES         | Estudiante            | RF-001, RF-017   | Los vectores A y B deben tener la misma dimensión para sumar                                     |
| VECTORES         | Estudiante            | RF-001           | La dimensión debe ser un entero positivo mayor a 0                                               |
| VECTORES         | Estudiante            | RF-001           | El nombre del vector debe ser etiqueta válida: A, B, C, etc.                                     |
| VECTORES         | Estudiante            | RF-009           | No se puede ejecutar suma si algún vector no tiene todos sus elementos en DETALLE_VECTOR          |
| DIMENSION        | Estudiante            | RF-017           | El campo Tamaño debe ser entero positivo mayor a 0                                               |
| DIMENSION        | Estudiante            | RF-017           | Dos vectores solo pueden sumarse si sus registros en DIMENSION tienen igual Tamaño               |
| DIMENSION        | Estudiante            | RF-001           | No puede existir un registro en DIMENSION sin vector asociado en VECTORES                        |
| DIMENSION        | Estudiante            | RF-003           | Una vez con elementos en DETALLE_VECTOR, el Tamaño no puede modificarse                          |
| DETALLE_VECTOR   | Estudiante            | RF-001           | El índice debe ser único por vector; consecutivo desde 0 hasta Dimension-1                       |
| DETALLE_VECTOR   | Estudiante            | RF-001           | El valor de cada posición debe ser FLOAT; no se permiten nulos                                   |
| DETALLE_VECTOR   | Estudiante            | RF-009           | La cantidad de registros debe coincidir exactamente con la dimensión del vector                  |
| OPERACIONES_SUMA | Estudiante            | RF-009, RF-019   | Solo Estudiantes pueden ejecutar y registrar operaciones de suma                                 |
| OPERACIONES_SUMA | Estudiante            | RF-009           | Debe referenciar obligatoriamente FKVectorA y FKVectorB válidos en VECTORES                      |
| OPERACIONES_SUMA   | Estudiante | RF-017 | Los vectores A y B referenciados deben tener igual dimensión                              |
| OPERACIONES_SUMA   | Estudiante | RF-019 | No se puede eliminar una operación con métricas asociadas en METRICAS_DESEMPENO           |
| METRICAS_DESEMPENO | Estudiante | RF-019 | Solo un registro de métricas por operación; no pueden existir dos con el mismo FKOperacion|
| METRICAS_DESEMPENO | Estudiante | RF-019 | El campo Aciertos no puede ser mayor que Intentos                                         |
| METRICAS_DESEMPENO | Estudiante | RF-019 | TiempoSegundos debe ser un valor positivo mayor a 0                                       |