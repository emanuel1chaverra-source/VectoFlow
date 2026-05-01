## Tabla 4 — Nodos de despliegue → Protocolos → RNF → Componentes

| Nodo de Despliegue                  | Protocolo  | RNF Asociado                                              | Componente                                      |
|-------------------------------------|------------|-----------------------------------------------------------|-------------------------------------------------|
| PC Estudiante (1366x768, 1920x1080) | HTTPS      | RNF-01 (Rendimiento ≤2s), RNF-10 (Responsive)            | Navegador Web — Interfaz Estudiante             |
| PC Estudiante                       | HTTPS      | RNF-03 (Animaciones 0.5–1.5s), RNF-17 (3 colores)        | Módulo Visualización Paso a Paso                |
| PC Docente / Administrador          | HTTPS      | RNF-12 (Seguridad, bloqueo 10 intentos)                   | Navegador Web — Interfaz Docente/Admin          |
| PC Docente / Administrador          | HTTPS      | RNF-18 (Exportación ≤5s)                                  | Módulo Exportación PDF/Excel                    |
| Servidor de Aplicaciones            | HTTPS      | RNF-08 (100 usuarios concurrentes), RNF-20 (500 usuarios) | Módulo Suma de Vectores                         |
| Servidor de Aplicaciones            | HTTPS/REST | RNF-12 (Autenticación JWT)                                | Módulo Autenticación                            |
| Servidor de Aplicaciones            | JDBC/SQL   | RNF-09 (Guardado <1s), RNF-15 (Timestamp 100%)            | Módulo Historial / OPERACIONES_SUMA             |
| Servidor de Aplicaciones            | JDBC/SQL   | RNF-04 (Precisión 100%), RNF-24 (Consistencia cliente-servidor) | Motor de Cálculo Suma                     |
| Servidor de Aplicaciones            | JDBC/SQL   | RNF-23 (Reportes ≤4s para 1000 registros)                 | Módulo Métricas / Reportes                      |
| Servidor de BD (MySQL/PostgreSQL)   | JDBC/SQL   | RNF-06 (Integridad 0% pérdida), RNF-21 (Historial único)  | Tablas VECTORES, DETALLE_VECTOR, OPERACIONES_SUMA |
| Servidor de BD                      | JDBC/SQL   | RNF-25 (Hash SHA-256, datos cifrados)                     | Tabla USUARIOS — campo Contraseña               |
| Servidor de BD                      | JDBC/SQL   | RNF-22 (Reinicio conserva config 100%)                    | Tablas VECTORES, DETALLE_VECTOR                 |