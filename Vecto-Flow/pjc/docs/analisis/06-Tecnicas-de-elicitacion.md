# 6. Técnicas de Elicitación de Requisitos

**6.1 Encuesta**

Se aplicó una encuesta digital a 25 participantes (estudiantes de primer y segundo semestre, docentes de programación y administradores) mediante Google Forms, con el objetivo de identificar las principales dificultades en el aprendizaje de la suma de vectores y las funcionalidades deseadas para la plataforma VectoFlow.

**6.1.1 Resultados principales de la encuesta**

La encuesta reveló los siguientes hallazgos clave:

    •	El 100% de los docentes y administradores, y más del 80% de los estudiantes, consideran que la visualización paso a paso facilita la comprensión de la suma de vectores.
    •	Las principales dificultades reportadas incluyen: traducir la operación matemática a código (32%), comprender el recorrido índice por índice (28%), entender la restricción de igual dimensión (24%) e interpretar el vector resultado C[i] (16%).
    •	La mayoría de los encuestados prefiere ver cada operación A[i] + B[i] = C[i] posición por posición con animación controlable.
    •	El 88% considera fundamental que el sistema valide las dimensiones antes de ejecutar la suma.
    •	Los estudiantes solicitan: control de velocidad de animación, historial de sumas, diferenciación por colores de vectores, y pseudocódigo sincronizado.
    •	Los docentes solicitan: panel de seguimiento por estudiante, creación de ejercicios personalizados y reportes de desempeño automáticos.
    •	La frecuencia de práctica varía: 24% todos los días, 24% varias veces por semana, 28% una vez por semana, 20% pocas veces al mes, 4% nunca.

**6.2 Entrevista**

Se realizaron entrevistas semiestructuradas a 3 docentes de programación del área de ingeniería de sistemas, con el fin de profundizar en las dificultades observadas en los estudiantes durante el aprendizaje de la suma de vectores y recoger sugerencias pedagógicas. Los docentes coincidieron en que los estudiantes tienen dificultad para conectar la notación matemática C[i] = A[i] + B[i] con el código real, y que una herramienta con visualización sincronizada sería altamente beneficiosa.

**6.3 Observación Directa**

Se realizó observación directa en sesiones prácticas de laboratorio de programación, donde se identificaron los siguientes patrones: los estudiantes confunden el vector resultado con una variable simple, tienen dificultad para entender el rol del índice dentro del ciclo for, y cometen errores frecuentes al declarar el vector resultado con un tamaño diferente al de los operandos.