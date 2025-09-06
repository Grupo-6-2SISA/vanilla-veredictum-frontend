document.addEventListener('DOMContentLoaded', () => {
    // Array com os dados dos clientes
    const clients = [
        { id: 1, clientName: 'Davidson Mendes', info: 'Ver mais', active: true },
        { id: 2, clientName: 'Gabriel Cordeiro', info: 'Ver mais', active: true },
        { id: 3, clientName: 'Luiz Gustavo', info: 'Ver mais', active: true }
    ];

    const listItemsContainer = document.querySelector('.list-items-container.client-list-items-container');

    // Função para criar o HTML de uma única linha de cliente
    function createClientRow(client) {
        const row = document.createElement('div');
        row.classList.add('list-item', 'client-list-item-grid');
        row.dataset.clientId = client.id;
        row.innerHTML = `
            <p class="col-name">${client.clientName}</p>
            <p class="col-edit">
                <img src="./assets/svg/edit.svg" class="icon_edit" alt="Editar">
            </p>
            <p class="col-info">
                <a href="#" class="view-client-link">${client.info}</a>
            </p>
            <p class="col-status">
                <label class="toggle-switch">
                    <input type="checkbox" ${client.active ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </p>
        `;
        return row;
    }

    // Função para renderizar todos os clientes
    function renderClients() {
        listItemsContainer.innerHTML = ''; // Limpa antes de renderizar
        clients.forEach(client => {
            const row = createClientRow(client);
            listItemsContainer.appendChild(row);
        });
    }

    // Renderiza a lista quando a página carrega
    renderClients();

    /* ========================================================= */
    /* Lógica para o Modal de Adicionar (Novo Cliente) */
    /* ========================================================= */
    const newAppointmentBtn = document.querySelector('.btn-new-appointment');
    const addModal = document.getElementById('new-appointment-modal-add-client');
    const addModalBackdrop = document.querySelector('.modal-backdrop-add');
    const addModalCloseBtn = addModal?.querySelector('.modal-close-btn');

    function openAddModal() {
        if (addModal && addModalBackdrop) {
            addModal.classList.remove('hidden');
            addModalBackdrop.classList.remove('hidden');
            console.log('Modal de Adicionar Cliente: FUNCIONOU ✅');
        } else {
            console.error('ERRO: Modal de Adicionar Cliente não encontrado. Verifique os seletores.');
        }
    }

    function closeAddModal() {
        addModal.classList.add('hidden');
        addModalBackdrop.classList.add('hidden');
    }

    if (newAppointmentBtn) {
        newAppointmentBtn.addEventListener('click', (event) => {
            event.preventDefault();
            openAddModal();
        });
    }

    if (addModalCloseBtn) {
        addModalCloseBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeAddModal();
        });
    }

    if (addModalBackdrop) {
        addModalBackdrop.addEventListener('click', closeAddModal);
    }

    /* ========================================================= */
    /* Lógica para o Modal de Editar Cliente */
    /* ========================================================= */
    const editModal = document.getElementById('new-appointment-modal-edit-client');
    const editModalBackdrop = document.querySelector('.modal-backdrop-edit');
    const editModalCloseBtn = editModal?.querySelector('.modal-close-btn');

    function openEditModal() {
        if (editModal && editModalBackdrop) {
            editModal.classList.remove('hidden');
            editModalBackdrop.classList.remove('hidden');
            console.log('Modal de Editar Cliente: FUNCIONOU ✅');
        } else {
            console.error('ERRO: Modal de Editar Cliente não encontrado. Verifique os seletores.');
        }
    }

    function closeEditModal() {
        editModal.classList.add('hidden');
        editModalBackdrop.classList.add('hidden');
    }

    if (editModalCloseBtn) {
        editModalCloseBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeEditModal();
        });
    }

    if (editModalBackdrop) {
        editModalBackdrop.addEventListener('click', closeEditModal);
    }

    /* ========================================================= */
    /* Lógica para o Modal de Visualizar Cliente */
    /* ========================================================= */
    const viewModal = document.getElementById('new-appointment-modal-view-client');
    const viewModalBackdrop = document.querySelector('.modal-backdrop-view');
    const viewModalCloseBtn = viewModal?.querySelector('.modal-close-btn');

    function openViewModal() {
        if (viewModal && viewModalBackdrop) {
            viewModal.classList.remove('hidden');
            viewModalBackdrop.classList.remove('hidden');
            console.log('Modal de Visualizar Cliente: FUNCIONOU ✅');
        } else {
            console.error('ERRO: Modal de Visualizar Cliente não encontrado. Verifique os seletores.');
        }
    }

    function closeViewModal() {
        viewModal.classList.add('hidden');
        viewModalBackdrop.classList.add('hidden');
    }

    if (viewModalCloseBtn) {
        viewModalCloseBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeViewModal();
        });
    }

    if (viewModalBackdrop) {
        viewModalBackdrop.addEventListener('click', closeViewModal);
    }

    /* ========================================================= */
    /* Delegação de Eventos para Botões Dinâmicos */
    /* ========================================================= */
    listItemsContainer.addEventListener('click', function(e) {
        // Lógica para o botão de Editar
        if (e.target.classList.contains('icon_edit')) {
            e.preventDefault();
            openEditModal();
        }

        // Lógica para o link de Visualizar
        if (e.target.classList.contains('view-client-link')) {
            e.preventDefault();
            openViewModal();
        }
    });

    // Sua lógica `router.js` pode ser mantida como está.
});