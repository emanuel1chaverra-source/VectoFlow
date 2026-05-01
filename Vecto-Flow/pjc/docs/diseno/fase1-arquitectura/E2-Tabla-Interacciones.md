## 8.1.2 Tabla de Interacciones del Sistema

| # | Entidad Externa | Tipo       | Rol / Descripción                              | Datos que envía                                      | Datos que recibe                                        | Protocolo   |
|---|-----------------|------------|------------------------------------------------|------------------------------------------------------|---------------------------------------------------------|-------------|
| 1 | Estudiante      | Persona    | Consume el servicio de suma de vectores        | Valores de vectores, solicitudes de suma             | Resultados, visualización paso a paso, historial        | Web / HTTPS |
| 2 | Docente         | Persona    | Gestiona ejercicios y monitorea estudiantes    | Datos de ejercicios, solicitudes de métricas         | Ejercicios creados, reportes de desempeño               | Web / HTTPS |
| 3 | Administrador   | Persona    | Gestiona usuarios y configuración              | Datos de usuarios, parámetros                        | Confirmaciones, reportes globales                       | Web / HTTPS |
| 4 | Módulo Auth     | Sistema    | Valida identidad y permisos                    | Token de sesión, credenciales                        | Confirmación de identidad y rol                         | API / REST  |
| 5 | Navegador Web   | Dispositivo| Interfaz de acceso para todos los roles        | Peticiones HTTP                                      | Respuestas HTML/JS, resultados                          | Web / HTTPS |