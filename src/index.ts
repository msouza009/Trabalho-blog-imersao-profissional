import express, {Request, Response} from "express";
import { connect } from "http2";
import mysql from "mysql2/promise";
import { format } from 'date-fns';

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

const connection = mysql.createPool({
    host: "db",
    port: 3306,
    user: "root",
    password: "mudar123",
    database: "unicesumar"
});

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.get('/users', async function (req: Request, res: Response) {
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

app.get('/users/add', async function (req: Request, res: Response) {
    return res.render('users/add'); 
});

app.post('/users', async (req, res) => {
    const { nome, email, senha, confirmSenha, papel, ativo } = req.body;

    if (!nome || !email || !senha || !papel) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    if (senha !== confirmSenha) {
        return res.status(400).send('As senhas não coincidem.');
    }

    const ativoValue = ativo ? 1 : 0;

    try {
        await connection.query('INSERT INTO users (nome, email, senha, papel, ativo) VALUES (?, ?, ?, ?, ?)', 
            [nome, email, senha, papel, ativoValue]);

        res.redirect('/users'); 
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).send('Erro ao cadastrar usuário.');
    }
});

app.delete('/users/:id/delete', async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = parseInt(id);

    try {
        await connection.query('DELETE FROM users WHERE id = ?', [userId]);

        // Responde com 204, pois a exclusão foi realizada
        res.status(204).send(); // No Content
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).send('Erro ao excluir usuário.');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});