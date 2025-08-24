document.addEventListener('DOMContentLoaded', () => {
    // Array com os dados dos agendamentos
    const appointments = [
        { id: 1, clientName: 'Davidson Mendes', day: '09/06/2025', time: '15:00', status: 'Previsto' },
        { id: 2, clientName: 'Gabriel Cordeiro', day: '12/06/2025', time: '12:00', status: 'Previsto' },
        { id: 3, clientName: 'Luiz Gustavo', day: '12/06/2025', time: '15:00', status: 'Previsto' },
        { id: 4, clientName: 'Márcio Ribeiro', day: '13/06/2025', time: '09:45', status: 'Previsto' },
        { id: 5, clientName: 'Isabel C. Oliveira', day: '14/06/2025', time: '11:00', status: 'Previsto' }
    ];

    const tableContainer = document.querySelector('.table-container');

    // Função para criar o HTML de uma única linha
    function createAppointmentRow(appointment) {
        const row = document.createElement('div');
        row.classList.add('table-row');
        row.dataset.appointmentId = appointment.id; // Adiciona um ID para fácil identificação
        row.innerHTML = `
            <div class="col-check"><input type="checkbox"></div>
            <div class="col-name">${appointment.clientName}</div>
            <div class="col-day">${appointment.day}</div>
            <div class="col-time">${appointment.time}</div>
            <div class="col-status">${appointment.status}</div>
            <div class="col-edit"><img src="./assets/svg/edit.svg" class="icon_edit" alt="Editar"></div>
            <div class="col-delete"><img src="./assets/svg/lixo.svg" class="icon_trash" alt="Excluir"></div>
        `;
        return row;
    }

    // Função para renderizar todas as linhas
    function renderAppointments() {
        tableContainer.innerHTML = `
            <div class="table-header">
                <p class="col-check"><input type="checkbox" id="select-all-checkbox"></p>
                <p class="col-name">Nome</p>
                <p class="col-day">Dia</p>
                <p class="col-time">Horário</p>
                <p class="col-status">Status</p>
                <p class="col-edit">Editar</p>
                <p class="col-delete">Excluir</p>
            </div>
        `; // Recria o header para evitar duplicidade
        
        appointments.forEach(appointment => {
            const row = createAppointmentRow(appointment);
            tableContainer.appendChild(row);
        });
    }

    // Renderiza a lista quando a página carrega
    renderAppointments();

    /* ========================================================= */
    /* Lógica para abrir e fechar modais (reutilizando a lógica anterior) */
    /* ========================================================= */
    const deleteButtons = document.querySelectorAll('.icon_trash');
    const deleteModal = document.getElementById('modal-delete-schedule');
    const deleteModalBackdrop = document.querySelector('.modal-backdrop-delete');
    const deleteModalCloseBtn = document.querySelector('.modal-close-delete-btn');
    const btnCancelDelete = document.querySelector('.btn-cancel-delete');
    const btnConfirmDelete = document.querySelector('.btn-confirm-delete');

    const clientNameSpan = deleteModal.querySelector('.client-name');
    const scheduleTimeSpan = deleteModal.querySelector('.schedule-time');
    const scheduleDateSpan = deleteModal.querySelector('.schedule-date');

    function openDeleteModal(clientName, scheduleTime, scheduleDate) {
        clientNameSpan.textContent = clientName;
        scheduleTimeSpan.textContent = scheduleTime;
        scheduleDateSpan.textContent = scheduleDate;

        deleteModal.classList.remove('hidden');
        deleteModalBackdrop.classList.remove('hidden');
    }

    function closeDeleteModal() {
        deleteModal.classList.add('hidden');
        deleteModalBackdrop.classList.add('hidden');
    }
    
    // Delegação de evento para o botão de lixo
    tableContainer.addEventListener('click', (event) => {
        const trashButton = event.target.closest('.icon_trash');
        if (trashButton) {
            const row = trashButton.closest('.table-row');
            if (row) {
                const clientName = row.dataset.clientName;
                const scheduleTime = row.dataset.scheduleTime;
                const scheduleDate = row.dataset.scheduleDate;
                openDeleteModal(clientName, scheduleTime, scheduleDate);
            }
        }
    });

    deleteModalCloseBtn.addEventListener('click', closeDeleteModal);
    deleteModalBackdrop.addEventListener('click', closeDeleteModal);
    btnCancelDelete.addEventListener('click', closeDeleteModal);

    btnConfirmDelete.addEventListener('click', () => {
        alert("Agendamento cancelado!");
        closeDeleteModal();
    });
});

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================= */
    /* Lógica para a Lista de Aniversariantes */
    /* ========================================================= */
    
    // Array com os dados dos aniversariantes
    const birthdays = [
        {
            name: 'Davidson Mendes',
            date: '09/06/2025'
        },
        {
            name: 'João Matos',
            date: '10/06/2025'
        },
        {
            name: 'Lilian Medeiros',
            date: '16/06/2025'
        },
        {
            name: 'William Ferreira',
            date: '23/06/2025'
        },
        {
            name: 'Cesar Sampaio',
            date: '24/06/2025'
        }
    ];

    const birthdaysListContainer = document.querySelector('.birthdays-list');

    // Função para criar o HTML de um item de aniversário
    function createBirthdayItem(birthday) {
        const item = document.createElement('div');
        item.classList.add('birthday-item');
        item.innerHTML = `
            <p class="name">${birthday.name}</p>
            <p class="date">${birthday.date}</p>
        `;
        return item;
    }

    // Função para renderizar a lista de aniversariantes
    function renderBirthdays() {
        // Limpa a lista existente para evitar duplicidade
        birthdaysListContainer.innerHTML = '';

        // Adiciona os novos itens à lista
        birthdays.forEach(birthday => {
            const birthdayItem = createBirthdayItem(birthday);
            birthdaysListContainer.appendChild(birthdayItem);
        });
    }

    // Chama a função para renderizar a lista quando a página carregar
    renderBirthdays();

});
/* ========================================================= */
/* Lógica para Seletor de Mês */
/* ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const monthSelectorBtn = document.querySelector('.month-selector-btn');
    const monthPickerPopup = document.getElementById('month-picker');
    const currentMonthDisplay = document.getElementById('current-month-display');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const monthButtonsContainer = document.querySelector('.month-buttons');
    const okBtn = document.getElementById('ok-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const monthDisplaySpan = monthSelectorBtn.querySelector('span');

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    let currentYear = new Date().getFullYear();
    let selectedMonthIndex = new Date().getMonth();

    function renderMonths() {
        monthButtonsContainer.innerHTML = '';
        for (let i = 0; i < 12; i++) {
            const button = document.createElement('button');
            button.textContent = months[i];
            if (i === selectedMonthIndex) {
                button.classList.add('selected');
            }
            button.addEventListener('click', () => {
                selectedMonthIndex = i;
                renderMonths(); // Atualiza a seleção
            });
            monthButtonsContainer.appendChild(button);
        }
        currentMonthDisplay.textContent = `${months[selectedMonthIndex]} ${currentYear}`;
    }

    // Abre o pop-up
    monthSelectorBtn.addEventListener('click', () => {
        monthPickerPopup.classList.remove('hidden');
        renderMonths();
    });

    // Navegação de mês/ano (opcional, pode ser simplificado)
    prevMonthBtn.addEventListener('click', () => {
        currentYear--;
        renderMonths();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentYear++;
        renderMonths();
    });

    // Ações do pop-up
    okBtn.addEventListener('click', () => {
        monthDisplaySpan.textContent = months[selectedMonthIndex];
        monthPickerPopup.classList.add('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        monthPickerPopup.classList.add('hidden');
    });
});


document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================= */
    /* Lógica para o Modal de Adicionar (Novo Agendamento) */
    /* ========================================================= */
    const newAppointmentBtn = document.querySelector('.btn-new-appointment');
    const addModal = document.getElementById('new-appointment-modal-add');
    const addModalBackdrop = document.querySelector('.modal-backdrop-add');
    const addModalCloseBtn = addModal.querySelector('.modal-close-btn');

    function openAddModal() {
        addModal.classList.remove('hidden');
        addModalBackdrop.classList.remove('hidden');
    }

    function closeAddModal() {
        addModal.classList.add('hidden');
        addModalBackdrop.classList.add('hidden');
    }

    newAppointmentBtn.addEventListener('click', openAddModal);
    addModalCloseBtn.addEventListener('click', closeAddModal);
    addModalBackdrop.addEventListener('click', closeAddModal);


/* ========================================================= */
/* Lógica para o Modal de Editar Agendamento */
/* ========================================================= */
    const editButtons = document.querySelectorAll('.icon_edit');
    const editModal = document.getElementById('new-appointment-modal-edit');
    const editModalBackdrop = document.querySelector('.modal-backdrop-edit');
    const editModalCloseBtn = editModal.querySelector('.modal-close-btn');

    function openEditModal() {
        editModal.classList.remove('hidden');
        editModalBackdrop.classList.remove('hidden');
    }

    function closeEditModal() {
        editModal.classList.add('hidden');
        editModalBackdrop.classList.add('hidden');
    }

    // Adiciona o evento de clique a todos os botões de edição encontrados
    editButtons.forEach(button => {
        button.addEventListener('click', openEditModal);
    });
    
    editModalCloseBtn.addEventListener('click', closeEditModal);
    editModalBackdrop.addEventListener('click', closeEditModal);

});


document.addEventListener('DOMContentLoaded', () => {

/* ========================================================= */
/* Lógica para o Modal de Exclusão */
/* ========================================================= */
    
    // Seleciona todos os botões de lixo (exclusão)
    const deleteButtons = document.querySelectorAll('.icon_trash');
    
    // Seleciona o modal e o backdrop
    const deleteModal = document.getElementById('modal-delete-schedule');
    const deleteModalBackdrop = document.querySelector('.modal-backdrop-delete');
    const deleteModalCloseBtn = document.querySelector('.modal-close-delete-btn');
    const btnCancelDelete = document.querySelector('.btn-cancel-delete');
    const btnConfirmDelete = document.querySelector('.btn-confirm-delete');

    // Elementos de texto dentro do modal
    const clientNameSpan = deleteModal.querySelector('.client-name');
    const scheduleTimeSpan = deleteModal.querySelector('.schedule-time');
    const scheduleDateSpan = deleteModal.querySelector('.schedule-date');

    // Função para abrir o modal de exclusão
    function openDeleteModal(clientName, scheduleTime, scheduleDate) {
        // Atualiza o texto do modal com os dados do agendamento
        clientNameSpan.textContent = clientName;
        scheduleTimeSpan.textContent = scheduleTime;
        scheduleDateSpan.textContent = scheduleDate;

        deleteModal.classList.remove('hidden');
        deleteModalBackdrop.classList.remove('hidden');
    }

    // Função para fechar o modal de exclusão
    function closeDeleteModal() {
        deleteModal.classList.add('hidden');
        deleteModalBackdrop.classList.add('hidden');
    }

    // Adiciona um listener para cada botão de lixo
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Ajuste aqui: Encontra o contêiner pai da linha que contém os dados
            // Supondo que a linha do seu agendamento tem a classe 'appointment-row'
            const row = button.closest('.appointment-row'); 

            if (row) {
                const clientName = row.dataset.clientName;
                const scheduleTime = row.dataset.scheduleTime;
                const scheduleDate = row.dataset.scheduleDate;
                openDeleteModal(clientName, scheduleTime, scheduleDate);
            } else {
                console.error("Contêiner de agendamento não encontrado.");
            }
        });
    });

    // Adiciona listeners para fechar o modal
    deleteModalCloseBtn.addEventListener('click', closeDeleteModal);
    deleteModalBackdrop.addEventListener('click', closeDeleteModal);
    btnCancelDelete.addEventListener('click', closeDeleteModal);

    // Adiciona listener para confirmar a exclusão (adapte para sua lógica de backend)
    btnConfirmDelete.addEventListener('click', () => {
        // Lógica para enviar o pedido de exclusão ao servidor
        alert("Agendamento cancelado!"); // Exemplo de ação
        closeDeleteModal();
    });
});

document.addEventListener('DOMContentLoaded', () => {

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================= */
    /* Lógica para o Modal de Exclusão em Massa */
    /* ========================================================= */
    
    // Seleciona o botão de exclusão em massa pelo ID correto
    // Se o seu botão é uma imagem, use a classe. Se for um botão, use o ID
    const btnDeleteAll = document.getElementById('icon_lixo') || document.getElementById('btn-delete-all');

    // Seleciona o checkbox 'selecionar todos'
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    
    // Seleciona o modal e o backdrop para exclusão em massa
    const massDeleteModal = document.getElementById('modal-mass-delete-schedule');
    const massDeleteModalBackdrop = document.querySelector('.modal-backdrop-mass-delete');
    const massDeleteConfirmBtn = document.querySelector('.btn-confirm-mass-delete');
    const massDeleteCancelBtn = document.querySelector('.btn-cancel-mass-delete');
    const massDeleteCloseBtn = document.querySelector('.modal-close-mass-delete-btn');


    // Funções para abrir e fechar o modal de exclusão em massa
    function openMassDeleteModal() {
        massDeleteModal.classList.remove('hidden');
        massDeleteModalBackdrop.classList.remove('hidden');
    }

    function closeMassDeleteModal() {
        massDeleteModal.classList.add('hidden');
        massDeleteModalBackdrop.classList.add('hidden');
    }

    // Lógica para o checkbox de "selecionar todos"
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (event) => {
            // Consulta todos os checkboxes no momento da mudança
            const appointmentCheckboxes = document.querySelectorAll('.table-row .col-check input[type="checkbox"]');
            appointmentCheckboxes.forEach(checkbox => {
                checkbox.checked = event.target.checked;
            });
        });
    }

    // Ouve o clique no botão de exclusão em massa
    if (btnDeleteAll) {
        btnDeleteAll.addEventListener('click', () => {
            // Consulta os checkboxes no momento do clique no botão de exclusão
            const selectedAppointments = document.querySelectorAll('.table-row .col-check input[type="checkbox"]:checked');
            
            if (selectedAppointments.length > 0) {
                // Se houver itens selecionados, abre o modal de confirmação
                openMassDeleteModal();
            } else {
                alert("Por favor, selecione pelo menos um agendamento para excluir.");
            }
        });
    }

    // Ouve o clique no botão de confirmação do modal de exclusão em massa
    if (massDeleteConfirmBtn) {
        massDeleteConfirmBtn.addEventListener('click', () => {
            // Consulta os checkboxes novamente antes de excluir
            const selectedRows = document.querySelectorAll('.table-row .col-check input[type="checkbox"]:checked');
            
            // Aqui você envia a requisição para o backend para deletar os IDs dos itens
            alert(`Excluindo ${selectedRows.length} agendamento(s) selecionado(s)...`);
            
            // Exemplo de como remover os elementos do DOM
            selectedRows.forEach(checkbox => {
                const row = checkbox.closest('.table-row');
                if (row) {
                    row.remove();
                }
            });

            closeMassDeleteModal();
        });
    }

    // Adiciona listeners para fechar o modal
    if (massDeleteCancelBtn) {
        massDeleteCancelBtn.addEventListener('click', closeMassDeleteModal);
    }
    
    if (massDeleteCloseBtn) {
        massDeleteCloseBtn.addEventListener('click', closeMassDeleteModal);
    }
});
});