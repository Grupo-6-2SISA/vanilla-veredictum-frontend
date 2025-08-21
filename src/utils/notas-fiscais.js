/**
 * Gerenciamento da página de notas fiscais
 * Segue os padrões de nomenclatura: camelCase para JavaScript
 */
import ApiService from "./api-service.js"
import Utils from "./utils.js"

let currentNotaId = null
let isEditMode = false

/**
 * Inicializa os event listeners da página
 */
function initializeEventListeners() {
    // Botão adicionar nota fiscal
    document.getElementById("adicionarNotaBtn").addEventListener("click", () => {
        openNotaModal()
    })

    // Modal nota - fechar
    document.getElementById("notaModalClose").addEventListener("click", () => {
        closeNotaModal()
    })
    document.getElementById("notaModalOverlay").addEventListener("click", () => {
        closeNotaModal()
    })

    // Modal nota - salvar
    document.getElementById("notaForm").addEventListener("submit", (e) => {
        e.preventDefault()
        handleSaveNota()
    })

    // Modal informações - fechar
    document.getElementById("infoNotaModalClose").addEventListener("click", () => {
        closeInfoModal()
    })
    document.getElementById("infoNotaModalOverlay").addEventListener("click", () => {
        closeInfoModal()
    })

    // Modal excluir - fechar
    document.getElementById("excluirNotaModalClose").addEventListener("click", () => {
        closeExcluirModal()
    })
    document.getElementById("excluirNotaModalOverlay").addEventListener("click", () => {
        closeExcluirModal()
    })

    // Modal excluir - botões
    document.getElementById("cancelarExcluirBtn").addEventListener("click", () => {
        closeExcluirModal()
    })
    document.getElementById("confirmarExcluirBtn").addEventListener("click", () => {
        handleExcluirNota()
    })
}

/**
 * Configura máscaras nos inputs
 */
function setupMasks() {
    const valorInput = document.getElementById("valor")
    if (valorInput) {
        valorInput.addEventListener("input", (e) => {
            let value = e.target.value
            value = value.replace(/\D/g, "")
            value = (Number.parseInt(value) / 100).toFixed(2) + ""
            value = value.replace(".", ",")
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
            e.target.value = "R$ " + value
        })
    }
}

/**
 * Carrega e renderiza a lista de notas fiscais
 */
async function loadNotasFiscais() {
    try {
        const notas = await ApiService.getNotasFiscais()
        renderNotasTable(notas)
    } catch (error) {
        console.error("Erro ao carregar notas fiscais:", error)
        Utils.dom.showToast("Erro ao carregar notas fiscais", "error")
    }
}

/**
 * Renderiza a tabela de notas fiscais
 * @param {Array} notas - Lista de notas fiscais
 */
function renderNotasTable(notas) {
    const tbody = document.getElementById("notasTableBody")

    if (!notas || notas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">Nenhuma nota fiscal encontrada</td>
            </tr>
        `
        return
    }

    tbody.innerHTML = notas
        .map(
            (nota) => `
        <tr>
            <td class="table__cell">${nota.numeroNota}</td>
            <td class="table__cell">${nota.etiqueta}</td>
            <td class="table__cell">${Utils.formatters.formatDate(nota.dataVencimento)}</td>
            <td class="table__cell">
                <span class="status ${nota.emitida ? "status--success" : "status--warning"}">
                    ${nota.emitida ? "Sim" : "Não"}
                </span>
            </td>
            <td class="table__cell">
                <button class="btn btn--icon" data-action="edit" data-id="${nota.id}">
                    img src="assets/icons/edit.svg" alt="Editar"
                </button>
            </td>
            <td class="table__cell">
                <button class="btn btn--icon btn--danger" data-action="delete" data-id="${nota.id}">
                    img src="assets/icons/delete.svg" alt="Excluir"
                </button>
            </td>
            <td class="table__cell">
                <button class="btn btn--info" data-action="info" data-id="${nota.id}">
                    Ver mais
                </button>
            </td>
        </tr>
    `,
        )
        .join("")

    tbody.querySelectorAll("button[data-action]").forEach((button) => {
        button.addEventListener("click", (e) => {
            const action = e.currentTarget.dataset.action
            const id = e.currentTarget.dataset.id
            if (action === "edit") {
                editNota(id)
            } else if (action === "delete") {
                showExcluirModal(id)
            } else if (action === "info") {
                showNotaInfo(id)
            }
        })
    })
}

/**
 * Abre o modal de nota fiscal (cadastro/edição)
 * @param {Object} nota - Dados da nota (opcional, para edição)
 */
function openNotaModal(nota = null) {
    const modal = document.getElementById("notaModal")
    const title = document.getElementById("notaModalTitle")
    const saveBtn = document.getElementById("salvarNotaBtn")
    const form = document.getElementById("notaForm")

    if (nota) {
        // Modo edição
        isEditMode = true
        currentNotaId = nota.id
        title.textContent = "Editar Nota Fiscal"
        saveBtn.textContent = "Salvar"
        fillNotaForm(nota)
    } else {
        // Modo cadastro
        isEditMode = false
        currentNotaId = null
        title.textContent = "Adicionar Nota Fiscal"
        saveBtn.textContent = "Adicionar"
        form.reset()
    }

    modal.classList.add("is-open")
}

/**
 * Fecha o modal de nota fiscal
 */
function closeNotaModal() {
    const modal = document.getElementById("notaModal")
    modal.classList.remove("is-open")
    document.getElementById("notaForm").reset()
}

/**
 * Preenche o formulário com dados da nota fiscal
 * @param {Object} nota - Dados da nota fiscal
 */
function fillNotaForm(nota) {
    document.getElementById("numeroNota").value = nota.numeroNota || ""
    document.getElementById("valor").value = Utils.formatters.formatCurrency(nota.valor)
    document.getElementById("dataVencimento").value = nota.dataVencimento ? nota.dataVencimento.split("T")[0] : ""
    document.getElementById("etiqueta").value = nota.etiqueta || ""
    document.getElementById("emitida").value = nota.emitida ? "true" : "false"
    document.getElementById("urlCloud").value = nota.urlCloud || ""
    document.getElementById("cliente").value = nota.cliente?.id || ""
}

/**
 * Manipula o salvamento da nota fiscal
 */
async function handleSaveNota() {
    const form = document.getElementById("notaForm")
    const formData = new FormData(form)
    const notaData = {
        numeroNota: formData.get("numeroNota"),
        valor: Number.parseFloat(formData.get("valor").replace("R$", "").replace(".", "").replace(",", ".")),
        dataVencimento: formData.get("dataVencimento"),
        etiqueta: formData.get("etiqueta"),
        emitida: formData.get("emitida") === "true",
        urlCloud: formData.get("urlCloud"),
        cliente: { id: formData.get("cliente") },
    }

    // Validações
    if (!validateNotaData(notaData)) {
        return
    }

    try {
        if (isEditMode) {
            await ApiService.updateNotaFiscal(currentNotaId, notaData)
            Utils.dom.showToast("Nota fiscal atualizada com sucesso!", "success")
        } else {
            await ApiService.createNotaFiscal(notaData)
            Utils.dom.showToast("Nota fiscal criada com sucesso!", "success")
        }

        closeNotaModal()
        loadNotasFiscais()
    } catch (error) {
        console.error("Erro ao salvar nota fiscal:", error)
        Utils.dom.showToast("Erro ao salvar nota fiscal", "error")
    }
}

/**
 * Valida os dados da nota fiscal
 * @param {Object} notaData - Dados da nota fiscal
 * @returns {boolean} - true se válido, false se inválido
 */
function validateNotaData(notaData) {
    if (!notaData.numeroNota || !notaData.valor || !notaData.dataVencimento || !notaData.cliente.id) {
        Utils.dom.showToast("Preencha todos os campos obrigatórios", "warning")
        return false
    }

    return true
}

/**
 * Edita uma nota fiscal
 * @param {number} notaId - ID da nota fiscal
 */
async function editNota(notaId) {
    try {
        const nota = await ApiService.getNotaFiscalById(notaId)
        openNotaModal(nota)
    } catch (error) {
        console.error("Erro ao carregar nota fiscal:", error)
        Utils.dom.showToast("Erro ao carregar dados da nota fiscal", "error")
    }
}

/**
 * Mostra informações detalhadas da nota fiscal
 * @param {number} notaId - ID da nota fiscal
 */
async function showNotaInfo(notaId) {
    try {
        const nota = await ApiService.getNotaFiscalById(notaId)
        renderNotaInfo(nota)

        const modal = document.getElementById("infoNotaModal")
        modal.classList.add("is-open")
    } catch (error) {
        console.error("Erro ao carregar informações da nota fiscal:", error)
        Utils.dom.showToast("Erro ao carregar informações", "error")
    }
}

/**
 * Renderiza as informações da nota fiscal no modal
 * @param {Object} nota - Dados da nota fiscal
 */
function renderNotaInfo(nota) {
    const container = document.getElementById("infoNotaContent")

    const fields = [
        { key: "numeroNota", label: "Número da Nota" },
        { key: "valor", label: "Valor", format: Utils.formatters.formatCurrency },
        { key: "dataVencimento", label: "Data de Vencimento", format: Utils.formatters.formatDate },
        { key: "etiqueta", label: "Etiqueta" },
        { key: "emitida", label: "Emitida", format: (v) => (v ? "Sim" : "Não") },
        { key: "urlCloud", label: "URL Cloud" },
        { key: "cliente", label: "Cliente", format: (c) => c?.nome || "-" },
    ]

    container.innerHTML = fields
        .map((field) => {
            const value = nota[field.key]
            const formattedValue = field.format ? field.format(value) : value || "-"
            return `
            <div class="info-item">
                <div class="info-item__label">${field.label}</div>
                <div class="info-item__value">${formattedValue}</div>
            </div>
        `
        })
        .join("")
}

/**
 * Fecha o modal de informações
 */
function closeInfoModal() {
    const modal = document.getElementById("infoNotaModal")
    modal.classList.remove("is-open")
}

/**
 * Mostra o modal de confirmação para excluir nota fiscal
 * @param {number} notaId - ID da nota fiscal
 */
async function showExcluirModal(notaId) {
    try {
        const nota = await ApiService.getNotaFiscalById(notaId)
        currentNotaId = notaId

        const message = document.getElementById("excluirNotaMessage")
        message.textContent = `Deseja excluir a nota ${nota.numeroNota} de etiqueta "${nota.etiqueta}"?`

        const modal = document.getElementById("excluirNotaModal")
        modal.classList.add("is-open")
    } catch (error) {
        console.error("Erro ao carregar nota fiscal:", error)
        Utils.dom.showToast("Erro ao carregar dados da nota fiscal", "error")
    }
}

/**
 * Fecha o modal de excluir
 */
function closeExcluirModal() {
    const modal = document.getElementById("excluirNotaModal")
    modal.classList.remove("is-open")
}

/**
 * Confirma a exclusão da nota fiscal
 */
async function handleExcluirNota() {
    try {
        await ApiService.deleteNotaFiscal(currentNotaId)

        Utils.dom.showToast("Nota fiscal excluída com sucesso!", "success")
        closeExcluirModal()
        loadNotasFiscais()
    } catch (error) {
        console.error("Erro ao excluir nota fiscal:", error)
        Utils.dom.showToast("Erro ao excluir nota fiscal", "error")
    }
}

// Inicializa o gerenciador quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    initializeEventListeners()
    setupMasks()
    loadNotasFiscais()
})
