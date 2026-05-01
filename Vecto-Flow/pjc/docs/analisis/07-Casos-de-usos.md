# Casos de usos 

**CU01 – Ingresar Vectores para Suma**

**Actor:** Estudiante

**Propósito:** Permitir al estudiante definir los vectores A y B (o más) con sus valores para realizar la suma.

**Precondiciones:** El estudiante debe estar autenticado en el sistema.

**Flujo Normal:**

    1.	El estudiante accede al módulo de suma de vectores.
    2.	El sistema muestra el formulario de ingreso de vectores.
    3.	El estudiante define la dimensión (tamaño) del vector A.
    4.	El estudiante ingresa los valores de cada posición del vector A.
    5.	El estudiante repite los pasos 3 y 4 para el vector B.
    6.	El sistema valida que ambos vectores tengan la misma dimensión.
    7.	El sistema almacena los vectores en la base de datos.
    8.	El sistema confirma que los vectores fueron ingresados correctamente.

**Flujos Alternativos:**

    •	FA1 (paso 6): Si los vectores tienen dimensiones distintas, el sistema muestra una alerta indicando la incompatibilidad y solicita corrección.
    •	FA2 (paso 4): Si el estudiante ingresa un valor no numérico, el sistema muestra un mensaje de error en el campo correspondiente.

**Postcondiciones:** Los vectores A y B quedan almacenados y disponibles para ejecutar la suma.

**RF Asociado:** RF-001

________________________________________

**CU03 – Ejecutar Suma de Vectores**

**Actor:** Estudiante

**Propósito:** Calcular C[i] = A[i] + B[i] para cada índice del vector.

**Precondiciones:** Los vectores A y B deben estar ingresados y tener la misma dimensión.

**Flujo Normal:**

    1.	El estudiante selecciona la opción "Ejecutar Suma".
    2.	El sistema verifica que los vectores A y B existen y tienen igual dimensión.
    3.	El sistema recorre cada índice i desde 0 hasta n-1.
    4.	Para cada índice, el sistema calcula C[i] = A[i] + B[i].
    5.	El sistema almacena el vector resultado C en la base de datos.
    6.	El sistema muestra el vector C con todos sus valores al estudiante.

**Flujos Alternativos:**

    •	FA1 (paso 2): Si los vectores tienen dimensiones distintas, el sistema detiene la operación, muestra una alerta de incompatibilidad y redirige al estudiante a corregir los vectores.
    •	FA2 (paso 2): Si alguno de los vectores está vacío, el sistema muestra un mensaje indicando que deben ingresarse valores antes de ejecutar.

**Postcondiciones:** El vector resultado C queda calculado, almacenado y visible para el estudiante.

**RF Asociado:** RF-009

________________________________________

**CU04 – Ver Suma Paso a Paso**

**Actor:** Estudiante

**Propósito:** Mostrar cada iteración C[i] = A[i] + B[i] de forma animada para comprensión didáctica.

**Precondiciones:** La suma debe haber sido ejecutada previamente (CU03 completado).

**Flujo Normal:**

    1.	El estudiante selecciona la opción "Ver paso a paso".
    2.	El sistema inicia la animación desde el índice 0.
    3.	Para cada índice i, el sistema resalta visualmente A[i], B[i] y muestra la operación A[i] + B[i] = C[i].
    4.	El sistema avanza automáticamente al siguiente índice con un intervalo de 0.5 a 1.5 segundos.
    5.	Al llegar al último índice, el sistema muestra el vector C completo.
    6.	El sistema indica que la visualización ha finalizado.
**Flujos Alternativos:**

    •	FA1 (paso 4): El estudiante puede pausar, avanzar o retroceder manualmente entre pasos.
    •	FA2 (paso 2): Si la suma no ha sido ejecutada, el sistema muestra un mensaje indicando que primero debe ejecutar la suma.
**Postcondiciones:** El estudiante ha visualizado el proceso completo de suma índice por índice.

**RF Asociado:** RF-018

________________________________________

**CU05 – Ver Ejemplo con Valores Reales**

**Actor: Estudiante**

**Propósito:** Mostrar un ejemplo concreto de suma de vectores con valores numéricos predefinidos.

**Precondiciones:** El estudiante debe estar autenticado.

**Flujo Normal:**

    1.	El estudiante accede a la sección de ejemplos.
    2.	El sistema carga un ejemplo predefinido con vectores A y B con valores reales.
    3.	El sistema muestra los vectores A y B con sus valores.
    4.	El sistema ejecuta la suma y muestra el vector C resultado.
    5.	El sistema muestra la operación completa en formato A[i] + B[i] = C[i] para cada índice.

**Flujos Alternativos:**

    •	FA1 (paso 2): Si no hay ejemplos cargados, el sistema muestra un mensaje indicando que no hay ejemplos disponibles.

**Postcondiciones:** El estudiante visualizó un ejemplo completo de suma con valores reales.

**RF Asociado:** RF-018, RF-009

________________________________________

**CU06 – Consultar Resultado de la Suma**

**Actor:** Estudiante

**Propósito:** Mostrar el vector C resultado con sus índices y valores de forma clara.

**Precondiciones:** La suma debe haber sido ejecutada (CU03 completado).

**Flujo Normal:**

    1.	El estudiante selecciona la opción "Ver resultado".
    2.	El sistema recupera el vector C almacenado.
    3.	El sistema muestra cada posición del vector C con su índice y valor correspondiente.
    4.	El sistema diferencia visualmente el vector C de los vectores A y B mediante colores.

**Flujos Alternativos:**

    •	FA1 (paso 2): Si no existe una suma ejecutada, el sistema indica que debe ejecutar la operación primero.

**Postcondiciones:** El estudiante visualiza el vector resultado C completo con índices y valores.

**RF Asociado:** RF-009

________________________________________

**CU07 – Sumar Más de Dos Vectores**

**Actor:** Estudiante

**Propósito:** Extender la operación de suma a múltiples vectores acumulados (A + B + C + ... + N).

**Precondiciones:** El estudiante debe estar autenticado y haber ingresado al menos dos vectores.

**Flujo Normal:**
 
    1.	El estudiante selecciona la opción "Agregar vector adicional".
    2.	El sistema habilita el formulario para ingresar un nuevo vector.
    3.	El estudiante define la dimensión y valores del nuevo vector.
    4.	El sistema valida que el nuevo vector tenga la misma dimensión que los anteriores.
    5.	El estudiante repite los pasos 1 a 4 para cada vector adicional que desee.
    6.	El estudiante ejecuta la suma acumulada.
    7.	El sistema calcula C[i] = A[i] + B[i] + ... + N[i] para cada índice.
    8.	El sistema muestra el vector resultado final.

**Flujos Alternativos:**

    •	FA1 (paso 4): Si el nuevo vector tiene dimensión diferente, el sistema muestra alerta de incompatibilidad y no lo agrega.

**Postcondiciones:** El vector resultado acumula la suma de todos los vectores ingresados.

**RF Asociado:** RF-009

________________________________________

**CU08 – Consultar Índice Específico del Resultado**

**Actor: Estudiante**

**Propósito:** Mostrar el valor de C[i] para un índice específico ingresado por el estudiante.

**Precondiciones:** La suma debe haber sido ejecutada (CU03 completado).

**Flujo Normal:**

    1.	El estudiante ingresa el índice i que desea consultar.
    2.	El sistema valida que el índice esté dentro del rango válido (0 a n-1).
    3.	El sistema recupera el valor de C[i] del vector resultado.
    4.	El sistema muestra el valor de C[i] junto con los valores A[i] y B[i] correspondientes.

**Flujos Alternativos:**

    •	FA1 (paso 2): Si el índice está fuera del rango, el sistema muestra un mensaje de error indicando el rango válido.
    •	FA2 (paso 1): Si no existe suma ejecutada, el sistema indica que debe ejecutar la operación primero.

**Postcondiciones:** El estudiante conoce el valor exacto de C[i] para el índice consultado.

**RF Asociado:** RF-009, RF-002

_______________________________________


**CU09 – Guardar Resultado en Historial**

**Actor:** Estudiante

**Propósito:** Registrar la operación de suma ejecutada en la base de datos para consulta futura.

**Precondiciones:** La suma debe haber sido ejecutada (CU03 completado).

**Flujo Normal:**

    1.	El sistema detecta que la suma fue ejecutada exitosamente.
    2.	El sistema genera automáticamente un registro en OPERACIONES_SUMA con fecha, hora, vectores A y B, y vector resultado C.
    3.	El sistema confirma al estudiante que la operación fue guardada en el historial.

**Flujos Alternativos:**

    •	FA1 (paso 2): Si ocurre un error al guardar, el sistema muestra un mensaje de error y ofrece reintentar.

**Postcondiciones:** La operación queda registrada en el historial del estudiante con timestamp.

**RF Asociado:** RF-019

________________________________________

**CU10 – Consultar Historial de Sumas**

**Actor:** Estudiante

**Propósito:** Mostrar el registro de todas las operaciones de suma previas del estudiante.

**Precondiciones:** El estudiante debe estar autenticado y tener al menos una operación guardada.

**Flujo Normal:**

    1.	El estudiante accede a la sección "Historial".
    2.	El sistema consulta la tabla OPERACIONES_SUMA filtrando por el usuario autenticado.
    3.	El sistema muestra la lista de operaciones ordenadas por fecha descendente.
    4 .	Cada registro muestra: fecha, hora, vectores A y B, y vector resultado C.
    5.	El estudiante puede seleccionar un registro para ver su detalle completo.

**Flujos Alternativos:**

    •	FA1 (paso 2): Si no hay operaciones registradas, el sistema muestra el mensaje "No tienes operaciones guardadas aún".

**Postcondiciones:** El estudiante visualiza su historial completo de sumas realizadas.
**RF Asociado:** RF-019

________________________________________

**CU11 – Practicar con Valores Propios**

**Actor:** Estudiante

**Propósito:** Permitir al estudiante ingresar libremente sus propios valores para una práctica personalizada sin restricciones de ejercicio asignado.

**Precondiciones:** El estudiante debe estar autenticado.

**Flujo Normal:**

    1.	El estudiante selecciona el modo "Práctica libre".
    2.	El sistema habilita el formulario de ingreso sin plantilla ni ejercicio asignado.
    3.	El estudiante define la dimensión y valores de los vectores A y B a su elección.
    4.	El estudiante ejecuta la suma.
    5.	El sistema calcula y muestra el resultado.
    6.	El sistema guarda la operación en el historial marcada como "práctica libre".

**Flujos Alternativos:**
    
    •	FA1 (paso 3): Si los vectores tienen dimensiones distintas, el sistema muestra alerta de incompatibilidad.

**Postcondiciones:** El estudiante completó una práctica libre y el resultado quedó guardado en el historial.

**RF Asociado:** RF-001, RF-009

________________________________________

**CU12 – Reiniciar Vectores para Nueva Práctica**

**Actor:** Estudiante

**Propósito:** Vaciar los vectores activos en pantalla sin perder el historial de operaciones anteriores.

**Precondiciones:** El estudiante debe tener vectores cargados en el formulario activo.

**Flujo Normal:**

    1.	El estudiante selecciona la opción "Reiniciar".
    2.	El sistema solicita confirmación al estudiante.
    3.	El estudiante confirma la acción.
    4.	El sistema limpia los campos de los vectores A y B en pantalla.
    5.	El sistema mantiene intacto el historial de operaciones guardadas.
    6.	El sistema muestra el formulario vacío listo para una nueva práctica.

**Flujos Alternativos:**

    •	FA1 (paso 3): Si el estudiante cancela la confirmación, el sistema no realiza ningún cambio.

**Postcondiciones:** Los vectores activos fueron limpiados y el historial permanece intacto.

**RF Asociado:** RF-006

________________________________________

**CU13 – Ver Explicación Textual de la Suma**

**Actor:** Estudiante

**Propósito:** Mostrar una descripción en texto de cada paso del proceso de suma para reforzar la comprensión.

**Precondiciones:** La suma debe haber sido ejecutada (CU03 completado).

**Flujo Normal:**

    1.	El estudiante selecciona la opción "Ver explicación textual".
    2.	El sistema genera una descripción paso a paso en lenguaje natural.
    3.	Para cada índice i, el sistema muestra: "En la posición i, A[i] + B[i] = C[i]".
    4.	El sistema muestra la explicación completa de todos los índices en orden.

**Flujos Alternativos:**

    •	FA1 (paso 2): Si no existe suma ejecutada, el sistema indica que debe ejecutar la operación primero.

**Postcondiciones:** El estudiante leyó la explicación textual completa del proceso de suma.

**RF Asociado:** RF-018

________________________________________

**CU15 – Modificar Valor de un Vector Antes de Sumar**

**Actor:** Estudiante

**Propósito:** Permitir la edición de valores de un vector ya ingresado antes de ejecutar la suma.

**Precondiciones:** El estudiante debe tener al menos un vector ingresado y la suma no debe haberse ejecutado aún.

**Flujo Normal:**

    1.	El estudiante selecciona el vector que desea modificar (A o B).
    2.	El sistema muestra los valores actuales del vector con sus índices.
    3.	El estudiante selecciona la posición que desea editar.
    4.	El estudiante ingresa el nuevo valor.
    5.	El sistema valida que el nuevo valor sea numérico.
    6.	El sistema actualiza el valor en la posición seleccionada.
    7.	El sistema confirma la modificación.

**Flujos Alternativos:**

    •	FA1 (paso 5): Si el valor ingresado no es numérico, el sistema muestra un mensaje de error y solicita corrección.
}
**Postcondiciones:** El vector queda actualizado con el nuevo valor antes de ejecutar la suma.

**RF Asociado:** RF-003

________________________________________

**CU16 – Consultar Tamaño de los Vectores**

**Actor:** Estudiante

**Propósito:** Mostrar la longitud actual de cada vector activo en el sistema.

**Precondiciones:** El estudiante debe tener al menos un vector ingresado.

**Flujo Normal:**

    1.	El estudiante selecciona la opción "Ver tamaño de vectores".
    2.	El sistema consulta la dimensión de cada vector activo.
    3.	El sistema muestra la longitud de cada vector (A, B y C si existe) de forma clara.

**Flujos Alternativos:**

    •	FA1 (paso 2): Si no hay vectores ingresados, el sistema muestra el mensaje "No hay vectores activos".

**Postcondiciones:** El estudiante conoce la dimensión de cada vector activo.

**RF Asociado:** RF-005

________________________________________

**CU17 – Ver Suma en Formato Tabla**

**Actor:** Estudiante

**Propósito:** Presentar el resultado de la suma en una tabla comparativa con columnas A, B y C.

**Precondiciones:** La suma debe haber sido ejecutada (CU03 completado).

**Flujo Normal:**

    1.	El estudiante selecciona la opción "Ver en tabla".
    2.	El sistema genera una tabla con columnas: Índice, A[i], B[i], C[i].
    3.	El sistema llena cada fila con los valores correspondientes a cada posición.
    4.	El sistema muestra la tabla completa al estudiante.

**Flujos Alternativos:**

    •	FA1 (paso 2): Si no existe suma ejecutada, el sistema indica que debe ejecutar la operación primero.

**Postcondiciones:** El estudiante visualiza la suma completa en formato tabular comparativo.

**RF Asociado:** RF-018, RF-009

________________________________________

**CU18 – Descargar Resultado de la Suma**

**Actor:** Estudiante

**Propósito:** Permitir al estudiante exportar el resultado de la suma en un archivo descargable (PDF o Excel).

**Precondiciones:** La suma debe haber sido ejecutada (CU03 completado).

**Flujo Normal:**

    1.	El estudiante selecciona la opción "Descargar resultado".
    2.	El sistema muestra las opciones de formato: PDF o Excel.
    3.	El estudiante selecciona el formato deseado.
    4.	El sistema genera el archivo con los vectores A, B, C y la fecha de la operación.
    5.	El sistema inicia la descarga del archivo en el dispositivo del estudiante.

**Flujos Alternativos:**

    •	FA1 (paso 4): Si ocurre un error al generar el archivo, el sistema muestra un mensaje de error y ofrece reintentar.

**Postcondiciones:** El estudiante descargó el resultado de la suma en el formato seleccionado.

**RF Asociado:** RF-022

________________________________________

**CU19 – Ver Resumen de Práctica**

**Actor:** Estudiante

**Propósito:** Mostrar estadísticas de la sesión actual del estudiante.

**Precondiciones:** El estudiante debe haber realizado al menos una operación en la sesión activa.

**Flujo Normal:**

    1.	El estudiante selecciona la opción "Ver resumen de sesión".
    2.	El sistema consulta las operaciones realizadas en la sesión activa.
    3.	El sistema muestra: número de sumas realizadas, número de intentos, tiempo total de práctica y aciertos.
    4.	El sistema muestra un mensaje de retroalimentación según el desempeño.

**Flujos Alternativos:**
    
    •	FA1 (paso 2): Si no hay operaciones en la sesión, el sistema muestra "No has realizado operaciones en esta sesión".

**Postcondiciones:** El estudiante conoce su desempeño durante la sesión de práctica.

**RF Asociado:** RF-019, RF-025

________________________________________

**CU20 – Crear Ejercicio de Suma de Vectores**

**Actor:** Docente

**Propósito:** Permitir al docente diseñar ejercicios de suma de vectores para asignar a estudiantes.

**Precondiciones:** El docente debe estar autenticado con rol Docente.

**Flujo Normal:**

    1.	El docente accede al panel de ejercicios.
    2.	El docente selecciona "Crear nuevo ejercicio".
    3.	El sistema muestra el formulario de creación con campos: título, descripción, vectores A y B predefinidos.
    4.	El docente completa los campos y define los vectores del ejercicio.
    5.	El sistema valida que los vectores tengan la misma dimensión.
    6.	El sistema guarda el ejercicio en la base de datos con estado "Activo".
    7.	El sistema confirma la creación del ejercicio.
**Flujos Alternativos:**

    •	FA1 (paso 5): Si los vectores tienen dimensiones distintas, el sistema muestra alerta y solicita corrección.
    •	FA2 (paso 4): Si algún campo obligatorio está vacío, el sistema indica los campos faltantes.

**Postcondiciones:** El ejercicio queda creado y disponible para ser asignado a estudiantes.

**RF Asociado:** RF-020

________________________________________


**CU21 – Asignar Ejercicio a Estudiantes**

**Actor:** Docente

**Propósito:** Distribuir ejercicios de suma de vectores a uno o varios estudiantes.

**Precondiciones:** El docente debe estar autenticado y tener al menos un ejercicio creado.

**Flujo Normal:**

    1.	El docente accede al panel de ejercicios.
    2.	El docente selecciona el ejercicio que desea asignar.
    3.	El docente selecciona el o los estudiantes destinatarios.
    4.	El sistema registra la asignación vinculando el ejercicio con los estudiantes seleccionados.
    5.	El sistema notifica a los estudiantes que tienen un nuevo ejercicio disponible.
    6.	El sistema confirma al docente que la asignación fue exitosa.

**Flujos Alternativos:**

    •	FA1 (paso 3): Si no hay estudiantes registrados, el sistema muestra el mensaje "No hay estudiantes disponibles para asignar".

**Postcondiciones:** El ejercicio queda asignado y visible para los estudiantes seleccionados.

**RF Asociado:** RF-020

________________________________________

**CU22 – Monitorear Progreso en Suma de Vectores**

**Actor:** Docente

**Propósito:** Ver el historial de sumas realizadas por cada estudiante para detectar dificultades.

**Precondiciones:** El docente debe estar autenticado y tener estudiantes con operaciones registradas.

**Flujo Normal:**

    1.	El docente accede al panel de monitoreo.
    2.	El docente selecciona el estudiante que desea revisar.
    3.	El sistema consulta OPERACIONES_SUMA y METRICAS_DESEMPENO filtradas por ese estudiante.
    4.	El sistema muestra el historial de sumas: fecha, vectores usados, resultado y métricas.
    5.	El docente puede filtrar por fecha o por ejercicio asignado.

**Flujos Alternativos:**

    •	FA1 (paso 3): Si el estudiante no tiene operaciones registradas, el sistema muestra "Este estudiante no ha realizado operaciones aún".
**Postcondiciones:** El docente visualizó el progreso completo del estudiante seleccionado.

**RF Asociado:** RF-021

________________________________________

**CU23 – Exportar Resultados de Estudiantes**

**Actor: Docente**

**Propósito:** Generar un reporte de desempeño de los estudiantes en formato exportable.

**Precondiciones:** El docente debe estar autenticado y tener datos de estudiantes disponibles.

**Flujo Normal:**

    1.	El docente accede al panel de reportes.
    2.	El docente selecciona el rango de fechas y los estudiantes a incluir.
    3.	El docente selecciona el formato de exportación: PDF o Excel.
    4.	El sistema genera el reporte con: nombre del estudiante, número de sumas, aciertos, tiempo promedio y fecha.
    5.	El sistema inicia la descarga del archivo.

**Flujos Alternativos:**

    •	FA1 (paso 4): Si no hay datos en el rango seleccionado, el sistema muestra "No hay registros para los filtros aplicados".
    •	FA2 (paso 4): Si ocurre un error al generar el archivo, el sistema muestra un mensaje de error y ofrece reintentar.

**Postcondiciones:** El docente descargó el reporte de desempeño de sus estudiantes.

**RF Asociado:** RF-022

_______________________________________

**CU24 – Gestionar Cuentas de Usuario**

**Actor:** Administrador

**Propósito:** Realizar el CRUD completo de usuarios con sus roles en el sistema.

**Precondiciones:** El administrador debe estar autenticado con rol Administrador.

**Flujo Normal:**

    1.	El administrador accede al panel de gestión de usuarios.
    2.	El sistema muestra la lista de todos los usuarios registrados con su rol y estado.
    3.	El administrador puede seleccionar una de las siguientes acciones: 
        o	Crear: Completa el formulario con nombre, apellido, correo, contraseña y rol. El sistema valida y guarda el nuevo usuario.
        o	Consultar: Busca un usuario por nombre o correo. El sistema muestra sus datos completos.
        o	Actualizar: Selecciona un usuario y modifica sus datos. El sistema guarda los cambios.
        o	Eliminar: Selecciona un usuario y confirma la eliminación. El sistema cambia el estado a "Inactivo".
    4.	El sistema confirma cada acción realizada.
**Flujos Alternativos:**

    •	FA1 (Crear, paso 3): Si el correo ya existe, el sistema muestra "Este correo ya está registrado".
    •	FA2 (Eliminar, paso 3): Si el administrador cancela la confirmación, no se realiza ningún cambio.

**Postcondiciones:** Los cambios en los usuarios quedan registrados en la base de datos.

**RF Asociado:** RF-024

________________________________________

**CU25 – Generar Reporte Global de Uso**

**Actor:** Administrador

**Propósito:** Consolidar y mostrar estadísticas generales de uso y desempeño de toda la plataforma.

**Precondiciones:** El administrador debe estar autenticado y existir datos de uso en el sistema.

**Flujo Normal:**

    1.	El administrador accede al panel de reportes globales.
    2.	El administrador selecciona el rango de fechas del reporte.
    3.	El sistema consulta OPERACIONES_SUMA y METRICAS_DESEMPENO de todos los usuarios.
    4.	El sistema genera el reporte con: total de operaciones realizadas, usuarios activos, promedio de aciertos, tiempo promedio de práctica y ejercicios más usados.
    5.	El sistema muestra el reporte en pantalla y ofrece la opción de exportarlo.
    6.	El administrador puede descargar el reporte en PDF o Excel.

**Flujos Alternativos:**

    •	FA1 (paso 3): Si no hay datos en el rango seleccionado, el sistema muestra "No hay registros para el período indicado".

**Postcondiciones:** El administrador visualizó y/o descargó el reporte global de uso de la plataforma.
RF Asociado: RF-025







