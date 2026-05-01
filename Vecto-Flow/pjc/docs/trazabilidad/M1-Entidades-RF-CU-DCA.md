## Tabla 1 — Entidades externas → RF → CU → DCA

| Entidad Externa | RF Asociado | CU Asociado       | DCA                                                              |
|-----------------|-------------|-------------------|------------------------------------------------------------------|
| Estudiante      | RF-001      | CU01              | Ingresa vectores A y B con dimensión y valores al sistema        |
| Estudiante      | RF-002      | CU08              | Consulta valor en posición específica del vector                 |
| Estudiante      | RF-003      | CU15              | Modifica valor de un vector antes de ejecutar la suma            |
| Estudiante      | RF-004      | CU12              | Reinicia vectores activos en pantalla sin afectar historial      |
| Estudiante      | RF-005      | CU16              | Consulta tamaño actual de los vectores activos                   |
| Estudiante      | RF-006      | CU12              | Limpia completamente los vectores A y B con confirmación         |
| Estudiante      | RF-007      | CU07              | Agrega vector adicional a la suma acumulada                      |
| Estudiante      | RF-008      | CU05              | Recorre secuencialmente los elementos del vector                 |
| Estudiante      | RF-009      | CU03, CU06, CU07  | Ejecuta suma C[i] = A[i] + B[i] y visualiza resultado           |
| Estudiante      | RF-010      | CU07              | Restablece dos vectores del mismo tamaño                         |
| Estudiante      | RF-011      | CU06              | Consulta suma total acumulada del vector resultado C             |
| Estudiante      | RF-012      | CU08              | Consulta valor C[i] en índice específico con A[i] y B[i]        |
| Estudiante      | RF-013      | CU17              | Visualiza resultado en tabla con columnas Índice, A, B, C        |
| Estudiante      | RF-014      | CU13              | Lee explicación textual paso a paso de la suma                   |
| Estudiante      | RF-015      | CU18              | Descarga resultado en PDF o Excel                                |
| Estudiante      | RF-016      | CU10              | Consulta historial de sumas realizadas                           |
| Estudiante      | RF-017      | CU01, CU03        | Recibe alerta por dimensiones incompatibles                      |
| Estudiante      | RF-018      | CU04, CU05, CU13, CU17 | Visualiza suma paso a paso animada índice por índice        |
| Estudiante      | RF-019      | CU09, CU10, CU19  | Guarda operación en historial y consulta resumen de sesión       |
| Docente         | RF-020      | CU20, CU21        | Crea y asigna ejercicios de suma de vectores                     |
| Docente         | RF-021      | CU22              | Monitorea historial y métricas de estudiantes                    |
| Docente         | RF-022      | CU23              | Exporta resultados de estudiantes en PDF o Excel                 |
| Administrador   | RF-023      | CU03              | Valida exactitud de los cálculos del sistema                     |
| Administrador   | RF-024      | CU24              | Gestiona usuarios y roles (CRUD completo)                        |
| Administrador   | RF-025      | CU25              | Genera informe global de uso y desempeño                         |