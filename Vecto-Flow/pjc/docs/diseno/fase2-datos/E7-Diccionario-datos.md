# Diccionario de datos 

El diccionario de datos describe las 12 tablas que componen la base de datos del sistema VectoFlow.

________________________________________

# Tabla: ROLES
*Descripción: Almacena los tipos de roles disponibles en el sistema (Estudiante, Docente, Administrador).*

| Campo | Tipo de Dato | Tamaño | Nulo | Auto Inc. | Tipo de Campo | Tabla Relacionada | Descripción |
|---|---|---|---|---|---|---|---|
| PKRol | INT | 11 | No | Sí | Clave Primaria | - | Identificador único del rol |
| NombreRol | VARCHAR | 50 | No | No | Campo | - | Nombre del rol |
| Descripcion | VARCHAR | 150 | Sí | No | Campo | - | Descripción del rol y permisos |

________________________________________

# Tabla: USUARIOS
*Descripción: Guarda todos los usuarios registrados en VectoFlow con sus datos de acceso y rol asignado.*

| Campo | Tipo de Dato | Tamaño | Nulo | Auto Inc. | Tipo de Campo | Tabla Relacionada | Descripción |
|---|---|---|---|---|---|---|---|
| PKUsuario | INT | 11 | No | Sí | Clave Primaria | - | Identificador único del usuario |
| Nombre | VARCHAR | 60 | No | No | Campo | - | Nombre del usuario |
| Apellido | VARCHAR | 60 | No | No | Campo | - | Apellido del usuario |
| Correo | VARCHAR | 100 | No | No | Campo | - | Correo electrónico para login |
| Contraseña | VARCHAR | 255 | No | No | Campo | - | Contraseña cifrada |
| FechaRegistro | DATE | - | No | No | Campo | - | Fecha de registro |
| Estado | TINYINT | 1 | No | No | Campo | - | 1=Activo, 0=Inactivo |
| FKRol | INT | 11 | No | No | Clave Foránea | ROLES | Rol asignado al usuario |

________________________________________

## Tabla: CATEGORIAS_EJERCICIO
*Descripción: Permite clasificar los ejercicios por nivel o tipo, evitando redundancia de datos en EJERCICIOS.*

| Campo | Tipo de Dato | Tamaño | Nulo | Auto Inc. | Tipo de Campo | Tabla Relacionada | Descripción |
|---|---|---|---|---|---|---|---|
| PKCategoria | INT | 11 | No | Sí | Clave Primaria | - | Identificador único de la categoría |
| NombreCategoria | VARCHAR | 80 | No | No | Campo | - | Nombre de la categoría (ej: Básico, Intermedio, Avanzado) |
| Descripcion | VARCHAR | 200 | Sí | No | Campo | - | Descripción del nivel o tipo de ejercicio |
| Estado | TINYINT | 1 | No | No | Campo | - | Estado: 1=Activa, 0=Inactiva |

________________________________________

## Tabla: EJERCICIOS
*Descripción: Contiene los ejercicios de suma de vectores creados por los docentes.*

| Campo | Tipo de Dato | Tamaño | Nulo | Auto Inc. | Tipo de Campo | Tabla Relacionada | Descripción |
|---|---|---|---|---|---|---|---|
| PKEjercicio | INT | 11 | No | Sí | Clave Primaria | - | Identificador único del ejercicio |
| Titulo | VARCHAR | 100 | No | No | Campo | - | Título del ejercicio |
| Descripcion | TEXT | - | Sí | No | Campo | - | Enunciado o instrucciones |
| FechaCreacion | DATE | - | No | No | Campo | - | Fecha de creación |
| Estado | TINYINT | 1 | No | No | Campo | - | 1=Activo, 0=Inactivo |
| FKDocente | INT | 11 | No | No | Clave Foránea | USUARIOS | Docente que creó el ejercicio |
| FKCategoria | INT | 11 | No | No | Clave Foránea | CATEGORIAS_EJERCICIO | Categoría a la que pertenece el ejercicio |

_________________________________________

## Tabla: ASIGNACIONES
*Descripción: Formaliza la relación docente-estudiante-ejercicio. Tabla pivote que registra qué ejercicio fue asignado a quién y por quién.*

| Campo | Tipo de Dato | Tamaño | Nulo | Auto Inc. | Tipo de Campo | Tabla Relacionada | Descripción |
|---|---|---|---|---|---|---|---|
| PKAsignacion | INT | 11 | No | Sí | Clave Primaria | - | Identificador único de la asignación |
| FechaAsignacion | DATE | - | No | No | Campo | - | Fecha en que se realizó la asignación |
| FechaLimite | DATE | - | Sí | No | Campo | - | Fecha límite para completar el ejercicio |
| Estado | TINYINT | 1 | No | No | Campo | - | Estado: 1=Pendiente, 2=Completada, 3=Vencida |
| FKEjercicio | INT | 11 | No | No | Clave Foránea | EJERCICIOS | Ejercicio asignado |
| FKEstudiante | INT | 11 | No | No | Clave Foránea | USUARIOS | Estudiante al que se le asignó |
| FKDocente | INT | 11 | No | No | Clave Foránea | USUARIOS | Docente que realizó la asignación |

______________________________________

## Tabla: SESIONES
*Descripción: Registra los accesos al sistema para auditoría y seguimiento de actividad de usuarios.*

| Campo | Tipo de Dato | Tamaño | Nulo | Auto Inc. | Tipo de Campo | Tabla Relacionada | Descripción |
|---|---|---|---|---|---|---|---|
| PKSesion | INT | 11 | No | Sí | Clave Primaria | - | Identificador único de la sesión |
| FechaInicio | DATETIME | - | No | No | Campo | - | Fecha y hora de inicio de sesión |
| FechaFin | DATETIME | - | Sí | No | Campo | - | Fecha y hora de cierre de sesión |
| IPAcceso | VARCHAR | 45 | Sí | No | Campo | - | Dirección IP desde donde se conectó |
| Dispositivo | VARCHAR | 100 | Sí | No | Campo | - | Información del dispositivo o navegador |
| Estado | TINYINT | 1 | No | No | Campo | - | Estado: 1=Activa, 0=Cerrada |
| FKUsuario | INT | 11 | No | No | Clave Foránea | USUARIOS | Usuario que inició la sesión |

_______________________________________

## Tabla: VECTORES
*Descripción: Cabecera de cada vector ingresado al sistema.*

| Campo | Tipo de Dato | Tamaño | Nulo | Auto Inc. | Tipo de Campo | Tabla Relacionada | Descripción |
|---|---|---|---|---|---|---|---|
| PKVector | INT | 11 | No | Sí | Clave Primaria | - | Identificador único del vector |
| NombreVector | VARCHAR | 10 | No | No | Campo | - | Etiqueta: A, B, C, etc. |
| FKDimensión | INT | 11 | No | No | Clave Foránea | DIMENSION | Referencia a la dimensión del vector |
| FKUsuario | INT | 11 | No | No | Clave Foránea | USUARIOS | Usuario que ingresó el vector |

___________________________________________

## Tabla: DETALLE_VECTOR
*Descripción: Almacena cada elemento individual del vector de forma atómica.*

| Campo | Tipo de Dato | Tamaño | Nulo | Auto Inc. | Tipo de Campo | Tabla Relacionada | Descripción |
|---|---|---|---|---|---|---|---|
| PKDetalle | INT | 11 | No | Sí | Clave Primaria | - | Identificador único |
| Indice | INT | 11 | No | No | Campo | - | Posición del elemento (i) |
| Valor | FLOAT | - | No | No | Campo | - | Valor numérico en posición i |
| FKVector | INT | 11 | No | No | Clave Foránea | VECTORES | Vector al que pertenece |

_____________________________________________

## Tabla: OPERACIONES_SUMA
*Descripción: Historial de cada operación de suma de vectores ejecutada.*

| Campo | Tipo de Dato | Tamaño | Nulo | Auto Inc. | Tipo de Campo | Tabla Relacionada | Descripción |
|---|---|---|---|---|---|---|---|
| PKOperacion | INT | 11 | No | Sí | Clave Primaria | - | Identificador único |
| FechaOperacion | DATETIME | - | No | No | Campo | - | Fecha/hora de la suma |
| FKEstudiante | INT | 11 | No | No | Clave Foránea | USUARIOS | Estudiante que ejecutó |
| FKVectorA | INT | 11 | No | No | Clave Foránea | VECTORES | Vector A operando |
| FKVectorB | INT | 11 | No | No | Clave Foránea | VECTORES | Vector B operando |
| FKVectorC | INT | 11 | No | No | Clave Foránea | VECTORES | Vector resultado de la operación de suma |
| FKEjercicio | INT | 11 | Sí | No | Clave Foránea | EJERCICIOS | Ejercicio asociado (opcional) |

____________________________________________

## Tabla: INTENTOS_EJERCICIO
*Descripción: Guarda el historial detallado de cada intento que un estudiante realiza sobre una asignación.*

| Campo | Tipo de Dato | Tamaño | Nulo | Auto Inc. | Tipo de Campo | Tabla Relacionada | Descripción |
|---|---|---|---|---|---|---|---|
| PKIntento | INT | 11 | No | Sí | Clave Primaria | - | Identificador único del intento |
| NumeroIntento | INT | 11 | No | No | Campo | - | Número de intento (1°, 2°, 3°...) |
| FechaIntento | DATETIME | - | No | No | Campo | - | Fecha y hora en que se realizó el intento |
| TiempoSegundos | INT | 11 | Sí | No | Campo | - | Tiempo en segundos que tardó el estudiante |
| Calificacion | FLOAT | - | Sí | No | Campo | - | Calificación obtenida en el intento |
| Observacion | TEXT | - | Sí | No | Campo | - | Retroalimentación o nota del docente |
| FKAsignacion | INT | 11 | No | No | Clave Foránea | ASIGNACIONES | Asignación a la que pertenece el intento |
| FKOperacion | INT | 11 | Sí | No | Clave Foránea | OPERACIONES_SUMA | Operación de suma ejecutada en el intento |

________________________________________________

## Tabla: METRICAS_DESEMPENO
*Descripción: Registra las métricas de desempeño de cada estudiante por operación.*

| Campo | Tipo de Dato | Tamaño | Nulo | Auto Inc. | Tipo de Campo | Tabla Relacionada | Descripción |
|---|---|---|---|---|---|---|---|
| PKMetrica | INT | 11 | No | Sí | Clave Primaria | - | Identificador único |
| Intentos | INT | 11 | No | No | Campo | - | Número de intentos |
| TiempoSegundos | INT | 11 | No | No | Campo | - | Tiempo en segundos |
| Aciertos | INT | 11 | No | No | Campo | - | Respuestas correctas |
| FechaRegistro | DATETIME | - | No | No | Campo | - | Fecha/hora del registro |
| FKOperacion | INT | 11 | No | No | Clave Foránea | OPERACIONES_SUMA | Operación asociada |

____________________________________________

## Tabla: DIMENSION
*Descripción: Almacena las dimensiones disponibles para los vectores en el sistema.*

| Campo | Tipo de Dato | Tamaño | Nulo | Auto Inc. | Tipo de Campo | Tabla Relacionada | Descripción |
|---|---|---|---|---|---|---|---|
| PKDimension | INT | 11 | No | Sí | Clave Primaria | - | Identificador único de la dimensión |
| Tamaño | INT | 11 | No | No | Campo | - | Tamaño o número de elementos del vector |
