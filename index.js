const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyYaY3p6RlFFpQ4h1HqzkGFRp5qPtrA8-MbLLhvl896g5DQ1JcTGhRpZUlnXznSEnYMcg/exec";

app.post("/enviar-email", async (req, res) => {
  try {
    // Repasse o POST para o Apps Script
    const resposta = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const dados = await resposta.json();
    res.json(dados);
  } catch (err) {
    res.status(500).json({ erro: "Falha ao encaminhar o e-mail", detalhe: err.message });
  }
});

// Healthcheck
app.get("/", (req, res) => res.send("Relay DoceGestorExpress OK!"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Relay rodando na porta", port);
});
