const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');

var app = express();
app.use(bodyparser.json());

var cors = require('cors');
app.use(cors({ origin: true, credentials: true }));

var mysqlConnection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: '12345678',
    database: 'api',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));


// Rotas


// GET Partidas
app.get('/matches', (req, res) => {
    mysqlConnection.query('SELECT * FROM matches ORDER BY matches.id DESC', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

// POST Partidas
app.post('/matches', (req, res) => {
    let matches = req.body;

    const sql = 'INSERT INTO matches (team_a, result_a, team_b, result_b, date) VALUES (?, ?, ?, ?, ?);';
    const values = [matches.team_a, matches.result_a, matches.team_b, matches.result_b, matches.date];

    mysqlConnection.query(sql, values, (err, rows, fields) => {
        if (!err)
        return res.json({
            error: false,
            message: "Sucesso, POST Partida!"
        });
    else
        return res.json({
            error: true,
            message: "Desculpe, ocorreu um erro desconhecido!"
        });
    })

});

// PUT Partida
app.put('/matches/:id', (req, res) => {
    let matches = req.body;

    const sql = 'UPDATE matches SET team_a=?, result_a=?, team_b=?, result_b=?, date=? WHERE id=?';
    const values = [matches.team_a, matches.result_a, matches.team_b, matches.result_b, matches.date, req.params.id];

    mysqlConnection.query(sql, values, (err, rows, fields) => {
        if (!err)
            return res.json({
                error: false,
                message: "Sucesso, PUT Partidas!"
            });
        else
            return res.json({
                error: true,
                message: "Desculpe, ocorreu um erro desconhecido!"
            });
    });

});

// DELETE Partidas
app.delete('/matches/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM matches WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
        return res.json({
            error: false,
            message: "Sucesso, DELETE Partida!"
        });
    else
        return res.json({
            error: true,
            message: "Desculpe, ocorreu um erro desconhecido!"
        });
    })
});