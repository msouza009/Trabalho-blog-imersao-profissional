import express, { Request, Response } from "express";
import mysql from "mysql2/promise";
import session from 'express-session';
import bcrypt from 'bcrypt';
import path from "path";

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createPool({
    host: "db",
    port: 3306,
    user: "root",
    password: "mudar123",
    database: "unicesumar"
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: '$#$123',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.get('/', async (req: Request, res: Response) => {
    return res.render('index');
});

app.get('/login', async (req: Request, res: Response) => {
    return res.render('users/login'); 
});

app.post('/login', async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).send('Email e senha são obrigatórios.');
    }

    try {
        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if ((rows as any[]).length === 0) {
            return res.status(401).send('Email ou senha inválidos.');
        }

        const user = (rows as any[])[0];

        const senhaCorreta = await bcrypt.compare(senha, user.senha);
        if (!senhaCorreta) {
            return res.status(401).send('Email ou senha inválidos.');
        }

        req.session.userId = user.id;
        req.session.userName = user.nome;

        res.redirect('/users');
    } catch (error) {
        console.log('Erro ao realizar login:', error);
        res.status(500).send('Erro ao realizar login');
    }
});

app.get('/users', async (req: Request, res: Response) => {
    try {
        const [rows] = await connection.query("SELECT * FROM users");
        return res.render('users/index', {
            users: rows 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar usuários");
    }
});

app.get('/users/add', async (req: Request, res: Response) => {
    return res.render('users/add'); 
});

app.post('/users', async (req: Request, res: Response) => {
    const { nome, email, senha, confirmSenha, papel, ativo } = req.body;

    if (!nome || !email || !senha || !papel) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    if (senha !== confirmSenha) {
        return res.status(400).send('As senhas não coincidem.');
    }

    const ativoValue = ativo ? 1 : 0;

    // Hash a senha antes de armazenar
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(senha, saltRounds);
        await connection.query('INSERT INTO users (nome, email, senha, papel, ativo) VALUES (?, ?, ?, ?, ?)', 
            [nome, email, hashedPassword, papel, ativoValue]);

        res.redirect('/users'); 
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).send('Erro ao cadastrar usuário.');
    }
});

app.delete('/users/:id/delete', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await connection.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.log('Erro ao deletar o usuário:', error);
        res.status(500).send('Erro ao deletar usuário');
    }
});

app.get('/users/:id/edit', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
        
        if ((rows as any[]).length === 0) {
            return res.status(404).send('Usuário não encontrado.');
        }

        return res.render('users/edit', {
            user: rows[0]
        });
    } catch (error) {
        console.error('Erro ao buscar usuário para edição:', error);
        res.status(500).send('Erro ao buscar usuário.');
    }
});

// Rota para atualizar usuário (POST)
app.post('/users/:id/edit', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome, email, senha, papel, ativo } = req.body;

    const ativoValue = ativo ? 1 : 0;

    try {
        await connection.execute(
            'UPDATE users SET nome = ?, email = ?, senha = ?, papel = ?, ativo = ? WHERE id = ?', 
            [nome, email, senha, papel, ativoValue, id]
        );

        res.redirect('/users'); 
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).send('Erro ao atualizar usuário.');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});