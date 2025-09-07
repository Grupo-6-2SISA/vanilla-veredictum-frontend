document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:3000/notas';
    
    const listItemsContainer = document.querySelector('.nf-list-items-container');
    const newAppointmentBtn = document.querySelector('.btn-new-appointment');
    
    // Mapeia os modais para acesso fácil
    const modals = {
        add: document.getElementById('new-appointment-modal-add-note'),
        edit: document.getElementById('new-appointment-modal-edit-note'),
        view: document.getElementById('new-appointment-modal-view-note'),
        delete: document.getElementById('modal-delete-schedule-note')
    };

    // Mapeia os backdrops (se você tiver)
    const backdrops = {
        add: document.querySelector('.modal-backdrop-add-note'),
        edit: document.querySelector('.modal-backdrop-edit-note'),
        view: document.querySelector('.modal-backdrop-view-note'),
        delete: document.querySelector('.modal-backdrop-delete-note')
    };
    
    let currentNotaId = null;

    /* ========================================================= */
    /* Funções de Interação com a API (CRUD) */
    /* ========================================================= */

    // GET: Buscar todas as notas fiscais
    async function fetchNotas() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Erro ao buscar notas fiscais');
            }
            const notas = await response.json();
            renderNotas(notas);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    // GET: Buscar uma única nota pelo ID
    async function fetchNotaById(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar nota por ID');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            return null;
        }
    }

    // POST: Adicionar uma nova nota
    async function addNota(notaData) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notaData)
            });
            if (!response.ok) {
                throw new Error('Erro ao cadastrar nota fiscal');
            }
            closeModal('add');
            fetchNotas();
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    // PATCH: Atualizar uma nota existente
    async function updateNota(id, notaData) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notaData)
            });
            if (!response.ok) {
                throw new Error('Erro ao atualizar nota fiscal');
            }
            closeModal('edit');
            fetchNotas();
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    // DELETE: Excluir uma nota
    async function deleteNota(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Erro ao excluir nota fiscal');
            }
            closeModal('delete');
            fetchNotas();
        } catch (error) {
            console.error('Erro:', error);
        }
    }


    /* ========================================================= */
    /* Funções para Renderizar e Preencher a UI */
    /* ========================================================= */
    
    function createNotaRow(nota) {
        const row = document.createElement('div');
        row.classList.add('nf-list-item');
        row.dataset.notaId = nota.id;
        row.innerHTML = `
            <p class="nf-col-name">${nota.numeroNota}</p>
            <p class="nf-col-etiqueta">${nota.etiqueta || '-'}</p>
            <p class="nf-col-data">${nota.dataVencimento || '-'}</p>
            <p class="nf-col-emitida">${nota.emitida ? 'Sim' : 'Não'}</p>
            <p class="nf-col-editar">
                <img src="assets/svg/edit.svg" alt="Editar" class="icon_edit">
            </p>
            <p class="nf-col-excluir">
                <button class="btn-excluir" style="border: none;">
                    <img src="assets/svg/lixo.svg" alt="Excluir" class="icon_delete">
                </button>
            </p>
            <p class="nf-col-info">
                <a href="#" class="view-note-link" aria-haspopup="dialog" role="button">Ver mais</a>
            </p>
        `;
        return row;
    }

    function renderNotas(notas) {
        if (!listItemsContainer) return;
        listItemsContainer.innerHTML = '';
        notas.forEach(nota => {
            const row = createNotaRow(nota);
            listItemsContainer.appendChild(row);
        });
    }

    async function fillEditModal(notaId) {
        const nota = await fetchNotaById(notaId);
        if (!nota) return;
        currentNotaId = notaId;

        const form = modals.edit.querySelector('form');
        form.querySelector('#numeroNotaEdit').value = nota.numeroNota || '';
        form.querySelector('#dataVencimentoEdit').value = nota.dataVencimento || '';
        form.querySelector('#emitidaEdit').value = nota.emitida ? 'true' : 'false';
        form.querySelector('#clienteEdit').value = nota.cliente || '';
        form.querySelector('#valorEdit').value = nota.valor || '';
        form.querySelector('#etiquetaEdit').value = nota.etiqueta || '';
        form.querySelector('#urlCloudEdit').value = nota.urlCloud || '';
    }

    async function fillViewModal(notaId) {
        const nota = await fetchNotaById(notaId);
        if (!nota) return;

        const form = modals.view.querySelector('form');
        form.querySelector('#numeroNotaView').value = nota.numeroNota || '';
        form.querySelector('#dataVencimentoView').value = nota.dataVencimento || '';
        form.querySelector('#emitidaView').value = nota.emitida ? 'true' : 'false';
        form.querySelector('#clienteView').value = nota.cliente || '';
        form.querySelector('#valorView').value = nota.valor || '';
        form.querySelector('#etiquetaView').value = nota.etiqueta || '';
        form.querySelector('#urlCloudView').value = nota.urlCloud || '';
    }


    /* ========================================================= */
    /* Lógica de Eventos e Modais */
    /* ========================================================= */
    
    function openModal(modalKey) {
        modals[modalKey].classList.remove('hidden');
    }

    function closeModal(modalKey) {
        modals[modalKey].classList.add('hidden');
    }

    newAppointmentBtn.addEventListener('click', () => {
        openModal('add');
    });

    listItemsContainer.addEventListener('click', async (e) => {
        const target = e.target;
        const row = target.closest('.nf-list-item');
        if (!row) return;

        const notaId = row.dataset.notaId;

        if (target.classList.contains('icon_edit')) {
            openModal('edit');
            await fillEditModal(notaId);
        }

        if (target.classList.contains('view-note-link')) {
            e.preventDefault();
            openModal('view');
            await fillViewModal(notaId);
        }

        if (target.classList.contains('icon_delete')) {
            openModal('delete');
            modals.delete.dataset.notaId = notaId;
            const notaNumero = row.querySelector('.nf-col-name').textContent;
            modals.delete.querySelector('.note-number').textContent = notaNumero;
        }
    });

    // Submissão do formulário de adição
    modals.add.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const notaData = Object.fromEntries(formData.entries());
        notaData.emitida = notaData.emitida === 'true'; // Converte para boolean
        addNota(notaData);
    });

    // Submissão do formulário de edição
    modals.edit.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentNotaId) return;

        const formData = new FormData(e.target);
        const notaData = Object.fromEntries(formData.entries());
        notaData.emitida = notaData.emitida === 'true'; // Converte para boolean
        updateNota(currentNotaId, notaData);
    });

    // Botão de "Sim" no modal de exclusão
    document.querySelector('#modal-delete-schedule-note .btn-confirm-delete').addEventListener('click', () => {
        const notaId = modals.delete.dataset.notaId;
        if (notaId) {
            deleteNota(notaId);
        }
    });

    // Fechar modais ao clicar no botão de fechar ou no backdrop
    document.querySelectorAll('.modal-close-btn, .modal-close-delete-btn, .btn-cancel-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.closest('.modal, .modal-delete-note').id;
            const modalKey = Object.keys(modals).find(key => modals[key].id === modalId);
            if (modalKey) {
                closeModal(modalKey);
            }
        });
    });

    // Fechar modais ao clicar no backdrop (se você tiver backdrops)
    Object.values(backdrops).forEach(backdrop => {
        if(backdrop) {
            backdrop.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    const modalKey = Object.keys(modals).find(key => modals[key].id === modal.id);
                    if (modalKey) {
                        closeModal(modalKey);
                    }
                }
            });
        }
    });
    
    // Fechar modais com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            Object.keys(modals).forEach(modalKey => {
                if (!modals[modalKey].classList.contains('hidden')) {
                    closeModal(modalKey);
                }
            });
        }
    });

    // Inicializa a busca de notas ao carregar a página
    fetchNotas();
});

// Funções para Modais
// Abre o modal de edição
function openModalEditar(index) {
    console.log(`Abrindo modal de edição para a nota fiscal no índice ${index}`);
    document.getElementById("new-appointment-modal-edit-note").style.display = "flex";
}

// Fecha o modal de edição
function closeModalEditar() {
    document.getElementById("new-appointment-modal-edit-note").style.display = "none";
}

// Abre o modal de adição
function openModalAdicionar() {
    document.getElementById("new-appointment-modal-add-note").style.display = "flex";
}

// Fecha o modal de adição
function closeModalAdicionar() {
    document.getElementById("new-appointment-modal-add-note").style.display = "none";
}

// Abre o modal de exclusão
function openModalExcluir(index) {
    console.log(`Abrindo modal de exclusão para a nota fiscal no índice ${index}`);
    document.getElementById("modal-delete-schedule-note").style.display = "flex";
}

// Fecha o modal de exclusão
function closeModalExcluir() {
    document.getElementById("modal-delete-schedule-note").style.display = "none";
}

// Abre o modal de "Ver Mais"
function openModalVerMais(index) {
    console.log(`Abrindo modal 'Ver Mais' para a nota fiscal no índice ${index}`);
    document.getElementById("new-appointment-modal-view-note").style.display = "flex";
}

// Fecha o modal de "Ver Mais"
function closeModalVerMais() {
    document.getElementById("new-appointment-modal-view-note").style.display = "none";
}

// Função para fechar qualquer modal aberto ao pressionar a tecla 'Esc'
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
        closeModalEditar();
        closeModalAdicionar();
        closeModalExcluir();
        closeModalVerMais();
    }
});

// Função para fechar qualquer modal ao clicar fora dele
document.addEventListener('click', function (e) {
    const target = e.target;
    if (target.id === "new-appointment-modal-edit-note " || target.id === "new-appointment-modal-add-note" || target.id === "modal-delete-schedule" || target.id === "new-appointment-modal-view-note") {
        target.style.display = 'none';
    }
});document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:3000/notas';
    
    // Mapeia os modais para acesso fácil
    const modals = {
        add: document.getElementById('new-appointment-modal-add-note'),
        edit: document.getElementById('new-appointment-modal-edit-note'),
        view: document.getElementById('new-appointment-modal-view-note'),
        delete: document.getElementById('modal-delete-schedule-note')
    };

    const listItemsContainer = document.querySelector('.nf-list-items-container');
    const formAdicionarNota = document.getElementById('formNota');
    const formEditarNota = document.getElementById('formNotaEdit');
    const formVisualizarNota = document.getElementById('formNotaView');
    const btnAdicionar = document.querySelector('.btn-new-appointment');



    /* Funções de Interação com a API (CRUD) */


    // GET: Buscar todas as notas
    async function fetchNotas() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Erro ao buscar notas fiscais');
            }
            const notas = await response.json();
            renderNotasFiscais(notas);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    // GET: Buscar uma única nota pelo ID
    async function fetchNotaById(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar nota por ID');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            return null;
        }
    }

    // POST: Adicionar uma nova nota
    async function addNota(notaData) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notaData)
            });
            if (!response.ok) {
                throw new Error('Erro ao cadastrar nota fiscal');
            }
            closeModal('add');
            fetchNotas();
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    // PATCH: Atualizar uma nota existente
    async function updateNota(id, notaData) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notaData)
            });
            if (!response.ok) {
                throw new Error('Erro ao atualizar nota fiscal');
            }
            closeModal('edit');
            fetchNotas();
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    // DELETE: Excluir uma nota
    async function deleteNota(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Erro ao excluir nota fiscal');
            }
            closeModal('delete');
            fetchNotas();
        } catch (error) {
            console.error('Erro:', error);
        }
    }


    /* ========================================================= */
    /* Funções para Renderizar e Preencher a UI */
    /* ========================================================= */
    
    function createNotaRow(nota) {
        const row = document.createElement('div');
        row.classList.add('nf-list-item');
        row.dataset.notaId = nota.id;
        row.innerHTML = `
            <p class="nf-col-name">${nota.numeroNota}</p>
            <p class="nf-col-etiqueta">${nota.etiqueta}</p>
            <p class="nf-col-data">${nota.dataVencimento}</p>
            <p class="nf-col-emitida">${nota.emitida ? 'Sim' : 'Não'}</p>
            <p class="nf-col-editar">
                <img src="assets/svg/edit.svg" alt="Editar" class="icon_edit">
            </p>
            <p class="nf-col-excluir">
                <button class="btn-excluir" style="border: none;">
                    <img src="assets/svg/lixo.svg" alt="Excluir" class="icon_delete">
                </button>
            </p>
            <p class="nf-col-info">
                <a href="#" class="view-note-link" aria-haspopup="dialog" role="button">Ver mais</a>
            </p>
        `;
        return row;
    }

    function renderNotasFiscais(notas) {
        if (!listItemsContainer) return;
        listItemsContainer.innerHTML = '';
        notas.forEach(nota => {
            const row = createNotaRow(nota);
            listItemsContainer.appendChild(row);
        });
    }

    async function fillEditModal(notaId) {
        const nota = await fetchNotaById(notaId);
        if (!nota) return;

        modals.edit.dataset.notaId = nota.id;
        const form = formEditarNota;

        for (const key in nota) {
            // Verifica se o campo existe no formulário de edição
            const input = form.querySelector(`#${key}`);
            if (input) {
                if (input.type === 'date' && nota[key]) {
                    input.value = nota[key].split('T')[0];
                } else if (input.tagName === 'SELECT' && input.name === 'emitida') {
                    input.value = nota[key] ? 'true' : 'false';
                } else {
                    input.value = nota[key];
                }
            }
        }
    }

    async function fillViewModal(notaId) {
        const nota = await fetchNotaById(notaId);
        if (!nota) return;

        const form = formVisualizarNota;

        for (const key in nota) {
            const input = form.querySelector(`#${key}View`);
            if (input) {
                if (input.type === 'date' && nota[key]) {
                    input.value = nota[key].split('T')[0];
                } else if (key === 'emitida') {
                    input.value = nota[key] ? 'Sim' : 'Não';
                } else {
                    input.value = nota[key];
                }
            }
        }
    }


    /* ========================================================= */
    /* Lógica de Eventos e Modais */
    /* ========================================================= */
    
    function openModal(modalKey) {
        modals[modalKey].classList.remove('hidden');
    }

    function closeModal(modalKey) {
        modals[modalKey].classList.add('hidden');
    }

    btnAdicionar.addEventListener('click', () => {
        openModal('add');
    });

    listItemsContainer.addEventListener('click', async (e) => {
        const target = e.target;
        const row = target.closest('.nf-list-item');
        if (!row) return;

        const notaId = row.dataset.notaId;

        if (target.classList.contains('icon_edit')) {
            openModal('edit');
            await fillEditModal(notaId);
        }

        if (target.classList.contains('view-note-link')) {
            e.preventDefault();
            openModal('view');
            await fillViewModal(notaId);
        }

        if (target.classList.contains('icon_delete')) {
            openModal('delete');
            modals.delete.dataset.notaId = notaId;
            const notaNumero = row.querySelector('.nf-col-name').textContent;
            modals.delete.querySelector('.note-number').textContent = notaNumero;
        }
    });

    // Submissão do formulário de adição
    if (formAdicionarNota) {
        formAdicionarNota.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const notaData = Object.fromEntries(formData.entries());
            notaData.emitida = notaData.emitida === 'true'; // Converte para boolean
            addNota(notaData);
        });
    }

    // Submissão do formulário de edição
    if (formEditarNota) {
        formEditarNota.addEventListener('submit', (e) => {
            e.preventDefault();
            const notaId = modals.edit.dataset.notaId;
            if (!notaId) return;

            const formData = new FormData(e.target);
            const notaData = Object.fromEntries(formData.entries());
            notaData.emitida = notaData.emitida === 'true'; // Converte para boolean
            updateNota(notaId, notaData);
        });
    }

    // Botões de fechar e de "não"
    document.querySelectorAll('.modal-close-btn, .modal-close-delete-btn, .btn-cancel-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.closest('.modal, .modal-delete-note').id;
            const modalKey = Object.keys(modals).find(key => modals[key].id === modalId);
            if (modalKey) {
                closeModal(modalKey);
            }
        });
    });

    // Botão de "sim" no modal de exclusão
    document.querySelector('#modal-delete-schedule-note .btn-confirm-delete').addEventListener('click', () => {
        const notaId = modals.delete.dataset.notaId;
        if (notaId) {
            deleteNota(notaId);
        }
    });

    fetchNotas();
});

// Funções para Modais
// Abre o modal de edição
function openModalEditar(index) {
    // Você pode usar o 'index' para carregar os dados da nota fiscal específica no modal
    console.log(`Abrindo modal de edição para a nota fiscal no índice ${index}`);
    document.getElementById("new-appointment-modal-edit-note").style.display = "flex";
}

// Fecha o modal de edição
function closeModalEditar() {
    document.getElementById("new-appointment-modal-edit-note").style.display = "none";
}

// Abre o modal de adição
function openModalAdicionar() {
    document.getElementById("new-appointment-modal-add-note").style.display = "flex";
}

// Fecha o modal de adição
function closeModalAdicionar() {
    document.getElementById("new-appointment-modal-add-note").style.display = "none";
}

// Abre o modal de exclusão
function openModalExcluir(index) {
    // Você pode usar o 'index' para confirmar a exclusão da nota fiscal específica
    console.log(`Abrindo modal de exclusão para a nota fiscal no índice ${index}`);
    document.getElementById("modal-delete-schedule-note").style.display = "flex";
}

// Fecha o modal de exclusão
function closeModalExcluir() {
    document.getElementById("modal-delete-schedule-note").style.display = "none";
}

// Abre o modal de "Ver Mais"
function openModalVerMais(index) {
    // Você pode usar o 'index' para carregar os detalhes da nota fiscal específica
    console.log(`Abrindo modal 'Ver Mais' para a nota fiscal no índice ${index}`);
    document.getElementById("new-appointment-modal-view-note").style.display = "flex";
}

// Fecha o modal de "Ver Mais"
function closeModalVerMais() {
    document.getElementById("new-appointment-modal-view-note").style.display = "none";
}

// Função para fechar qualquer modal aberto ao pressionar a tecla 'Esc'
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
        closeModalEditar();
        closeModalAdicionar();
        closeModalExcluir();
        closeModalVerMais();
    }
});

// Função para fechar qualquer modal ao clicar fora dele
document.addEventListener('click', function (e) {
    const target = e.target;
    if (target.id === "new-appointment-modal-edit-note " || target.id === "new-appointment-modal-add-note" || target.id === "modal-delete-schedule" || target.id === "new-appointment-modal-view-note") {
        target.style.display = 'none';
    }
});