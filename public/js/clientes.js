document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:3000/clientes';

    const listItemsContainer = document.querySelector('.list-items-container.client-list-items-container');
    const newAppointmentBtn = document.querySelector('.btn-new-appointment');
    
    const modals = {
        add: document.getElementById('new-appointment-modal-add-client'),
        edit: document.getElementById('new-appointment-modal-edit-client'),
        view: document.getElementById('new-appointment-modal-view-client'),
        delete: document.getElementById('modal-delete-schedule')
    };

    const backdrops = {
        add: document.querySelector('.modal-backdrop-add'),
        edit: document.querySelector('.modal-backdrop-edit'),
        view: document.querySelector('.modal-backdrop-view'),
        delete: document.querySelector('.modal-backdrop-delete')
    };
    
    let currentClientId = null;


/* Funções de Interação com a API (CRUD) */


// GET: Buscar um único cliente pelo ID
async function fetchClientById(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar cliente por ID');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
}

// Preencher o modal de Edição
async function fillEditModal(clientId) {
    const client = await fetchClientById(clientId);
    if (!client) return;

    modals.edit.dataset.clientId = client.id;
    // Seleciona o formulário de edição pelo ID único
    const form = modals.edit.querySelector('#formEditarCliente');
    if (!form) {
        console.error("Formulário de edição não encontrado.");
        return;
    }
    
    for (const key in client) {
        const input = form.querySelector(`#${key}`);
        if (input) {
            if (input.type === 'date' && client[key]) {
                input.value = client[key].split('T')[0]; 
            } else if (input.type === 'checkbox') {
                input.checked = client[key];
            } else {
                input.value = client[key];
            }
        }
    }
}

// Preencher o modal de Visualização
async function fillViewModal(clientId) {
    const client = await fetchClientById(clientId);
    if (!client) return;

    // Seleciona o formulário de visualização pelo ID único
    const form = modals.view.querySelector('#formVisualizarCliente');
    if (!form) {
        console.error("Formulário de visualização não encontrado.");
        return;
    }

    for (const key in client) {
        const input = form.querySelector(`#${key}`);
        if (input) {
            if (input.type === 'date' && client[key]) {
                input.value = client[key].split('T')[0];
            } else {
                input.value = client[key];
            }
            input.disabled = true;
        }
    }
}

// GET: Buscar todos os clientes
async function fetchClients() {
    try {
        const response = await fetch(API_URL);
        const clients = await response.json();
        renderClients(clients);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
    }
}


// POST: Adicionar um novo cliente
async function addClient(clientData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });
        if (!response.ok) {
            throw new Error('Erro ao cadastrar cliente');
        }
        closeModal('add');
        fetchClients();
    } catch (error) {
        console.error('Erro:', error);
    }
}

// PATCH/PUT: Atualizar um cliente existente
async function updateClient(id, clientData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar cliente');
        }
        closeModal('edit');
        fetchClients();
    } catch (error) {
        console.error('Erro:', error);
    }
}

// DELETE: Desativar/deletar um cliente
async function updateClientStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: status })
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar status do cliente');
        }
        fetchClients();
    } catch (error) {
        console.error('Erro:', error);
    }
}


/* ========================================================= */
/* Funções para Renderizar Clientes */
/* ========================================================= */
function createClientRow(client) {
    const row = document.createElement('div');
    row.classList.add('list-item', 'client-list-item-grid');
    row.dataset.clientId = client.id;
    row.innerHTML = `
        <p class="col-name">${client.nome}</p>
        <p class="col-edit">
            <img src="./assets/svg/edit.svg" class="icon_edit" alt="Editar">
        </p>
        <p class="col-info">
            <a href="#" class="view-client-link">Ver mais</a>
        </p>
        <p class="col-status">
            <label class="toggle-switch">
                <input type="checkbox" ${client.status === 'Ativo' ? 'checked' : ''} data-id="${client.id}">
                <span class="slider"></span>
            </label>
        </p>
    `;
    return row;
}

function renderClients(clients) {
    if (listItemsContainer) {
        listItemsContainer.innerHTML = '';
        clients.forEach(client => {
            const row = createClientRow(client);
            listItemsContainer.appendChild(row);
        });
    }
}

/* ========================================================= */
/* Lógica Unificada para Modais (Abrir e Fechar) */
/* ========================================================= */

function openModal(modalKey, data = {}) {
    const modal = modals[modalKey];
    const backdrop = backdrops[modalKey];
    
    if (!modal || !backdrop) {
        console.error(`ERRO: Elemento do modal "${modalKey}" não encontrado.`);
        return;
    }

    if (modalKey === 'delete' && data.clientName) {
        const nameSpan = modal.querySelector('.client-name');
        if (nameSpan) {
            nameSpan.textContent = data.clientName;
        }
        currentClientId = data.clientId;
    }

    modal.classList.remove('hidden');
    backdrop.classList.remove('hidden');
}

function closeModal(modalKey) {
    modals[modalKey].classList.add('hidden');
    backdrops[modalKey].classList.add('hidden');
}

// Listener para o botão "Cadastrar Cliente"
newAppointmentBtn.addEventListener('click', () => {
    openModal('add');
});

// Lógica para lidar com os cliques na tabela
listItemsContainer.addEventListener('click', async (event) => {
    const target = event.target;
    const row = target.closest('.list-item');
    if (!row) return;

    const clientId = row.dataset.clientId;

    // Lógica de edição
    if (target.classList.contains('icon_edit')) {
        openModal('edit');
        await fillEditModal(clientId);
    }

    // Lógica de visualização
    if (target.classList.contains('view-client-link')) {
        event.preventDefault();
        openModal('view');
        await fillViewModal(clientId);
    }

    // Lógica do switch de status (desativação/ativação)

    if (target.type === 'checkbox') {
        const clientName = row.querySelector('.col-name').textContent;
        const clientId = row.dataset.clientId;

        if (!target.checked) {
            // Mantém o switch 'Ativo' e abre o modal para confirmação de desativação
            target.checked = true;
            openModal('delete', { clientName: clientName, clientId: clientId });
        } else {
            // Se o switch foi ativado, chame a nova função com o status 'Ativo'
            updateClientStatus(clientId, 'Ativo');
        }
    }
});

// Adiciona listener para o botão de confirmação do modal de exclusão
document.querySelector('#modal-delete-schedule .btn-confirm-delete').addEventListener('click', () => {
    if (currentClientId) {
         // Se a resposta for SIM, desativa o cliente chamando a nova função
        updateClientStatus(currentClientId, 'Inativo');
        closeModal('delete');
    }
});

// Seletores para os formulários de cadastro e edição com IDs únicos
const formCadastrarCliente = modals.add.querySelector('#formCadastrarCliente');
const formEditarCliente = modals.edit.querySelector('#formEditarCliente');

// Listener para o formulário de cadastro
if (formCadastrarCliente) {
    formCadastrarCliente.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(formCadastrarCliente);
        const clientData = Object.fromEntries(formData.entries());
        clientData.proBono = clientData.proBono === 'true';
        addClient(clientData);
    });
}

// Listener para o formulário de edição
if (formEditarCliente) {
    formEditarCliente.addEventListener('submit', (e) => {
        e.preventDefault();
        const clientId = modals.edit.dataset.clientId;
        if (!clientId) return;

        const formData = new FormData(formEditarCliente);
        const clientData = Object.fromEntries(formData.entries());
        clientData.proBono = clientData.proBono === 'true';

        updateClient(clientId, clientData);
    });
}

// Inicia a busca dos clientes quando a página carrega
fetchClients();
});


// Funções globais de fechar modal para o HTML
function closeModalAdicionarCliente() {
    document.querySelector('.modal-backdrop-add').classList.add('hidden');
    document.getElementById('new-appointment-modal-add-client').classList.add('hidden');
}

function closeModalEditarCliente() {
    document.querySelector('.modal-backdrop-edit').classList.add('hidden');
    document.getElementById('new-appointment-modal-edit-client').classList.add('hidden');
}

function closeModalVisualizarCliente() {
    document.querySelector('.modal-backdrop-view').classList.add('hidden');
    document.getElementById('new-appointment-modal-view-client').classList.add('hidden');
}

document.querySelector('.modal-close-delete-btn').addEventListener('click', () => {
    document.querySelector('.modal-backdrop-delete').classList.add('hidden');
    document.getElementById('modal-delete-schedule').classList.add('hidden');
});

document.querySelector('.btn-cancel-delete').addEventListener('click', () => {
    document.querySelector('.modal-backdrop-delete').classList.add('hidden');
    document.getElementById('modal-delete-schedule').classList.add('hidden');
});