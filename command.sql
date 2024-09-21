-- Criar tabela

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,  -- Adicionei o NOT NULL e a vírgula que estava faltando
  senha VARCHAR(255) NOT NULL,  -- Incluindo a coluna 'senha'
  papel VARCHAR(50) NOT NULL,   -- Incluindo a coluna 'papel'
  ativo TINYINT(1) DEFAULT 1,   -- Incluindo a coluna 'ativo' com valor padrão 1
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Incluindo a coluna 'created_at'
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- Incluindo a coluna 'updated_at'
);



-- Inserir Tabela
INSERT INTO users (nome, email, senha, papel, ativo) 
VALUES ('Matheus', 'szmatheussouza@gmail.com', 'admin123', 'admin', 1);

-- Alterar informação da tela
UPDATE users
SET nome = 'Henrique',
    email = 'matheus_009@icloud.com',
    senha = 'admin123',
    papel = 'Moderador'
    ativo = 0
    where id = 2;