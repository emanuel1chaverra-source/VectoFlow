# VectoFlow

## ¿Qué módulo implementas?
Módulo de Suma de Vectores — permite a los estudiantes ingresar vectores, validar dimensiones, ejecutar la suma posición por posición y visualizar el resultado paso a paso con trazabilidad completa.

## ¿Qué tablas cubre tu módulo?
- `ROLES`
- `USUARIOS`
- `SESIONES`
- `CATEGORIAS_EJERCICIO`
- `EJERCICIOS`
- `ASIGNACIONES`
- `DIMENSION`
- `VECTORES`
- `DETALLE_VECTOR`
- `OPERACIONES_SUMA`
- `INTENTOS_EJERCICIO`
- `METRICAS_DESEMPENO`

## ¿Qué framework elegiste y por qué?
**Node.js con Express.js** — elegimos Express por su simplicidad, flexibilidad y compatibilidad con `mysql2` para conectarse directamente a MySQL sin necesidad de un ORM complejo. Además, permite estructurar el proyecto en capas (controllers, models, routes, services) de forma clara y escalable.

## ¿Cómo ejecutar el proyecto?
1. Clonar el repositorio:
```bash
git clone https://github.com/emanuel1chaverra-source/VectoFlow.git
cd VectoFlow