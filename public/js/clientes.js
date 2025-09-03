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
            const clientes = await window.ApiService.getClientes()
            this.renderClientesTable(clientes)
        } catch (error) {
            console.error("Erro ao carregar clientes:", error)
            window.Utils.dom.showToast("Erro ao carregar clientes", "error")
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
                            <img src="../assets/svg/edit.svg" alt="Editar">
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
            const cliente = await window.ApiService.getClienteById(clienteId)
            this.renderClienteInfo(cliente)
            const modal = document.getElementById("modalInfoCliente")
            modal.classList.add("is-open")
        } catch (error) {
            console.error("Erro ao carregar informações do cliente:", error)
            window.Utils.dom.showToast("Erro ao carregar informações", "error")
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
            { key: "cpf", label: "CPF", format: window.Utils.formatters.formatCpf },
            { key: "telefone", label: "Telefone", format: window.Utils.formatters.formatPhone },
            { key: "dataNascimento", label: "Data de Nascimento", format: window.Utils.formatters.formatDate },
            { key: "dataInicio", label: "Data de Início", format: window.Utils.formatters.formatDate },
            { key: "cep", label: "CEP", format: window.Utils.formatters.formatCep },
            { key: "logradouro", label: "Logradouro" },
            { key: "numero", label: "Número" },
            { key: "complemento", label: "Complemento" },
            { key: "bairro", label: "Bairro" },
            { key: "localidade", label: "Localidade" },
            { key: "isJuridico", label: "Pessoa Jurídica?", format: (v) => (v ? "Sim" : "Não") },
            { key: "cnpj", label: "CNPJ", format: window.Utils.formatters.formatCnpj },
            { key: "inscricaoEstadual", label: "Inscrição Estadual" },
            { key: "indicacao", label: "Indicação" },
            { key: "proBono", label: "Pro-Bono?", format: (v) => (v ? "Sim" : "Não") },
            { key: "status", label: "Status" },
            { key: "descricao", label: "Descrição", fullWidth: true },
        ]

        container.innerHTML = fields
            .map((field) => {
                const value = cliente[field.key]
                const formattedValue = field.format ? field.format(value) : value || "-"
                const fullWidthClass = field.fullWidth ? "info-item--full" : ""
                return `
                <div class="info-item ${fullWidthClass}">
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
                await window.ApiService.ativarCliente(clienteId)
                window.Utils.dom.showToast("Cliente ativado com sucesso!", "success")
                this.loadClientes()
            } catch (error) {
                console.error("Erro ao ativar cliente:", error)
                window.Utils.dom.showToast("Erro ao ativar cliente", "error")
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
            const cliente = await window.ApiService.getClienteById(clienteId)
            this.currentClienteId = clienteId
            const message = document.getElementById("mensagemDesativarCliente")
            message.textContent = `Deseja desativar ${cliente.nome}?`
            const modal = document.getElementById("modalDesativarCliente")
            modal.classList.add("is-open")
        } catch (error) {
            console.error("Erro ao carregar cliente:", error)
            window.Utils.dom.showToast("Erro ao carregar dados do cliente", "error")
        }
    }

    /**
     * Fecha o modal de desativar
     */
    closeDesativarModal() {
        const modal = document.getElementById("modalDesativarCliente")
        modal.classList.remove("is-open")
        this.loadClientes()
    }

    /**
     * Confirma a desativação do cliente
     */
    async handleDesativarCliente() {
        try {
            await window.ApiService.inativarCliente(this.currentClienteId)
            window.Utils.dom.showToast("Cliente desativado com sucesso!", "success")
            this.closeDesativarModal()
            this.loadClientes()
        } catch (error) {
            console.error("Erro ao desativar cliente:", error)
            window.Utils.dom.showToast("Erro ao desativar cliente", "error")
        }
    }

    /**
     * Abre o modal de cliente (cadastro/edição)
     * @param {Object} cliente - Dados do cliente (opcional, para edição)
     */
    async openClienteModal(cliente = null) {
        const modal = document.getElementById("modalCadastroCliente")
        const title = document.getElementById("tituloModalCliente")
        const saveBtn = document.getElementById("salvarClienteBtn")
        const form = document.getElementById("formCliente")

        await this.populateIndicacaoSelect()

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
     * Popula o select de indicação com os clientes
     */
    async populateIndicacaoSelect() {
        const select = document.getElementById("indicacao")
        select.innerHTML = '<option value="">Selecione um cliente</option>'
        try {
            const clientes = await window.ApiService.getClientes()
            clientes.forEach(cliente => {
                const option = document.createElement("option")
                option.value = cliente.id
                option.textContent = cliente.nome
                select.appendChild(option)
            })
        } catch (error) {
            console.error("Erro ao popular indicações:", error)
        }
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
        document.getElementById("nome").value = cliente.nome || ""
        document.getElementById("email").value = cliente.email || ""
        document.getElementById("telefone").value = cliente.telefone || ""
        document.getElementById("cpf").value = cliente.cpf || ""
        document.getElementById("rg").value = cliente.rg || ""
        document.getElementById("dataNascimento").value = cliente.dataNascimento || ""
        document.getElementById("cep").value = cliente.cep || ""
        document.getElementById("logradouro").value = cliente.logradouro || ""
        document.getElementById("numero").value = cliente.numero || ""
        document.getElementById("bairro").value = cliente.bairro || ""
        document.getElementById("localidade").value = cliente.localidade || ""
        document.getElementById("complemento").value = cliente.complemento || ""
        document.getElementById("dataInicio").value = cliente.dataInicio || ""
        document.getElementById("indicacao").value = cliente.indicacao || ""
        document.getElementById("isJuridico").value = cliente.isJuridico ? "true" : "false"
        document.getElementById("cnpj").value = cliente.cnpj || ""
        document.getElementById("inscricaoEstadual").value = cliente.inscricaoEstadual || ""
        document.getElementById("proBono").value = cliente.proBono ? "true" : "false"
        document.getElementById("descricao").value = cliente.descricao || ""
    }

    /**
     * Manipula o salvamento do cliente
     */
    async handleSaveCliente() {
        const form = document.getElementById("formCliente")
        const formData = new FormData(form)
        const clienteData = Object.fromEntries(formData.entries())
        clienteData.proBono = clienteData.proBono === "true"
        clienteData.isJuridico = clienteData.isJuridico === "true"
        clienteData.status = "Ativo" // Default status

        if (!this.validateClienteData(clienteData)) return

        try {
            if (this.isEditMode) {
                await window.ApiService.updateCliente(this.currentClienteId, clienteData)
                window.Utils.dom.showToast("Cliente atualizado com sucesso!", "success")
            } else {
                await window.ApiService.createCliente(clienteData)
                window.Utils.dom.showToast("Cliente cadastrado com sucesso!", "success")
            }

            this.closeClienteModal()
            this.loadClientes()
        } catch (error) {
            console.error("Erro ao salvar cliente:", error)
            window.Utils.dom.showToast("Erro ao salvar cliente", "error")
        }
    }

    /**
     * Valida os dados do cliente
     * @param {Object} clienteData - Dados do cliente
     * @returns {boolean} - true se válido, false se inválido
     */
    validateClienteData(clienteData) {
        if (!clienteData.nome || !clienteData.email || !clienteData.cpf) {
            window.Utils.dom.showToast("Preencha todos os campos obrigatórios", "warning")
            return false
        }
        if (!window.Utils.validators.validateEmail(clienteData.email)) {
            window.Utils.dom.showToast("Email inválido", "warning")
            return false
        }
        if (!window.Utils.validators.validateCpf(clienteData.cpf)) {
            window.Utils.dom.showToast("CPF inválido", "warning")
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
            const cliente = await window.ApiService.getClienteById(clienteId)
            this.openClienteModal(cliente)
        } catch (error) {
            console.error("Erro ao carregar cliente:", error)
            window.Utils.dom.showToast("Erro ao carregar dados do cliente", "error")
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
            document.getElementById("localidade").value = address.localidade || ""
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