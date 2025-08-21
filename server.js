const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "app.veredictum.com";

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));
// Servir arquivos estáticos da pasta 'src'
app.use('/src', express.static(path.join(__dirname, 'src')));


// Rota principal (login)
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "src/pages/index.html"));
});

// Rota para a página de dashboard
app.get("/dashboard", (req, res) => {
	res.sendFile(path.join(__dirname, "src/pages/dashboard.html"));
});

// Rotas para páginas específicas
app.get("/clientes", (req, res) => {
	res.sendFile(path.join(__dirname, "src/pages/clientes.html"));
});

app.get("/notas-fiscais", (req, res) => {
	res.sendFile(path.join(__dirname, "src/pages/notas-fiscais.html"));
});

app.listen(PORT, () => {
	// A mensagem de inicialização será controlada pelo app.js
});
