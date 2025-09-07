document.addEventListener('DOMContentLoaded', () => {

    const clients = [
        { id: 1, clientName: 'Davidson Mendes', info: 'Ver mais', active: true },
        { id: 2, clientName: 'Gabriel Cordeiro', info: 'Ver mais', active: true },
        { id: 3, clientName: 'Luiz Gustavo', info: 'Ver mais', active: true }
    ];

    const listItemsContainer = document.querySelector('.list-items-container.client-list-items-container');
    const newAppointmentBtn = document.querySelector('.btn-new-appointment');

    // Mapeia todos os modais e seus backdrops para acesso fácil
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

    /* ========================================================= */
    /* Funções para Renderizar Clientes */
    /* ========================================================= */
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

    function renderClients() {
        if (listItemsContainer) {
            listItemsContainer.innerHTML = '';
            clients.forEach(client => {
                const row = createClientRow(client);
                listItemsContainer.appendChild(row);
            });
        }
    }

    renderClients();

    /* ========================================================= */
    /* Lógica Unificada para Modais (Abrir e Fechar) */
    /* ========================================================= */

    // Função para abrir qualquer modal
    function openModal(modalKey, data = {}) {
        const modal = modals[modalKey];
        const backdrop = backdrops[modalKey];
        
        if (!modal || !backdrop) {
            console.error(`ERRO: Elemento do modal "${modalKey}" não encontrado.`);
            return;
        }

        // Se houver dados (como o nome do cliente para o modal de exclusão), atualiza o conteúdo
        if (modalKey === 'delete' && data.clientName) {
            const nameSpan = modal.querySelector('.client-name');
            if (nameSpan) {
                nameSpan.textContent = data.clientName;
            }
        }

        modal.classList.remove('hidden');
        backdrop.classList.remove('hidden');
    }

    // Função para fechar qualquer modal
    function closeModal(modalKey) {
        const modal = modals[modalKey];
        const backdrop = backdrops[modalKey];

        if (!modal || !backdrop) return;

        modal.classList.add('hidden');
        backdrop.classList.add('hidden');
    }
    
    // Função para fechar todos os modais
    function closeAllModals() {
        for (const key in modals) {
            closeModal(key);
        }
    }

    /* ========================================================= */
    /* Adicionando listeners de eventos */
    /* ========================================================= */

    // Evento de clique unificado no container da lista de clientes
    if (listItemsContainer) {
        listItemsContainer.addEventListener('click', (e) => {
            const editIcon = e.target.closest('.icon_edit');
            const viewLink = e.target.closest('.view-client-link');

            if (editIcon) {
                e.preventDefault();
                openModal('edit');
            } else if (viewLink) {
                e.preventDefault();
                openModal('view');
            }
        });

        // Evento de mudança para o switch
        listItemsContainer.addEventListener('change', (e) => {
            if (e.target.matches('.toggle-switch input')) {
                const checkbox = e.target;
                if (!checkbox.checked) {
                    const row = checkbox.closest('.client-list-item');
                    const clientName = row?.querySelector('.col-name')?.textContent || '';
                    openModal('delete', { clientName });
                }
            }
        });
    }

    // Botão "Novo Agendamento"
    if (newAppointmentBtn) {
        newAppointmentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('add');
        });
    }

    // Evento de clique unificado para fechar modais (botões, backdrop, etc.)
    document.addEventListener('click', (e) => {
        // Clicou no backdrop
        if (e.target.classList.contains('modal-backdrop-add') || 
            e.target.classList.contains('modal-backdrop-edit') || 
            e.target.classList.contains('modal-backdrop-view') || 
            e.target.classList.contains('modal-backdrop-delete')) {
            closeAllModals();
        }

        // Clicou no botão de fechar (X)
        if (e.target.closest('.modal-close-btn') || e.target.closest('.modal-close-delete-btn')) {
            e.preventDefault();
            closeAllModals();
        }

        // Clicou no botão "Não" do modal de exclusão
        if (e.target.closest('.btn-cancel-delete')) {
            closeAllModals();
        }
    });

    // Evento de teclado (Escape)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
});