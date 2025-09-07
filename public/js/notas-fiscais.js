const notasFiscais = [
    {
        numero: "NF-e 1235474873626...",
        etiqueta: "Atendimento X",
        vencimento: "09/01/2025",
        emitida: "Sim"
    },
    {
        numero: "NF-e 123234567987...",
        etiqueta: "Consultoria Y",
        vencimento: "09/01/2025",
        emitida: "Sim"
    },
    {
        numero: "NF-e 15678765678...",
        etiqueta: "Serviço Prestado Z",
        vencimento: "09/01/2025",
        emitida: "Sim"
    }
];

// Função para renderizar a lista de notas fiscais
function renderNotasFiscais() {
    const container = document.querySelector('.nf-list-items-container');
    if (!container) return; // Garante que o container existe antes de renderizar

    container.innerHTML = notasFiscais.map((nota, index) => `
        <div class="nf-list-item">
            <p class="nf-col-name">${nota.numero}</p>
            <p class="nf-col-etiqueta">${nota.etiqueta}</p>
            <p class="nf-col-data">${nota.vencimento}</p>
            <p class="nf-col-emitida">${nota.emitida}</p>
            <p class="nf-col-editar">
                <img src="assets/svg/edit.svg" alt="Editar" onclick="openModalEditar(${index})">
            </p>
            <p class="nf-col-excluir">
                <button onclick="openModalExcluir(${index})" style="border: none;">
                    <img src="assets/svg/lixo.svg" alt="Excluir">
                </button>
            </p>
            <p class="nf-col-info">
                <a href="javascript:void(0)" onclick="openModalVerMais(${index})" aria-haspopup="dialog" role="button">Ver mais</a>
            </p>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderNotasFiscais);

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