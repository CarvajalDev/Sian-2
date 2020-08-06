CREATE DATABASE database_sian;

USE database_sian;

-- Tabla Usuarios 
CREATE TABLE users
(
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT
(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;

-- Tabla mascotas
CREATE TABLE mascotas
(
    id INT(11) NOT NULL,
    nombre_mascota VARCHAR(150) NOT NULL,
    user_id INT(11),
    especie_id INT(11),
    raza_id INT(11),
    nacimiento_mascota DATE,
    direccion_mascota VARCHAR(150) NOT NULL,
    imagen_mascota VARCHAR(150) NOT NULL,
    estado_mascota BOOLEAN,
    crated_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY (user_id) References users(id)
);

ALTER TABLE mascotas
    ADD PRIMARY KEY (id);

ALTER TABLE mascotas
    MODIFY id INT
(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE mascotas;
