import express, {Request, Response} from "express";
import { connect } from "http2";
import mysql from "mysql2/promise";
import { format } from 'date-fns';

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

const connection = mysql.createPool({
    host: "localhost",
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
            users: rows  //
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar usuários");
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});