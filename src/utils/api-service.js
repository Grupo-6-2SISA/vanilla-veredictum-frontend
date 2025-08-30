// Configuração da API
const API_BASE_URL = "http://localhost:3001"

// Objeto para gerenciar chamadas da API
const ApiService = {
    baseUrl: API_BASE_URL,

    // Método genérico para fazer requisições
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`
        const config = {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        }

        try {
            console.log(` API Request: ${config.method || "GET"} ${url}`)
            const response = await fetch(url, config)

            if (!response.ok) {
                const errorBody = await response.text()
                console.error(`HTTP error! status: ${response.status}`, errorBody)
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            // Verifica se há conteúdo para parsear
            const contentType = response.headers.get("content-type")
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json()
                console.log(` API Response:`, data)
                return data
            }

            return null
        } catch (error) {
            console.error(` API Error:`, error)
            throw error
        }
    },


    getClientes() {
        return this.request("/clientes")
    },

    getClienteById(id) {
        return this.request(`/clientes/${id}`)
    },

    createCliente(clienteData) {
        return this.request("/clientes/cadastrar-inativo", {
            method: "POST",
            body: JSON.stringify(clienteData),
        })
    },

    updateCliente(id, clienteData) {
        return this.request(`/clientes/${id}`, {
            method: "PUT",
            body: JSON.stringify(clienteData),
        })
    },

    ativarCliente(id) {
        return this.request(`/clientes/${id}/ativar`, {
            method: "PATCH",
        })
    },

    inativarCliente(id) {
        return this.request(`/clientes/${id}/inativar`, {
            method: "PATCH",
        })
    },


    getNotasFiscais() {
        return this.request("/notas-fiscais")
    },

    getNotaFiscalById(id) {
        return this.request(`/notas-fiscais/${id}`)
    },

    createNotaFiscal(notaData) {
        return this.request("/notas-fiscais", {
            method: "POST",
            body: JSON.stringify(notaData),
        })
    },

    updateNotaFiscal(id, notaData) {
        return this.request(`/notas-fiscais/${id}`, {
            method: "PUT",
            body: JSON.stringify(notaData),
        })
    },

    deleteNotaFiscal(id) {
        return this.request(`/notas-fiscais/${id}`, {
            method: "DELETE",
        })
    },

    getNotasMaisAtrasadas() {
        return this.request("/notas-fiscais/mais-atrasadas")
    },

    getNotasMaisRecentes() {
        return this.request("/notas-fiscais/mais-recentes")
    },
}


window.ApiService = ApiService
