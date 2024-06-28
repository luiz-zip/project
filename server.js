const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./database');

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/capturar-dados', (req, res) => {
    const { latitude, longitude, photo } = req.body;
    
    // Inserir dados no banco de dados
    const stmt = db.prepare("INSERT INTO capturas (latitude, longitude, photo) VALUES (?, ?, ?)");
    stmt.run(latitude, longitude, photo, function(err) {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            res.status(500).json({ status: 'erro', message: 'Erro ao inserir dados' });
        } else {
            console.log('Dados recebidos:', { id: this.lastID, latitude, longitude, photo });
            res.json({ status: 'sucesso', id: this.lastID, latitude, longitude, photo });
        }
    });
    stmt.finalize();
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

app.get('/api/dados', (req, res) => {
    db.all("SELECT * FROM capturas", (err, rows) => {
        if (err) {
            console.error('Erro ao buscar dados:', err);
            res.status(500).json({ status: 'erro', message: 'Erro ao buscar dados' });
        } else {
            res.json({ status: 'sucesso', dados: rows });
        }
    });
});
