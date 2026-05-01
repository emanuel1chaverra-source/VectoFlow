# Tabla 13 — Prototipo → Wireframes → Interacciones → Pantallas destino

| Prototipo | Wireframe | Interacción | Pantalla Destino |
|---|---|---|---|
| P-01: Login | W-01 | Ingresar correo y contraseña → clic "Ingresar" | Dashboard según rol (W-02, W-12 o W-14) |
| P-01: Login | W-01 | Credenciales inválidas o bloqueo tras 10 intentos | W-01: Mensaje de error en pantalla |
| P-02: Dashboard Estudiante | W-02 | Clic "Nueva Suma" | W-03: Formulario Ingreso Vectores |
| P-02: Dashboard Estudiante | W-02 | Clic "Ver Historial" | W-10: Historial de Operaciones |
| P-02: Dashboard Estudiante | W-02 | Clic "Ver Resumen" | W-11: Resumen de Sesión |
| P-03: Ingreso Vectores | W-03 | Completar dimensión y valores → clic "Guardar" | W-04: Panel Ejecución Suma |
| P-03: Ingreso Vectores | W-03 | Valor no numérico ingresado | W-03: Mensaje de error en campo |
| P-04: Ejecución Suma | W-04 | Clic "Ejecutar Suma" con dimensiones iguales | W-04: Muestra resultado C en pantalla |
| P-04: Ejecución Suma | W-04 | Dimensiones distintas detectadas | W-03: Alerta y regreso a corrección de vectores |
| P-04: Ejecución Suma | W-04 | Clic "Agregar vector adicional" | W-03: Formulario nuevo vector adicional |
| P-05: Paso a Paso | W-05 | Clic "Ver paso a paso" tras ejecutar suma | W-05: Animación índice por índice |
| P-05: Paso a Paso | W-05 | Clic "Pausar / Avanzar / Retroceder" | W-05: Control manual de la animación |
| P-05: Paso a Paso | W-05 | Suma no ejecutada → clic "Ver paso a paso" | W-04: Mensaje "Ejecute la suma primero" |
| P-06: Tabla Comparativa | W-06 | Clic "Ver en tabla" | W-06: Tabla Índice, A[i], B[i], C[i] |
| P-07: Explicación Textual | W-07 | Clic "Ver explicación textual" | W-07: Texto paso a paso en lenguaje natural |
| P-08: Consulta por Índice | W-08 | Ingresar índice → clic "Consultar" | W-08: Muestra A[i], B[i], C[i] del índice |
| P-08: Consulta por Índice | W-08 | Índice fuera de rango | W-08: Mensaje con rango válido (0 a n-1) |
| P-09: Historial | W-10 | Clic "Ver historial" | W-10: Lista de operaciones anteriores |
| P-09: Historial | W-10 | Clic "Descargar" en operación | Descarga PDF o Excel de esa operación |
| P-10: Resumen Sesión | W-11 | Clic "Ver resumen de sesión" | W-11: Métricas de la sesión activa |
| P-11: Panel Docente | W-12 | Clic "Crear ejercicio" | W-12: Formulario nuevo ejercicio con vectores |
| P-11: Panel Docente | W-12 | Clic "Asignar" en ejercicio creado | W-12: Selección de estudiantes destinatarios |
| P-12: Monitoreo | W-13 | Clic sobre nombre de estudiante | W-13: Detalle historial y métricas del estudiante |
| P-12: Monitoreo | W-13 | Clic "Exportar" | Descarga reporte PDF o Excel del estudiante |
| P-13: Panel Admin | W-14 | Clic "Nuevo usuario" | W-14: Formulario creación usuario con rol |
| P-13: Panel Admin | W-14 | Clic "Desactivar usuario" | W-14: Confirmación → Estado=0 en USUARIOS |
| P-13: Panel Admin | W-14 | Clic "Generar reporte global" | W-14: Reporte consolidado con filtro de fechas |