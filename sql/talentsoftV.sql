/* ======================================================================
   TALENTSOFT (Dimon's Style - Empresa de Confeccion y Maquila)
   SCRIPT UNIFICADO DE LA BASE DE DATOS: TalentSoft_Taller
   Motor: MySQL 8 (Workbench)

   ORDEN DE EJECUCION (no cambiar, cada modulo depende del anterior):
     MODULO 01  Registrar Personal ........ David     (tablas, catalogos, datos)
     MODULO 02  Procesos Administrativos .. Danier
     MODULO 03  Reclutamiento y Seleccion . Brayan
     MODULO 04  Gestion del Bienestar ..... Santiago

   NOTAS:
     - El modulo 01 BORRA y vuelve a crear la base de datos.
     - Ejecutar todo con el usuario root (el modulo 02 crea roles y usuarios).
     - Los modulos 02, 03 y 04 usan las tablas creadas en el modulo 01.

   LEYENDA DE CATALOGOS (ids definidos en el modulo 01):
     Roles ................. 1 = jefe, 2 = administrador, 3 = empleado,
                             4 = entrevistador
     Estados_solicitud ..... 1 = Pendiente, 2 = Aprobada, 3 = Rechazada
     Tipos_hora_extra ...... 1 = Diurna, 2 = Nocturna, 3 = Dominical diurna,
                             4 = Dominical nocturna, 5 = Festiva
     Estados_candidato ..... 1 = En proceso, 2 = Aprobado, 3 = Rechazado,
                             4 = Contratado
     Estados_asistencia_capacitacion ... 1 = Asistio, 2 = No asistio,
                                         3 = Excusado
   ====================================================================== */



/* ======================================================================
   1. CREACION DE LA BASE DE DATOS
   ====================================================================== */

-- Elimina la base de datos anterior (si existe) y la crea
DROP DATABASE IF EXISTS TalentSoft_Taller;
CREATE DATABASE TalentSoft_Taller;
USE TalentSoft_Taller;


/* ======================================================================
   2. TABLAS CATALOGO (Se crean primero)
   Guardan los valores fijos que usan las tablas del modelo.
   ====================================================================== */
-- Roles: Perfiles de acceso al sistema (jefe, administrador, empleado, entrevistador)
CREATE TABLE Roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tipos_sangre: Grupos sanguineos de los empleados
CREATE TABLE Tipos_sangre (
    id_tipo_sangre INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(5) NOT NULL UNIQUE
);

-- Tipos_contrato: Modalidades de contratacion (indefinido, fijo, aprendizaje, etc.)
CREATE TABLE Tipos_contrato (
    id_tipo_contrato INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tipos_incentivo: Clases de incentivo que se pueden otorgar a un empleado
CREATE TABLE Tipos_incentivo (
    id_tipo_incentivo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tipos_evento_laboral: Eventos de la vida laboral (ingreso, ascenso, traslado, retiro)
CREATE TABLE Tipos_evento_laboral (
    id_tipo_evento_laboral INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tipos_hora_extra: Clasificacion de las horas extra (diurna, nocturna, dominical, festiva)
CREATE TABLE Tipos_hora_extra (
    id_tipo_hora_extra INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Estados_solicitud: Estados de permisos y vacaciones (pendiente, aprobada, rechazada)
CREATE TABLE Estados_solicitud (
    id_estado_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tipos_novedad_salud: Clases de novedad de salud ocupacional
CREATE TABLE Tipos_novedad_salud (
    id_tipo_novedad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tipos_evento_institucional: Clases de evento de la empresa (reunion, celebracion, jornada de salud)
CREATE TABLE Tipos_evento_institucional (
    id_tipo_evento_institucional INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Modalidades_entrevista: Forma de la entrevista (presencial, virtual, telefonica)
CREATE TABLE Modalidades_entrevista (
    id_modalidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Estados_candidato: Etapas del candidato en el proceso de seleccion
CREATE TABLE Estados_candidato (
    id_estado_candidato INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Estados_asistencia_capacitacion: Resultado de la asistencia a una capacitacion
CREATE TABLE Estados_asistencia_capacitacion (
    id_estado_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

/* ======================================================================
   3. TABLAS DEL MODELO
   Tablas transaccionales. Todas se relacionan con Empleados o con los catalogos.
   ====================================================================== */
-- Empleados: Datos personales y de acceso de cada empleado (inicia en el id 101)
CREATE TABLE Empleados (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100),
    contrasena VARCHAR(255) NOT NULL,
    id_tipo_sangre INT NOT NULL,
    telefono VARCHAR(15),
    id_rol INT,
    fecha_nacimiento DATE,
    CONSTRAINT fk_empleado_tipo_sangre FOREIGN KEY (id_tipo_sangre) REFERENCES Tipos_sangre(id_tipo_sangre),
    CONSTRAINT fk_empleado_rol FOREIGN KEY (id_rol) REFERENCES Roles(id_rol)
) AUTO_INCREMENT = 101;

-- Contratos: Contratos de cada empleado con su tipo, fechas y salario
CREATE TABLE Contratos (
    id_contrato INT AUTO_INCREMENT PRIMARY KEY,
    id_tipo_contrato INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL,
    salario DECIMAL(10,2),
    id_empleado INT,
    CONSTRAINT fk_contrato_tipo FOREIGN KEY (id_tipo_contrato) REFERENCES Tipos_contrato(id_tipo_contrato),
    CONSTRAINT fk_contrato_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Incentivos: Incentivos otorgados a los empleados
CREATE TABLE Incentivos (
    id_incentivo INT AUTO_INCREMENT PRIMARY KEY,
    id_tipo_incentivo INT NOT NULL,
    descripcion TEXT,
    fecha_otorgado DATE,
    id_empleado INT,
    CONSTRAINT fk_incentivo_tipo FOREIGN KEY (id_tipo_incentivo) REFERENCES Tipos_incentivo(id_tipo_incentivo),
    CONSTRAINT fk_incentivo_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Diplomas: Titulos y estudios de cada empleado
CREATE TABLE Diplomas (
    id_diploma INT AUTO_INCREMENT PRIMARY KEY,
    nombre_diploma VARCHAR(100) NOT NULL,
    institucion VARCHAR(100),
    fecha_obtencion DATE,
    id_empleado INT,
    CONSTRAINT fk_diploma_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Historiales_laborales: Historial de eventos laborales (ingresos, ascensos, traslados, retiros)
CREATE TABLE Historiales_laborales (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT,
    id_tipo_evento_laboral INT,
    fecha_evento DATE,
    id_empleado INT,
    CONSTRAINT fk_historial_rol FOREIGN KEY (id_rol) REFERENCES Roles(id_rol),
    CONSTRAINT fk_historial_tipo FOREIGN KEY (id_tipo_evento_laboral) REFERENCES Tipos_evento_laboral(id_tipo_evento_laboral),
    CONSTRAINT fk_historial_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Asistencias: Marcacion diaria de entrada y salida
CREATE TABLE Asistencias (
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_entrada TIME,
    hora_salida TIME,
    id_empleado INT,
    CONSTRAINT fk_asistencia_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Horas_extra: Horas extra trabajadas, con su tipo y cantidad
CREATE TABLE Horas_extra (
    id_hora_extra INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE,
    id_tipo_hora_extra INT,
    cantidad_hora DECIMAL(4,2),
    id_empleado INT,
    CONSTRAINT fk_horaextra_tipo FOREIGN KEY (id_tipo_hora_extra) REFERENCES Tipos_hora_extra(id_tipo_hora_extra),
    CONSTRAINT fk_horaextra_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Permisos: Solicitudes de permiso y si la ausencia fue justificada
CREATE TABLE Permisos (
    id_permiso INT AUTO_INCREMENT PRIMARY KEY,
    motivacion TEXT,
    fecha_solicitud DATE,
    id_estado_solicitud INT,
    duracion_horas INT,
    id_empleado INT,
    ausencia_justificada TINYINT,
    CONSTRAINT fk_permiso_estado FOREIGN KEY (id_estado_solicitud) REFERENCES Estados_solicitud(id_estado_solicitud),
    CONSTRAINT fk_permiso_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Vacaciones: Solicitudes de vacaciones con su estado
CREATE TABLE Vacaciones (
    id_vacaciones INT AUTO_INCREMENT PRIMARY KEY,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    id_estado_solicitud INT,
    id_empleado INT,
    CONSTRAINT fk_vacaciones_estado FOREIGN KEY (id_estado_solicitud) REFERENCES Estados_solicitud(id_estado_solicitud),
    CONSTRAINT fk_vacaciones_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Novedades_salud: Novedades de salud ocupacional (incapacidades, accidentes, examenes)
CREATE TABLE Novedades_salud (
    id_novedad INT AUTO_INCREMENT PRIMARY KEY,
    id_tipo_novedad INT,
    descripcion TEXT,
    fecha_evento DATE,
    id_empleado INT,
    CONSTRAINT fk_novedad_tipo FOREIGN KEY (id_tipo_novedad) REFERENCES Tipos_novedad_salud(id_tipo_novedad),
    CONSTRAINT fk_novedad_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Evaluaciones_desempeno: Porcentaje de cumplimiento y observaciones por empleado
CREATE TABLE Evaluaciones_desempeno (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
    porcentaje_cumplido DECIMAL(5,2),
    observaciones TEXT,
    id_empleado INT,
    CONSTRAINT fk_evaluacion_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Encuestas_bienestar: Resultados de las encuestas de bienestar laboral
CREATE TABLE Encuestas_bienestar (
    id_encuesta INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE,
    resultado TEXT,
    observaciones TEXT,
    id_empleado INT,
    CONSTRAINT fk_encuesta_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Registros_evento_institucional: Eventos institucionales y el empleado asociado
CREATE TABLE Registros_evento_institucional (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_tipo_evento_institucional INT,
    fecha_evento DATE,
    descripcion TEXT,
    id_empleado INT,
    CONSTRAINT fk_evento_tipo FOREIGN KEY (id_tipo_evento_institucional) REFERENCES Tipos_evento_institucional(id_tipo_evento_institucional),
    CONSTRAINT fk_evento_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Capacitaciones: Capacitaciones programadas y el empleado que las dicta
CREATE TABLE Capacitaciones (
    id_capacitacion INT AUTO_INCREMENT PRIMARY KEY,
    tema VARCHAR(200) NOT NULL,
    lugar_plataforma VARCHAR(150),
    fecha DATE,
    hora TIME,
    id_empleado_capacitador INT,
    CONSTRAINT fk_capacitacion_empleado FOREIGN KEY (id_empleado_capacitador) REFERENCES Empleados(id_empleado)
);

-- Asistencias_capacitacion: Tabla intermedia: asistencia de cada empleado a cada capacitacion (clave compuesta)
CREATE TABLE Asistencias_capacitacion (
    id_capacitacion INT NOT NULL,
    id_empleado INT NOT NULL,
    id_estado_asistencia INT NOT NULL,
    PRIMARY KEY (id_capacitacion, id_empleado),
    CONSTRAINT fk_asiscap_estado FOREIGN KEY (id_estado_asistencia) REFERENCES Estados_asistencia_capacitacion(id_estado_asistencia),
    CONSTRAINT fk_asiscap_capacitacion FOREIGN KEY (id_capacitacion) REFERENCES Capacitaciones(id_capacitacion),
    CONSTRAINT fk_asiscap_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Entrevistas: Entrevistas tecnicas realizadas por un empleado (entrevistador)
CREATE TABLE Entrevistas (
    id_entrevista INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE,
    hora TIME,
    id_modalidad INT,
    calificacion_tecnica DECIMAL(4,2),
    observaciones_tecnicas TEXT,
    id_empleado INT,
    CONSTRAINT fk_entrevista_modalidad FOREIGN KEY (id_modalidad) REFERENCES Modalidades_entrevista(id_modalidad),
    CONSTRAINT fk_entrevista_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Candidatos: Candidatos al empleo, ligados a su entrevista y a un empleado responsable
CREATE TABLE Candidatos (
    id_candidato INT AUTO_INCREMENT PRIMARY KEY,
    documento_candidato VARCHAR(15),
    nombre_candidato VARCHAR(50),
    apellido_candidato VARCHAR(50),
    especialidad VARCHAR(45),
    id_estado_candidato INT,
    hoja_de_vida_pdf VARCHAR(255),
    id_empleado INT NOT NULL,
    id_entrevista INT NOT NULL,
    CONSTRAINT fk_candidato_estado FOREIGN KEY (id_estado_candidato) REFERENCES Estados_candidato(id_estado_candidato),
    CONSTRAINT fk_candidato_empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado),
    CONSTRAINT fk_candidato_entrevista FOREIGN KEY (id_entrevista) REFERENCES Entrevistas(id_entrevista)
);

/* ======================================================================
   4. DATOS DE LOS CATALOGOS (Valores fijos)
   ====================================================================== */
INSERT INTO Roles (nombre) VALUES ('jefe'), ('administrador'), ('empleado'), ('entrevistador');
INSERT INTO Tipos_sangre (nombre) VALUES ('A+'), ('A-'), ('B+'), ('B-'), ('AB+'), ('AB-'), ('O+'), ('O-');
INSERT INTO Tipos_contrato (nombre) VALUES ('Indefinido'), ('Fijo'), ('Obra o labor'), ('Aprendizaje'), ('Prestacion de servicios');
INSERT INTO Tipos_incentivo (nombre) VALUES ('Bono'), ('Reconocimiento'), ('Dia libre'), ('Comision'), ('Capacitacion');
INSERT INTO Tipos_evento_laboral (nombre) VALUES ('Ingreso'), ('Ascenso'), ('Traslado'), ('Cambio de rol'), ('Retiro');
INSERT INTO Tipos_hora_extra (nombre) VALUES ('Diurna'), ('Nocturna'), ('Dominical diurna'), ('Dominical nocturna'), ('Festiva');
INSERT INTO Estados_solicitud (nombre) VALUES ('Pendiente'), ('Aprobada'), ('Rechazada');
INSERT INTO Tipos_novedad_salud (nombre) VALUES ('Incapacidad'), ('Accidente laboral'), ('Enfermedad'), ('Examen medico');
INSERT INTO Tipos_evento_institucional (nombre) VALUES ('Reunion'), ('Celebracion'), ('Jornada de salud'), ('Integracion'), ('Reconocimiento');
INSERT INTO Modalidades_entrevista (nombre) VALUES ('Presencial'), ('Virtual'), ('Telefonica');
INSERT INTO Estados_candidato (nombre) VALUES ('En proceso'), ('Aprobado'), ('Rechazado'), ('Contratado');
INSERT INTO Estados_asistencia_capacitacion (nombre) VALUES ('Asistio'), ('No asistio'), ('Excusado');

/* ======================================================================
   5. DATOS SINTETICOS (30 por tabla)
   Datos de prueba para el taller textil. Empleados con id 101 a 130.
   ====================================================================== */
-- Datos de prueba: Empleados
INSERT INTO Empleados (id_empleado, nombre, apellido, correo, contrasena, id_tipo_sangre, telefono, id_rol, fecha_nacimiento) VALUES
    (101, 'Luisa', 'Castro Suarez', 'luisa.castro101@talentsoft.co', 'Dimon101', 8, '3813998698', 1, '2003-09-09'),
    (102, 'Oscar', 'Cardenas Ortiz', 'oscar.cardenas102@talentsoft.co', 'Dimon102', 8, '3309114170', 1, '2000-06-23'),
    (103, 'Felipe', 'Ramirez Moreno', 'felipe.ramirez103@talentsoft.co', 'Dimon103', 5, '3455681518', 2, '1982-11-26'),
    (104, 'Mateo', 'Gonzalez Ruiz', 'mateo.gonzalez104@talentsoft.co', 'Dimon104', 8, '3940557616', 2, '1975-03-23'),
    (105, 'Daniela', 'Suarez Medina', 'daniela.suarez105@talentsoft.co', 'Dimon105', 1, '3976846978', 4, '1995-10-26'),
    (106, 'Valentina', 'Medina Gonzalez', 'valentina.medina106@talentsoft.co', 'Dimon106', 2, '3081967273', 4, '1998-02-10'),
    (107, 'Jorge', 'Ortiz Pineda', 'jorge.ortiz107@talentsoft.co', 'Dimon107', 7, '3784864887', 4, '1989-06-05'),
    (108, 'Santiago', 'Vargas Diaz', 'santiago.vargas108@talentsoft.co', 'Dimon108', 5, '3002978753', 4, '2001-01-26'),
    (109, 'Paula', 'Ortiz Suarez', 'paula.ortiz109@talentsoft.co', 'Dimon109', 5, '3768045717', 3, '1990-04-26'),
    (110, 'Lorena', 'Hernandez Jimenez', 'lorena.hernandez110@talentsoft.co', 'Dimon110', 8, '3714751362', 3, '1970-08-18'),
    (111, 'Carlos', 'Garcia Ortiz', 'carlos.garcia111@talentsoft.co', 'Dimon111', 5, '3981933190', 3, '1999-12-27'),
    (112, 'Oscar', 'Ruiz Rojas', 'oscar.ruiz112@talentsoft.co', 'Dimon112', 8, '3205997283', 3, '1996-05-16'),
    (113, 'Andres', 'Mendoza Acosta', 'andres.mendoza113@talentsoft.co', 'Dimon113', 7, '3841622948', 3, '1987-07-07'),
    (114, 'Paola', 'Gonzalez Suarez', 'paola.gonzalez114@talentsoft.co', 'Dimon114', 1, '3360161055', 3, '1971-02-24'),
    (115, 'Nicolas', 'Gomez Castro', 'nicolas.gomez115@talentsoft.co', 'Dimon115', 3, '3475177992', 3, '1996-07-10'),
    (116, 'Nicolas', 'Ramirez Jimenez', 'nicolas.ramirez116@talentsoft.co', 'Dimon116', 4, '3957931860', 3, '1999-01-13'),
    (117, 'Lorena', 'Hernandez Rodriguez', 'lorena.hernandez117@talentsoft.co', 'Dimon117', 3, '3807370283', 3, '1977-03-12'),
    (118, 'Carolina', 'Hernandez Moreno', 'carolina.hernandez118@talentsoft.co', 'Dimon118', 3, '3468616425', 3, '1981-10-26'),
    (119, 'Mateo', 'Gomez Medina', 'mateo.gomez119@talentsoft.co', 'Dimon119', 5, '3647258771', 3, '1974-03-30'),
    (120, 'Andrea', 'Ramirez Torres', 'andrea.ramirez120@talentsoft.co', 'Dimon120', 3, '3017568205', 3, '1985-10-11'),
    (121, 'Natalia', 'Pineda Cardenas', 'natalia.pineda121@talentsoft.co', 'Dimon121', 5, '3831948939', 3, '1995-04-01'),
    (122, 'Daniel', 'Pineda Pardo', 'daniel.pineda122@talentsoft.co', 'Dimon122', 3, '3214162105', 3, '1998-12-23'),
    (123, 'David', 'Lopez Suarez', 'david.lopez123@talentsoft.co', 'Dimon123', 2, '3549145244', 3, '1970-08-16'),
    (124, 'Daniela', 'Medina Diaz', 'daniela.medina124@talentsoft.co', 'Dimon124', 6, '3600130411', 3, '1984-02-17'),
    (125, 'Oscar', 'Ortiz Mendoza', 'oscar.ortiz125@talentsoft.co', 'Dimon125', 2, '3906593976', 3, '2000-10-17'),
    (126, 'Laura', 'Suarez Pineda', 'laura.suarez126@talentsoft.co', 'Dimon126', 5, '3464506045', 3, '2002-08-14'),
    (127, 'Oscar', 'Lopez Vargas', 'oscar.lopez127@talentsoft.co', 'Dimon127', 2, '3659085380', 3, '1977-04-10'),
    (128, 'Juliana', 'Lopez Lopez', 'juliana.lopez128@talentsoft.co', 'Dimon128', 3, '3028594069', 3, '1985-12-20'),
    (129, 'Daniela', 'Moreno Moreno', 'daniela.moreno129@talentsoft.co', 'Dimon129', 7, '3363228088', 3, '1981-06-09'),
    (130, 'Paola', 'Gonzalez Torres', 'paola.gonzalez130@talentsoft.co', 'Dimon130', 2, '3004876452', 3, '1978-01-16');

-- Datos de prueba: Contratos
INSERT INTO Contratos (id_tipo_contrato, fecha_inicio, fecha_fin, salario, id_empleado) VALUES
    (5, '2020-06-04', NULL, 3650000.0, 101),
    (3, '2020-08-18', '2021-02-14', 1550000.0, 102),
    (5, '2021-09-09', NULL, 2700000.0, 103),
    (5, '2023-02-03', NULL, 3100000.0, 104),
    (4, '2025-02-17', '2027-02-17', 1423500.0, 105),
    (2, '2025-06-08', '2025-12-05', 3450000.0, 106),
    (1, '2021-12-07', NULL, 3000000.0, 107),
    (3, '2021-07-19', '2022-01-15', 2600000.0, 108),
    (3, '2026-06-03', '2026-11-30', 2350000.0, 109),
    (2, '2025-09-14', '2026-03-13', 2250000.0, 110),
    (3, '2026-02-20', '2027-02-20', 2650000.0, 111),
    (2, '2021-10-26', '2022-10-26', 2700000.0, 112),
    (4, '2022-02-11', '2022-08-10', 1423500.0, 113),
    (2, '2025-10-15', '2026-04-13', 2800000.0, 114),
    (2, '2020-04-26', '2020-10-23', 1800000.0, 115),
    (3, '2023-05-24', '2024-05-23', 2450000.0, 116),
    (2, '2021-06-02', '2021-11-29', 3350000.0, 117),
    (4, '2022-12-11', '2023-12-11', 1423500.0, 118),
    (1, '2026-03-25', NULL, 5800000.0, 119),
    (5, '2023-11-14', NULL, 2250000.0, 120),
    (4, '2023-07-02', '2024-07-01', 1423500.0, 121),
    (5, '2026-04-19', NULL, 3550000.0, 122),
    (4, '2023-07-08', '2024-07-07', 1423500.0, 123),
    (3, '2024-08-05', '2026-08-05', 2200000.0, 124),
    (2, '2024-11-01', '2025-11-01', 2150000.0, 125),
    (4, '2022-12-15', '2023-12-15', 1423500.0, 126),
    (2, '2026-04-18', '2026-10-15', 2700000.0, 127),
    (4, '2024-06-24', '2024-12-21', 1423500.0, 128),
    (4, '2026-02-16', '2027-02-16', 1423500.0, 129),
    (1, '2024-06-25', NULL, 3600000.0, 130);

-- Datos de prueba: Incentivos
INSERT INTO Incentivos (id_tipo_incentivo, descripcion, fecha_otorgado, id_empleado) VALUES
    (3, 'Puntualidad y asistencia perfecta', '2025-12-09', 101),
    (5, 'Apoyo en capacitacion a companeros', '2026-09-19', 102),
    (4, 'Cumplimiento de pedido urgente', '2026-05-03', 103),
    (4, 'Mejor empleado del mes', '2025-01-13', 104),
    (1, 'Cumplimiento de pedido urgente', '2025-08-14', 105),
    (1, 'Apoyo en capacitacion a companeros', '2025-10-03', 106),
    (3, 'Cumplimiento de metas de produccion', '2025-08-03', 107),
    (4, 'Cero desperdicio de tela', '2025-10-11', 108),
    (5, 'Apoyo en capacitacion a companeros', '2026-01-14', 109),
    (1, 'Cero desperdicio de tela', '2025-07-12', 110),
    (5, 'Cumplimiento de pedido urgente', '2025-01-12', 111),
    (1, 'Puntualidad y asistencia perfecta', '2025-12-04', 112),
    (2, 'Propuesta de mejora en el taller', '2025-07-31', 113),
    (5, 'Apoyo en capacitacion a companeros', '2025-06-24', 114),
    (3, 'Cumplimiento de metas de produccion', '2026-08-05', 115),
    (4, 'Apoyo en capacitacion a companeros', '2026-06-19', 116),
    (5, 'Cero desperdicio de tela', '2025-05-17', 117),
    (1, 'Cumplimiento de metas de produccion', '2025-10-05', 118),
    (4, 'Cumplimiento de metas de produccion', '2025-07-09', 119),
    (5, 'Apoyo en capacitacion a companeros', '2026-06-10', 120),
    (2, 'Propuesta de mejora en el taller', '2025-12-16', 121),
    (3, 'Mejor empleado del mes', '2025-11-22', 122),
    (5, 'Propuesta de mejora en el taller', '2025-09-19', 123),
    (4, 'Mejor empleado del mes', '2025-09-14', 124),
    (1, 'Apoyo en capacitacion a companeros', '2026-05-17', 125),
    (2, 'Cumplimiento de metas de produccion', '2026-05-08', 126),
    (3, 'Mejor empleado del mes', '2026-04-23', 127),
    (2, 'Mejor empleado del mes', '2025-10-08', 128),
    (5, 'Cumplimiento de pedido urgente', '2026-02-14', 129),
    (3, 'Puntualidad y asistencia perfecta', '2026-08-19', 130);

-- Datos de prueba: Diplomas
INSERT INTO Diplomas (nombre_diploma, institucion, fecha_obtencion, id_empleado) VALUES
    ('Tecnico en Confeccion Industrial', 'SENA', '2023-04-12', 101),
    ('Tecnologo en Patronaje Industrial', 'SENA', '2024-05-10', 102),
    ('Tecnologo en Gestion del Talento Humano', 'SENA', '2021-04-13', 103),
    ('Tecnico en Contabilidad', 'SENA', '2015-10-29', 104),
    ('Tecnologo en Gestion del Talento Humano', 'SENA', '2024-02-19', 105),
    ('Administracion de Empresas', 'Universidad Nacional', '2015-12-22', 106),
    ('Administracion de Empresas', 'Universidad Nacional', '2019-10-26', 107),
    ('Administracion de Empresas', 'Universidad Nacional', '2013-01-28', 108),
    ('Bachiller Academico', 'Colegio Distrital', '2006-10-02', 109),
    ('Bachiller Academico', 'Colegio Distrital', '2022-01-12', 110),
    ('Tecnico en Contabilidad', 'SENA', '2024-07-19', 111),
    ('Tecnologo en Patronaje Industrial', 'SENA', '2019-02-22', 112),
    ('Tecnologo en Gestion del Talento Humano', 'SENA', '2025-10-04', 113),
    ('Tecnico en Confeccion Industrial', 'SENA', '2005-08-25', 114),
    ('Curso de Seguridad y Salud en el Trabajo', 'SENA', '2010-05-28', 115),
    ('Tecnico en Confeccion Industrial', 'SENA', '2014-08-16', 116),
    ('Bachiller Academico', 'Colegio Distrital', '2016-07-10', 117),
    ('Tecnico en Confeccion Industrial', 'SENA', '2022-10-04', 118),
    ('Tecnico en Contabilidad', 'SENA', '2022-05-27', 119),
    ('Curso de Seguridad y Salud en el Trabajo', 'SENA', '2008-01-25', 120),
    ('Administracion de Empresas', 'Universidad Nacional', '2013-02-27', 121),
    ('Tecnologo en Patronaje Industrial', 'SENA', '2016-12-12', 122),
    ('Tecnico en Confeccion Industrial', 'SENA', '2008-05-30', 123),
    ('Bachiller Academico', 'Colegio Distrital', '2021-05-06', 124),
    ('Bachiller Academico', 'Colegio Distrital', '2007-12-12', 125),
    ('Tecnico en Confeccion Industrial', 'SENA', '2022-12-26', 126),
    ('Tecnico en Confeccion Industrial', 'SENA', '2011-04-16', 127),
    ('Tecnico en Contabilidad', 'SENA', '2023-05-21', 128),
    ('Bachiller Academico', 'Colegio Distrital', '2008-02-15', 129),
    ('Tecnico en Contabilidad', 'SENA', '2017-02-13', 130);

-- Datos de prueba: Historiales_laborales
INSERT INTO Historiales_laborales (id_rol, id_tipo_evento_laboral, fecha_evento, id_empleado) VALUES
    (1, 4, '2023-12-31', 101),
    (1, 1, '2025-02-16', 102),
    (2, 1, '2022-02-03', 103),
    (2, 4, '2020-08-07', 104),
    (4, 1, '2021-09-22', 105),
    (4, 2, '2025-06-28', 106),
    (4, 3, '2020-04-28', 107),
    (4, 1, '2022-06-23', 108),
    (3, 3, '2024-01-31', 109),
    (3, 3, '2021-01-11', 110),
    (3, 2, '2024-07-24', 111),
    (3, 1, '2023-08-22', 112),
    (3, 1, '2025-09-12', 113),
    (3, 1, '2025-04-12', 114),
    (3, 1, '2020-08-26', 115),
    (3, 1, '2023-12-16', 116),
    (3, 3, '2022-11-19', 117),
    (3, 1, '2020-04-25', 118),
    (3, 1, '2025-08-23', 119),
    (3, 1, '2021-01-03', 120),
    (3, 2, '2024-11-09', 121),
    (3, 1, '2021-11-30', 122),
    (3, 1, '2022-07-09', 123),
    (3, 4, '2025-07-18', 124),
    (3, 1, '2024-03-05', 125),
    (3, 1, '2026-01-03', 126),
    (3, 2, '2024-09-29', 127),
    (3, 2, '2024-01-27', 128),
    (3, 4, '2022-05-06', 129),
    (3, 1, '2024-12-09', 130);

-- Datos de prueba: Asistencias
INSERT INTO Asistencias (fecha, hora_entrada, hora_salida, id_empleado) VALUES
    ('2026-09-14', '08:50:00', '18:00:00', 101),
    ('2026-10-16', '07:00:00', '16:30:00', 102),
    ('2026-09-14', '08:15:00', '16:10:00', 103),
    ('2026-10-06', '07:15:00', '18:00:00', 104),
    ('2026-09-26', '07:30:00', '17:30:00', 105),
    ('2026-09-23', '06:45:00', '18:30:00', 106),
    ('2026-10-06', '07:15:00', '16:10:00', 107),
    ('2026-10-09', '07:30:00', '18:45:00', 108),
    ('2026-10-14', '08:00:00', '17:30:00', 109),
    ('2026-10-05', '06:45:00', '18:30:00', 110),
    ('2026-09-19', '08:50:00', '16:30:00', 111),
    ('2026-10-04', '06:00:00', '16:00:00', 112),
    ('2026-10-12', '07:50:00', '16:45:00', 113),
    ('2026-09-10', '08:45:00', '18:00:00', 114),
    ('2026-09-26', '07:15:00', '16:00:00', 115),
    ('2026-09-03', '06:15:00', '17:00:00', 116),
    ('2026-10-16', '06:50:00', '16:30:00', 117),
    ('2026-09-21', '07:30:00', '18:10:00', 118),
    ('2026-10-03', '07:15:00', '18:10:00', 119),
    ('2026-09-16', '07:45:00', '16:45:00', 120),
    ('2026-09-08', '08:15:00', '18:10:00', 121),
    ('2026-10-04', '08:45:00', '18:45:00', 122),
    ('2026-09-03', '06:45:00', '17:45:00', 123),
    ('2026-09-16', '08:45:00', '17:30:00', 124),
    ('2026-10-08', '08:30:00', '17:45:00', 125),
    ('2026-10-07', '06:30:00', '17:00:00', 126),
    ('2026-09-30', '07:15:00', '16:10:00', 127),
    ('2026-09-26', '07:00:00', '16:45:00', 128),
    ('2026-09-17', '06:15:00', '17:00:00', 129),
    ('2026-09-06', '07:50:00', '17:30:00', 130);

-- Datos de prueba: Horas_extra
INSERT INTO Horas_extra (fecha, id_tipo_hora_extra, cantidad_hora, id_empleado) VALUES
    ('2026-09-02', 2, 0.5, 101),
    ('2026-08-28', 5, 0.5, 102),
    ('2026-09-27', 5, 3.0, 103),
    ('2026-08-05', 3, 3.0, 104),
    ('2026-09-29', 5, 3.0, 105),
    ('2026-08-05', 2, 3.0, 106),
    ('2026-10-01', 1, 1.5, 107),
    ('2026-08-12', 2, 3.0, 108),
    ('2026-08-09', 3, 1.0, 109),
    ('2026-08-01', 3, 2.5, 110),
    ('2026-08-06', 4, 1.5, 111),
    ('2026-08-10', 5, 1.0, 112),
    ('2026-10-10', 5, 2.5, 113),
    ('2026-10-09', 2, 2.0, 114),
    ('2026-08-07', 5, 1.5, 115),
    ('2026-08-30', 5, 2.0, 116),
    ('2026-09-29', 1, 1.0, 117),
    ('2026-08-05', 1, 2.0, 118),
    ('2026-09-19', 5, 0.5, 119),
    ('2026-09-26', 5, 1.0, 120),
    ('2026-08-22', 2, 1.0, 121),
    ('2026-10-11', 2, 2.5, 122),
    ('2026-09-13', 4, 1.5, 123),
    ('2026-08-22', 4, 0.5, 124),
    ('2026-08-03', 3, 0.5, 125),
    ('2026-08-17', 5, 4.0, 126),
    ('2026-10-06', 2, 4.0, 127),
    ('2026-09-30', 2, 3.0, 128),
    ('2026-09-11', 2, 2.0, 129),
    ('2026-10-10', 1, 1.0, 130);

-- Datos de prueba: Permisos
INSERT INTO Permisos (motivacion, fecha_solicitud, id_estado_solicitud, duracion_horas, id_empleado, ausencia_justificada) VALUES
    ('Cita odontologica', '2026-07-12', 1, 8, 101, 1),
    ('Cita odontologica', '2026-09-24', 3, 6, 102, 1),
    ('Examen academico SENA', '2026-07-11', 3, 8, 103, 1),
    ('Cita medica', '2026-09-22', 3, 3, 104, 0),
    ('Cita odontologica', '2026-08-01', 1, 3, 105, 1),
    ('Calamidad domestica', '2026-08-09', 3, 8, 106, 1),
    ('Cita medica', '2026-08-13', 1, 8, 107, 0),
    ('Diligencia personal', '2026-09-14', 3, 1, 108, 0),
    ('Diligencia personal', '2026-10-05', 3, 2, 109, 1),
    ('Diligencia personal', '2026-07-15', 3, 1, 110, 0),
    ('Tramite en el banco', '2026-07-19', 1, 4, 111, 1),
    ('Diligencia personal', '2026-09-16', 1, 3, 112, 0),
    ('Cita medica', '2026-08-26', 2, 6, 113, 0),
    ('Reunion en el colegio de mi hijo', '2026-10-15', 1, 3, 114, 1),
    ('Cita odontologica', '2026-08-05', 1, 4, 115, 1),
    ('Tramite en el banco', '2026-08-02', 3, 4, 116, 1),
    ('Cita odontologica', '2026-08-30', 3, 3, 117, 1),
    ('Tramite en notaria', '2026-09-17', 1, 6, 118, 0),
    ('Reunion en el colegio de mi hijo', '2026-09-28', 1, 3, 119, 1),
    ('Reunion en el colegio de mi hijo', '2026-09-27', 2, 8, 120, 1),
    ('Tramite en notaria', '2026-07-30', 1, 4, 121, 0),
    ('Examen academico SENA', '2026-09-21', 3, 6, 122, 1),
    ('Tramite en el banco', '2026-09-08', 1, 6, 123, 1),
    ('Tramite en el banco', '2026-08-14', 3, 4, 124, 0),
    ('Tramite en el banco', '2026-07-05', 1, 8, 125, 1),
    ('Tramite en el banco', '2026-07-22', 1, 4, 126, 1),
    ('Calamidad domestica', '2026-08-26', 3, 4, 127, 1),
    ('Cita medica', '2026-09-17', 2, 3, 128, 1),
    ('Examen academico SENA', '2026-09-10', 1, 3, 129, 1),
    ('Tramite en el banco', '2026-10-11', 1, 8, 130, 1);

-- Datos de prueba: Vacaciones
INSERT INTO Vacaciones (fecha_inicio, fecha_fin, id_estado_solicitud, id_empleado) VALUES
    ('2026-09-21', '2026-10-05', 2, 101),
    ('2026-07-23', '2026-08-02', 1, 102),
    ('2026-08-08', '2026-08-23', 2, 103),
    ('2026-11-19', '2026-12-03', 1, 104),
    ('2026-10-18', '2026-11-02', 2, 105),
    ('2026-01-19', '2026-01-26', 1, 106),
    ('2026-04-25', '2026-05-05', 2, 107),
    ('2026-11-17', '2026-12-02', 2, 108),
    ('2026-03-26', '2026-04-10', 3, 109),
    ('2026-04-12', '2026-04-26', 1, 110),
    ('2026-10-11', '2026-10-18', 1, 111),
    ('2026-03-05', '2026-03-15', 2, 112),
    ('2026-03-09', '2026-03-24', 3, 113),
    ('2026-07-01', '2026-07-08', 2, 114),
    ('2026-05-05', '2026-05-19', 2, 115),
    ('2026-01-06', '2026-01-13', 1, 116),
    ('2026-06-28', '2026-07-08', 2, 117),
    ('2026-11-22', '2026-12-07', 1, 118),
    ('2026-11-30', '2026-12-07', 1, 119),
    ('2026-10-15', '2026-10-30', 2, 120),
    ('2026-11-05', '2026-11-15', 1, 121),
    ('2026-02-18', '2026-03-04', 1, 122),
    ('2026-03-22', '2026-04-06', 2, 123),
    ('2026-02-24', '2026-03-11', 1, 124),
    ('2026-02-20', '2026-02-27', 3, 125),
    ('2026-08-30', '2026-09-14', 1, 126),
    ('2026-08-19', '2026-09-03', 1, 127),
    ('2026-08-22', '2026-09-06', 2, 128),
    ('2026-02-24', '2026-03-03', 2, 129),
    ('2026-04-07', '2026-04-22', 3, 130);

-- Datos de prueba: Novedades_salud
INSERT INTO Novedades_salud (id_tipo_novedad, descripcion, fecha_evento, id_empleado) VALUES
    (1, 'Lesion leve en la mano en maquina de coser', '2026-05-31', 101),
    (2, 'Control de rutina con EPS', '2025-07-26', 102),
    (3, 'Examen medico periodico', '2025-06-06', 103),
    (2, 'Incapacidad por dolor lumbar', '2026-04-07', 104),
    (3, 'Lesion leve en la mano en maquina de coser', '2026-07-03', 105),
    (4, 'Examen de ingreso', '2025-07-23', 106),
    (2, 'Lesion leve en la mano en maquina de coser', '2026-09-21', 107),
    (1, 'Control de rutina con EPS', '2026-08-23', 108),
    (1, 'Incapacidad por dolor lumbar', '2026-06-29', 109),
    (3, 'Lesion leve en la mano en maquina de coser', '2026-01-05', 110),
    (3, 'Examen medico periodico', '2026-06-15', 111),
    (2, 'Incapacidad por dolor lumbar', '2026-01-01', 112),
    (3, 'Incapacidad por gripa', '2026-03-12', 113),
    (3, 'Incapacidad por dolor lumbar', '2026-01-22', 114),
    (3, 'Control de rutina con EPS', '2026-06-14', 115),
    (3, 'Examen medico periodico', '2026-05-29', 116),
    (4, 'Examen medico periodico', '2025-12-01', 117),
    (3, 'Lesion leve en la mano en maquina de coser', '2025-11-07', 118),
    (1, 'Examen de ingreso', '2026-04-07', 119),
    (2, 'Incapacidad por gripa', '2026-09-13', 120),
    (2, 'Incapacidad por dolor lumbar', '2026-04-01', 121),
    (3, 'Pausa activa recomendada', '2025-11-10', 122),
    (1, 'Pausa activa recomendada', '2025-11-20', 123),
    (4, 'Pausa activa recomendada', '2026-01-04', 124),
    (4, 'Incapacidad por dolor lumbar', '2025-12-10', 125),
    (1, 'Lesion leve en la mano en maquina de coser', '2026-08-20', 126),
    (4, 'Examen de ingreso', '2026-05-15', 127),
    (4, 'Incapacidad por dolor lumbar', '2025-11-14', 128),
    (4, 'Lesion leve en la mano en maquina de coser', '2025-06-08', 129),
    (3, 'Control de rutina con EPS', '2026-06-12', 130);

-- Datos de prueba: Evaluaciones_desempeno
INSERT INTO Evaluaciones_desempeno (porcentaje_cumplido, observaciones, id_empleado) VALUES
    (74.03, 'Excelente trabajo en equipo', 101),
    (91.29, 'Cumple con las metas asignadas', 102),
    (74.41, 'Buen desempeno en el area de corte', 103),
    (61.76, 'Cumple con las metas asignadas', 104),
    (94.55, 'Excelente trabajo en equipo', 105),
    (81.62, 'Necesita reforzar el control de calidad', 106),
    (91.73, 'Cumple con las metas asignadas', 107),
    (90.79, 'Buen desempeno en el area de corte', 108),
    (70.47, 'Excelente trabajo en equipo', 109),
    (96.58, 'Supera las expectativas del cargo', 110),
    (70.29, 'Debe mejorar la puntualidad', 111),
    (68.73, 'Cumple con las metas asignadas', 112),
    (69.16, 'Cumple con las metas asignadas', 113),
    (88.35, 'Desempeno estable durante el periodo', 114),
    (98.44, 'Necesita reforzar el control de calidad', 115),
    (78.25, 'Supera las expectativas del cargo', 116),
    (84.50, 'Necesita reforzar el control de calidad', 117),
    (85.31, 'Cumple con las metas asignadas', 118),
    (71.56, 'Cumple con las metas asignadas', 119),
    (94.97, 'Debe mejorar la puntualidad', 120),
    (64.66, 'Cumple con las metas asignadas', 121),
    (96.31, 'Desempeno estable durante el periodo', 122),
    (91.71, 'Necesita reforzar el control de calidad', 123),
    (94.98, 'Supera las expectativas del cargo', 124),
    (75.53, 'Debe mejorar la puntualidad', 125),
    (77.63, 'Desempeno estable durante el periodo', 126),
    (82.47, 'Cumple con las metas asignadas', 127),
    (90.26, 'Desempeno estable durante el periodo', 128),
    (71.48, 'Excelente trabajo en equipo', 129),
    (82.27, 'Desempeno estable durante el periodo', 130);

-- Datos de prueba: Encuestas_bienestar
INSERT INTO Encuestas_bienestar (fecha, resultado, observaciones, id_empleado) VALUES
    ('2026-04-18', 'Satisfecho', 'Las instalaciones son adecuadas', 101),
    ('2026-06-15', 'Satisfecho', 'Buen clima laboral', 102),
    ('2026-04-08', 'Neutral', 'Falta mas comunicacion con jefatura', 103),
    ('2026-08-11', 'Neutral', 'Falta mas comunicacion con jefatura', 104),
    ('2026-04-12', 'Insatisfecho', 'Carga de trabajo alta en temporada', 105),
    ('2026-06-10', 'Insatisfecho', 'Carga de trabajo alta en temporada', 106),
    ('2026-03-13', 'Muy satisfecho', 'Buenas capacitaciones', 107),
    ('2026-06-25', 'Satisfecho', 'Buen clima laboral', 108),
    ('2026-06-14', 'Insatisfecho', 'Carga de trabajo alta en temporada', 109),
    ('2026-06-21', 'Satisfecho', 'Las instalaciones son adecuadas', 110),
    ('2026-08-10', 'Muy satisfecho', 'Buenas capacitaciones', 111),
    ('2026-09-17', 'Muy satisfecho', 'Me siento a gusto con mi equipo', 112),
    ('2026-05-13', 'Satisfecho', 'Buen clima laboral', 113),
    ('2026-09-20', 'Satisfecho', 'Buen clima laboral', 114),
    ('2026-06-19', 'Muy satisfecho', 'Me siento a gusto con mi equipo', 115),
    ('2026-05-09', 'Muy satisfecho', 'Me siento a gusto con mi equipo', 116),
    ('2026-06-27', 'Muy satisfecho', 'Buenas capacitaciones', 117),
    ('2026-08-07', 'Insatisfecho', 'Carga de trabajo alta en temporada', 118),
    ('2026-04-22', 'Muy satisfecho', 'Me siento a gusto con mi equipo', 119),
    ('2026-04-10', 'Neutral', 'Falta mas comunicacion con jefatura', 120),
    ('2026-05-15', 'Muy satisfecho', 'Buenas capacitaciones', 121),
    ('2026-03-27', 'Satisfecho', 'Buen clima laboral', 122),
    ('2026-06-28', 'Muy satisfecho', 'Me siento a gusto con mi equipo', 123),
    ('2026-03-20', 'Satisfecho', 'Las instalaciones son adecuadas', 124),
    ('2026-06-09', 'Neutral', 'Falta mas comunicacion con jefatura', 125),
    ('2026-10-06', 'Satisfecho', 'Buen clima laboral', 126),
    ('2026-06-02', 'Satisfecho', 'Buen clima laboral', 127),
    ('2026-08-19', 'Insatisfecho', 'Carga de trabajo alta en temporada', 128),
    ('2026-05-10', 'Satisfecho', 'Buen clima laboral', 129),
    ('2026-04-26', 'Insatisfecho', 'Carga de trabajo alta en temporada', 130);

-- Datos de prueba: Registros_evento_institucional
INSERT INTO Registros_evento_institucional (id_tipo_evento_institucional, fecha_evento, descripcion, id_empleado) VALUES
    (2, '2026-05-15', 'Jornada de vacunacion', 103),
    (3, '2026-12-04', 'Entrega de reconocimientos', 104),
    (5, '2025-08-14', 'Reunion de planeacion de produccion', 108),
    (4, '2026-05-23', 'Jornada de pausas activas', 126),
    (2, '2025-11-22', 'Celebracion del dia de la mujer', 107),
    (5, '2026-02-14', 'Reunion de planeacion de produccion', 104),
    (4, '2026-02-13', 'Entrega de reconocimientos', 121),
    (4, '2026-06-07', 'Celebracion del dia de la mujer', 107),
    (2, '2026-06-04', 'Integracion de fin de ano', 103),
    (5, '2025-10-17', 'Entrega de reconocimientos', 110),
    (5, '2025-07-21', 'Entrega de reconocimientos', 112),
    (2, '2026-03-10', 'Integracion de fin de ano', 121),
    (1, '2026-04-09', 'Celebracion del dia de la mujer', 109),
    (4, '2026-07-08', 'Jornada de pausas activas', 123),
    (1, '2025-12-30', 'Jornada de vacunacion', 104),
    (3, '2026-07-30', 'Reunion general de resultados del mes', 116),
    (3, '2026-03-18', 'Jornada de vacunacion', 105),
    (1, '2025-08-09', 'Jornada de vacunacion', 125),
    (4, '2025-09-01', 'Celebracion del dia de la mujer', 121),
    (2, '2026-12-06', 'Reunion general de resultados del mes', 101),
    (3, '2025-12-24', 'Reunion general de resultados del mes', 121),
    (3, '2025-09-05', 'Jornada de vacunacion', 116),
    (5, '2026-07-27', 'Reunion de planeacion de produccion', 111),
    (5, '2026-01-11', 'Reunion general de resultados del mes', 112),
    (5, '2026-10-18', 'Reunion de planeacion de produccion', 116),
    (4, '2025-08-03', 'Reunion de planeacion de produccion', 121),
    (3, '2026-06-07', 'Celebracion del dia de la mujer', 118),
    (3, '2026-11-20', 'Jornada de vacunacion', 126),
    (4, '2026-12-03', 'Jornada de pausas activas', 125),
    (1, '2025-06-22', 'Integracion de fin de ano', 115);

-- Datos de prueba: Capacitaciones
INSERT INTO Capacitaciones (tema, lugar_plataforma, fecha, hora, id_empleado_capacitador) VALUES
    ('Seguridad industrial en maquinas de coser', 'Aula SENA', '2026-11-12', '08:00:00', 104),
    ('Atencion al cliente', 'Aula SENA', '2026-09-09', '14:00:00', 101),
    ('Control de calidad en confeccion', 'Sala de juntas', '2026-05-25', '08:00:00', 102),
    ('Trabajo en equipo', 'Taller principal', '2026-12-06', '09:00:00', 103),
    ('Primeros auxilios', 'Plataforma Google Meet', '2026-01-14', '08:00:00', 101),
    ('Uso de la plataforma TalentSoft', 'Plataforma Google Meet', '2026-07-08', '09:00:00', 104),
    ('Atencion al cliente', 'Taller principal', '2026-11-14', '10:00:00', 102),
    ('Excel basico para nomina', 'Plataforma Google Meet', '2026-06-05', '14:00:00', 104),
    ('Uso de la plataforma TalentSoft', 'Plataforma Google Meet', '2026-04-22', '08:00:00', 104),
    ('Trabajo en equipo', 'Plataforma Teams', '2026-04-30', '15:00:00', 104),
    ('Excel basico para nomina', 'Plataforma Teams', '2026-05-12', '10:00:00', 101),
    ('Primeros auxilios', 'Aula SENA', '2026-05-27', '09:00:00', 101),
    ('Prevencion de riesgos ergonomicos', 'Taller principal', '2026-05-02', '09:00:00', 103),
    ('Manejo del estres laboral', 'Plataforma Google Meet', '2026-09-05', '14:00:00', 101),
    ('Excel basico para nomina', 'Aula SENA', '2026-06-07', '08:00:00', 101),
    ('Excel basico para nomina', 'Plataforma Google Meet', '2026-07-01', '08:00:00', 104),
    ('Uso de la plataforma TalentSoft', 'Auditorio', '2026-08-18', '10:00:00', 104),
    ('Manejo de residuos textiles', 'Sala de juntas', '2026-06-02', '08:00:00', 101),
    ('Uso de la plataforma TalentSoft', 'Taller principal', '2026-05-16', '10:00:00', 103),
    ('Primeros auxilios', 'Plataforma Teams', '2026-11-20', '10:00:00', 101),
    ('Excel basico para nomina', 'Taller principal', '2026-10-26', '10:00:00', 104),
    ('Excel basico para nomina', 'Plataforma Google Meet', '2026-10-02', '08:00:00', 102),
    ('Excel basico para nomina', 'Plataforma Teams', '2026-08-01', '08:00:00', 102),
    ('Trabajo en equipo', 'Sala de juntas', '2026-11-22', '10:00:00', 104),
    ('Uso de la plataforma TalentSoft', 'Aula SENA', '2026-01-13', '15:00:00', 101),
    ('Manejo de residuos textiles', 'Sala de juntas', '2026-01-18', '08:00:00', 103),
    ('Atencion al cliente', 'Sala de juntas', '2026-01-20', '14:00:00', 101),
    ('Seguridad industrial en maquinas de coser', 'Auditorio', '2026-03-06', '14:00:00', 101),
    ('Primeros auxilios', 'Auditorio', '2026-03-30', '14:00:00', 102),
    ('Primeros auxilios', 'Sala de juntas', '2026-07-20', '14:00:00', 101);

-- Datos de prueba: Asistencias_capacitacion
INSERT INTO Asistencias_capacitacion (id_capacitacion, id_empleado, id_estado_asistencia) VALUES
    (1, 106, 1), (1, 108, 2), (1, 110, 2), (1, 121, 1),
    (2, 102, 3), (2, 103, 3), (3, 103, 1), (6, 113, 1),
    (7, 101, 3), (7, 102, 2), (7, 125, 2), (8, 112, 1),
    (8, 130, 2), (10, 113, 2), (10, 117, 3), (11, 130, 3),
    (12, 106, 1), (15, 103, 3), (15, 123, 3), (16, 104, 3),
    (17, 108, 1), (17, 116, 1), (17, 123, 3), (23, 113, 3),
    (25, 104, 1), (27, 119, 3), (28, 103, 1), (28, 110, 1),
    (29, 104, 2), (29, 114, 1);

-- Datos de prueba: Entrevistas
INSERT INTO Entrevistas (fecha, hora, id_modalidad, calificacion_tecnica, observaciones_tecnicas, id_empleado) VALUES
    ('2026-08-17', '11:00:00', 3, 3.55, 'Excelente manejo de maquinaria', 105),
    ('2026-08-18', '16:00:00', 2, 4.96, 'Buen dominio tecnico', 108),
    ('2026-09-30', '16:30:00', 2, 3.15, 'Excelente manejo de maquinaria', 105),
    ('2026-09-24', '11:00:00', 2, 2.74, 'Requiere refuerzo en calidad', 108),
    ('2026-10-06', '09:30:00', 3, 3.66, 'Excelente manejo de maquinaria', 105),
    ('2026-08-18', '10:00:00', 2, 4.74, 'Experiencia previa en confeccion', 106),
    ('2026-09-18', '10:00:00', 3, 4.99, 'Requiere refuerzo en calidad', 106),
    ('2026-10-06', '16:00:00', 3, 2.56, 'Experiencia previa en confeccion', 106),
    ('2026-08-02', '14:00:00', 3, 4.30, 'Conocimientos basicos suficientes', 106),
    ('2026-08-04', '15:30:00', 1, 3.51, 'Muy buena actitud', 106),
    ('2026-09-29', '15:00:00', 3, 4.49, 'Experiencia previa en confeccion', 107),
    ('2026-08-06', '11:00:00', 3, 2.80, 'Muy buena actitud', 108),
    ('2026-08-02', '10:00:00', 2, 2.80, 'Muy buena actitud', 105),
    ('2026-08-14', '09:00:00', 3, 4.06, 'Excelente manejo de maquinaria', 106),
    ('2026-09-19', '14:30:00', 3, 3.59, 'Conocimientos basicos suficientes', 108),
    ('2026-10-07', '16:00:00', 2, 3.49, 'Buen dominio tecnico', 106),
    ('2026-08-13', '15:30:00', 3, 2.77, 'Buen dominio tecnico', 106),
    ('2026-10-07', '10:30:00', 1, 3.64, 'Buen dominio tecnico', 106),
    ('2026-08-17', '09:30:00', 3, 3.95, 'Muy buena actitud', 107),
    ('2026-08-27', '10:00:00', 1, 3.73, 'No cumple el perfil tecnico', 108),
    ('2026-09-10', '16:30:00', 1, 2.66, 'No cumple el perfil tecnico', 107),
    ('2026-08-16', '08:00:00', 2, 2.98, 'Experiencia previa en confeccion', 108),
    ('2026-08-10', '15:30:00', 1, 4.90, 'Buen dominio tecnico', 106),
    ('2026-09-04', '09:00:00', 3, 3.41, 'Requiere refuerzo en calidad', 107),
    ('2026-10-10', '10:00:00', 3, 4.66, 'Experiencia previa en confeccion', 108),
    ('2026-10-09', '08:00:00', 2, 3.13, 'Buen dominio tecnico', 108),
    ('2026-08-10', '08:00:00', 3, 4.83, 'Conocimientos basicos suficientes', 106),
    ('2026-09-14', '08:00:00', 1, 3.39, 'Conocimientos basicos suficientes', 105),
    ('2026-09-17', '15:00:00', 1, 3.18, 'Conocimientos basicos suficientes', 107),
    ('2026-08-15', '16:00:00', 2, 2.79, 'Buen dominio tecnico', 106);

-- Datos de prueba: Candidatos
INSERT INTO Candidatos (documento_candidato, nombre_candidato, apellido_candidato, especialidad, id_estado_candidato, hoja_de_vida_pdf, id_empleado, id_entrevista) VALUES
    ('1057484627', 'Nicolas', 'Moreno', 'Confeccion', 2, '/hojas_vida/1057484627.pdf', 107, 1),
    ('1035454742', 'Diana', 'Lopez', 'Patronaje', 2, '/hojas_vida/1035454742.pdf', 106, 2),
    ('1058008404', 'Jorge', 'Suarez', 'Estampado', 2, '/hojas_vida/1058008404.pdf', 108, 3),
    ('1142895026', 'Mateo', 'Gomez', 'Estampado', 1, '/hojas_vida/1142895026.pdf', 107, 4),
    ('1191438139', 'Juan', 'Rojas', 'Control de calidad', 2, '/hojas_vida/1191438139.pdf', 107, 5),
    ('1104007457', 'Nicolas', 'Acosta', 'Bordado', 3, '/hojas_vida/1104007457.pdf', 106, 6),
    ('1068708805', 'Andres', 'Medina', 'Administracion', 4, '/hojas_vida/1068708805.pdf', 107, 7),
    ('1018908579', 'David', 'Acosta', 'Patronaje', 4, '/hojas_vida/1018908579.pdf', 107, 8),
    ('1068481032', 'Diana', 'Ruiz', 'Administracion', 4, '/hojas_vida/1068481032.pdf', 108, 9),
    ('1010604130', 'Daniel', 'Salazar', 'Administracion', 1, '/hojas_vida/1010604130.pdf', 106, 10),
    ('1164599089', 'Valentina', 'Moreno', 'Corte', 3, '/hojas_vida/1164599089.pdf', 107, 11),
    ('1005681639', 'Sofia', 'Cardenas', 'Estampado', 3, '/hojas_vida/1005681639.pdf', 108, 12),
    ('1002884494', 'Alejandro', 'Jimenez', 'Corte', 3, '/hojas_vida/1002884494.pdf', 108, 13),
    ('1071122348', 'Jorge', 'Torres', 'Diseno de modas', 2, '/hojas_vida/1071122348.pdf', 108, 14),
    ('1180681503', 'Juliana', 'Hernandez', 'Estampado', 4, '/hojas_vida/1180681503.pdf', 108, 15),
    ('1029331920', 'Juan', 'Mendoza', 'Sistemas', 4, '/hojas_vida/1029331920.pdf', 107, 16),
    ('1068349077', 'Sofia', 'Moreno', 'Sistemas', 3, '/hojas_vida/1068349077.pdf', 105, 17),
    ('1065514171', 'Mateo', 'Hernandez', 'Corte', 3, '/hojas_vida/1065514171.pdf', 108, 18),
    ('1144792410', 'Valentina', 'Gonzalez', 'Estampado', 4, '/hojas_vida/1144792410.pdf', 105, 19),
    ('1128153771', 'Felipe', 'Moreno', 'Contabilidad', 4, '/hojas_vida/1128153771.pdf', 107, 20),
    ('1021417256', 'Daniela', 'Salazar', 'Control de calidad', 1, '/hojas_vida/1021417256.pdf', 108, 21),
    ('1150924460', 'Nicolas', 'Hernandez', 'Corte', 2, '/hojas_vida/1150924460.pdf', 108, 22),
    ('1045881779', 'Paola', 'Hernandez', 'Corte', 4, '/hojas_vida/1045881779.pdf', 108, 23),
    ('1153988331', 'Felipe', 'Torres', 'Sistemas', 4, '/hojas_vida/1153988331.pdf', 105, 24),
    ('1030171317', 'Juan', 'Garcia', 'Sistemas', 4, '/hojas_vida/1030171317.pdf', 108, 25),
    ('1179605870', 'Juan', 'Garcia', 'Patronaje', 2, '/hojas_vida/1179605870.pdf', 106, 26),
    ('1003344906', 'Andrea', 'Gomez', 'Corte', 1, '/hojas_vida/1003344906.pdf', 108, 27),
    ('1165526977', 'Andres', 'Mendoza', 'Contabilidad', 3, '/hojas_vida/1165526977.pdf', 107, 28),
    ('1050009044', 'Paula', 'Suarez', 'Patronaje', 1, '/hojas_vida/1050009044.pdf', 108, 29),
    ('1197109230', 'Paola', 'Gonzalez', 'Control de calidad', 3, '/hojas_vida/1197109230.pdf', 106, 30);


/* ======================================================================
   6. VISTAS Y PROCEDIMIENTOS DE GESTION DE PERSONAL (David)
   ====================================================================== */

-- Vista: informacion basica de todos los empleados con su rol
DROP VIEW IF EXISTS verempleados;
CREATE VIEW verempleados AS 
SELECT 
    emp.id_empleado AS id,
    emp.nombre AS nombre,
    emp.apellido AS apellido,
    ro.nombre AS rol,
    emp.telefono AS telefono,
    emp.correo AS correo
FROM Empleados emp
INNER JOIN Roles ro ON ro.id_rol = emp.id_rol
ORDER BY emp.id_empleado ASC;

-- Procedimiento para buscar un empleado
DELIMITER //
DROP PROCEDURE IF EXISTS buscarempleado//
CREATE PROCEDURE buscarempleado(IN empleado INT)
BEGIN
    SELECT 
        emp.id_empleado AS id,
        emp.nombre AS nombre,
        emp.apellido AS apellido,
        ro.nombre AS rol,
        emp.telefono AS telefono,
        emp.correo AS correo
    FROM Empleados emp
    INNER JOIN Roles ro ON ro.id_rol = emp.id_rol
    WHERE emp.id_empleado = empleado;
END//

-- Procedimiento para registrar un empleado
DROP PROCEDURE IF EXISTS RegistrarEmpleado//
CREATE PROCEDURE RegistrarEmpleado(
    IN E_nombre VARCHAR(50),
    IN E_apellido VARCHAR(50),
    IN E_correo VARCHAR(100),
    IN E_contrasena VARCHAR(255),
    IN E_id_tipo_sangre INT,
    IN E_telefono VARCHAR(15),
    IN E_id_rol INT,
    IN E_fecha_nacimiento DATE
)
BEGIN
    INSERT INTO Empleados (nombre, apellido, correo, contrasena, id_tipo_sangre, telefono, id_rol, fecha_nacimiento)
    VALUES (E_nombre, E_apellido, E_correo, E_contrasena, E_id_tipo_sangre, E_telefono, E_id_rol, E_fecha_nacimiento);
END//

-- Procedimientos de actualizacion de campos especificos
DROP PROCEDURE IF EXISTS ActualizarNombreEmpleado//
CREATE PROCEDURE ActualizarNombreEmpleado(IN E_id_empleado INT, IN E_nombre VARCHAR(50))
BEGIN
    UPDATE Empleados SET nombre = E_nombre WHERE id_empleado = E_id_empleado;
END//

DROP PROCEDURE IF EXISTS ActualizarApellidoEmpleado//
CREATE PROCEDURE ActualizarApellidoEmpleado(IN E_id_empleado INT, IN E_apellido VARCHAR(50))
BEGIN
    UPDATE Empleados SET apellido = E_apellido WHERE id_empleado = E_id_empleado;
END//

DROP PROCEDURE IF EXISTS ActualizarCorreoEmpleado//
CREATE PROCEDURE ActualizarCorreoEmpleado(IN E_id_empleado INT, IN E_correo VARCHAR(100))
BEGIN
    UPDATE Empleados SET correo = E_correo WHERE id_empleado = E_id_empleado;
END//

DROP PROCEDURE IF EXISTS ActualizarContrasenaEmpleado//
CREATE PROCEDURE ActualizarContrasenaEmpleado(IN E_id_empleado INT, IN E_contrasena VARCHAR(255))
BEGIN
    UPDATE Empleados SET contrasena = E_contrasena WHERE id_empleado = E_id_empleado;
END//

DROP PROCEDURE IF EXISTS ActualizarTipoSangreEmpleado//
CREATE PROCEDURE ActualizarTipoSangreEmpleado(IN E_id_empleado INT, IN E_id_tipo_sangre INT)
BEGIN
    UPDATE Empleados SET id_tipo_sangre = E_id_tipo_sangre WHERE id_empleado = E_id_empleado;
END//

DROP PROCEDURE IF EXISTS ActualizarTelefonoEmpleado//
CREATE PROCEDURE ActualizarTelefonoEmpleado(IN E_id_empleado INT, IN E_telefono VARCHAR(15))
BEGIN
    UPDATE Empleados SET telefono = E_telefono WHERE id_empleado = E_id_empleado;
END//

DROP PROCEDURE IF EXISTS ActualizarRolEmpleado//
CREATE PROCEDURE ActualizarRolEmpleado(IN E_id_empleado INT, IN E_id_rol INT)
BEGIN
    UPDATE Empleados SET id_rol = E_id_rol WHERE id_empleado = E_id_empleado;
END//

DROP PROCEDURE IF EXISTS ActualizarFechaNacimientoEmpleado//
CREATE PROCEDURE ActualizarFechaNacimientoEmpleado(IN E_id_empleado INT, IN E_fecha_nacimiento DATE)
BEGIN
    UPDATE Empleados SET fecha_nacimiento = E_fecha_nacimiento WHERE id_empleado = E_id_empleado;
END//

DELIMITER ;

/* ======================================================================
   7. CONSULTAS DE VERIFICACION
   ====================================================================== */
SELECT * FROM verempleados;
-- ----------------------------------------------------------------------
-- CONSULTAS SELECT * FROM - MODULO 01 (DAVID / ESTRUCTURA GLOBAL)
-- ----------------------------------------------------------------------

-- 1. Vista principal de personal
SELECT * FROM verempleados;

-- 2. Tablas Transaccionales y del Modelo
SELECT * FROM Empleados;
SELECT * FROM Contratos;
SELECT * FROM Incentivos;
SELECT * FROM Diplomas;
SELECT * FROM Historiales_laborales;
SELECT * FROM Asistencias;
SELECT * FROM Horas_extra;
SELECT * FROM Permisos;
SELECT * FROM Vacaciones;
SELECT * FROM Novedades_salud;
SELECT * FROM Evaluaciones_desempeno;
SELECT * FROM Encuestas_bienestar;
SELECT * FROM Registros_evento_institucional;
SELECT * FROM Capacitaciones;
SELECT * FROM Asistencias_capacitacion;
SELECT * FROM Entrevistas;
SELECT * FROM Candidatos;

-- 3. Tablas Catalogo (Maestras)
SELECT * FROM Roles;
SELECT * FROM Tipos_sangre;
SELECT * FROM Tipos_contrato;
SELECT * FROM Tipos_incentivo;
SELECT * FROM Tipos_evento_laboral;
SELECT * FROM Tipos_hora_extra;
SELECT * FROM Estados_solicitud;
SELECT * FROM Tipos_novedad_salud;
SELECT * FROM Tipos_evento_institucional;
SELECT * FROM Modalidades_entrevista;
SELECT * FROM Estados_candidato;
SELECT * FROM Estados_asistencia_capacitacion;


/* ======================================================================
   RESPONSABLE: Danier Felipe Herrera Charry
   TALENTSOFT (Dimon's Style - Empresa de Confeccion)
   MODULO 02: PROCESOS ADMINISTRATIVOS
   Base de datos: TalentSoft_Taller

   CONTENIDO:
     1. Consultas basicas del modulo (JOIN, COUNT, INSERT, UPDATE, DELETE) y subconsultas
     2. Vistas
     3. Procedimientos almacenados
     4. DCL (roles, GRANT y REVOKE)

   Pestanas que cubre: Marcacion, Permisos, Vacaciones, Horas extra y Alertas.
   Estados de solicitud: 1 = Pendiente, 2 = Aprobada, 3 = Rechazada
   Tipos de hora extra:  1 = Diurna, 2 = Nocturna, 3 = Dominical diurna,
                         4 = Dominical nocturna, 5 = Festiva
   ====================================================================== */

USE TalentSoft_Taller;


/* ======================================================================
   1. CONSULTAS BASICAS DEL MODULO
   ====================================================================== */

-- ---------------------------------------------------------------------
-- ASISTENCIAS (pestana Marcacion)
-- ---------------------------------------------------------------------

-- Asistencia de cada empleado con su nombre (INNER JOIN).
-- Solo muestra los empleados que si tienen asistencia registrada.
SELECT
    e.nombre AS Empleado,
    a.fecha,
    a.hora_entrada,
    a.hora_salida
FROM Asistencias a
INNER JOIN Empleados e
    ON a.id_empleado = e.id_empleado;


-- Empleados que llegaron tarde (despues de las 8:00 AM).
SELECT
    e.nombre AS Empleado,
    a.fecha,
    a.hora_entrada
FROM Asistencias a
INNER JOIN Empleados e
    ON a.id_empleado = e.id_empleado
WHERE a.hora_entrada > '08:00:00';

-- ---------------------------------------------------------------------
-- PERMISOS (pestana Permisos)
-- ---------------------------------------------------------------------

-- Todos los empleados y su permiso, aunque no tengan (LEFT JOIN).
-- Si el empleado no tiene permiso, la columna sale NULL.
SELECT
    e.nombre AS Empleado,
    p.motivacion AS Permiso
FROM Empleados e
LEFT JOIN Permisos p
    ON p.id_empleado = e.id_empleado;

-- Empleados que nunca han pedido un permiso.
SELECT
    e.nombre AS Empleado_Sin_Permisos
FROM Empleados e
LEFT JOIN Permisos p
    ON e.id_empleado = p.id_empleado
WHERE p.id_permiso IS NULL;

-- Cantidad de permisos en cada estado (COUNT + GROUP BY).
SELECT
    es.nombre AS Estado,
    COUNT(*) AS Cantidad
FROM Permisos p
INNER JOIN Estados_solicitud es
    ON p.id_estado_solicitud = es.id_estado_solicitud
GROUP BY es.nombre;

-- Cantidad de permisos por empleado.
SELECT
    e.nombre AS Empleado,
    COUNT(p.id_permiso) AS Total_Permisos
FROM Empleados e
JOIN Permisos p
    ON e.id_empleado = p.id_empleado
GROUP BY e.id_empleado, e.nombre;

-- Aprobar un permiso (UPDATE).
-- El WHERE es obligatorio: sin el se modificarian todos los permisos.
UPDATE Permisos
SET id_estado_solicitud = 2
WHERE id_permiso = 5;

-- ---------------------------------------------------------------------
-- VACACIONES (pestana Vacaciones)
-- ---------------------------------------------------------------------

-- Vacaciones de cada empleado con el nombre del estado.
SELECT
    e.nombre AS Empleado,
    v.fecha_inicio,
    v.fecha_fin,
    es.nombre AS Estado
FROM Vacaciones v
INNER JOIN Empleados e
    ON v.id_empleado = e.id_empleado
INNER JOIN Estados_solicitud es
    ON v.id_estado_solicitud = es.id_estado_solicitud;

-- Cantidad de solicitudes de vacaciones por empleado.
SELECT
    e.nombre AS Empleado,
    COUNT(v.id_vacaciones) AS Total_Vacaciones
FROM Empleados e
JOIN Vacaciones v
    ON e.id_empleado = v.id_empleado
GROUP BY e.id_empleado, e.nombre;

-- Cancelar una solicitud de vacaciones pendiente (DELETE).
DELETE FROM Vacaciones
WHERE id_vacaciones = 2
    AND id_estado_solicitud = 1;

-- ---------------------------------------------------------------------
-- HORAS EXTRA (pestana Horas extra)
-- ---------------------------------------------------------------------

-- Horas extra con el nombre del empleado y el tipo.
SELECT
    e.nombre AS Empleado,
    t.nombre AS Tipo,
    h.fecha,
    h.cantidad_hora AS Horas
FROM Horas_extra h
INNER JOIN Empleados e
    ON h.id_empleado = e.id_empleado
INNER JOIN Tipos_hora_extra t
    ON h.id_tipo_hora_extra = t.id_tipo_hora_extra;

-- Total de horas extra por empleado (SUM + GROUP BY).
SELECT
    e.nombre AS Empleado,
    SUM(h.cantidad_hora) AS Total_Horas
FROM Horas_extra h
INNER JOIN Empleados e
    ON h.id_empleado = e.id_empleado
GROUP BY e.id_empleado, e.nombre;

-- Total de horas extra por tipo.
SELECT
    t.nombre AS Tipo,
    SUM(h.cantidad_hora) AS Total_Horas
FROM Horas_extra h
INNER JOIN Tipos_hora_extra t
    ON h.id_tipo_hora_extra = t.id_tipo_hora_extra
GROUP BY t.nombre;

-- ---------------------------------------------------------------------
-- CONTRATOS (pestana Alertas)
-- ---------------------------------------------------------------------

-- Contratos con el nombre del empleado y el tipo de contrato.
SELECT
    e.nombre AS Empleado,
    tc.nombre AS Tipo_Contrato,
    c.fecha_fin
FROM Contratos c
INNER JOIN Empleados e
    ON c.id_empleado = e.id_empleado
INNER JOIN Tipos_contrato tc
    ON c.id_tipo_contrato = tc.id_tipo_contrato;

-- Contratos que ya vencieron (CURDATE() es la fecha de hoy).
SELECT
    e.nombre AS Empleado,
    c.fecha_fin
FROM Contratos c
INNER JOIN Empleados e
    ON c.id_empleado = e.id_empleado
WHERE c.fecha_fin < CURDATE();

-- Contratos indefinidos (no tienen fecha de fin).
SELECT
    e.nombre AS Empleado,
    c.fecha_inicio
FROM Contratos c
INNER JOIN Empleados e
    ON c.id_empleado = e.id_empleado
WHERE c.fecha_fin IS NULL;

-- Cantidad de contratos por tipo.
SELECT
    tc.nombre AS Tipo_Contrato,
    COUNT(*) AS Cantidad
FROM Contratos c
INNER JOIN Tipos_contrato tc
    ON c.id_tipo_contrato = tc.id_tipo_contrato
GROUP BY tc.nombre;


-- ---------------------------------------------------------------------
-- SUBCONSULTAS (una consulta dentro de otra)
-- La consulta de adentro (entre parentesis) se ejecuta primero y su
-- resultado lo usa la consulta de afuera.
-- ---------------------------------------------------------------------

-- Empleados que tienen vacaciones aprobadas (IN).
SELECT
    nombre,
    apellido
FROM Empleados
WHERE id_empleado IN (
    SELECT id_empleado
    FROM Vacaciones
    WHERE id_estado_solicitud = 2
);

-- Empleados que tienen permisos pendientes (IN).
SELECT
    nombre,
    apellido
FROM Empleados
WHERE id_empleado IN (
    SELECT id_empleado
    FROM Permisos
    WHERE id_estado_solicitud = 1
);

-- Empleados con ausencias NO justificadas (IN).
SELECT
    nombre,
    apellido
FROM Empleados
WHERE id_empleado IN (
    SELECT id_empleado
    FROM Permisos
    WHERE ausencia_justificada = 0
);

-- Empleados que no han registrado horas extra (NOT IN).
SELECT
    nombre,
    apellido
FROM Empleados
WHERE id_empleado NOT IN (
    SELECT id_empleado
    FROM Horas_extra
);

-- Empleados que todavia no han marcado asistencia hoy (NOT IN).
SELECT
    nombre,
    apellido
FROM Empleados
WHERE id_empleado NOT IN (
    SELECT id_empleado
    FROM Asistencias
    WHERE fecha = CURDATE()
);

-- Empleados cuyo contrato vence en los proximos 60 dias (IN).
SELECT
    nombre,
    apellido
FROM Empleados
WHERE id_empleado IN (
    SELECT id_empleado
    FROM Contratos
    WHERE DATEDIFF(fecha_fin, CURDATE()) BETWEEN 0 AND 60
);

-- Empleados con salario mayor al promedio (comparacion con AVG).
SELECT
    e.nombre AS Empleado,
    c.salario
FROM Contratos c
INNER JOIN Empleados e
    ON c.id_empleado = e.id_empleado
WHERE c.salario > (
    SELECT AVG(salario)
    FROM Contratos
);

-- Registro con la mayor cantidad de horas extra (comparacion con MAX).
SELECT
    e.nombre AS Empleado,
    h.fecha,
    h.cantidad_hora AS Horas
FROM Horas_extra h
INNER JOIN Empleados e
    ON h.id_empleado = e.id_empleado
WHERE h.cantidad_hora = (
    SELECT MAX(cantidad_hora)
    FROM Horas_extra
);


/* ======================================================================
   2. VISTAS
   Una vista es una consulta guardada con nombre.
   Se consulta como si fuera una tabla.
   ====================================================================== */

-- Asistencia (pestana Marcacion)
CREATE VIEW VistaAsistencia AS
SELECT
    e.nombre AS Empleado,
    a.fecha,
    a.hora_entrada,
    a.hora_salida
FROM Asistencias a
INNER JOIN Empleados e
    ON a.id_empleado = e.id_empleado;

SELECT * FROM VistaAsistencia;

-- Permisos con el nombre del estado (pestana Permisos)
CREATE VIEW VistaPermisos AS
SELECT
    e.nombre AS Empleado,
    p.motivacion AS Motivo,
    p.fecha_solicitud,
    p.duracion_horas AS Horas,
    es.nombre AS Estado
FROM Permisos p
INNER JOIN Empleados e
    ON p.id_empleado = e.id_empleado
INNER JOIN Estados_solicitud es
    ON p.id_estado_solicitud = es.id_estado_solicitud;

SELECT * FROM VistaPermisos;

-- Vacaciones con el nombre del estado (pestana Vacaciones)
CREATE VIEW VistaVacaciones AS
SELECT
    e.nombre AS Empleado,
    v.fecha_inicio,
    v.fecha_fin,
    es.nombre AS Estado
FROM Vacaciones v
INNER JOIN Empleados e
    ON v.id_empleado = e.id_empleado
INNER JOIN Estados_solicitud es
    ON v.id_estado_solicitud = es.id_estado_solicitud;

SELECT * FROM VistaVacaciones;

-- Horas extra con el tipo (pestana Horas extra)
CREATE VIEW VistaHorasExtra AS
SELECT
    e.nombre AS Empleado,
    t.nombre AS Tipo,
    h.fecha,
    h.cantidad_hora AS Horas
FROM Horas_extra h
INNER JOIN Empleados e
    ON h.id_empleado = e.id_empleado
INNER JOIN Tipos_hora_extra t
    ON h.id_tipo_hora_extra = t.id_tipo_hora_extra;

SELECT * FROM VistaHorasExtra;

-- Contratos por vencer con los dias que les quedan (pestana Alertas)
-- DATEDIFF resta dos fechas: fecha_fin menos la fecha de hoy.
CREATE VIEW VistaAlertasContrato AS
SELECT
    e.nombre AS Empleado,
    c.fecha_fin,
    DATEDIFF(c.fecha_fin, CURDATE()) AS Dias_Restantes
FROM Contratos c
INNER JOIN Empleados e
    ON c.id_empleado = e.id_empleado
WHERE c.fecha_fin >= CURDATE();

SELECT * FROM VistaAlertasContrato;


/* ======================================================================
   3. PROCEDIMIENTOS ALMACENADOS
   Se guardan en la base de datos y se ejecutan con CALL.
   IN es el parametro: el valor que se manda al llamar el procedimiento.
   ====================================================================== */

-- ---------------------------------------------------------------------
-- MARCACION
-- ---------------------------------------------------------------------

-- Registrar la entrada (boton Registrar Entrada).
-- CURDATE() es la fecha de hoy y CURTIME() la hora actual.
-- La hora de salida queda vacia porque el turno apenas empieza.
DELIMITER $
CREATE PROCEDURE RegistrarEntrada(
    IN empleado INT
)
BEGIN
    INSERT INTO Asistencias (fecha, hora_entrada, id_empleado)
    VALUES (CURDATE(), CURTIME(), empleado);
END $

DELIMITER ;

CALL RegistrarEntrada(105);

-- Registrar la salida (boton Registrar Salida).
-- Completa la fila de hoy. "hora_salida IS NULL" evita cambiar una
-- salida que ya estaba registrada.
DELIMITER $
CREATE PROCEDURE RegistrarSalida(
    IN empleado INT
)
BEGIN
    UPDATE Asistencias
    SET hora_salida = CURTIME()
    WHERE id_empleado = empleado
        AND fecha = CURDATE()
        AND hora_salida IS NULL;
END $

DELIMITER ;

CALL RegistrarSalida(105);

-- Deshacer la salida (boton Deshacer registro de salida).
-- Deja el turno abierto otra vez.
DELIMITER $
CREATE PROCEDURE DeshacerSalida(
    IN empleado INT
)
BEGIN
    UPDATE Asistencias
    SET hora_salida = NULL
    WHERE id_empleado = empleado
        AND fecha = CURDATE();
END $

DELIMITER ;

CALL DeshacerSalida(105);

-- Buscar las asistencias de un empleado.
DELIMITER $
CREATE PROCEDURE BuscarAsistenciaEmpleado(
    IN empleado INT
)
BEGIN
    SELECT *
    FROM Asistencias
    WHERE id_empleado = empleado;
END $

DELIMITER ;

CALL BuscarAsistenciaEmpleado(101);

-- ---------------------------------------------------------------------
-- PERMISOS
-- ---------------------------------------------------------------------

-- Buscar los permisos de un empleado.
DELIMITER $
CREATE PROCEDURE BuscarPermisosEmpleado(
    IN empleado INT
)
BEGIN
    SELECT *
    FROM Permisos
    WHERE id_empleado = empleado;
END $

DELIMITER ;

CALL BuscarPermisosEmpleado(101);

-- Solicitar un permiso (boton Enviar solicitud).
-- Siempre queda Pendiente (1).
-- Medio dia = 4 horas, dia completo = 8 horas.
-- justificada: 1 = si, 0 = no.
DELIMITER $
CREATE PROCEDURE SolicitarPermiso(
    IN empleado INT,
    IN motivo TEXT,
    IN horas INT,
    IN justificada TINYINT
)
BEGIN
    INSERT INTO Permisos
        (motivacion, fecha_solicitud, id_estado_solicitud, duracion_horas, id_empleado, ausencia_justificada)
    VALUES
        (motivo, CURDATE(), 1, horas, empleado, justificada);
END $

DELIMITER ;

CALL SolicitarPermiso(101, 'Tramite en el banco', 4, 1);

-- Ver los permisos que esperan respuesta del jefe.
DELIMITER $
CREATE PROCEDURE PermisosPendientes()
BEGIN
    SELECT *
    FROM VistaPermisos
    WHERE Estado = 'Pendiente';
END $

DELIMITER ;

CALL PermisosPendientes();

-- El jefe aprueba (2) o rechaza (3) un permiso.
DELIMITER $
CREATE PROCEDURE ResolverPermiso(
    IN permiso INT,
    IN nuevo_estado INT
)
BEGIN
    UPDATE Permisos
    SET id_estado_solicitud = nuevo_estado
    WHERE id_permiso = permiso;
END $

DELIMITER ;

CALL ResolverPermiso(1, 2);

-- ---------------------------------------------------------------------
-- VACACIONES
-- ---------------------------------------------------------------------

-- Buscar las vacaciones de un empleado.
DELIMITER $
CREATE PROCEDURE BuscarVacacionesEmpleado(
    IN empleado INT
)
BEGIN
    SELECT *
    FROM Vacaciones
    WHERE id_empleado = empleado;
END $

DELIMITER ;

CALL BuscarVacacionesEmpleado(101);

-- Solicitar vacaciones (queda Pendiente).
DELIMITER $
CREATE PROCEDURE SolicitarVacaciones(
    IN empleado INT,
    IN inicio DATE,
    IN fin DATE
)
BEGIN
    INSERT INTO Vacaciones (fecha_inicio, fecha_fin, id_estado_solicitud, id_empleado)
    VALUES (inicio, fin, 1, empleado);
END $

DELIMITER ;

CALL SolicitarVacaciones(101, '2026-12-15', '2026-12-22');

-- Cancelar una solicitud de vacaciones.
-- Solo borra si sigue Pendiente (estado 1).
DELIMITER $
CREATE PROCEDURE CancelarVacaciones(
    IN vacacion INT
)
BEGIN
    DELETE FROM Vacaciones
    WHERE id_vacaciones = vacacion
        AND id_estado_solicitud = 1;
END $

DELIMITER ;

CALL CancelarVacaciones(4);

-- ---------------------------------------------------------------------
-- HORAS EXTRA
-- ---------------------------------------------------------------------

-- Buscar las horas extra de un empleado con el tipo.
DELIMITER $
CREATE PROCEDURE BuscarHorasExtraEmpleado(
    IN empleado INT
)
BEGIN
    SELECT
        h.fecha,
        t.nombre AS Tipo,
        h.cantidad_hora AS Horas
    FROM Horas_extra h
    INNER JOIN Tipos_hora_extra t
        ON h.id_tipo_hora_extra = t.id_tipo_hora_extra
    WHERE h.id_empleado = empleado;
END $

DELIMITER ;

CALL BuscarHorasExtraEmpleado(101);

-- Registrar horas extra (boton Registrar horas).
DELIMITER $
CREATE PROCEDURE RegistrarHorasExtra(
    IN empleado INT,
    IN tipo INT,
    IN horas DECIMAL(4,2)
)
BEGIN
    INSERT INTO Horas_extra (fecha, id_tipo_hora_extra, cantidad_hora, id_empleado)
    VALUES (CURDATE(), tipo, horas, empleado);
END $

DELIMITER ;

CALL RegistrarHorasExtra(101, 1, 2.5);

-- ---------------------------------------------------------------------
-- ALERTAS
-- ---------------------------------------------------------------------

-- Contratos que vencen en los proximos "dias" dias.
-- Ejemplo: CALL AlertasContrato(60); revisa los proximos 60 dias.
DELIMITER $
CREATE PROCEDURE AlertasContrato(
    IN dias INT
)
BEGIN
    SELECT
        e.nombre AS Empleado,
        c.fecha_fin,
        DATEDIFF(c.fecha_fin, CURDATE()) AS Dias_Restantes
    FROM Contratos c
    INNER JOIN Empleados e
        ON c.id_empleado = e.id_empleado
    WHERE DATEDIFF(c.fecha_fin, CURDATE()) BETWEEN 0 AND dias;
END $

DELIMITER ;

CALL AlertasContrato(60);

-- Ver los procedimientos creados en la base de datos.
SHOW PROCEDURE STATUS
WHERE Db = DATABASE();


/* ======================================================================
   4. DCL (Data Control Language)
   GRANT = otorga permisos.   REVOKE = retira permisos.
   Se aplica el principio de minimo privilegio: cada rol recibe solo
   lo que necesita. Los permisos se dan sobre vistas y procedimientos,
   no sobre las tablas.
   Ejecutar esta parte con el usuario root.
   ====================================================================== */

-- ---------------------------------------------------------------------
-- Crear los roles (los mismos 4 que tiene TalentSoft)
-- ---------------------------------------------------------------------
-- Se eliminan antes de crearlos para poder ejecutar el script varias veces
DROP USER IF EXISTS 'luisa'@'localhost', 'felipe'@'localhost', 'carlos'@'localhost';
DROP ROLE IF EXISTS jefe, administrador, empleado, entrevistador;

CREATE ROLE jefe;
CREATE ROLE administrador;
CREATE ROLE empleado;
CREATE ROLE entrevistador;

-- ---------------------------------------------------------------------
-- JEFE: consulta todo el modulo, aprueba permisos y ve las alertas
-- ---------------------------------------------------------------------
GRANT SELECT ON TalentSoft_Taller.VistaAsistencia TO jefe;
GRANT SELECT ON TalentSoft_Taller.VistaPermisos TO jefe;
GRANT SELECT ON TalentSoft_Taller.VistaVacaciones TO jefe;
GRANT SELECT ON TalentSoft_Taller.VistaHorasExtra TO jefe;
GRANT SELECT ON TalentSoft_Taller.VistaAlertasContrato TO jefe;
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.PermisosPendientes TO jefe;
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.ResolverPermiso TO jefe;
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.AlertasContrato TO jefe;

-- ---------------------------------------------------------------------
-- ADMINISTRADOR: consulta todo el modulo y ve las alertas
-- ---------------------------------------------------------------------
GRANT SELECT ON TalentSoft_Taller.VistaAsistencia TO administrador;
GRANT SELECT ON TalentSoft_Taller.VistaPermisos TO administrador;
GRANT SELECT ON TalentSoft_Taller.VistaVacaciones TO administrador;
GRANT SELECT ON TalentSoft_Taller.VistaHorasExtra TO administrador;
GRANT SELECT ON TalentSoft_Taller.VistaAlertasContrato TO administrador;
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.AlertasContrato TO administrador;

-- ---------------------------------------------------------------------
-- EMPLEADO: marca asistencia y hace sus propias solicitudes.
-- No ve las alertas de contrato ni aprueba nada.
-- ---------------------------------------------------------------------
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.RegistrarEntrada TO empleado;
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.RegistrarSalida TO empleado;
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.DeshacerSalida TO empleado;
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.BuscarAsistenciaEmpleado TO empleado;
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.BuscarPermisosEmpleado TO empleado;
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.SolicitarPermiso TO empleado;
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.BuscarVacacionesEmpleado TO empleado;
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.SolicitarVacaciones TO empleado;
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.CancelarVacaciones TO empleado;
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.BuscarHorasExtraEmpleado TO empleado;
GRANT EXECUTE ON PROCEDURE TalentSoft_Taller.RegistrarHorasExtra TO empleado;

-- ---------------------------------------------------------------------
-- ENTREVISTADOR: no tiene permisos en este modulo
-- (su trabajo esta en el modulo de seleccion).
-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- Crear usuarios de prueba (uno por rol) y asignarles el rol
-- ---------------------------------------------------------------------
CREATE USER 'luisa'@'localhost' IDENTIFIED BY 'Dimon101';
CREATE USER 'felipe'@'localhost' IDENTIFIED BY 'Dimon103';
CREATE USER 'carlos'@'localhost' IDENTIFIED BY 'Dimon111';

GRANT jefe TO 'luisa'@'localhost';
GRANT administrador TO 'felipe'@'localhost';
GRANT empleado TO 'carlos'@'localhost';

-- En MySQL 8 el rol hay que activarlo por defecto; si no, el usuario
-- entra sin permisos.
SET DEFAULT ROLE jefe TO 'luisa'@'localhost';
SET DEFAULT ROLE administrador TO 'felipe'@'localhost';
SET DEFAULT ROLE empleado TO 'carlos'@'localhost';

-- ---------------------------------------------------------------------
-- Ver los permisos de los roles
-- ---------------------------------------------------------------------
SHOW GRANTS FOR jefe;
SHOW GRANTS FOR empleado;

-- ---------------------------------------------------------------------
-- REVOKE: retirar un permiso.
-- Ejemplo: el empleado ya no puede registrar horas extra.
-- ---------------------------------------------------------------------
REVOKE EXECUTE ON PROCEDURE TalentSoft_Taller.RegistrarHorasExtra FROM empleado;

-- ---------------------------------------------------------------------
-- PRUEBA DE SEGURIDAD
-- Abrir una conexion nueva en Workbench con el usuario 'carlos'
-- (clave Dimon111) y ejecutar:
--
-- CALL TalentSoft_Taller.BuscarPermisosEmpleado(111);   -> funciona
-- SELECT * FROM TalentSoft_Taller.VistaPermisos;        -> error, no tiene permiso
-- SELECT * FROM TalentSoft_Taller.Permisos;             -> error, no tiene permiso
-- ---------------------------------------------------------------------


/* ======================================================================
   RESPONSABLE: Brayan
   TALENTSOFT (Dimon's Style - Empresa de Confeccion)
   MODULO 03: RECLUTAMIENTO Y SELECCION (Banco de Candidatos, Entrevistas)
   Base de datos: TalentSoft_Taller

   CONTENIDO:
     1. Vistas para el banco de candidatos y el dashboard
     2. Triggers
     3. Procedimientos almacenados
     4. Datos de prueba (perfiles de confeccion de Dimon's Style)
     5. Consultas de ejemplo del modulo

   Estados de candidato: 1 = En proceso, 2 = Aprobado, 3 = Rechazado,
                         4 = Contratado
   ====================================================================== */

USE TalentSoft_Taller;


/* ======================================================================
   1. VISTAS PARA EL BANCO DE CANDIDATOS Y EL DASHBOARD
   ====================================================================== */

-- Banco de candidatos: datos del candidato con su entrevista y estado
DROP VIEW IF EXISTS vista_candidatos_detalle;
CREATE VIEW vista_candidatos_detalle AS
SELECT
    c.documento_candidato,
    c.nombre_candidato,
    c.apellido_candidato,
    c.especialidad,
    e.fecha,
    e.calificacion_tecnica,
    est.nombre AS estado,
    c.id_candidato,
    c.hoja_de_vida_pdf,
    c.id_entrevista
FROM Candidatos c
INNER JOIN Entrevistas e ON c.id_entrevista = e.id_entrevista
LEFT JOIN Estados_candidato est ON c.id_estado_candidato = est.id_estado_candidato;

-- Gestion de entrevistas: candidato, reclutador, modalidad y observaciones
DROP VIEW IF EXISTS vista_entrevistas_gestion;
CREATE VIEW vista_entrevistas_gestion AS
SELECT
    c.nombre_candidato,
    c.apellido_candidato,
    c.especialidad,
    e.fecha,
    e.hora,
    e.calificacion_tecnica,
    emp.nombre AS nombre_reclutador,
    emp.apellido AS apellido_reclutador,
    m.nombre AS modalidad,
    e.observaciones_tecnicas
FROM Candidatos c
INNER JOIN Entrevistas e ON c.id_entrevista = e.id_entrevista
LEFT JOIN Empleados emp ON e.id_empleado = emp.id_empleado
LEFT JOIN Modalidades_entrevista m ON m.id_modalidad = e.id_modalidad;

-- Dashboard: total de candidatos por estado y promedio de calificacion
DROP VIEW IF EXISTS vista_dashboard_reclutamiento;
CREATE VIEW vista_dashboard_reclutamiento AS
SELECT
    COUNT(*) AS total_candidatos,
    COALESCE(SUM(CASE WHEN c.id_estado_candidato = 1 THEN 1 ELSE 0 END), 0) AS en_proceso,
    COALESCE(SUM(CASE WHEN c.id_estado_candidato = 2 THEN 1 ELSE 0 END), 0) AS aprobados,
    COALESCE(SUM(CASE WHEN c.id_estado_candidato = 3 THEN 1 ELSE 0 END), 0) AS rechazados,
    COALESCE(SUM(CASE WHEN c.id_estado_candidato = 4 THEN 1 ELSE 0 END), 0) AS contratados,
    ROUND(AVG(e.calificacion_tecnica), 2) AS promedio_calificacion
FROM Candidatos c
INNER JOIN Entrevistas e ON e.id_entrevista = c.id_entrevista;

-- Candidatos por especialidad: total, promedio y mejor calificacion
DROP VIEW IF EXISTS vista_candidatos_por_especialidad;
CREATE VIEW vista_candidatos_por_especialidad AS
SELECT c.especialidad,
       COUNT(*) AS total_candidatos,
       ROUND(AVG(e.calificacion_tecnica), 2) AS promedio_calificacion,
       MAX(e.calificacion_tecnica) AS mejor_calificacion
FROM Candidatos c
INNER JOIN Entrevistas e ON c.id_entrevista = e.id_entrevista
GROUP BY c.especialidad;

-- Ranking de candidatos por especialidad segun la calificacion tecnica
DROP VIEW IF EXISTS vista_ranking_candidatos;
CREATE VIEW vista_ranking_candidatos AS
SELECT c.id_candidato,
       CONCAT(c.nombre_candidato, ' ', c.apellido_candidato) AS candidato,
       c.especialidad,
       e.calificacion_tecnica,
       est.nombre AS estado,
       RANK() OVER (PARTITION BY c.especialidad ORDER BY e.calificacion_tecnica DESC) AS puesto
FROM Candidatos c
INNER JOIN Entrevistas e ON c.id_entrevista = e.id_entrevista
LEFT JOIN Estados_candidato est ON est.id_estado_candidato = c.id_estado_candidato;

/* ======================================================================
   2. TRIGGERS DE INTEGRIDAD Y VALIDACION
   ====================================================================== */
-- Antes de insertar un candidato: estado 'En proceso' por defecto y documento sin espacios
DELIMITER //
DROP TRIGGER IF EXISTS trg_verificar_estado_candidato//
CREATE TRIGGER trg_verificar_estado_candidato BEFORE INSERT ON Candidatos FOR EACH ROW
BEGIN
    IF NEW.id_estado_candidato IS NULL THEN SET NEW.id_estado_candidato = 1; END IF;
    SET NEW.documento_candidato = TRIM(NEW.documento_candidato);
END//
DELIMITER ;

/* ======================================================================
   3. PROCEDIMIENTOS ALMACENADOS
   ====================================================================== */
-- Registra un candidato y devuelve su id
DELIMITER //
DROP PROCEDURE IF EXISTS sp_registrar_candidatos//
CREATE PROCEDURE sp_registrar_candidatos(
    IN p_documento VARCHAR(15), IN p_nombre VARCHAR(50), IN p_apellido VARCHAR(50),
    IN p_especialidad VARCHAR(45), IN p_estado INT, IN p_hoja_vida VARCHAR(255),
    IN p_empleado INT, IN p_entrevista INT
)
BEGIN
    -- Candidatos de prueba (uno por entrevista)
    INSERT INTO Candidatos (documento_candidato, nombre_candidato, apellido_candidato, especialidad, id_estado_candidato, hoja_de_vida_pdf, id_empleado, id_entrevista)
    VALUES (p_documento, p_nombre, p_apellido, p_especialidad, p_estado, p_hoja_vida, p_empleado, p_entrevista);
    SELECT LAST_INSERT_ID() AS id_candidato;
END//
DELIMITER ;

/* ======================================================================
   4. DATOS DE PRUEBA (Perfiles de Confeccion Dimon's Style)
   ====================================================================== */

-- Vista auxiliar: genera los numeros del 1 al 20 (la usa el INSERT de Entrevistas).
-- No existia en los modulos anteriores y sin ella el script falla.
DROP VIEW IF EXISTS vista_numeros_aux;
CREATE VIEW vista_numeros_aux AS
WITH RECURSIVE nums AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM nums WHERE n < 20
)
SELECT n FROM nums;

-- Los INSERT solo se ejecutan si la tabla esta vacia (por eso el COUNT(*) = 0).
-- Con los datos del modulo 01 ya hay registros, asi que no insertan nada.

-- Entrevistas de prueba
INSERT INTO Entrevistas (fecha, hora, id_modalidad, calificacion_tecnica, observaciones_tecnicas, id_empleado)
SELECT DATE_ADD(CURDATE(), INTERVAL (v.n * 3 - 40) DAY), '09:00:00', (v.n % 3) + 1,
       4 + ((v.n * 37) % 55) / 10, 'Excelente manejo de maquinaria textil y destreza en costura.', 103 + (v.n % 2)
FROM vista_numeros_aux v WHERE v.n <= 20 AND (SELECT COUNT(*) FROM Entrevistas) = 0;

INSERT INTO Candidatos (documento_candidato, nombre_candidato, apellido_candidato, especialidad, id_estado_candidato, hoja_de_vida_pdf, id_empleado, id_entrevista)
SELECT CONCAT('1020', LPAD(e.id_entrevista, 6, '0')),
       ELT(((e.id_entrevista - 1) % 20) + 1, 'Alejandro','Brenda','Cristian','Dayana','Eduardo','Fabiola','Gustavo','Heidy','Ivan','Johana','Kevin','Lorena','Manuel','Nancy','Oscar','Patricia','Ricardo','Silvia','Tomas','Viviana'),
       ELT(((e.id_entrevista * 3) % 20) + 1, 'Aguirre','Bermudez','Cortes','Duarte','Escobar','Forero','Galvis','Henao','Idarraga','Jaramillo','Lozano','Mejia','Naranjo','Osorio','Pineda','Quiroga','Restrepo','Sandoval','Tamara','Uribe'),
       -- Especialidades textiles para Dimon's Style:
       ELT((e.id_entrevista % 6) + 1, 'Corte y Trazo', 'Patronaje y Escalado', 'Control de Calidad Textil', 'Ensamblaje y Costura', 'Acabados y Plancha', 'Diseno de Modas'),
       CASE WHEN e.calificacion_tecnica >= 8 THEN 2 ELSE 1 END,
       CONCAT('/cv/1020', LPAD(e.id_entrevista, 6, '0'), '.pdf'), e.id_empleado, e.id_entrevista
FROM Entrevistas e WHERE (SELECT COUNT(*) FROM Candidatos) = 0;

/* ======================================================================
   5. CONSULTAS DE EJEMPLO DEL MODULO 03 (Tus SELECT para proyectar)
   ====================================================================== */
SELECT * FROM vista_candidatos_detalle;
SELECT * FROM vista_entrevistas_gestion;
SELECT * FROM vista_dashboard_reclutamiento;
SELECT * FROM vista_candidatos_por_especialidad;
SELECT * FROM vista_ranking_candidatos;


/* ======================================================================
   RESPONSABLE: Santiago
   TALENTSOFT (Dimon's Style - Empresa de Confeccion)
   MODULO 04: GESTION DEL BIENESTAR
   Base de datos: TalentSoft_Taller

   CONTENIDO:
     1. Vistas analiticas del modulo
     2. Triggers de integridad y validacion
     3. Procedimientos almacenados
     4. Datos de prueba (Eventos, Salud, Encuestas y Capacitaciones)
     5. DCL (Permisos por Rol)
     6. Consultas directas de Santiago (100% funcionales)
   ====================================================================== */

USE TalentSoft_Taller;
SET NAMES utf8mb4;

/* ======================================================================
   1. VISTAS ANALITICAS DEL MODULO
   ====================================================================== */

-- Eventos institucionales
DROP VIEW IF EXISTS vista_eventos_institucionales;
CREATE VIEW vista_eventos_institucionales AS
SELECT REI.id_evento, TEI.nombre AS tipo_evento, REI.descripcion, REI.fecha_evento,
       CONCAT(E.nombre, ' ', E.apellido) AS empleado_organizador
FROM Registros_evento_institucional REI
INNER JOIN Tipos_evento_institucional TEI ON REI.id_tipo_evento_institucional = TEI.id_tipo_evento_institucional
LEFT JOIN Empleados E ON REI.id_empleado = E.id_empleado;

-- Proximos eventos
DROP VIEW IF EXISTS vista_proximos_eventos;
CREATE VIEW vista_proximos_eventos AS
SELECT id_evento, tipo_evento, descripcion, fecha_evento, empleado_organizador,
       DATEDIFF(fecha_evento, CURDATE()) AS dias_faltantes
FROM vista_eventos_institucionales
WHERE fecha_evento >= CURDATE();

-- Salud ocupacional: estadisticas
DROP VIEW IF EXISTS vista_salud_estadisticas;
CREATE VIEW vista_salud_estadisticas AS
SELECT t.nombre AS tipo_novedad, COUNT(*) AS total_casos
FROM Novedades_salud n
JOIN Tipos_novedad_salud t ON t.id_tipo_novedad = n.id_tipo_novedad
GROUP BY t.nombre;

-- Encuestas de bienestar: distribucion de satisfaccion
DROP VIEW IF EXISTS vista_encuestas_satisfaccion;
CREATE VIEW vista_encuestas_satisfaccion AS
SELECT resultado, COUNT(*) AS total_respuestas,
       ROUND(100 * COUNT(*) / (SELECT COUNT(*) FROM Encuestas_bienestar), 1) AS porcentaje
FROM Encuestas_bienestar
GROUP BY resultado;

-- Capacitaciones textiles programadas
DROP VIEW IF EXISTS vista_capacitaciones_programacion;
CREATE VIEW vista_capacitaciones_programacion AS
SELECT c.id_capacitacion, c.tema, c.lugar_plataforma, c.fecha, c.hora,
       CONCAT(e.nombre, ' ', e.apellido) AS capacitador
FROM Capacitaciones c
LEFT JOIN Empleados e ON e.id_empleado = c.id_empleado_capacitador;


/* ======================================================================
   2. TRIGGERS DE INTEGRIDAD Y VALIDACION
   ====================================================================== */

DELIMITER //

DROP TRIGGER IF EXISTS trg_evento_bi//
CREATE TRIGGER trg_evento_bi
BEFORE INSERT ON Registros_evento_institucional
FOR EACH ROW
BEGIN
    IF NEW.id_tipo_evento_institucional IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Debe indicar el tipo de evento';
    END IF;
    IF NEW.fecha_evento IS NULL THEN SET NEW.fecha_evento = CURDATE(); END IF;
    SET NEW.descripcion = TRIM(NEW.descripcion);
END//

DROP TRIGGER IF EXISTS trg_novedad_bi//
CREATE TRIGGER trg_novedad_bi
BEFORE INSERT ON Novedades_salud
FOR EACH ROW
BEGIN
    IF NEW.id_tipo_novedad IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Debe indicar el tipo de novedad';
    END IF;
    IF NEW.fecha_evento IS NULL THEN SET NEW.fecha_evento = CURDATE(); END IF;
END//

DROP TRIGGER IF EXISTS trg_encuesta_bi//
CREATE TRIGGER trg_encuesta_bi
BEFORE INSERT ON Encuestas_bienestar
FOR EACH ROW
BEGIN
    IF NEW.fecha IS NULL THEN SET NEW.fecha = CURDATE(); END IF;
    SET NEW.resultado = TRIM(NEW.resultado);
END//

DELIMITER ;


/* ======================================================================
   3. PROCEDIMIENTOS ALMACENADOS
   ====================================================================== */

DELIMITER //

DROP PROCEDURE IF EXISTS sp_registrar_evento//
CREATE PROCEDURE sp_registrar_evento(IN p_tipo INT, IN p_fecha DATE, IN p_descripcion TEXT, IN p_empleado INT)
BEGIN
    INSERT INTO Registros_evento_institucional (id_tipo_evento_institucional, fecha_evento, descripcion, id_empleado)
    VALUES (p_tipo, p_fecha, p_descripcion, p_empleado);
END//

DROP PROCEDURE IF EXISTS sp_registrar_novedad_salud//
CREATE PROCEDURE sp_registrar_novedad_salud(IN p_tipo INT, IN p_descripcion TEXT, IN p_fecha DATE, IN p_empleado INT)
BEGIN
    INSERT INTO Novedades_salud (id_tipo_novedad, descripcion, fecha_evento, id_empleado)
    VALUES (p_tipo, p_descripcion, p_fecha, p_empleado);
END//

DROP PROCEDURE IF EXISTS sp_programar_capacitacion//
CREATE PROCEDURE sp_programar_capacitacion(
    IN p_tema VARCHAR(200), IN p_lugar VARCHAR(150), IN p_fecha DATE, IN p_hora TIME, IN p_capacitador INT
)
BEGIN
    INSERT INTO Capacitaciones (tema, lugar_plataforma, fecha, hora, id_empleado_capacitador)
    VALUES (p_tema, p_lugar, p_fecha, p_hora, p_capacitador);
END//

DELIMITER ;


/* ======================================================================
   4. DATOS DE PRUEBA (Solucion para que las consultas 2, 3 y 4 funcionen)
   ====================================================================== */

-- Novedades de salud de prueba para el taller textil (Incapacidad, Accidente, Enfermedad, Examen)
INSERT INTO Novedades_salud (id_tipo_novedad, descripcion, fecha_evento, id_empleado) VALUES
    (1, 'Incapacidad medica por sindrome de tunel carpiano', '2026-05-10', 101),
    (2, 'Accidente leve: hincon de aguja en maquina plana', '2026-06-12', 101),
    (3, 'Reporte de lumbalgia por postura en mesa de corte', '2026-07-01', 103),
    (4, 'Examen medico ocupacional periodico (Vision y audiometria)', '2026-08-15', 104),
    (1, 'Incapacidad por gripa severa', '2026-09-02', 105),
    (2, 'Accidente de trabajo en maquina fileteadora', '2026-09-10', 107)
    ON DUPLICATE KEY UPDATE id_novedad = id_novedad;

-- Encuestas de bienestar de prueba
INSERT INTO Encuestas_bienestar (fecha, resultado, observaciones, id_empleado) VALUES
    ('2026-09-01', 'Muy satisfecho', 'Excelente ambiente en la planta de produccion', 101),
    ('2026-09-02', 'Satisfecho', 'Buen clima laboral, requiere mejor ventilacion', 102),
    ('2026-09-03', 'Neutral', 'Ajustar horarios de pausas activas', 103),
    ('2026-09-04', 'Insatisfecho', 'Carga de trabajo alta en temporada', 104),
    ('2026-09-05', 'Insatisfecho', 'Carga de trabajo alta en temporada', 105),
    ('2026-09-06', 'Satisfecho', 'Buen clima laboral', 106)
    ON DUPLICATE KEY UPDATE id_encuesta = id_encuesta;

-- Capacitaciones y Asistencias a Capacitaciones de prueba
INSERT INTO Capacitaciones (id_capacitacion, tema, lugar_plataforma, fecha, hora, id_empleado_capacitador) VALUES
    (1, 'Seguridad industrial en maquinas de coser', 'Planta de Confeccion', '2026-08-10', '08:00:00', 103),
    (2, 'Ergonomia y pausas activas para operarios', 'Planta de Confeccion', '2026-09-15', '09:00:00', 104),
    (3, 'Control de calidad de telas y confeccion', 'Sala de Juntas', '2026-10-20', '10:00:00', 101)
    ON DUPLICATE KEY UPDATE id_capacitacion = id_capacitacion;

INSERT INTO Asistencias_capacitacion (id_capacitacion, id_empleado, id_estado_asistencia) VALUES
    (1, 101, 1), (1, 102, 2), (1, 103, 1), (1, 104, 3),
    (2, 101, 2), (2, 102, 1), (2, 105, 1)
    ON DUPLICATE KEY UPDATE id_capacitacion = id_capacitacion;


/* ======================================================================
   5. CONTROL DE ACCESO (DCL - Permisos)
   ====================================================================== */

GRANT SELECT ON TalentSoft_Taller.vista_eventos_institucionales TO jefe, administrador, empleado;
GRANT SELECT ON TalentSoft_Taller.vista_proximos_eventos TO jefe, administrador, empleado;
GRANT SELECT ON TalentSoft_Taller.vista_salud_estadisticas TO jefe, administrador;
GRANT SELECT ON TalentSoft_Taller.vista_encuestas_satisfaccion TO jefe, administrador;
GRANT SELECT ON TalentSoft_Taller.vista_capacitaciones_programacion TO jefe, administrador, empleado;


/* ======================================================================
   6. CONSULTAS DE SANTIAGO (Las 4 Secciones Listas para Probar)
   ====================================================================== */

-- ----------------------------------------------------------------------
-- SECCION 1: EVENTOS (CALENDARIO)
-- ----------------------------------------------------------------------

/*Consulta 1. Mostrar todos los eventos registrados*/
SELECT
    REI.id_evento,
    TEI.nombre AS tipo_evento,
    REI.descripcion,
    REI.fecha_evento,
    CONCAT(E.nombre, ' ', E.apellido) AS empleado
FROM Registros_evento_institucional REI
INNER JOIN Tipos_evento_institucional TEI
    ON REI.id_tipo_evento_institucional = TEI.id_tipo_evento_institucional
LEFT JOIN Empleados E
    ON REI.id_empleado = E.id_empleado
ORDER BY REI.fecha_evento ASC;

/*Consulta 2. Mostrar los eventos proximos*/
SELECT
    REI.id_evento,
    TEI.nombre AS tipo_evento,
    REI.descripcion,
    REI.fecha_evento,
    CONCAT(E.nombre, ' ', E.apellido) AS empleado
FROM Registros_evento_institucional REI
INNER JOIN Tipos_evento_institucional TEI
    ON REI.id_tipo_evento_institucional = TEI.id_tipo_evento_institucional
LEFT JOIN Empleados E
    ON REI.id_empleado = E.id_empleado
WHERE REI.fecha_evento >= CURDATE()
ORDER BY REI.fecha_evento ASC;

/*Consulta 3. Buscar eventos de un tipo especifico*/
SELECT
    REI.id_evento,
    TEI.nombre AS tipo_evento,
    REI.descripcion,
    REI.fecha_evento,
    CONCAT(E.nombre, ' ', E.apellido) AS empleado
FROM Registros_evento_institucional REI
INNER JOIN Tipos_evento_institucional TEI
    ON REI.id_tipo_evento_institucional = TEI.id_tipo_evento_institucional
LEFT JOIN Empleados E
    ON REI.id_empleado = E.id_empleado
WHERE TEI.nombre = 'Reunion'
ORDER BY REI.fecha_evento ASC;

/*Consulta 4. Contar cuantos eventos hay de cada tipo*/
SELECT
    TEI.nombre AS tipo_evento,
    COUNT(REI.id_evento) AS cantidad_eventos
FROM Tipos_evento_institucional TEI
LEFT JOIN Registros_evento_institucional REI
    ON TEI.id_tipo_evento_institucional = REI.id_tipo_evento_institucional
GROUP BY TEI.id_tipo_evento_institucional, TEI.nombre
ORDER BY cantidad_eventos DESC;

/*Consulta 5. Consultar eventos de un rango de fechas*/
SELECT
    REI.id_evento,
    TEI.nombre AS tipo_evento,
    REI.descripcion,
    REI.fecha_evento
FROM Registros_evento_institucional REI
INNER JOIN Tipos_evento_institucional TEI
    ON REI.id_tipo_evento_institucional = TEI.id_tipo_evento_institucional
WHERE REI.fecha_evento BETWEEN '2026-01-01' AND '2026-12-31'
ORDER BY REI.fecha_evento ASC;

/*Consulta 6. Mostrar los eventos asociados a un empleado*/
SELECT
    CONCAT(E.nombre, ' ', E.apellido) AS empleado,
    TEI.nombre AS tipo_evento,
    REI.descripcion,
    REI.fecha_evento
FROM Registros_evento_institucional REI
INNER JOIN Empleados E
    ON REI.id_empleado = E.id_empleado
INNER JOIN Tipos_evento_institucional TEI
    ON REI.id_tipo_evento_institucional = TEI.id_tipo_evento_institucional
WHERE E.id_empleado = 103
ORDER BY REI.fecha_evento DESC;


-- ----------------------------------------------------------------------
-- SECCION 2: SALUD OCUPACIONAL (¡Ya funciona con datos!)
-- ----------------------------------------------------------------------

/*Consulta 1. Novedades de salud por tipo*/
SELECT t.nombre AS tipo, COUNT(*) AS total
FROM Novedades_salud n
JOIN Tipos_novedad_salud t ON t.id_tipo_novedad = n.id_tipo_novedad
GROUP BY t.nombre
ORDER BY total DESC;

/*Consulta 2. Historial de salud de un empleado*/
SELECT CONCAT(e.nombre,' ',e.apellido) AS empleado, t.nombre AS tipo,
       n.descripcion, n.fecha_evento
FROM Novedades_salud n
JOIN Empleados e ON e.id_empleado = n.id_empleado
JOIN Tipos_novedad_salud t ON t.id_tipo_novedad = n.id_tipo_novedad
WHERE e.id_empleado = 101
ORDER BY n.fecha_evento DESC;

/*Consulta 3. Empleados con 2 o mas novedades (posible riesgo)*/
SELECT e.id_empleado, CONCAT(e.nombre,' ',e.apellido) AS empleado,
       r.nombre AS rol, COUNT(*) AS novedades
FROM Novedades_salud n
JOIN Empleados e ON e.id_empleado = n.id_empleado
JOIN Roles r ON r.id_rol = e.id_rol
GROUP BY e.id_empleado, empleado, r.nombre
HAVING COUNT(*) >= 2
ORDER BY novedades DESC;

/*Consulta 4. Accidentes e incapacidades por mes*/
SELECT DATE_FORMAT(n.fecha_evento,'%Y-%m') AS mes, t.nombre AS tipo, COUNT(*) AS total
FROM Novedades_salud n
JOIN Tipos_novedad_salud t ON t.id_tipo_novedad = n.id_tipo_novedad
WHERE t.nombre IN ('Incapacidad','Accidente laboral')
GROUP BY mes, t.nombre
ORDER BY mes;


-- ----------------------------------------------------------------------
-- SECCION 3: ENCUESTAS DE BIENESTAR (¡Ya funciona con datos!)
-- ----------------------------------------------------------------------

/*Consulta 1. Distribucion de satisfaccion (con porcentaje)*/
SELECT resultado, COUNT(*) AS total,
       ROUND(100 * COUNT(*) / (SELECT COUNT(*) FROM Encuestas_bienestar), 1) AS porcentaje
FROM Encuestas_bienestar
GROUP BY resultado
ORDER BY total DESC;

/*Consulta 2. Satisfaccion por rol*/
SELECT r.nombre AS rol, eb.resultado, COUNT(*) AS total
FROM Encuestas_bienestar eb
JOIN Empleados e ON e.id_empleado = eb.id_empleado
JOIN Roles r ON r.id_rol = e.id_rol
GROUP BY r.nombre, eb.resultado
ORDER BY r.nombre, total DESC;

/*Consulta 3. Empleados insatisfechos y su motivo*/
SELECT CONCAT(e.nombre,' ',e.apellido) AS empleado, eb.fecha, eb.observaciones
FROM Encuestas_bienestar eb
JOIN Empleados e ON e.id_empleado = eb.id_empleado
WHERE eb.resultado = 'Insatisfecho'
ORDER BY eb.fecha DESC;

/*Consulta 4. Observaciones mas repetidas*/
SELECT observaciones, COUNT(*) AS veces
FROM Encuestas_bienestar
GROUP BY observaciones
ORDER BY veces DESC;

/*Consulta 5. Empleados que no han respondido la encuesta*/
SELECT e.id_empleado, CONCAT(e.nombre,' ',e.apellido) AS empleado
FROM Empleados e
LEFT JOIN Encuestas_bienestar eb ON eb.id_empleado = e.id_empleado
WHERE eb.id_encuesta IS NULL;


-- ----------------------------------------------------------------------
-- SECCION 4: CAPACITACIONES (¡Ya funciona con datos!)
-- ----------------------------------------------------------------------

/*Consulta 1. Capacitaciones con su capacitador*/
SELECT c.tema, c.lugar_plataforma, c.fecha, c.hora,
       CONCAT(e.nombre,' ',e.apellido) AS capacitador
FROM Capacitaciones c
LEFT JOIN Empleados e ON e.id_empleado = c.id_empleado_capacitador
ORDER BY c.fecha;

/*Consulta 2. Asistencia por capacitacion*/
SELECT c.tema,
       SUM(ea.nombre = 'Asistio')    AS asistieron,
       SUM(ea.nombre = 'No asistio') AS no_asistieron,
       SUM(ea.nombre = 'Excusado')   AS excusados,
       ROUND(100 * SUM(ea.nombre = 'Asistio') / COUNT(*), 1) AS pct_asistencia
FROM Asistencias_capacitacion ac
JOIN Capacitaciones c ON c.id_capacitacion = ac.id_capacitacion
JOIN Estados_asistencia_capacitacion ea ON ea.id_estado_asistencia = ac.id_estado_asistencia
GROUP BY c.id_capacitacion, c.tema;

/*Consulta 3. Capacitaciones a las que falto un empleado*/
SELECT c.tema, c.fecha, ea.nombre AS estado
FROM Asistencias_capacitacion ac
JOIN Capacitaciones c ON c.id_capacitacion = ac.id_capacitacion
JOIN Estados_asistencia_capacitacion ea ON ea.id_estado_asistencia = ac.id_estado_asistencia
WHERE ac.id_empleado = 101 AND ea.nombre <> 'Asistio';


/* ======================================================================
   SEGURIDAD: ENCRIPTACION DE CONTRASENAS (HASH SHA2-256)
   TALENTSOFT (Dimon's Style - Empresa de Confeccion)
   Base de datos: TalentSoft_Taller

   PARA QUE SIRVE ESTE BLOQUE:
     Las contrasenas de la tabla Empleados quedan guardadas como un hash
     SHA2 de 256 bits (64 caracteres) y no en texto plano. Un hash no se
     puede revertir: nadie que lea la base de datos puede ver la
     contrasena real.

   QUE HACE:
     1. Convierte a hash las contrasenas que ya estan en la tabla.
     2. Vuelve a crear RegistrarEmpleado y ActualizarContrasenaEmpleado
        para que las contrasenas nuevas tambien se guarden con hash.
     3. Consultas de prueba (verificacion y simulacion de login).

   NOTAS:
     - Este bloque va al final a proposito: no modifica ninguna linea
       de los modulos 01 a 04, solo agrega.
     - Se puede ejecutar mas de una vez sin problema: el paso 1 solo
       convierte las contrasenas que todavia no son un hash.
     - Login: la aplicacion debe comparar contra SHA2(clave_escrita, 256),
       nunca contra la clave en texto plano.
     - Ejecutar con el usuario root, igual que el resto del script.
   ====================================================================== */

USE TalentSoft_Taller;


/* ----------------------------------------------------------------------
   1. ENCRIPTAR LAS CONTRASENAS QUE YA EXISTEN
   Un hash SHA2-256 siempre mide 64 caracteres. El WHERE evita aplicar el
   hash dos veces si este bloque se ejecuta de nuevo.
   ---------------------------------------------------------------------- */
UPDATE Empleados
SET contrasena = SHA2(contrasena, 256)
WHERE CHAR_LENGTH(contrasena) <> 64;


/* ----------------------------------------------------------------------
   2. PROCEDIMIENTOS QUE GUARDAN CONTRASENAS CON HASH
   Reemplazan a los del modulo 01 (mismo nombre y mismos parametros);
   la unica diferencia es SHA2(E_contrasena, 256).
   ---------------------------------------------------------------------- */
DELIMITER //

-- Registrar un empleado nuevo con la contrasena encriptada
DROP PROCEDURE IF EXISTS RegistrarEmpleado//
CREATE PROCEDURE RegistrarEmpleado(
    IN E_nombre VARCHAR(50),
    IN E_apellido VARCHAR(50),
    IN E_correo VARCHAR(100),
    IN E_contrasena VARCHAR(255),
    IN E_id_tipo_sangre INT,
    IN E_telefono VARCHAR(15),
    IN E_id_rol INT,
    IN E_fecha_nacimiento DATE
)
BEGIN
    INSERT INTO Empleados (nombre, apellido, correo, contrasena, id_tipo_sangre, telefono, id_rol, fecha_nacimiento)
    VALUES (E_nombre, E_apellido, E_correo, SHA2(E_contrasena, 256), E_id_tipo_sangre, E_telefono, E_id_rol, E_fecha_nacimiento);
END//

-- Cambiar la contrasena de un empleado guardandola encriptada
DROP PROCEDURE IF EXISTS ActualizarContrasenaEmpleado//
CREATE PROCEDURE ActualizarContrasenaEmpleado(IN E_id_empleado INT, IN E_contrasena VARCHAR(255))
BEGIN
    UPDATE Empleados SET contrasena = SHA2(E_contrasena, 256) WHERE id_empleado = E_id_empleado;
END//

DELIMITER ;


/* ----------------------------------------------------------------------
   3. CONSULTAS DE PRUEBA
   ---------------------------------------------------------------------- */

-- Verificar: la columna contrasena debe mostrar 64 caracteres, no 'Dimon101'
SELECT id_empleado, correo, contrasena, CHAR_LENGTH(contrasena) AS largo
FROM Empleados
LIMIT 5;

-- Simular un login correcto: devuelve 1 fila
SELECT id_empleado, nombre, apellido
FROM Empleados
WHERE correo = 'luisa.castro101@talentsoft.co'
AND contrasena = SHA2('Dimon101', 256);

-- Simular un login con clave incorrecta: devuelve 0 filas
SELECT id_empleado, nombre, apellido
FROM Empleados
WHERE correo = 'luisa.castro101@talentsoft.co'
AND contrasena = SHA2('clave_equivocada', 256);
