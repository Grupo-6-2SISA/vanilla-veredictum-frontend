# ⚖️ Veredictum - Front-End (Versão 1.0)
> Desenvolvido por **LAW & CODE**

Este documento serve como guia central para o desenvolvimento do front-end do projeto Veredictum. Ele detalha o escopo, os objetivos e os padrões de código que devem ser seguidos por todos os integrantes da equipe.

---

### ✨ Links 
- **🎨 Protótipo (Figma):** [Acessar o Design do Veredictum](https://www.figma.com/design/meiG9fy7id9U1DlL7A6RVk/Prot%C3%B3tipo-Veredictum---Grupo-6?node-id=0-1&p=f&t=16LDYPX1MWmyOh9Y-0)
- **🗃️ Repositórios:** [Organização Grupo-6-2SISA no GitHub](https://github.com/Grupo-6-2SISA)

---

## 🎯 Sobre o Projeto

Com o objetivo de atender às principais necessidades identificadas, o Projeto Veredictum foi desenvolvido com foco na organização, eficiência e praticidade da gestão do escritório. A aplicação contará com telas de cadastro e login, além de uma funcionalidade para recuperação de senha, garantindo segurança e fácil acesso à plataforma.

Entre os recursos, estão:

- **Gestão de clientes e funcionários:** Interface intuitiva para cadastrar, visualizar, atualizar e excluir informações de forma prática e organizada.
- **Controle financeiro:** Telas dedicadas à gestão de despesas e emissão de notas fiscais, facilitando o controle contábil do escritório.
- **Agenda e relacionamento:** Módulo que organiza os atendimentos diários e mensais, exibe os aniversariantes do mês, e permite filtrar por período, contribuindo para um relacionamento mais próximo com os clientes.
- **Dashboard administrativo:** Painel central com indicadores e dados relevantes, oferecendo uma visão ampla e estratégica da administração do escritório.
- **Histórico de envio de e-mails:** Página específica para visualizar todos os e-mails enviados dentro de um determinado intervalo de tempo, promovendo maior controle da comunicação institucional.

---

## 📁 Estrutura de Pastas e Arquivos

O projeto está organizado na seguinte estrutura para garantir a separação de responsabilidades, escalabilidade e facilitar a manutenção. Esta estrutura é comum em aplicações web modernas que utilizam um servidor Node.js (como Express) para servir o conteúdo.

```
.
├── .git/              # Diretório interno do Git para controle de versão
├── .idea/             # Configurações do ambiente de desenvolvimento (IDE JetBrains)
├── public/            # Arquivos estáticos servidos diretamente ao cliente
│   ├── css/           # Folhas de estilo CSS compiladas/públicas
│   └── js/            # Scripts JavaScript compilados/públicos
├── src/               # Código-fonte da aplicação
│   ├── assets/        # Arquivos de mídia brutos (não públicos)
│   │   ├── fonts/
│   │   ├── icons/
│   │   └── img/
│   ├── components/    # Componentes de UI reutilizáveis (ex: header, footer, cards)
│   ├── pages/         # Arquivos HTML de cada página da aplicação
│   ├── utils/         # Funções utilitárias (ex: formatação de data, validações)
│   └── views/         # Templates de views (se usar um template engine)
├── package.json       # Metadados do projeto e lista de dependências
├── server.js          # Configuração e inicialização do servidor (ou app.js)
└── README.md          # Documentação do projeto
```

### Descrição Detalhada

#### Diretórios Raiz

-   **`.git/`**: Contém todos os metadados e o histórico do repositório Git. É gerenciado automaticamente pelo Git.
-   **`.idea/`**: Armazena configurações específicas do projeto para IDEs da JetBrains (como WebStorm, IntelliJ). **Deve ser ignorado pelo Git** (adicionado ao `.gitignore`).
-   **`public/`**: O único diretório acessível diretamente pelo navegador. Contém todos os arquivos estáticos que serão enviados ao cliente.
    -   `css/`: Versões finais das folhas de estilo.
    -   `js/`: Versões finais dos scripts JavaScript.
-   **`src/`**: O "coração" do projeto, onde todo o código-fonte de desenvolvimento reside.
    -   `assets/`: Armazena os arquivos de mídia "originais" (imagens não otimizadas, ícones, fontes). Estes arquivos podem ser processados e copiados para a pasta `public/` durante um processo de build.
    -   `components/`: Contém fragmentos de HTML/JS/CSS que representam partes reutilizáveis da interface, como um cabeçalho, rodapé, modal ou card. A ideia é montar as páginas usando esses blocos.
    -   `pages/`: Contém os arquivos HTML completos para cada página da aplicação (ex: `login.html`, `dashboard.html`).
    -   `utils/`: Módulos com funções auxiliares puras e reutilizáveis em várias partes do projeto (ex: `validators.js`, `formatters.js`).
    -   `views/`: Usado por template engines (como EJS, Pug) para renderizar páginas dinamicamente no servidor. Pode ser uma alternativa a `pages/` se o conteúdo for gerado no back-end.

#### Arquivos Raiz

-   **`README.md`**: Este arquivo. A documentação principal do projeto.
-   **`package.json`**: Arquivo de manifesto do Node.js. Define o nome do projeto, versão, scripts de automação (ex: `npm start`) e gerencia as dependências de desenvolvimento e produção.
-   **`server.js` / `app.js`**: Ponto de entrada da aplicação no servidor. Responsável por iniciar o servidor web (Express, por exemplo), definir rotas e configurar como os arquivos estáticos da pasta `public/` são servidos.

---

## 💻 Padrões de Código

Para garantir a qualidade, legibilidade e manutenibilidade do código, adotaremos os seguintes padrões.

### 📜 HTML Semântico

O uso de HTML semântico é **obrigatório**. Tags devem ser usadas por seu significado, não por sua aparência.

- **Estrutura:** Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>` e `<footer>` para estruturar as páginas.
- **Conteúdo:** Utilize `<h1>` a `<h6>` para hierarquia de títulos, `<p>` para parágrafos, `<ul>`, `<ol>` e `<li>` para listas, e `<blockquote>` para citações.
- **Formulários:** Agrupe campos com `<fieldset>` e use `<label>` associado a cada `<input>`, `<select>` ou `<textarea>`.
- **Interatividade:** Use `<button>` para ações e `<a>` para navegação.

### 🎨 CSS (BEM + `kebab-case`)

Adotamos a metodologia BEM (Block, Element, Modifier) para a nomenclatura de classes, utilizando o padrão `kebab-case`.

| Categoria | Padrão | Exemplos |
| :--- | :--- | :--- |
| **Layout** | `.layout-name` | `.container`, `.grid-container`, `.flex-container` |
| **Bloco** | `.nome-do-bloco` | `.card`, `.btn`, `.main-header`, `.login-form` |
| **Elemento** | `.bloco__elemento` | `.card__title`, `.main-header__logo`, `.login-form__input` |
| **Modificador** | `.bloco--modificador` | `.btn--primary`, `.card--highlight`, `.btn--disabled` |
| **Estado** | `.is-estado` | `.is-active`, `.is-hidden`, `.is-loading`, `.is-open` |

### ☕ JavaScript (`camelCase`)

O código JavaScript deve seguir o padrão `camelCase` e ser organizado conforme as convenções abaixo.

#### Variáveis e Constantes

| Tipo | Padrão | Exemplos |
| :--- | :--- | :--- |
| **Elementos DOM** | sufixo `Element` | `const loginFormElement = ...`, `const userAvatarElement = ...` |
| **Dados** | Nome descritivo | `const userData`, `let chartData` |
| **Estado (Booleano)** | prefixo `is` ou `has` | `let isLoading = true`, `const hasUnsavedChanges = false` |
| **Configuração** | Nome descritivo | `const apiUrl = '...'`, `const maxLoginAttempts = 5` |

#### Funções

| Tipo | Padrão | Exemplos |
| :--- | :--- | :--- |
| **Ações** | Verbo de ação | `calculateMetrics()`, `validateForm()`, `saveUserSettings()` |
| **Obtenção de Dados** | prefixo `get` | `getUserById(id)`, `getDashboardData()` |
| **Renderização** | prefixo `render` | `renderUserTable(users)`, `renderChart(data)` |
| **Atualização** | prefixo `update` | `updateHeaderTitle(title)`, `updateCardContent(cardId, content)` |
| **Manipuladores de Evento** | `handle` + Elemento + Evento | `handleLoginButtonClick()`, `handleFilterFormSubmit(event)` |

#### Classes

| Tipo | Padrão | Exemplos |
| :--- | :--- | :--- |
| **Classes** | `PascalCase` | `class ApiService { ... }`, `class FormValidator { ... }` |

---

# 🚀 Padrões de Commits e GitHub

Os repositórios do projeto estão na organização do GitHub: [Grupo-6-2SISA](https://github.com/Grupo-6-2SISA)

## 📌 Formato do Commit

```bash
<tipo>(<escopo opcional>): <descrição curta no presente e imperativo>

[Corpo opcional explicando o motivo da mudança, o que foi alterado e impactos]

[Issue relacionada, se houver]
```

## 📊 Tipos de Commits (Conventional Commits)

| Prefixo        | Significado                                         |
| -------------- | --------------------------------------------------- |
| 🎉 `feat`      | Adição de nova funcionalidade                       |
| 🐛 `fix`       | Correção de bugs                                    |
| 🏗️ `refactor` | Refatoração do código (sem mudar funcionalidade)    |
| 🛠️ `chore`    | Mudanças na configuração, dependências              |
| 🎨 `style`     | Alterações de formatação, lint, espaços, indentação |
| 🧪 `test`      | Adição ou correção de testes                        |
| 📖 `docs`      | Alterações na documentação                          |
| 🔧 `ci`        | Mudanças na configuração de CI/CD                   |
| ⚡ `perf`       | Melhorias de performance                            |
| ⏪ `revert`     | Reversão de commit                                  |

## 🏆 Exemplos de Commits Bem Escritos

### ✅ Commit Simples

```bash
feat(user): adicionar validação de e-mail no cadastro
```

### 📜 Commit com Corpo Explicativo

```bash
fix(auth): corrigir erro na geração de token JWT

O erro acontecia porque o tempo de expiração estava sendo passado como string 
ao invés de um número inteiro. Agora, a conversão para `Long` foi corrigida.

Fixes #42
```

### 🔄 Commit para Atualização de Dependências

```bash
chore(deps): atualizar Spring Boot para versão 3.1.0
```

# 🚦Padrão de branches

| Branch                                        | Descrição                               |
| --------------------------------------------- | --------------------------------------- |
| 🌍 `main`                                     | versão estável do projeto.             |
| ⚙ `develop`                                  | branch principal para desenvolvimento. |
| 🔛 `feature/nome-da-feature`                  | novas funcionalidades.                 |
| 🐞 `bugfix/nome-do-bug`                       | correções de bugs.                     |
| 🔥 `hotfix/nome-do-hotfix`                    | correções urgentes na produção.        |
| 🔖 `release/versao`                           | preparação de novas versões.          |



## Criar uma nova branch
Para criar uma nova branch e mudar para ela, use o comando:
```bash 
git checkout -b nome-da-branch
```
Ou, se você estiver usando uma versão mais recente do Git, pode usar:
```bash
git switch -c nome-da-branch
```
Exemplo: Se você quiser criar uma branch chamada feature/nova-funcionalidade:
```bash
git checkout -b feature/nova-funcionalidade
```
Ou:
```bash
git switch -c feature/nova-funcionalidade
```
Isso cria a branch e muda automaticamente para ela.

## Dar push para o repositório remoto
Depois de fazer o commit, envie (push) a nova branch para o repositório remoto com o comando:
```bash
git push -u origin nome-da-branch
```
Exemplo:
```bash
git push -u origin feature/nova-funcionalidade
```
O -u (ou --set-upstream) faz com que a branch local seja associada à branch remota, então nas próximas vezes, você pode apenas rodar git push ou git pull sem precisar especificar o nome da branch.

## Verificar se o push foi bem-sucedido
Para verificar se a branch foi enviada corretamente para o repositório remoto, você pode rodar:
```bash
git branch -r
```
Isso mostrará todas as branches remotas.