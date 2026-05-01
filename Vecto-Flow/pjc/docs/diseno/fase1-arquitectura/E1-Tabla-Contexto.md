## 8.1.1 Tabla de Contexto del Sistema

| # | Entrada | Fuente | Proceso | Salida | Destino |
|---|---------|--------|---------|--------|---------|
| 1 | Datos de registro (nombre, correo, contraseña, rol) | Estudiante / Docente / Admin | Validar y almacenar usuario en BD | Confirmación de registro | Usuario registrado |
| 2 | Credenciales de acceso (correo + contraseña) | Estudiante / Docente / Admin | Autenticar usuario y generar sesión | Acceso al sistema según rol | Panel de usuario |
| 3 | Valores del vector A (índices + valores numéricos) | Estudiante | Validar dimensión y almacenar vector en BD | Vector A guardado | Módulo de suma |
| 4 | Valores del vector B (índices + valores numéricos) | Estudiante | Validar dimensión y almacenar vector en BD | Vector B guardado | Módulo de suma |
| 5 | Solicitud de suma A + B | Estudiante | Validar dimensiones, ejecutar C[i] = A[i] + B[i] | Vector resultado C | Pantalla de resultado |
| 6 | Solicitud visualización paso a paso | Estudiante | Recorrer índice por índice mostrando A[i]+B[i]=C[i] | Animación secuencial | Pantalla trazabilidad | 
| 7 | Solicitud de historial | Estudiante | Consultar OPERACIONES_SUMA filtrada por usuario | Lista de sumas realizadas | Pantalla historial | 
| 8 | Creación de ejercicio | Docente | Validar y almacenar ejercicio en BD | Ejercicio disponible | Módulo ejercicios | 
| 9  | Solicitud de métricas | Docente | Consultar METRICAS_DESEMPENO | Reporte de desempeño | Panel docente |
| 10 | Gestión de usuarios | Administrador | CRUD sobre tabla USUARIOS | Usuario actualizado  | Panel admin |
| 11 | Solicitud reportes generales | Administrador | Consultar operaciones y métricas | Reporte global | Panel admin   |