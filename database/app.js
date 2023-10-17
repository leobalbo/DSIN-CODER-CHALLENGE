const express = require("express");
const sqlite3 = require("sqlite3");
const database = require("./database");
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

app.post("/submitData", (req, res) => {
  const data = req.body;
  database.insertData(data);
  res.status(200).json({ message: "Dados recebidos com sucesso!" });
});

app.post("/getData", (req, res) => {
  const code = req.body.code;

  database.getDataByCode(code, (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: 404, error_message: "Erro ao buscar dados." });
    }

    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 404 });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor em execução em http://localhost:${port}`);
});
