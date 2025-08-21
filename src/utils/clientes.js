/**
 * Mostra informações detalhadas do cliente
 * @param {number} clienteId - ID do cliente
 */
async function showClienteInfo(clienteId) {
    try {
        const cliente = await ApiService.getClienteById(clienteId)
        renderClienteInfo(cliente)
/**
        const modal = document.getElementById("infoClienteModal")
        modal.classList.add("is-open")
    } catch (error) {
        console.error("Erro ao carregar informações do cliente:", error)
        Utils.dom.showToast("Erro ao carregar informações", "error")
    }
}
let isEditMode = false
/**
 * Renderiza as informações do cliente no modal
 * @param {Object} cliente - Dados do cliente
 */
function renderClienteInfo(cliente) {
    const container = document.getElementById("infoClienteContent")
    document.getElementById("cadastrarClienteBtn").addEventListener("click", () => {
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
        { key: "proBono", label: "Pro-Bono?" },
        { key: "status", label: "Status" },
        { key: "descricao", label: "Descrição" },
    ]
    // Modal informações - fechar
    container.innerHTML = fields
        .map(
            (field) => `
        <div class="info-item">
            <div class="info-item__label">${field.label}</div>
            <div class="info-item__value">${cliente[field.key] || "-"}</div>
        </div>
    `,
        )
        .join("")
}
    document.getElementById("desativarClienteModalOverlay").addEventListener("click", () => {
/**
 * Fecha o modal de informações
 */
function closeInfoModal() {
    const modal = document.getElementById("infoClienteModal")
    modal.classList.remove("is-open")
}
    document.getElementById("confirmarDesativarBtn").addEventListener("click", () => {
/**
 * Alterna o status do cliente
 * @param {number} clienteId - ID do cliente
 * @param {boolean} isActive - Se o cliente está ativo
 */
async function toggleClienteStatus(clienteId, isActive) {
    if (!isActive) {
        // Se está desativando, mostra modal de confirmação
        showDesativarModal(clienteId)
    } else {
        // Se está ativando, faz diretamente
        try {
            await ApiService.ativarCliente(clienteId)
            Utils.dom.showToast("Cliente ativado com sucesso!", "success")
        } catch (error) {
            console.error("Erro ao ativar cliente:", error)
            Utils.dom.showToast("Erro ao ativar cliente", "error")
            loadClientes() // Recarrega para reverter o toggle
        }
    }
}

/**
 * Mostra o modal de confirmação para desativar cliente
 * @param {number} clienteId - ID do cliente
 */
async function showDesativarModal(clienteId) {
    try {
        const cliente = await ApiService.getClienteById(clienteId)
        currentClienteId = clienteId
        console.error("Erro ao carregar clientes:", error)
        const message = document.getElementById("desativarClienteMessage")
        message.textContent = `Deseja desativar ${cliente.nome}?`
}
        const modal = document.getElementById("desativarClienteModal")
        modal.classList.add("is-open")
    } catch (error) {
        console.error("Erro ao carregar cliente:", error)
        Utils.dom.showToast("Erro ao carregar dados do cliente", "error")
    }
}

/**
 * Fecha o modal de desativar
 */
function closeDesativarModal() {
    const modal = document.getElementById("desativarClienteModal")
    modal.classList.remove("is-open")
    loadClientes() // Recarrega para reverter o toggle
}

/**
 * Confirma a desativação do cliente
 */
async function handleDesativarCliente() {
    try {
        await ApiService.inativarCliente(currentClienteId)
                </button>
        Utils.dom.showToast("Cliente desativado com sucesso!", "success")
        closeDesativarModal()
        // O loadClientes já é chamado no closeDesativarModal
    } catch (error) {
        console.error("Erro ao desativar cliente:", error)
        Utils.dom.showToast("Erro ao desativar cliente", "error")
    }
}
                    <input type="checkbox" class="switch__input"
/**
 * Busca endereço pelo CEP
 * @param {string} cep - CEP a ser consultado
 */
async function handleCepLookup(cep) {
    const cleanCep = cep.replace(/\D/g, "")
    if (cleanCep.length !== 8) return
    ,
    try {
        const address = await Utils.api.getAddressByCep(cleanCep)

        if (address.erro) {
            throw new Error("CEP não encontrado")
        }

        // Preenche os campos automaticamente
        document.getElementById("logradouro").value = address.logradouro || ""
        document.getElementById("bairro").value = address.bairro || ""
        document.getElementById("cidade").value = address.localidade || ""
            const id = e.currentTarget.dataset.id
        Utils.dom.showToast("Endereço encontrado!", "success")
    } catch (error) {
        console.error("Erro ao buscar CEP:", error)
        Utils.dom.showToast("CEP não encontrado", "warning")
        })
        if (element.dataset.action === "toggle") {
            element.addEventListener("change", (e) => {
                const id = e.currentTarget.dataset.id
                toggleClienteStatus(id, e.currentTarget.checked)
    initializeEventListeners()
    setupMasks()
    loadClientes()
        }
    })
}

/**
 * Abre o modal de cliente (cadastro/edição)
 * @param {Object} cliente - Dados do cliente (opcional, para edição)
 */
function openClienteModal(cliente = null) {
    const modal = document.getElementById("clienteModal")
    const title = document.getElementById("clienteModalTitle")
    const saveBtn = document.getElementById("salvarClienteBtn")
    const form = document.getElementById("clienteForm")

    if (cliente) {
        // Modo edição
        isEditMode = true
        currentClienteId = cliente.id
        title.textContent = "Editar Cliente"
        saveBtn.textContent = "Salvar"
        fillClienteForm(cliente)
    } else {
        // Modo cadastro
        isEditMode = false
        currentClienteId = null
        title.textContent = "Cadastrar Cliente"
        saveBtn.textContent = "Cadastrar"
        form.reset()
    }

    modal.classList.add("is-open")
}

/**
 * Fecha o modal de cliente
 */
function closeClienteModal() {
    const modal = document.getElementById("clienteModal")
    modal.classList.remove("is-open")
    document.getElementById("clienteForm").reset()
}

/**
 * Preenche o formulário com dados do cliente
 * @param {Object} cliente - Dados do cliente
 */
function fillClienteForm(cliente) {
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
        "proBono",
        "status",
        "descricao",
    ]

    fields.forEach((field) => {
        const element = document.getElementById(field)
        if (element) {
            if (element.type === "checkbox" || element.type === "radio") {
                element.checked = cliente[field]
            } else {
                element.value = cliente[field] || ""
            }
        }
    })
}

/**
 * Manipula o salvamento do cliente
 */
async function handleSaveCliente() {
    const form = document.getElementById("clienteForm")
    const formData = new FormData(form)
    const clienteData = Object.fromEntries(formData.entries())

    // Validações
    if (!validateClienteData(clienteData)) {
        return
    }

    try {
        if (isEditMode) {
            await ApiService.updateCliente(currentClienteId, clienteData)
            Utils.dom.showToast("Cliente atualizado com sucesso!", "success")
        } else {
            await ApiService.createCliente(clienteData)
            Utils.dom.showToast("Cliente cadastrado com sucesso!", "success")
        }

        closeClienteModal()
        loadClientes()
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
function validateClienteData(clienteData) {
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
async function editCliente(clienteId) {
    try {
        const cliente = await ApiService.getClienteById(clienteId)
        openClienteModal(cliente)
    } catch (error) {
        console.error("Erro ao carregar cliente:", error)
        Utils.dom.showToast("Erro ao carregar dados do cliente", "error")
    }
}


            const modal = document.getElementById("infoClienteModal")
            modal.classList.add("is-open")
        } catch (error) {
            console.error("Erro ao carregar informações do cliente:", error)
            Utils.showToast("Erro ao carregar informações", "error")
        }
    }

    /**
     * Renderiza as informações do cliente no modal
     * @param {Object} cliente - Dados do cliente
     */
    renderClienteInfo(cliente) {
        const container = document.getElementById("infoClienteContent")

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
            { key: "proBono", label: "Pro-Bono?" },
            { key: "status", label: "Status" },
            { key: "descricao", label: "Descrição" },
        ]

        container.innerHTML = fields
            .map(
                (field) => `
            <div class="info-item">
                <div class="info-item__label">${field.label}</div>
                <div class="info-item__value">${cliente[field.key] || "-"}</div>
            </div>
        `,
            )
            .join("")
    }

    /**
     * Fecha o modal de informações
     */
    closeInfoModal() {
        const modal = document.getElementById("infoClienteModal")
        modal.classList.remove("is-open")
    }

    /**
     * Alterna o status do cliente
     * @param {number} clienteId - ID do cliente
     * @param {boolean} isActive - Se o cliente está ativo
     */
    async toggleClienteStatus(clienteId, isActive) {
        if (!isActive) {
            // Se está desativando, mostra modal de confirmação
            this.showDesativarModal(clienteId)
        } else {
            // Se está ativando, faz diretamente
            try {
                const cliente = await ApiService.getClienteById(clienteId)
                cliente.status = "Ativo"
                await ApiService.updateCliente(clienteId, cliente)
                Utils.showToast("Cliente ativado com sucesso!", "success")
            } catch (error) {
                console.error("Erro ao ativar cliente:", error)
                Utils.showToast("Erro ao ativar cliente", "error")
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

            const message = document.getElementById("desativarClienteMessage")
            message.textContent = `Deseja desativar ${cliente.nome}?`

            const modal = document.getElementById("desativarClienteModal")
            modal.classList.add("is-open")
        } catch (error) {
            console.error("Erro ao carregar cliente:", error)
            Utils.showToast("Erro ao carregar dados do cliente", "error")
        }
    }

    /**
     * Fecha o modal de desativar
     */
    closeDesativarModal() {
        const modal = document.getElementById("desativarClienteModal")
        modal.classList.remove("is-open")
        this.loadClientes() // Recarrega para reverter o toggle
    }

    /**
     * Confirma a desativação do cliente
     */
    async handleDesativarCliente() {
        try {
            const cliente = await ApiService.getClienteById(this.currentClienteId)
            cliente.status = "Inativo"
            await ApiService.updateCliente(this.currentClienteId, cliente)

            Utils.showToast("Cliente desativado com sucesso!", "success")
            this.closeDesativarModal()
            this.loadClientes()
        } catch (error) {
            console.error("Erro ao desativar cliente:", error)
            Utils.showToast("Erro ao desativar cliente", "error")
        }
    }

    /**
     * Busca endereço pelo CEP
     * @param {string} cep - CEP a ser consultado
     */
    async handleCepLookup(cep) {
        if (!cep || cep.length < 8) return

        try {
            const address = await Utils.getAddressByCep(cep)

            // Preenche os campos automaticamente
            document.getElementById("logradouro").value = address.logradouro || ""
            document.getElementById("bairro").value = address.bairro || ""
            document.getElementById("cidade").value = address.cidade || ""

            Utils.showToast("Endereço encontrado!", "success")
        } catch (error) {
            console.error("Erro ao buscar CEP:", error)
            Utils.showToast("CEP não encontrado", "warning")
        }
    }
}

// Inicializa o gerenciador quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    window.clientesManager = new ClientesManager()
});
