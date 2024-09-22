-- init-user.sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  papel VARCHAR(50) NOT NULL,
  ativo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Criação do usuário padrão
INSERT INTO users (nome, email, senha, papel, ativo) 
VALUES ('Adminsitrador', 'admin@admin.com', '$2b$10$eP8.t2GOs7TQG9Cf.lT0A.Pk1d5dG.M00jZ5JjFZ5wXrt/9v8fbwG', 'Administrador', 1);
