const express = require("express")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

// Servir arquivos estáticos da pasta 'src' (para CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "src")))

// Rota principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src/pages/dashboard.html"))
})

// Rota para a página de dashboard
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "src/pages/dashboard.html"))
})

// Rotas para páginas específicas
app.get("/clientes", (req, res) => {
    res.sendFile(path.join(__dirname, "src/pages/clientes.html"))
})

app.get("/notas-fiscais", (req, res) => {
    res.sendFile(path.join(__dirname, "src/pages/notas-fiscais.html"))
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
    console.log(`Acesse: http://localhost:${PORT}`)
})
