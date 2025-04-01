-- Create database
CREATE DATABASE GestionNotas;
USE GestionNotas;

-- Users table (common fields for both students and professors)
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    foto_perfil VARCHAR(255),
    tipo_usuario ENUM('estudiante', 'profesor', 'admin') NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster searches
CREATE INDEX idx_dni ON Usuarios(dni);

-- Students table
CREATE TABLE Estudiantes (
    id INT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_carrera INT NOT NULL,
    fecha_ingreso DATE NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_carrera) REFERENCES Carreras(id)
);

-- Professors table
CREATE TABLE Profesores (
    id INT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- Careers/Programs table
CREATE TABLE Carreras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion INT NOT NULL COMMENT 'Duration in semesters'
);

-- Subjects table
CREATE TABLE Materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    id_carrera INT NOT NULL,
    cuatrimestre INT NOT NULL,
    anio INT NOT NULL,
    FOREIGN KEY (id_carrera) REFERENCES Carreras(id)
);

-- Prerequisite subjects (correlatives)
CREATE TABLE Correlativas (
    id_materia INT NOT NULL,
    id_materia_correlativa INT NOT NULL,
    PRIMARY KEY (id_materia, id_materia_correlativa),
    FOREIGN KEY (id_materia) REFERENCES Materias(id),
    FOREIGN KEY (id_materia_correlativa) REFERENCES Materias(id)
);

-- Professor-Subject assignments
CREATE TABLE Profesor_Materia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_profesor INT NOT NULL,
    id_materia INT NOT NULL,
    anio_academico INT NOT NULL,
    cuatrimestre INT NOT NULL,
    UNIQUE KEY (id_profesor, id_materia, anio_academico, cuatrimestre),
    FOREIGN KEY (id_profesor) REFERENCES Profesores(id),
    FOREIGN KEY (id_materia) REFERENCES Materias(id)
);

-- Student enrollments in subjects
CREATE TABLE Inscripciones_Materia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante INT NOT NULL,
    id_materia INT NOT NULL,
    anio_academico INT NOT NULL,
    cuatrimestre INT NOT NULL,
    estado ENUM('cursando', 'aprobada', 'reprobada', 'abandonada') NOT NULL DEFAULT 'cursando',
    nota_final DECIMAL(4,2) CHECK (nota_final BETWEEN 0 AND 10),
    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (id_estudiante, id_materia, anio_academico, cuatrimestre),
    FOREIGN KEY (id_estudiante) REFERENCES Estudiantes(id),
    FOREIGN KEY (id_materia) REFERENCES Materias(id)
);

-- Exam tables
CREATE TABLE Mesas_Examen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_materia INT NOT NULL,
    fecha_mesa1 DATE NOT NULL,
    fecha_mesa2 DATE NOT NULL,
    tipo ENUM('regular', 'recuperatorio', 'final') NOT NULL,
    anio_academico INT NOT NULL,
    cuatrimestre INT NOT NULL,
    UNIQUE KEY (id_materia, anio_academico, cuatrimestre, tipo),
    FOREIGN KEY (id_materia) REFERENCES Materias(id)
);

-- Exam registrations
CREATE TABLE Inscripciones_Examen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante INT NOT NULL,
    id_mesa_examen INT NOT NULL,
    mesa_elegida ENUM('mesa1', 'mesa2') NOT NULL,
    estado ENUM('inscripto', 'presente', 'ausente') NOT NULL DEFAULT 'inscripto',
    nota DECIMAL(4,2) CHECK (nota BETWEEN 0 AND 10),
    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (id_estudiante, id_mesa_examen),
    FOREIGN KEY (id_estudiante) REFERENCES Estudiantes(id),
    FOREIGN KEY (id_mesa_examen) REFERENCES Mesas_Examen(id)
);

-- Grades for assignments, midterms, etc.
CREATE TABLE Notas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_inscripcion_materia INT NOT NULL,
    nombre_evaluacion VARCHAR(100) NOT NULL,
    tipo ENUM('parcial', 'trabajo_practico', 'final', 'recuperatorio') NOT NULL,
    nota DECIMAL(4,2) NOT NULL CHECK (nota BETWEEN 0 AND 10),
    fecha DATE NOT NULL,
    observaciones TEXT,
    FOREIGN KEY (id_inscripcion_materia) REFERENCES Inscripciones_Materia(id)
);

-- System logs
CREATE TABLE Logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(100),
    id_registro_afectado INT,
    datos_previos TEXT,
    datos_nuevos TEXT,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(45),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);

-- TRIGGER: Prevent enrollment in subjects with pending prerequisites
DELIMITER $$
CREATE TRIGGER before_inscripcion_materia
BEFORE INSERT ON Inscripciones_Materia
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM Correlativas c
        LEFT JOIN Inscripciones_Materia im ON c.id_materia_correlativa = im.id_materia 
        AND im.id_estudiante = NEW.id_estudiante
        WHERE c.id_materia = NEW.id_materia
        AND (im.estado IS NULL OR im.estado != 'aprobada')
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No puedes inscribirte en esta materia porque tienes correlativas pendientes.';
    END IF;
END$$
DELIMITER ;
