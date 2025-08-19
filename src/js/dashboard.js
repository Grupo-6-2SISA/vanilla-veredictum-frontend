document.addEventListener('DOMContentLoaded', function() {

    // Dados de exemplo para o gráfico de atendimentos concluídos
    const dadosAtendimentos = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
            label: 'Atendimentos Concluídos',
            data: [30, 45, 28, 50, 40, 65],
            backgroundColor: 'rgba(46, 204, 113, 0.8)', // Cor verde
            borderColor: 'rgba(39, 174, 96, 1)',
            borderWidth: 1,
            borderRadius: 5,
        }]
    };

    // Configuração do gráfico de atendimentos
    const configAtendimentos = {
        type: 'bar', // Tipo de gráfico de barra
        data: dadosAtendimentos,
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: 25
                }
            },
            plugins: {
                legend: {
                    display: false // Oculta a legenda
                },
                tooltip: {
                    // Configuração de tooltip (opcional)
                }
            }
        },
    };

    // Renderiza o primeiro gráfico
    const ctxAtendimentos = document.getElementById('atendimentosConcluidosChart').getContext('2d');
    new Chart(ctxAtendimentos, configAtendimentos);


    // Dados de exemplo para o gráfico de taxa de cancelamento
    const dadosCancelamento = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
            label: 'Taxa de Cancelamento',
            data: [15, 10, 20, 12, 18, 10],
            backgroundColor: 'rgba(231, 76, 60, 0.8)', // Cor vermelha
            borderColor: 'rgba(192, 57, 43, 1)',
            borderWidth: 1,
            tension: 0.4, // Curva suave para o gráfico de linha
        }]
    };

    // Configuração do gráfico de cancelamento
    const configCancelamento = {
        type: 'bar', // Tipo de gráfico de linha
        data: dadosCancelamento,
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: 25 // Sugere um valor máximo para o eixo Y
                }
            },
            plugins: {
                legend: {
                    display: false // Oculta a legenda
                },
                tooltip: {
                    // Configuração de tooltip (opcional)
                }
            }
        },
    };

    // Renderiza o segundo gráfico
    const ctxCancelamento = document.getElementById('taxaCancelamentoChart').getContext('2d');
    new Chart(ctxCancelamento, configCancelamento);
});