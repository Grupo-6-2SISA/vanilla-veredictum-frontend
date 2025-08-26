import ApiService from "./api-service.js"
import Utils from "./utils.js"

class ClientesManager {
    constructor() {
        this.currentClienteId = null
        this.isEditMode = false

        this.initializeEventListeners()
        this.setupMasks()
        this.loadClientes()
    }

    /**
     * Inicializa os event listeners da página
     */
    initializeEventListeners() {
        document.getElementById("cadastrarClienteBtn").addEventListener("click", () => this.openClienteModal())
        document.getElementById("fecharModalCliente").addEventListener("click", () => this.closeClienteModal())
        document.getElementById("modalCadastroClienteOverlay").addEventListener("click", () => this.closeClienteModal())
        document.getElementById("formCliente").addEventListener("submit", (e) => {
            e.preventDefault()
            this.handleSaveCliente()
        })
        document.getElementById("fecharModalInfoCliente").addEventListener("click", () => this.closeInfoModal())
        document.getElementById("modalInfoClienteOverlay").addEventListener("click", () => this.closeInfoModal())
        document.getElementById("fecharModalDesativar").addEventListener("click", () => this.closeDesativarModal())
        document.getElementById("modalDesativarClienteOverlay").addEventListener("click", () => this.closeDesativarModal())
        document.getElementById("cancelarDesativacao").addEventListener("click", () => this.closeDesativarModal())
        document.getElementById("confirmarDesativacao").addEventListener("click", () => this.handleDesativarCliente())

        const cepInput = document.getElementById("cep")
        if (cepInput) {
            cepInput.addEventListener("blur", (e) => this.handleCepLookup(e.target.value))
        }
    }

    /**
     * Configura máscaras nos inputs
     */
    setupMasks() {
        // Implementar máscaras se necessário, usando Utils.mask
    }

    /**
     * Carrega e renderiza a lista de clientes
     */
    async loadClientes() {
        try {
            const clientes = await ApiService.getClientes() // Corrigido: busca clientes da API
            this.renderClientesTable(clientes)
        } catch (error) {
            console.error("Erro ao carregar clientes:", error)
            Utils.dom.showToast("Erro ao carregar clientes", "error")
        }
    }

    /**
     * Renderiza a tabela de clientes
     * @param {Array} clientes - Lista de clientes
     */
    renderClientesTable(clientes) {
        const container = document.getElementById("clientsTableBody")
        if (!container) {
            console.error("Elemento clientsTableBody não encontrado!")
            return
        }
        // Renderiza header
        container.innerHTML = `
            <div class="table-header">
                <p class="col-name">Nome</p>
                <p class="col-edit">Editar</p>
                <p class="col-info">Informações</p>
                <p class="col-status">Status</p>
            </div>
        `
        if (!clientes || clientes.length === 0) {
            container.innerHTML += `<div class="table-row"><div style="grid-column: 1 / -1; text-align:center;">Nenhum cliente encontrado</div></div>`
            return
        }
        clientes.forEach((cliente) => {
            container.innerHTML += `
                <div class="table-row">
                    <div class="col-name">${cliente.nome}</div>
                    <div class="col-edit">
                        <button class="action-btn action-btn--edit" data-action="edit" data-id="${cliente.id}">
                            <img src="/assets/svg/edit.svg" alt="Editar">
                        </button>
                    </div>
                    <div class="col-info">
                        <button class="action-btn action-btn--info" data-action="info" data-id="${cliente.id}">
                           <p style="color: #000000"> Ver Mais</p> 
                        </button>
                    </div>
                    <div class="col-status">
                        <label class="toggle">
                            <input type="checkbox" class="toggle__input" data-action="toggle" data-id="${cliente.id}" ${cliente.status === "Ativo" ? "checked" : ""}>
                            <span class="toggle__slider"></span>
                        </label>
                    </div>
                </div>
            `
        })
        this.addTableActionListeners()
    }

    /**
     * Adiciona event listeners aos botões da tabela
     */
    addTableActionListeners() {
        document.querySelectorAll("#clientsTableBody [data-action]").forEach((element) => {
            const action = element.dataset.action
            const id = element.dataset.id

            if (action === "edit") {
                element.addEventListener("click", () => this.editCliente(id))
            } else if (action === "info") {
                element.addEventListener("click", () => this.showClienteInfo(id))
            } else if (action === "toggle") {
                element.addEventListener("change", (e) => {
                    this.toggleClienteStatus(id, e.currentTarget.checked)
                })
            }
        })
    }

    /**
     * Mostra informações detalhadas do cliente
     * @param {number} clienteId - ID do cliente
     */
    async showClienteInfo(clienteId) {
        try {
            const cliente = await ApiService.getClienteById(clienteId)
            this.renderClienteInfo(cliente)
            const modal = document.getElementById("modalInfoCliente")
            modal.classList.add("is-open")
        } catch (error) {
            console.error("Erro ao carregar informações do cliente:", error)
            Utils.dom.showToast("Erro ao carregar informações", "error")
        }
    }

    /**
     * Renderiza as informações do cliente no modal
     * @param {Object} cliente - Dados do cliente
     */
    renderClienteInfo(cliente) {
        const container = document.getElementById("conteudoInfoCliente")

        const fields = [
            { key: "nome", label: "Nome" },
            { key: "email", label: "E-mail" },
            { key: "rg", label: "RG" },
            { key: "cpf", label: "CPF" },
            { key: "telefone", label: "Telefone" },
            { key: "cep", label: "CEP" },
            { key: "logradouro", label: "Logradouro" },
            { key: "bairro", label: "Bairro" },
            { key: "numero", label: "Número" },
            { key: "cidade", label: "Cidade" },
            { key: "inscricaoEstadual", label: "Inscrição Estadual" },
            { key: "indicacao", label: "Indicação" },
            { key: "proBono", label: "Pro-Bono?", format: (v) => (v ? "Sim" : "Não") },
            { key: "status", label: "Status" },
            { key: "descricao", label: "Descrição" },
        ]

        container.innerHTML = fields
            .map((field) => {
                const value = cliente[field.key]
                const formattedValue = field.format ? field.format(value) : value || "-"
                return `
                <div class="info-item">
                    <div class="info-item__label">${field.label}</div>
                    <div class="info-item__value">${formattedValue}</div>
                </div>`
            })
            .join("")
    }

    /**
     * Fecha o modal de informações
     */
    closeInfoModal() {
        const modal = document.getElementById("modalInfoCliente")
        modal.classList.remove("is-open")
    }

    /**
     * Alterna o status do cliente
     * @param {number} clienteId - ID do cliente
     * @param {boolean} isActive - Se o cliente está ativo
     */
    async toggleClienteStatus(clienteId, isActive) {
        if (!isActive) {
            this.showDesativarModal(clienteId)
        } else {
            try {
                await ApiService.ativarCliente(clienteId)
                Utils.dom.showToast("Cliente ativado com sucesso!", "success")
            } catch (error) {
                console.error("Erro ao ativar cliente:", error)
                Utils.dom.showToast("Erro ao ativar cliente", "error")
                this.loadClientes() // Recarrega para reverter o toggle
            }
        }
    }

    /**
     * Mostra o modal de confirmação para desativar cliente
     * @param {number} clienteId - ID do cliente
     */
    async showDesativarModal(clienteId) {
        try {
            const cliente = await ApiService.getClienteById(clienteId)
            this.currentClienteId = clienteId
            const message = document.getElementById("mensagemDesativarCliente")
            message.textContent = `Deseja desativar ${cliente.nome}?`
            const modal = document.getElementById("modalDesativarCliente")
            modal.classList.add("is-open")
        } catch (error) {
            console.error("Erro ao carregar cliente:", error)
            Utils.dom.showToast("Erro ao carregar dados do cliente", "error")
        }
    }

    /**
     * Fecha o modal de desativar
     */
    closeDesativarModal() {
        const modal = document.getElementById("modalDesativarCliente")
        modal.classList.remove("is-open")
    }

    /**
     * Confirma a desativação do cliente
     */
    async handleDesativarCliente() {
        try {
            await ApiService.inativarCliente(this.currentClienteId)
            Utils.dom.showToast("Cliente desativado com sucesso!", "success")
            this.closeDesativarModal()
            this.loadClientes()
        } catch (error) {
            console.error("Erro ao desativar cliente:", error)
            Utils.dom.showToast("Erro ao desativar cliente", "error")
        }
    }

    /**
     * Abre o modal de cliente (cadastro/edição)
     * @param {Object} cliente - Dados do cliente (opcional, para edição)
     */
    openClienteModal(cliente = null) {
        const modal = document.getElementById("modalCadastroCliente")
        const title = document.getElementById("tituloModalCliente")
        const saveBtn = document.getElementById("salvarClienteBtn")
        const form = document.getElementById("formCliente")

        if (cliente) {
            this.isEditMode = true
            this.currentClienteId = cliente.id
            title.textContent = "Editar Cliente"
            saveBtn.textContent = "Salvar"
            this.fillClienteForm(cliente)
        } else {
            this.isEditMode = false
            this.currentClienteId = null
            title.textContent = "Cadastrar Cliente"
            saveBtn.textContent = "Cadastrar"
            form.reset()
        }

        modal.classList.add("is-open")
    }

    /**
     * Fecha o modal de cliente
     */
    closeClienteModal() {
        const modal = document.getElementById("modalCadastroCliente")
        modal.classList.remove("is-open")
        document.getElementById("formCliente").reset()
    }

    /**
     * Preenche o formulário com dados do cliente
     * @param {Object} cliente - Dados do cliente
     */
    fillClienteForm(cliente) {
        const fields = [
            "nome",
            "email",
            "rg",
            "cpf",
            "cnpj",
            "telefone",
            "cep",
            "logradouro",
            "bairro",
            "numero",
            "cidade",
            "inscricaoEstadual",
            "indicacao",
            "status",
            "descricao",
        ]

        fields.forEach((field) => {
            const element = document.getElementById(field)
            if (element) element.value = cliente[field] || ""
        })
        document.getElementById("proBono").value = cliente.proBono ? "true" : "false"
    }

    /**
     * Manipula o salvamento do cliente
     */
    async handleSaveCliente() {
        const form = document.getElementById("formCliente")
        const formData = new FormData(form)
        const clienteData = Object.fromEntries(formData.entries())
        clienteData.proBono = clienteData.proBono === "true"

        if (!this.validateClienteData(clienteData)) return

        try {
            if (this.isEditMode) {
                await ApiService.updateCliente(this.currentClienteId, clienteData)
                Utils.dom.showToast("Cliente atualizado com sucesso!", "success")
            } else {
                await ApiService.createCliente(clienteData)
                Utils.dom.showToast("Cliente cadastrado com sucesso!", "success")
            }

            this.closeClienteModal()
            this.loadClientes()
        } catch (error) {
            console.error("Erro ao salvar cliente:", error)
            Utils.dom.showToast("Erro ao salvar cliente", "error")
        }
    }

    /**
     * Valida os dados do cliente
     * @param {Object} clienteData - Dados do cliente
     * @returns {boolean} - true se válido, false se inválido
     */
    validateClienteData(clienteData) {
        if (!clienteData.nome || !clienteData.email || !clienteData.cpf) {
            Utils.dom.showToast("Preencha todos os campos obrigatórios", "warning")
            return false
        }
        if (!Utils.validators.validateEmail(clienteData.email)) {
            Utils.dom.showToast("Email inválido", "warning")
            return false
        }
        if (!Utils.validators.validateCpf(clienteData.cpf)) {
            Utils.dom.showToast("CPF inválido", "warning")
            return false
        }
        return true
    }

    /**
     * Edita um cliente
     * @param {number} clienteId - ID do cliente
     */
    async editCliente(clienteId) {
        try {
            const cliente = await ApiService.getClienteById(clienteId)
            this.openClienteModal(cliente)
        } catch (error) {
            console.error("Erro ao carregar cliente:", error)
            Utils.dom.showToast("Erro ao carregar dados do cliente", "error")
        }
    }

    /**
     * Busca endereço pelo CEP
     * @param {string} cep - CEP a ser consultado
     */
    async handleCepLookup(cep) {
        const cleanCep = cep.replace(/\D/g, "")
        if (cleanCep.length !== 8) return

        try {
            const address = await Utils.api.getAddressByCep(cleanCep)
            if (address.erro) throw new Error("CEP não encontrado")

            document.getElementById("logradouro").value = address.logradouro || ""
            document.getElementById("bairro").value = address.bairro || ""
            document.getElementById("cidade").value = address.localidade || ""
            Utils.dom.showToast("Endereço encontrado!", "success")
        } catch (error) {
            console.error("Erro ao buscar CEP:", error)
            Utils.dom.showToast("CEP não encontrado", "warning")
        }
    }
}

// Inicializa o gerenciador quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    window.clientesManager = new ClientesManager()
})
