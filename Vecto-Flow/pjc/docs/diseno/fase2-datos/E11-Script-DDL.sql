-- ============================================
-- SCRIPT DDL - VectoFlow
-- Base de Datos: Sistema de Suma de Vectores
-- ============================================

-- Tabla 1: ROLES
CREATE TABLE ROLES (
    PKRol        INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NombreRol    VARCHAR(50)  NOT NULL,
    Descripcion  VARCHAR(150)
);

-- Tabla 2: DIMENSION
CREATE TABLE DIMENSION (
    PKDimension  INT  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Tamaño       INT  NOT NULL
);

-- Tabla 3: USUARIOS
CREATE TABLE USUARIOS (
    PKUsuario      INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Nombre         VARCHAR(60)   NOT NULL,
    Apellido       VARCHAR(60)   NOT NULL,
    Correo         VARCHAR(100)  NOT NULL,
    Contraseña     VARCHAR(255)  NOT NULL,
    FechaRegistro  DATE          NOT NULL,
    Estado         TINYINT(1)    NOT NULL DEFAULT 1,
    FKRol          INT           NOT NULL,
    FOREIGN KEY (FKRol) REFERENCES ROLES(PKRol) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla 4: SESIONES
CREATE TABLE SESIONES (
    PKSesion     INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FechaInicio  DATETIME NOT NULL,
    FechaFin     DATETIME,
    IPAcceso     VARCHAR(45),
    Dispositivo  VARCHAR(100),
    Estado       TINYINT(1) NOT NULL DEFAULT 1,
    FKUsuario    INT NOT NULL,
    FOREIGN KEY (FKUsuario) REFERENCES USUARIOS(PKUsuario) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla 5: CATEGORIAS_EJERCICIO
CREATE TABLE CATEGORIAS_EJERCICIO (
    PKCategoria      INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NombreCategoria  VARCHAR(80)  NOT NULL,
    Descripcion      VARCHAR(200),
    Estado           TINYINT(1)   NOT NULL DEFAULT 1
);

-- Tabla 6: EJERCICIOS
CREATE TABLE EJERCICIOS (
    PKEjercicio    INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Titulo         VARCHAR(100)  NOT NULL,
    Descripcion    TEXT,
    FechaCreacion  DATE          NOT NULL,
    Estado         TINYINT(1)    NOT NULL DEFAULT 1,
    FKDocente      INT           NOT NULL,
    FKCategoria    INT           NOT NULL,
    FOREIGN KEY (FKDocente) REFERENCES USUARIOS(PKUsuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (FKCategoria) REFERENCES CATEGORIAS_EJERCICIO(PKCategoria) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla 7: ASIGNACIONES
CREATE TABLE ASIGNACIONES (
    PKAsignacion     INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FechaAsignacion  DATE        NOT NULL,
    FechaLimite      DATE,
    Estado           TINYINT(1)  NOT NULL DEFAULT 1,
    FKEjercicio      INT         NOT NULL,
    FKEstudiante     INT         NOT NULL,
    FKDocente        INT         NOT NULL,
    FOREIGN KEY (FKEjercicio) REFERENCES EJERCICIOS(PKEjercicio) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (FKEstudiante) REFERENCES USUARIOS(PKUsuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (FKDocente) REFERENCES USUARIOS(PKUsuario) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla 8: VECTORES
CREATE TABLE VECTORES (
    PKVector      INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NombreVector  VARCHAR(10)  NOT NULL,
    FKDimension   INT          NOT NULL,
    FKUsuario     INT          NOT NULL,
    FOREIGN KEY (FKDimension) REFERENCES DIMENSION(PKDimension) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (FKUsuario) REFERENCES USUARIOS(PKUsuario) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla 9: DETALLE_VECTOR
CREATE TABLE DETALLE_VECTOR (
    PKDetalle  INT    NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Indice     INT    NOT NULL,
    Valor      FLOAT  NOT NULL,
    FKVector   INT    NOT NULL,
    FOREIGN KEY (FKVector) REFERENCES VECTORES(PKVector) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla 10: OPERACIONES_SUMA
CREATE TABLE OPERACIONES_SUMA (
    PKOperacion      INT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FechaOperacion   DATETIME  NOT NULL,
    FKEstudiante     INT       NOT NULL,
    FKVectorA        INT       NOT NULL,
    FKVectorB        INT       NOT NULL,
    FKVectorC        INT       NOT NULL,
    FKEjercicio      INT,
    FOREIGN KEY (FKEstudiante) REFERENCES USUARIOS(PKUsuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (FKVectorA) REFERENCES VECTORES(PKVector) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (FKVectorB) REFERENCES VECTORES(PKVector) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (FKVectorC) REFERENCES VECTORES(PKVector) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (FKEjercicio) REFERENCES EJERCICIOS(PKEjercicio) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla 11: INTENTOS_EJERCICIO
CREATE TABLE INTENTOS_EJERCICIO (
    PKIntento       INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NumeroIntento   INT         NOT NULL,
    FechaIntento    DATETIME    NOT NULL,
    TiempoSegundos  INT,
    Calificacion    FLOAT,
    Observacion     TEXT,
    FKAsignacion    INT         NOT NULL,
    FKOperacion     INT,
    FOREIGN KEY (FKAsignacion) REFERENCES ASIGNACIONES(PKAsignacion) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (FKOperacion) REFERENCES OPERACIONES_SUMA(PKOperacion) ON DELETE  CASCADE ON UPDATE CASCADE
);

-- Tabla 12: METRICAS_DESEMPENO
CREATE TABLE METRICAS_DESEMPENO (
    PKMetrica       INT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Intentos        INT       NOT NULL,
    TiempoSegundos  INT       NOT NULL,
    Aciertos        INT       NOT NULL,
    FechaRegistro   DATETIME  NOT NULL,
    FKOperacion     INT       NOT NULL,
    FOREIGN KEY (FKOperacion) REFERENCES OPERACIONES_SUMA(PKOperacion) ON DELETE CASCADE ON UPDATE CASCADE
);