CREATE DATABASE chat_app;

-- Use o banco de dados
USE chat_app;

-- 1. Tabela de usuários para login e registro
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de mensagens com remetente e destinatário
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender VARCHAR(50) NOT NULL,
    recipient VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE compromissos(
	id INT AUTO_INCREMENT PRIMARY KEY,
    data timestamp DEFAULT CURRENT_TIMESTAMP,
    descricao VARCHAR(255) not null
);

CREATE TABLE fichas (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    email VARCHAR(255) NOT NULL,
    numero VARCHAR(50) NOT NULL,
    sangue VARCHAR(3) NOT NULL,
    alergias TEXT NOT NULL,
    complicacoes TEXT NOT NULL
);

CREATE TABLE remedios (
	id INT AUTO_INCREMENT PRIMARY KEY,
    arquivo VARCHAR(255) NOT NULL
);

CREATE TABLE exames (
	id INT AUTO_INCREMENT PRIMARY KEY,
    arquivo VARCHAR(255) NOT NULL
);