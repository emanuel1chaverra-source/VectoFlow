## Tabla 6 — Relaciones MER → Cardinalidades → Reglas de negocio

| Relación       | Entidad Origen              | Entidad Destino    | Cardinalidad | Regla de Negocio                                                                                  |
|----------------|-----------------------------|--------------------|--------------|---------------------------------------------------------------------------------------------------|
| tiene_rol      | USUARIOS                    | ROLES              | N:1          | Un usuario tiene exactamente un rol; un rol puede asignarse a muchos usuarios                     |
| crea           | USUARIOS (Docente)          | EJERCICIOS         | 1:N          | Un docente puede crear muchos ejercicios; cada ejercicio pertenece a un docente                   |
| ingresa        | USUARIOS (Estudiante)       | VECTORES           | 1:N          | Un estudiante puede ingresar muchos vectores; cada vector pertenece a un usuario                  |
| tiene_dimension| VECTORES                    | DIMENSION          | 1:1          | Cada vector tiene exactamente una dimensión; una dimensión pertenece a un vector                  |
| compone        | VECTORES                    | DETALLE_VECTOR     | 1:N          | Un vector tiene muchos elementos; cada elemento pertenece a un solo vector                        |
| ejecuta        | USUARIOS (Estudiante)       | OPERACIONES_SUMA   | 1:N          | Un estudiante puede ejecutar muchas sumas; cada suma pertenece a un estudiante                    |
| usa_vectorA    | OPERACIONES_SUMA            | VECTORES           | N:1          | Muchas operaciones pueden referenciar el mismo vector A                                           |
| usa_vectorB    | OPERACIONES_SUMA            | VECTORES           | N:1          | Muchas operaciones pueden referenciar el mismo vector B                                           |
| asociada_a     | OPERACIONES_SUMA            | EJERCICIOS         | N:1          | Una operación puede estar asociada a un ejercicio (FKEjercicio es opcional/nullable)              |
| genera         | OPERACIONES_SUMA            | METRICAS_DESEMPENO | 1:1          | Cada operación genera exactamente una métrica de desempeño                                        |
| evalua         | USUARIOS (Estudiante)       | METRICAS_DESEMPENO | 1:N          | Un estudiante puede tener muchas métricas; cada métrica pertenece a un estudiante                 |