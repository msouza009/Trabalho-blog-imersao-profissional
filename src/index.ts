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

    try {
        await connection.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({message: 'Usuário deletado com sucesso'});
    } catch (error) {
        console.log('Erro ao deleter o usuário:', error);
        res.status(500).send('Erro ao deleter usuário');
    }
});

app.get('/users/:id/edit', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
        
        // Verifica se o usuário foi encontrado
        if ((rows as any[]).length === 0) { // Converta 'rows' para array explicitamente
            return res.status(404).send('Usuário não encontrado.');
        }

        return res.render('users/edit', {
            user: rows[0] // Passa o usuário encontrado para a view
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