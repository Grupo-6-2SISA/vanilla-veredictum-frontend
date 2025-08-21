const { exec } = require("child_process");
const chalk = require("chalk");

const frontendPort = 3000;
const jsonServerPort = 3001;
const domain = "localhost";

const border = chalk.bold.cyan;
const title = chalk.bold.white;
const label = chalk.bold.white;
const value = chalk.yellow;
const success = chalk.green;

console.log(border("┌─────────────────────────────────────────────────────────────┐"));
console.log(border("│ ") + title("⚖️  Veredictum Front-End & API Server") + border("                  │"));
console.log(border("├─────────────────────────────────────────────────────────────┤"));
console.log(border("│                                                             │"));
console.log(border("│ ") + label("Aplicação Front-end:") + " ".repeat(34) + border("│"));
console.log(border("│   ") + success("✔ Online em:") + `      ${value(`http://${domain}:${frontendPort}`)}` + " ".repeat(23) + border("│"));
console.log(border("│                                                             │"));
console.log(border("│ ") + label("API (JSON-Server):") + " ".repeat(37) + border("│"));
console.log(border("│   ") + success("✔ Online em:") + `      ${value(`http://localhost:${jsonServerPort}`)}` + " ".repeat(19) + border("│"));
console.log(border("│   ") + label("Endpoints:") + " ".repeat(44) + border("│"));
console.log(border("│     ") + `• ${value("/clientes")}` + " ".repeat(43) + border("│"));
console.log(border("│     ") + `• ${value("/notas_fiscais")}` + " ".repeat(38) + border("│"));
console.log(border("│                                                             │"));
console.log(border("└─────────────────────────────────────────────────────────────┘"));
console.log("\n" + chalk.gray("Pressione CTRL+C para encerrar os servidores."));

// Iniciar o servidor Express (front-end)
const frontend = exec(`node server.js`);
frontend.stdout.on('data', (data) => {
  // console.log(chalk.gray(`[FRONTEND] ${data}`));
});
frontend.stderr.on('data', (data) => {
  console.error(chalk.red(`[FRONTEND ERROR] ${data}`));
});


// Iniciar o JSON Server (API)
const api = exec(`json-server --watch db.json --port ${jsonServerPort}`);
api.stdout.on('data', (data) => {
    // Silenciar a saída padrão do json-server para não poluir o console
});
api.stderr.on('data', (data) => {
  console.error(chalk.red(`[API ERROR] ${data}`));
});
