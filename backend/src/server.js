const express = require("express");
const cors = require("cors");
const connection = require("./db_config");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const port = 3030;

/* ======== ROTAS EXISTENTES ======== */

// Cadastro
app.post('/cadastro', (req, res) => {
  console.log(req.body);
  const { username, password, email, cpf, numero } = req.body;
  const query = "INSERT INTO users (username, password, email, cpf, numero) VALUES (?,?,?,?,?)";

  connection.query(query, [username, password, email, cpf, numero], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor' });
    } else {
      res.json({
        success: true,
        message: 'Cadastro bem sucedido',
        data: { id: results.insertId, username, password, email, cpf, numero }
      });
    }
  });
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

  connection.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Login bem-sucedido!' });
    } else {
      res.json({ success: false, message: 'Usuário ou senha incorretos!' });
    }
  });
});


/* ======== ROTAS NOVAS - AGENDA ======== */

// GET - Listar compromissos
app.get('/compromissos', (req, res) => {
  const query = "SELECT * FROM compromissos ORDER BY data ASC";
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao buscar compromissos' });
    }
    res.json(results);
  });
});

// POST - Adicionar compromisso
app.post('/compromissos', (req, res) => {
  const { data, descricao } = req.body;
  const query = "INSERT INTO compromissos (data, descricao) VALUES (?, ?)";

  connection.query(query, [data, descricao], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao adicionar compromisso' });
    }
    res.json({ success: true, message: 'Compromisso adicionado com sucesso', id: results.insertId });
  });
});

// DELETE - Excluir compromisso
app.delete('/compromissos/:id', (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM compromissos WHERE id = ?";

  connection.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao excluir compromisso' });
    }
    res.json({ success: true, message: 'Compromisso excluído com sucesso' });
  });
});

// ================= FICHA DO USUÁRIO =================

// POST - Salvar ficha do usuário
app.post("/fichas", (req, res) => {
  const {
    nome,
    data_nascimento,
    email,
    numero,
    sangue,
    alergias,
    complicacoes
  } = req.body;

  const query = `
        INSERT INTO fichas 
        (nome, data_nascimento, email, numero, sangue, alergias, complicacoes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

  connection.query(
    query,
    [nome, data_nascimento, email, numero, sangue, alergias, complicacoes],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Erro ao salvar ficha."
        });
      }

      res.json({
        success: true,
        message: "Ficha cadastrada com sucesso!",
        id: results.insertId
      });
    }
  );
});

const multer = require("multer");
const path = require("path");

// === CONFIGURAÇÃO DO MULTER PARA UPLOAD ===
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + ext;
    callback(null, name);
  },
});
const upload = multer({ storage });

// Criar pasta uploads caso não exista
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ==================== ROTAS DE REMÉDIOS ====================
app.post("/remedios", upload.single("arquivo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Nenhum arquivo enviado." });
  }

  const arquivo = req.file.filename;

  const query = "INSERT INTO remedios (arquivo) VALUES (?)";

  connection.query(query, [arquivo], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Erro ao salvar arquivo no banco."
      });
    }

    res.json({
      success: true,
      message: "Arquivo salvo com sucesso!",
      id: results.insertId
    });
  });
});

// LISTAR REMÉDIOS
app.get("/remedios", (req, res) => {
  const query = "SELECT * FROM remedios ORDER BY id DESC";

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar remédios."
      });
    }

    res.json(results);
  });
});

// DELETE - Excluir remédio
app.delete("/remedios/:id", (req, res) => {
  const { id } = req.params;

  // 1️⃣ Buscar arquivo no banco
  const buscarQuery = "SELECT arquivo FROM remedios WHERE id = ?";
  connection.query(buscarQuery, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Erro ao localizar o remédio ou ele não existe."
      });
    }

    const arquivo = results[0].arquivo;
    const filePath = `uploads/${arquivo}`;

    // 2️⃣ Excluir arquivo físico
    fs.unlink(filePath, (erroArquivo) => {
      if (erroArquivo) console.log("Erro ao apagar arquivo:", erroArquivo);
    });

    // 3️⃣ Excluir do banco
    const deleteQuery = "DELETE FROM remedios WHERE id = ?";
    connection.query(deleteQuery, [id], (err2) => {
      if (err2) {
        return res.status(500).json({
          success: false,
          message: "Erro ao excluir remédio do banco."
        });
      }

      res.json({
        success: true,
        message: "Remédio excluído com sucesso!"
      });
    });
  });
});

// ==================== ROTAS DE EXAMES ====================

// POST - Upload de exame
app.post("/exames", upload.single("arquivo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Nenhum arquivo enviado."
    });
  }

  const arquivo = req.file.filename;

  const query = "INSERT INTO exames (arquivo) VALUES (?)";

  connection.query(query, [arquivo], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Erro ao salvar exame no banco."
      });
    }

    res.json({
      success: true,
      message: "Exame salvo com sucesso!",
      id: results.insertId
    });
  });
});

// GET - Listar exames
app.get("/exames", (req, res) => {
  const query = "SELECT * FROM exames ORDER BY id DESC";

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar exames."
      });
    }

    res.json(results);
  });
});

// DELETE - Excluir exame
app.delete("/exames/:id", (req, res) => {
  const { id } = req.params;

  const buscarQuery = "SELECT arquivo FROM exames WHERE id = ?";
  connection.query(buscarQuery, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Erro ao localizar o exame ou ele não existe."
      });
    }

    const arquivo = results[0].arquivo;
    const filePath = `uploads/${arquivo}`;

    fs.unlink(filePath, (erroArquivo) => {
      if (erroArquivo) console.log("Erro ao apagar arquivo:", erroArquivo);
    });

    const deleteQuery = "DELETE FROM exames WHERE id = ?";
    connection.query(deleteQuery, [id], (err2) => {
      if (err2) {
        return res.status(500).json({
          success: false,
          message: "Erro ao excluir exame do banco."
        });
      }

      res.json({
        success: true,
        message: "Exame excluído com sucesso!"
      });
    });
  });
});

/* ======== INICIAR SERVIDOR ======== */
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
