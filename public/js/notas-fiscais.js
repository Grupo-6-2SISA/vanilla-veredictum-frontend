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
                let v = e.target.value.replace(/\D/g, "")
                v = (v / 100).toFixed(2) + ""
                v = v.replace(".", ",")
                v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
                e.target.value = `R$ ${v}`
            })
        }
    }

    /**
     * Carrega e renderiza a lista de notas fiscais
     */
    async loadNotasFiscais() {
        try {
            const notas = await window.ApiService.getNotasFiscais()
            this.renderNotasTable(notas)
        } catch (error) {
            console.error("Erro ao carregar notas fiscais:", error)
            window.Utils.dom.showToast("Erro ao carregar notas fiscais", "error")
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
                    <div class="col-name">${nota.numero}</div>
                    <div class="col-etiqueta">${nota.etiqueta || "-"}</div>
                    <div class="col-day">${window.Utils.formatters.formatDate(nota.dataVencimento)}</div>
                    <div class="col-status">${nota.status || '-'}</div>
                    <div class="col-emitida">${nota.emitida ? "Sim" : "Não"}</div>
                    <div class="col-edit">
                        <button class="action-btn action-btn--edit" data-action="edit" data-id="${nota.id}">
                            <img src="../assets/svg/edit.svg" alt="Editar">
                        </button>
                    </div>
                    <div class="col-delete">
                        <button class="action-btn action-btn--delete" data-action="delete" data-id="${nota.id}">
                            <img src="../assets/svg/lixo.svg" alt="Excluir">
                        </button>
                    </div>
                    <div class="col-info">
                        <button class="action-btn action-btn--info" data-action="info" data-id="${nota.id}">
                            <p style="color: #000000;">Ver Mais</p>
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
    async openNotaModal(nota = null) {
        const modal = document.getElementById("notaModal")
        const title = document.getElementById("notaModalTitle")
        const saveBtn = document.getElementById("salvarNotaBtn")
        const form = document.getElementById("notaForm")

        await this.populateClientesSelect()

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
     * Popula o select de clientes
     */
    async populateClientesSelect() {
        const select = document.getElementById("clienteId")
        select.innerHTML = ""
        try {
            const clientes = await window.ApiService.getClientes()
            clientes.forEach(cliente => {
                const option = document.createElement("option")
                option.value = cliente.id
                option.textContent = cliente.nome
                select.appendChild(option)
            })
        } catch (error) {
            console.error("Erro ao popular clientes:", error)
        }
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
        document.getElementById("numero").value = nota.numero
        document.getElementById("valor").value = window.Utils.formatters.formatCurrency(nota.valor)
        document.getElementById("dataVencimento").value = nota.dataVencimento
        document.getElementById("etiqueta").value = nota.etiqueta
        document.getElementById("status").value = nota.status
        document.getElementById("emitida").value = nota.emitida ? "true" : "false"
        document.getElementById("urlNuvem").value = nota.urlNuvem
        document.getElementById("clienteId").value = nota.cliente.id
        document.getElementById("descricao").value = nota.descricao
    }

    /**
     * Manipula o salvamento da nota fiscal
     */
    async handleSaveNota() {
        const form = document.getElementById("notaForm")
        const formData = new FormData(form)

        const clienteId = formData.get("clienteId")
        const cliente = await window.ApiService.getClienteById(clienteId)

        const notaData = {
            numero: formData.get("numero"),
            valor: window.Utils.formatters.unformatCurrency(formData.get("valor")),
            dataVencimento: formData.get("dataVencimento"),
            etiqueta: formData.get("etiqueta"),
            status: formData.get("status"),
            emitida: formData.get("emitida") === "true",
            urlNuvem: formData.get("urlNuvem"),
            cliente: {
                id: cliente.id,
                nome: cliente.nome
            },
            descricao: formData.get("descricao"),
            dataCriacao: new Date().toISOString().split('T')[0] // Adiciona data de criação
        }

        if (!this.validateNotaData(notaData)) return

        try {
            if (this.isEditMode) {
                await window.ApiService.updateNotaFiscal(this.currentNotaId, notaData)
                window.Utils.dom.showToast("Nota fiscal atualizada com sucesso!", "success")
            } else {
                await window.ApiService.createNotaFiscal(notaData)
                window.Utils.dom.showToast("Nota fiscal criada com sucesso!", "success")
            }
            this.closeNotaModal()
            this.loadNotasFiscais()
        } catch (error) {
            console.error("Erro ao salvar nota fiscal:", error)
            window.Utils.dom.showToast("Erro ao salvar nota fiscal", "error")
        }
    }

    /**
     * Valida os dados da nota fiscal
     * @param {Object} notaData - Dados da nota fiscal
     * @returns {boolean} - true se válido, false se inválido
     */
    validateNotaData(notaData) {
        if (!notaData.numero || !notaData.valor || !notaData.dataVencimento || !notaData.cliente.id) {
            window.Utils.dom.showToast("Preencha todos os campos obrigatórios", "warning")
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
            const nota = await window.ApiService.getNotaFiscalById(notaId)
            this.openNotaModal(nota)
        } catch (error) {
            console.error("Erro ao carregar nota fiscal:", error)
            window.Utils.dom.showToast("Erro ao carregar dados da nota fiscal", "error")
        }
    }

    /**
     * Mostra informações detalhadas da nota fiscal
     * @param {number} notaId - ID da nota fiscal
     */
    async showNotaInfo(notaId) {
        try {
            const nota = await window.ApiService.getNotaFiscalById(notaId)
            this.renderNotaInfo(nota)
            document.getElementById("infoNotaModal").classList.add("is-open")
        } catch (error) {
            console.error("Erro ao carregar informações da nota fiscal:", error)
            window.Utils.dom.showToast("Erro ao carregar informações", "error")
        }
    }

    /**
     * Renderiza as informações da nota fiscal no modal
     * @param {Object} nota - Dados da nota fiscal
     */
    renderNotaInfo(nota) {
        const container = document.getElementById("infoNotaContent")
        const fields = [
            { key: "numero", label: "Número da Nota" },
            { key: "valor", label: "Valor", format: window.Utils.formatters.formatCurrency },
            { key: "dataVencimento", label: "Data de Vencimento", format: window.Utils.formatters.formatDate },
            { key: "etiqueta", label: "Etiqueta" },
            { key: "status", label: "Status" },
            { key: "emitida", label: "Emitida", format: (v) => (v ? "Sim" : "Não") },
            { key: "urlNuvem", label: "URL da Nuvem", format: (v) => v ? `<a href="${v}" target="_blank">Link</a>` : '-' },
            { key: "cliente", label: "Cliente", format: (c) => c?.nome || "-" },
            { key: "descricao", label: "Descrição" },
        ]
        container.innerHTML = fields.map(field => {
            const value = nota[field.key]
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
            const nota = await window.ApiService.getNotaFiscalById(notaId)
            this.currentNotaId = notaId
            const message = document.getElementById("excluirNotaMessage")
            message.textContent = `Deseja excluir a nota ${nota.numero} de etiqueta "${nota.etiqueta}"?`
            document.getElementById("excluirNotaModal").classList.add("is-open")
        } catch (error) {
            console.error("Erro ao carregar nota fiscal:", error)
            window.Utils.dom.showToast("Erro ao carregar dados da nota fiscal", "error")
        }
    }


    closeExcluirModal() {
        document.getElementById("excluirNotaModal").classList.remove("is-open")
    }


    async handleExcluirNota() {
        try {
            await window.ApiService.deleteNotaFiscal(this.currentNotaId)
            window.Utils.dom.showToast("Nota fiscal excluída com sucesso!", "success")
            this.closeExcluirModal()
            this.loadNotasFiscais()
        } catch (error) {
            console.error("Erro ao excluir nota fiscal:", error)
            window.Utils.dom.showToast("Erro ao excluir nota fiscal", "error")
        }
    }
}

// Inicializa o gerenciador quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    window.notasFiscaisManager = new NotasFiscaisManager()
})