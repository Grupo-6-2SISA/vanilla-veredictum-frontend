/**
 * Gerenciamento da página de notas fiscais
 * Segue os padrões de nomenclatura: camelCase para JavaScript
 */

const API_URL = "http://localhost:3001/notasFiscais"
// const API_URL = "http://localhost:8080/notas-fiscais" // endpoint original comentado

class NotasFiscaisManager {
    constructor() {
        this.currentNotaId = null
        this.isEditMode = false

        this.initializeEventListeners()
        this.setupMasks()
        this.loadNotasFiscais()
    }

    /**
     * Inicializa os event listeners da página
     */
    initializeEventListeners() {
        document.getElementById("adicionarNotaBtn").addEventListener("click", () => this.openNotaModal())
        document.getElementById("notaModalClose").addEventListener("click", () => this.closeNotaModal())
        document.getElementById("notaModalOverlay").addEventListener("click", () => this.closeNotaModal())
        document.getElementById("notaForm").addEventListener("submit", (e) => {
            e.preventDefault()
            this.handleSaveNota()
        })
        document.getElementById("infoNotaModalClose").addEventListener("click", () => this.closeInfoModal())
        document.getElementById("infoNotaModalOverlay").addEventListener("click", () => this.closeInfoModal())
        document.getElementById("excluirNotaModalClose").addEventListener("click", () => this.closeExcluirModal())
        document.getElementById("excluirNotaModalOverlay").addEventListener("click", () => this.closeExcluirModal())
        document.getElementById("cancelarExcluirBtn").addEventListener("click", () => this.closeExcluirModal())
        document.getElementById("confirmarExcluirBtn").addEventListener("click", () => this.handleExcluirNota())
    }

    /**
     * Configura máscaras nos inputs
     */
    setupMasks() {
        const valorInput = document.getElementById("valor")
        if (valorInput) {
            valorInput.addEventListener("input", (e) => {
                // Simples máscara de moeda
                let v = e.target.value.replace(/\D/g, "")
                v = (v / 100).toFixed(2) + ""
                v = v.replace(".", ",")
                v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
                e.target.value = v
            })
        }
    }

    /**
     * Carrega e renderiza a lista de notas fiscais
     */
    async loadNotasFiscais() {
        try {
            const res = await fetch(API_URL)
            if (!res.ok) throw new Error("Erro ao buscar notas fiscais")
            const notas = await res.json()
            this.notas = notas
            this.renderNotasTable(notas)
        } catch (error) {
            console.error("Erro ao carregar notas fiscais:", error)
            alert("Erro ao carregar notas fiscais")
        }
    }

    /**
     * Renderiza a tabela de notas fiscais
     * @param {Array} notas - Lista de notas fiscais
     */
    renderNotasTable(notas) {
        const container = document.getElementById("notasTableBody")
        container.innerHTML = `
            <div class="table-header">
                <p class="col-name">Número da Nota</p>
                <p class="col-etiqueta">Etiqueta</p>
                <p class="col-day">Data de Vencimento</p>
                <p class="col-status">Status</p>
                <p class="col-emitida">Emitida</p>
                <p class="col-edit">Editar</p>
                <p class="col-delete">Excluir</p>
                <p class="col-info">Informações</p>
            </div>
        `
        if (!notas || notas.length === 0) {
            container.innerHTML += `<div class="table-row"><div style="grid-column: 1 / -1; text-align:center;">Nenhuma nota fiscal encontrada</div></div>`
            return
        }
        notas.forEach(nota => {
            container.innerHTML += `
                <div class="table-row">
                    <div class="col-name">${nota.numeroNota || nota.numero}</div>
                    <div class="col-etiqueta">${nota.etiqueta || "-"}</div>
                    <div class="col-day">${this.formatDate(nota.dataVencimento || nota.data_emissao)}</div>
                    <div class="col-status">${nota.status || '-'}</div>
                    <div class="col-emitida">${nota.emitida ? "Sim" : "Não"}</div>
                    <div class="col-edit">
                        <button class="action-btn action-btn--edit" data-action="edit" data-id="${nota.id}">
                            <img src="/assets/svg/edit.svg" alt="Editar">
                        </button>
                    </div>
                    <div class="col-delete">
                        <button class="action-btn action-btn--delete" data-action="delete" data-id="${nota.id}">
                            <img src="/assets/svg/lixo.svg" alt="Excluir">
                        </button>
                    </div>
                    <div class="col-info">
                        <button class="action-btn action-btn--info" data-action="info" data-id="${nota.id}">
                            <span style="color: #222;">Ver Mais</span>
                        </button>
                    </div>
                </div>
            `
        })
        this.addTableActionListeners()
    }

    addTableActionListeners() {
        document.querySelectorAll("#notasTableBody button[data-action]").forEach(button => {
            button.addEventListener("click", (e) => {
                const action = e.currentTarget.dataset.action
                const id = Number(e.currentTarget.dataset.id)
                if (action === "edit") this.editNota(id)
                else if (action === "delete") this.showExcluirModal(id)
                else if (action === "info") this.showNotaInfo(id)
            })
        })
    }

    /**
     * Abre o modal de nota fiscal (cadastro/edição)
     * @param {Object} nota - Dados da nota (opcional, para edição)
     */
    openNotaModal(nota = null) {
        const modal = document.getElementById("notaModal")
        const title = document.getElementById("notaModalTitle")
        const saveBtn = document.getElementById("salvarNotaBtn")
        const form = document.getElementById("notaForm")

        if (nota) {
            this.isEditMode = true
            this.currentNotaId = nota.id
            title.textContent = "Editar Nota Fiscal"
            saveBtn.textContent = "Salvar"
            this.fillNotaForm(nota)
        } else {
            this.isEditMode = false
            this.currentNotaId = null
            title.textContent = "Adicionar Nota Fiscal"
            saveBtn.textContent = "Adicionar"
            form.reset()
        }
        modal.classList.add("is-open")
    }

    /**
     * Fecha o modal de nota fiscal
     */
    closeNotaModal() {
        document.getElementById("notaModal").classList.remove("is-open")
        document.getElementById("notaForm").reset()
    }

    /**
     * Preenche o formulário com dados da nota fiscal
     * @param {Object} nota - Dados da nota fiscal
     */
    fillNotaForm(nota) {
        document.getElementById("numeroNota").value = nota.numeroNota || nota.numero || ""
        document.getElementById("valor").value = nota.valor || ""
        document.getElementById("dataVencimento").value = (nota.dataVencimento || nota.data_emissao || "").split("T")[0]
        document.getElementById("etiqueta").value = nota.etiqueta || ""
        if (document.getElementById("status")) {
            document.getElementById("status").value = nota.status || "Ativo"
        }
        document.getElementById("emitida").value = nota.emitida ? "true" : "false"
        document.getElementById("urlCloud").value = nota.urlCloud || ""
        document.getElementById("cliente").value = (nota.cliente && nota.cliente.nome) || ""
    }

    /**
     * Manipula o salvamento da nota fiscal
     */
    async handleSaveNota() {
        const form = document.getElementById("notaForm")
        const formData = new FormData(form)
        const notaData = {
            numeroNota: formData.get("numeroNota"),
            valor: formData.get("valor"),
            dataVencimento: formData.get("dataVencimento"),
            etiqueta: formData.get("etiqueta"),
            status: formData.get("status") || "Ativo",
            emitida: formData.get("emitida") === "true",
            urlCloud: formData.get("urlCloud"),
            cliente: { nome: formData.get("cliente") }
        }
        if (!this.validateNotaData(notaData)) return
        try {
            if (this.isEditMode) {
                await fetch(`${API_URL}/${this.currentNotaId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(notaData)
                })
                alert("Nota fiscal atualizada com sucesso!")
            } else {
                await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(notaData)
                })
                alert("Nota fiscal criada com sucesso!")
            }
            this.closeNotaModal()
            this.loadNotasFiscais()
        } catch (error) {
            console.error("Erro ao salvar nota fiscal:", error)
            alert("Erro ao salvar nota fiscal")
        }
    }

    /**
     * Valida os dados da nota fiscal
     * @param {Object} notaData - Dados da nota fiscal
     * @returns {boolean} - true se válido, false se inválido
     */
    validateNotaData(notaData) {
        if (!notaData.numeroNota || !notaData.valor || !notaData.dataVencimento || !notaData.cliente.nome) {
            alert("Preencha todos os campos obrigatórios")
            return false
        }
        return true
    }

    /**
     * Edita uma nota fiscal
     * @param {number} notaId - ID da nota fiscal
     */
    async editNota(notaId) {
        try {
            const res = await fetch(`${API_URL}/${notaId}`)
            if (!res.ok) throw new Error("Nota não encontrada")
            const nota = await res.json()
            this.openNotaModal(nota)
        } catch (error) {
            console.error("Erro ao carregar nota fiscal:", error)
            alert("Erro ao carregar dados da nota fiscal")
        }
    }

    /**
     * Mostra informações detalhadas da nota fiscal
     * @param {number} notaId - ID da nota fiscal
     */
    async showNotaInfo(notaId) {
        try {
            const res = await fetch(`${API_URL}/${notaId}`)
            if (!res.ok) throw new Error("Nota não encontrada")
            const nota = await res.json()
            this.renderNotaInfo(nota)
            document.getElementById("infoNotaModal").classList.add("is-open")
        } catch (error) {
            console.error("Erro ao carregar informações da nota fiscal:", error)
            alert("Erro ao carregar informações")
        }
    }

    /**
     * Renderiza as informações da nota fiscal no modal
     * @param {Object} nota - Dados da nota fiscal
     */
    renderNotaInfo(nota) {
        const container = document.getElementById("infoNotaContent")
        const fields = [
            { key: "numeroNota", label: "Número da Nota" },
            { key: "valor", label: "Valor" },
            { key: "dataVencimento", label: "Data de Vencimento", format: this.formatDate },
            { key: "etiqueta", label: "Etiqueta" },
            { key: "status", label: "Status" },
            { key: "emitida", label: "Emitida", format: (v) => (v ? "Sim" : "Não") },
            { key: "urlCloud", label: "URL Cloud", format: (v) => v ? `<a href="${v}" target="_blank">Link</a>` : '-' },
            { key: "cliente", label: "Cliente", format: (c) => c?.nome || "-" },
        ]
        container.innerHTML = fields.map(field => {
            let value = nota[field.key]
            if (field.key === "numeroNota" && !value) value = nota.numero
            if (field.key === "dataVencimento" && !value) value = nota.data_emissao
            const formattedValue = field.format ? field.format(value) : (value || "-")
            return `<div class="info-item"><div class="info-item__label">${field.label}</div><div class="info-item__value">${formattedValue}</div></div>`
        }).join("")
    }

    /**
     * Fecha o modal de informações
     */
    closeInfoModal() {
        document.getElementById("infoNotaModal").classList.remove("is-open")
    }

    /**
     * Mostra o modal de confirmação para excluir nota fiscal
     * @param {number} notaId - ID da nota fiscal
     */
    async showExcluirModal(notaId) {
        try {
            const res = await fetch(`${API_URL}/${notaId}`)
            if (!res.ok) throw new Error("Nota não encontrada")
            const nota = await res.json()
            this.currentNotaId = notaId
            const message = document.getElementById("excluirNotaMessage")
            message.textContent = `Deseja excluir a nota ${nota.numeroNota} de etiqueta "${nota.etiqueta}"?`
            document.getElementById("excluirNotaModal").classList.add("is-open")
        } catch (error) {
            console.error("Erro ao carregar nota fiscal:", error)
            alert("Erro ao carregar dados da nota fiscal")
        }
    }

    /**
     * Fecha o modal de excluir
     */
    closeExcluirModal() {
        document.getElementById("excluirNotaModal").classList.remove("is-open")
    }

    /**
     * Confirma a exclusão da nota fiscal
     */
    async handleExcluirNota() {
        try {
            await fetch(`${API_URL}/${this.currentNotaId}`, { method: "DELETE" })
            alert("Nota fiscal excluída com sucesso!")
            this.closeExcluirModal()
            this.loadNotasFiscais()
        } catch (error) {
            console.error("Erro ao excluir nota fiscal:", error)
            alert("Erro ao excluir nota fiscal")
        }
    }

    formatDate(dateStr) {
        if (!dateStr) return "-"
        const d = new Date(dateStr)
        return d.toLocaleDateString("pt-BR")
    }
}

// Inicializa o gerenciador quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    window.notasFiscaisManager = new NotasFiscaisManager()
})
