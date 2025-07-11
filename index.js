const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyX4o5Y2qAt2v6PIXZeutS9IDlpzHiSLmGtjSqCtvHGlEIKzfYlAOd0ofB_vg0zoNTgqw/exec";

app.post("/enviar-email", async (req, res) => {
  try {
    const resposta = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const text = await resposta.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }
    res.json(json);
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
