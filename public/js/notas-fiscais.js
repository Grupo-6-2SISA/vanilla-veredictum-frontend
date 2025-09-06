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

// // Função para renderizar a lista de notas fiscais
// function renderNotasFiscais() {
//     const container = document.querySelector('.nf-list-items-container');
//     container.innerHTML = notasFiscais.map(nota => `
//         <div class="nf-list-item">
//             <p class="nf-col-name">${nota.numero}</p>
//             <p class="nf-col-etiqueta">${nota.etiqueta}</p>
//             <p class="nf-col-data">${nota.vencimento}</p>
//             <p class="nf-col-emitida">${nota.emitida}</p>
//             <p class="nf-col-editar">
//                 <img src="assets/svg/edit.svg" alt="Editar" onclick="openModalEditar_notas()">
//             </p>
//             <p class="nf-col-excluir">
//                 <button onclick="openModalExcluir()" style="border: none;">
//                     <img src="assets/svg/lixo.svg" alt="Excluir">
//                 </button>
//             </p>
//             <p class="nf-col-info">
//                 <a href="javascript:void(0)" onclick="openModalVerMais()" aria-haspopup="dialog" role="button">Ver mais</a>
//             </p>
//         </div>
//     `).join('');
// }

// document.addEventListener('DOMContentLoaded', renderNotasFiscais);

function openModalEditar_notas() {
    document.getElementById("modal_editar_notas").style.display = "flex";
}

function closeModalEditar() {
    document.getElementById("modal_editar_notas").style.display = "none";
}

function openModalAdicionar_notas() {
    document.getElementById("modal_adicionar_notas").style.display = "flex";
}

function closeModalAdicionar() {
    document.getElementById("modal_adicionar_notas").style.display = "none";
}   

function openModalExcluir() {
    document.getElementById("modalConfirmar").style.display = "flex";
}

function closeModalExcluir() {
    document.getElementById("modalConfirmar").style.display = "none";
}

function openModalVerMais() {
    document.getElementById("modal_ver_mais").style.display = "flex";
}

function closeModalVerMais() {
    document.getElementById("modal_ver_mais").style.display = "none";
}



function closeAllModals() {
    document.querySelectorAll('.modal, .modal-backdrop').forEach(el => {
        if (!el) return;
        if (getComputedStyle(el).display !== 'none') {
            el.style.display = 'none';
        }
        if (el.classList) el.classList.add('hidden');
    });
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        closeAllModals();
    }
});

document.addEventListener('click', function (e) {
    const target = e.target;
    if (!target || !target.classList) return;

    if (target.classList.contains('modal') || target.classList.contains('modal-backdrop')) {
        target.style.display = 'none';
        if (target.classList) target.classList.add('hidden');
    }
});