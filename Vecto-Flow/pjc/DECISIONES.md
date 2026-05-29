# Decisiones

## Decisión #01 — Inclusión de tablas adicionales en el modelo de datos

**¿Qué decidí?**
Incluir cuatro tablas adicionales al modelo de datos original: `CATEGORIAS_EJERCICIO`, 
`ASIGNACIONES`, `SESIONES` e `INTENTOS_EJERCICIO`.

**¿Por qué?**
Durante el análisis del modelo relacional se identificó que el diseño inicial, aunque 
funcional, presentaba limitaciones en trazabilidad, organización y auditoría. Las razones 
específicas por tabla son:

- **CATEGORIAS_EJERCICIO:** El campo de categoría estaba siendo repetido directamente en 
  `EJERCICIOS`, lo que generaba redundancia de datos y violaba la 3FN. Al separarlo en 
  su propia tabla, cada categoría se define una sola vez y los ejercicios simplemente 
  la referencian mediante una clave foránea.

- **ASIGNACIONES:** No existía una forma estructurada de registrar qué docente asignó 
  qué ejercicio a qué estudiante. Esta tabla actúa como pivote entre `USUARIOS` y 
  `EJERCICIOS`, formalizando esa relación y permitiendo llevar control de fechas límite 
  y estados de entrega.

- **SESIONES:** El sistema no contaba con ningún mecanismo de auditoría de accesos. 
  Esta tabla permite registrar cada inicio y cierre de sesión, junto con la IP y el 
  dispositivo usado, lo cual es fundamental para la seguridad y el seguimiento de 
  actividad de los usuarios.

- **INTENTOS_EJERCICIO:** El historial de operaciones (`OPERACIONES_SUMA`) registraba 
  la suma ejecutada, pero no el contexto académico del intento: a qué asignación 
  pertenecía, cuántas veces lo intentó el estudiante, cuánto tardó o qué calificación 
  obtuvo. Esta tabla cubre ese vacío y conecta el proceso académico con la operación 
  técnica.

**¿Qué artefacto de diseño respalda esta decisión?**
El Diccionario de Datos versión 2.0 (`Diccionario_de_Datos_VectoFlow_COMPLETO.docx`) 
y el Modelo Entidad-Relación (MER) en Tercera Forma Normal (3FN), donde se pueden 
verificar las claves foráneas, relaciones y justificación de cada campo incluido.

## Decisión #02 — Uso de JWT para autenticación
**¿Qué decidí?**
Usar JSON Web Tokens (JWT) como mecanismo de autenticación en lugar de sesiones del lado del servidor (express-session).

**¿Por qué?**
VectoFlow es una SPA (Single Page Application) con múltiples páginas HTML estáticas que consumen una API REST. Las sesiones del servidor requieren estado compartido, lo que complica el escalado. JWT permite autenticación stateless: el token viaja en cada petición y el servidor solo lo verifica sin guardar estado.

**¿Qué artefacto de diseño respalda esta decisión?**
El Diagrama de Arquitectura del sistema (Cliente–Servidor–BD) y los Requisitos No Funcionales RNF-02 (Seguridad) y RNF-03 (Rendimiento), que exigen autenticación segura y tiempos de respuesta menores a 2 segundos.