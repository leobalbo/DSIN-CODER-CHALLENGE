const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("data.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS data (name TEXT, age INTEGER, gender TEXT, blood TEXT, music TEXT, sports TEXT, game TEXT, code INT)"
  );
});

function insertData(data) {
  const { name, age, gender, blood, music, sports, game, code } = data;

  const stmt = db.prepare("INSERT INTO data VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  stmt.run(name, age, gender, blood, music, sports, game, code);
  console.log("Dados inseridos no banco de dados.");
  stmt.finalize();
}

function getDataByCode(code, callback) {
  db.get("SELECT * FROM data WHERE code = ?", [code], (err, row) => {
    if (err) {
      console.error("Erro ao executar a consulta:", err);
      return callback(err, null);
    }

    if (row) {
      callback(null, row);
    } else {
      callback(null, null);
    }
  });
}

module.exports = {
  insertData,
  getDataByCode,
};
