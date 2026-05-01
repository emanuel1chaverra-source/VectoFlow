# Tercera Forma Normal (3FN)

Todas las tablas cumplen con la 3FN porque ya están en 2FN, y no existen dependencias transitivas entre atributos no clave. Los datos derivados o calculados no se almacenan en las tablas base. Por ejemplo:

    - En USUARIOS, el NombreRol no se almacena directamente; se obtiene mediante la relación con ROLES a través de FKRol.

    - En VECTORES, los elementos individuales no se almacenan en la tabla cabecera; se normalizan en DETALLE_VECTOR, garantizando atomicidad en cada posición del vector.

    - En DETALLE_VECTOR, cada fila representa un único elemento en una posición específica (Indice), evitando listas o arreglos dentro de un solo campo.

    - En METRICAS_DESEMPENO, los datos del estudiante no se repiten; se referencian mediante FKOperacion, que a su vez enlaza con OPERACIONES_SUMA y USUARIOS.

    - En EJERCICIOS, el nivel o tipo de ejercicio no se almacena como texto repetido; se normaliza en la tabla CATEGORIAS_EJERCICIO a través de FKCategoria.

    - En ASIGNACIONES, los datos del docente y del estudiante no se duplican; se referencian mediante FKDocente y FKEstudiante, ambos apuntando a USUARIOS.

    - En INTENTOS_EJERCICIO, la calificación y el tiempo se registran por intento individual, sin depender transitivamente de atributos ajenos a la clave primaria PKIntento.

    - En SESIONES, la información del usuario no se repite; se referencia mediante FKUsuario apuntando a USUARIOS, manteniendo trazabilidad sin redundancia.

    - En OPERACIONES_SUMA, los vectores operandos (A y B) y el vector resultado (C) se referencian mediante FKVectorA, FKVectorB y FKVectorC, todos apuntando a VECTORES, cuyos valores están normalizados en DETALLE_VECTOR.

**Desnormalización intencional:** 

El vector resultado C se almacena como referencia en OPERACIONES_SUMA mediante FKVectorC, y sus valores individuales se persisten en DETALLE_VECTOR. No se realizan operaciones de filtrado ni agregación directa sobre el resultado, por lo que esta estructura garantiza tanto la normalización como la eficiencia en consultas de solo lectura.