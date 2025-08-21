/**
 * Utilitários JavaScript - Funções auxiliares reutilizáveis
 * Segue os padrões de nomenclatura definidos no projeto
 */

/**
 * Formatadores de dados
 */
const formatters = {
    /**
     * Formata CPF para exibição
     * @param {string} cpf - CPF sem formatação
     * @returns {string} - CPF formatado (000.000.000-00)
     */
    formatCpf(cpf) {
        if (!cpf) return ""
        const cleanCpf = cpf.replace(/\D/g, "")
        return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    },

    /**
     * Formata CNPJ para exibição
     * @param {string} cnpj - CNPJ sem formatação
     * @returns {string} - CNPJ formatado (00.000.000/0000-00)
     */
    formatCnpj(cnpj) {
        if (!cnpj) return ""
        const cleanCnpj = cnpj.replace(/\D/g, "")
        return cleanCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    },

    /**
     * Formata telefone para exibição
     * @param {string} phone - Telefone sem formatação
     * @returns {string} - Telefone formatado ((00)00000-0000)
     */
    formatPhone(phone) {
        if (!phone) return ""
        const cleanPhone = phone.replace(/\D/g, "")
        if (cleanPhone.length === 11) {
            return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3")
        } else if (cleanPhone.length === 10) {
            return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1)$2-$3")
        }
        return phone
    },

    /**
     * Formata CEP para exibição
     * @param {string} cep - CEP sem formatação
     * @returns {string} - CEP formatado (00000-000)
     */
    formatCep(cep) {
        if (!cep) return ""
        const cleanCep = cep.replace(/\D/g, "")
        return cleanCep.replace(/(\d{5})(\d{3})/, "$1-$2")
    },

    /**
     * Formata data para exibição brasileira
     * @param {string} date - Data no formato ISO ou americano
     * @returns {string} - Data formatada (dd/mm/aaaa)
     */
    formatDate(date) {
        if (!date) return ""
        // Adiciona 'T00:00:00' para garantir que a data seja interpretada em UTC
        const dateObj = new Date(date + "T00:00:00")
        return dateObj.toLocaleDateString("pt-BR")
    },

    /**
     * Formata valor monetário
     * @param {number|string} value - Valor numérico
     * @returns {string} - Valor formatado (R$ 0,00)
     */
    formatCurrency(value) {
        if (!value) return "R$ 0,00"
        const numValue =
            typeof value === "string" ? Number.parseFloat(value.replace(/[^\d,.-]/g, "").replace(",", ".")) : value
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(numValue)
    },
}

/**
 * Validadores de dados
 */
const validators = {
    /**
     * Valida CPF
     * @param {string} cpf - CPF para validação
     * @returns {boolean} - True se válido
     */
    validateCpf(cpf) {
        if (!cpf) return false
        const cleanCpf = cpf.replace(/\D/g, "")

        if (cleanCpf.length !== 11) return false
        if (/^(\d)\1{10}$/.test(cleanCpf)) return false

        let sum = 0
        for (let i = 0; i < 9; i++) {
            sum += Number.parseInt(cleanCpf.charAt(i)) * (10 - i)
        }
        let remainder = (sum * 10) % 11
        if (remainder === 10 || remainder === 11) remainder = 0
        if (remainder !== Number.parseInt(cleanCpf.charAt(9))) return false

        sum = 0
        for (let i = 0; i < 10; i++) {
            sum += Number.parseInt(cleanCpf.charAt(i)) * (11 - i)
        }
        remainder = (sum * 10) % 11
        if (remainder === 10 || remainder === 11) remainder = 0
        return remainder === Number.parseInt(cleanCpf.charAt(10))
    },

    /**
     * Valida CNPJ
     * @param {string} cnpj - CNPJ para validação
     * @returns {boolean} - True se válido
     */
    validateCnpj(cnpj) {
        if (!cnpj) return false
        const cleanCnpj = cnpj.replace(/\D/g, "")

        if (cleanCnpj.length !== 14) return false
        if (/^(\d)\1{13}$/.test(cleanCnpj)) return false

        const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

        let sum = 0
        for (let i = 0; i < 12; i++) {
            sum += Number.parseInt(cleanCnpj.charAt(i)) * weights1[i]
        }
        let remainder = sum % 11
        const digit1 = remainder < 2 ? 0 : 11 - remainder

        sum = 0
        for (let i = 0; i < 13; i++) {
            sum += Number.parseInt(cleanCnpj.charAt(i)) * weights2[i]
        }
        remainder = sum % 11
        const digit2 = remainder < 2 ? 0 : 11 - remainder

        return digit1 === Number.parseInt(cleanCnpj.charAt(12)) && digit2 === Number.parseInt(cleanCnpj.charAt(13))
    },

    /**
     * Valida email
     * @param {string} email - Email para validação
     * @returns {boolean} - True se válido
     */
    validateEmail(email) {
        if (!email) return false
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    },

    /**
     * Valida CEP
     * @param {string} cep - CEP para validação
     * @returns {boolean} - True se válido
     */
    validateCep(cep) {
        if (!cep) return false
        const cleanCep = cep.replace(/\D/g, "")
        return cleanCep.length === 8
    },
}

/**
 * Utilitários de DOM
 */
const domUtils = {
    /**
     * Abre modal
     * @param {string} modalId - ID do modal
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId)
        if (modal) {
            modal.classList.add("is-open")
            document.body.style.overflow = "hidden"
        }
    },

    /**
     * Fecha modal
     * @param {string} modalId - ID do modal
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId)
        if (modal) {
            modal.classList.remove("is-open")
            document.body.style.overflow = ""
        }
    },

    /**
     * Limpa formulário
     * @param {string} formId - ID do formulário
     */
    clearForm(formId) {
        const form = document.getElementById(formId)
        if (form) {
            form.reset()
        }
    },

    /**
     * Mostra loading
     * @param {string} elementId - ID do elemento
     */
    showLoading(elementId) {
        const element = document.getElementById(elementId)
        if (element) {
            element.classList.add("is-loading")
        }
    },

    /**
     * Esconde loading
     * @param {string} elementId - ID do elemento
     */
    hideLoading(elementId) {
        const element = document.getElementById(elementId)
        if (element) {
            element.classList.remove("is-loading")
        }
    },

    /**
     * Exibe mensagem de erro
     * @param {string} message - Mensagem de erro
     */
    showError(message) {
        this.showToast(message, "error")
    },

    /**
     * Exibe mensagem de sucesso
     * @param {string} message - Mensagem de sucesso
     */
    showSuccess(message) {
        this.showToast(message, "success")
    },

    /**
     * Exibe um toast de notificação
     * @param {string} message - A mensagem a ser exibida
     * @param {string} type - O tipo de toast ('success', 'error', 'warning')
     */
    showToast(message, type = "info") {
        const toastContainer =
            document.getElementById("toast-container") ||
            (() => {
                const container = document.createElement("div")
                container.id = "toast-container"
                document.body.appendChild(container)
                return container
            })()

        const toast = document.createElement("div")
        toast.className = `toast toast--${type}`
        toast.textContent = message

        toastContainer.appendChild(toast)

        setTimeout(() => {
            toast.classList.add("toast--visible")
        }, 10)

        setTimeout(() => {
            toast.classList.remove("toast--visible")
            setTimeout(() => {
                toast.remove()
            }, 500)
        }, 3000)
    },
}

/**
 * Utilitários de máscara para inputs
 */
const maskUtils = {
    /**
     * Aplica máscara de CPF
     * @param {HTMLInputElement} input - Input element
     */
    applyCpfMask(input) {
        input.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "")
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
            e.target.value = value
        })
    },

    /**
     * Aplica máscara de CNPJ
     * @param {HTMLInputElement} input - Input element
     */
    applyCnpjMask(input) {
        input.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "")
            value = value.replace(/(\d{2})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1/$2")
            value = value.replace(/(\d{4})(\d{1,2})$/, "$1-$2")
            e.target.value = value
        })
    },

    /**
     * Aplica máscara de telefone
     * @param {HTMLInputElement} input - Input element
     */
    applyPhoneMask(input) {
        input.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "")
            value = value.slice(0, 11) // Limita a 11 dígitos
            if (value.length > 10) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3")
            } else if (value.length > 5) {
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3")
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d*)/, "($1) $2")
            } else {
                value = value.replace(/^(\d*)/, "($1)")
            }
            e.target.value = value
        })
    },

    /**
     * Aplica máscara de CEP
     * @param {HTMLInputElement} input - Input element
     */
    applyCepMask(input) {
        input.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "")
            value = value.replace(/(\d{5})(\d)/, "$1-$2")
            e.target.value = value.slice(0, 9) // Limita a 9 caracteres (XXXXX-XXX)
        })
    },
}

/**
 * Utilitários de API externa
 */
const apiUtils = {
    /**
     * Busca endereço pelo CEP usando a API ViaCEP
     * @param {string} cep - CEP (apenas números)
     * @returns {Promise<object>} - Dados do endereço
     */
    async getAddressByCep(cep) {
        const url = `https://viacep.com.br/ws/${cep}/json/`
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error("Erro ao buscar CEP")
        }
        return response.json()
    },
}

const Utils = {
    formatters,
    validators,
    dom: domUtils,
    mask: maskUtils,
    api: apiUtils,
}

export default Utils

