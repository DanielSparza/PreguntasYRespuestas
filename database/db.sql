CREATE DATABASE preguntasrespuestas;
USE preguntasrespuestas;

CREATE TABLE users(
    id_usuario INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    usuario VARCHAR(30) NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    email VARCHAR(80) NOT NULL,
    contrasena VARCHAR(100) NOT NULL
);

ALTER TABLE users ADD imagen VARCHAR(100);

CREATE TABLE questions(
    id_pregunta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    titulo VARCHAR(80) NOT NULL,
    descripcion TEXT NOT NULL,
    categorias TEXT NOT NULL,
    fechaP timestamp NOT NULL DEFAULT current_timestamp,
    fk_usuario INT NOT NULL,
    FOREIGN KEY(fk_usuario) REFERENCES users(id_usuario)
);

CREATE TABLE answers(
    id_respuesta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    respuesta TEXT NOT NULL,
    fechaR timestamp NOT NULL DEFAULT current_timestamp,
    fk_usuario INT NOT NULL,
    fk_pregunta INT NOT NULL,
    FOREIGN KEY(fk_usuario) REFERENCES users(id_usuario),
    FOREIGN KEY(fk_pregunta) REFERENCES questions(id_pregunta)
);

CREATE TABLE answersrate(
    fk_usuario INT NOT NULL,
    fk_respuesta INT NOT NULL,
    calificacion ENUM("1", "2", "3", "4", "5") NOT NULL,
    PRIMARY KEY(fk_usuario, fk_respuesta),
    FOREIGN KEY(fk_usuario) REFERENCES users(id_usuario),
    FOREIGN KEY(fk_respuesta) REFERENCES answers(id_respuesta)
);