

const API_URL = 'http://localhost:3000/funcionarios';

// Cadastrar funcionário
async function cadastrarFuncionario(funcionario) {
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(funcionario)
    });
    carregarFuncionarios();
}

// Editar funcionário
async function editarFuncionario(id, funcionario) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(funcionario)
    });
    carregarFuncionarios();
}

// Alternar status ativo/inativo
async function alternarStatusFuncionario(id, statusAtual) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !statusAtual })
    });
    carregarFuncionarios();
}

// Carregar funcionários na tabela
async function carregarFuncionarios() {
    const response = await fetch(API_URL);
    const funcionarios = await response.json();
    const tbody = document.querySelector('.panel-content table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    funcionarios.forEach(func => {
        const tr = document.createElement('tr');
        tr.className = 'pill-row';
        tr.innerHTML = `
            <td>${func.id}</td>
            <td>${func.nome}</td>
            <td>
                <div class="toggle-switch${func.ativo ? ' active' : ''}" onclick="alternarStatusFuncionario(${func.id}, ${func.ativo})"></div>
            </td>
            <td>
                <button class="edit-btn" onclick="openModalEditar(${func.id})">
                    <img src="./assets/svg/lapiz.svg" alt="Editar">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Abrir modal de edição e preencher dados
async function openModalEditar(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const funcionario = await response.json();

    const modal = document.getElementById("modalEditar");
    modal.style.display = "flex";

    // Preenche os campos 
    modal.querySelector('input[type="text"]').value = funcionario.nome;
    modal.querySelector('input[type="email"]').value = funcionario.email;
    modal.querySelector('select').value = funcionario.tipoUsuario;
    modal.querySelector('input[type="password"]').value = funcionario.senha;

    // Salvar edição
    const salvarBtn = modal.querySelector('.modal-add-btn');
    salvarBtn.onclick = async function() {
        await editarFuncionario(id, {
            nome: modal.querySelector('input[type="text"]').value,
            email: modal.querySelector('input[type="email"]').value,
            tipoUsuario: modal.querySelector('select').value,
            senha: modal.querySelector('input[type="password"]').value,
            ativo: funcionario.ativo
        });
        closeModalEditar();
    };
}

// Abrir modal de cadastro
function openModalCriar() {
    document.getElementById("modalCriar").style.display = "flex";
}

// Fechar modal de cadastro
function closeModalCriar() {
    document.getElementById("modalCriar").style.display = "none";
}

// Fechar modal de edição
function closeModalEditar() {
    document.getElementById("modalEditar").style.display = "none";
}

// botão cadastrar do modal
document.addEventListener('DOMContentLoaded', function() {
    const cadastrarBtn = document.querySelector('#modalCriar .modal-add-btn');
    if (cadastrarBtn) {
        cadastrarBtn.addEventListener('click', async function() {
            const nome = document.querySelector('#modalCriar input[placeholder="Digite o nome"]').value;
            const email = document.querySelector('#modalCriar input[placeholder="Digite o e-mail"]').value;
            const tipoUsuario = document.querySelector('#modalCriar select').value;
            const senha = document.querySelector('#modalCriar input[placeholder="Digite a senha"]').value;

            // Validação de e-mail usando utils.js
            if (!window.Utils.validators.validateEmail(email)) {
                window.Utils.dom.showError('E-mail inválido!');
                return;
            }

            await cadastrarFuncionario({
                nome,
                email,
                tipoUsuario,
                senha,
                ativo: true
            });

            closeModalCriar();
        });
    }
    carregarFuncionarios();
});

