document.addEventListener('DOMContentLoaded', function() {

    const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

    // Gráfico de Atendimentos Concluídos
    const atendimentosConcluidosData = {
        labels: meses,
        datasets: [
            {
                label: 'Ano Anterior',
                data: [42, 58, 35, 55, 72, 48, 88, 63, 45, 78, 70, 52],
                backgroundColor: '#333333', // Preto
                borderRadius: 5,
            },
            {
                label: 'Ano Atual',
                data: [10, 18, 55, 40, 75, 77, 22, 83, 90, 62, 36, 95],
                backgroundColor: '#BFBFBF', // Cinza
                borderRadius: 5,
            }
        ]
    };

    const atendimentosConcluidosConfig = {
        type: 'bar',
        data: atendimentosConcluidosData,
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { stepSize: 10 }
                }
            }
        }
    };

    new Chart(
        document.getElementById('atendimentosConcluidosChart').getContext('2d'),
        atendimentosConcluidosConfig
    );

    // Gráfico de Taxa de Cancelamento
    const taxaCancelamentoData = {
        labels: meses,
        datasets: [
            {
                label: 'Ano Anterior',
                data: [20, 42, 58, 35, 72, 48, 88, 63, 45, 78, 70, 52],
                backgroundColor: '#333333',
                borderRadius: 5,
            },
            {
                label: 'Ano Atual',
                data: [10, 31, 18, 55, 40, 77, 22, 83, 90, 62, 36, 95],
                backgroundColor: '#BFBFBF',
                borderRadius: 5,
            }
        ]
    };

    const taxaCancelamentoConfig = {
        type: 'bar',
        data: taxaCancelamentoData,
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { stepSize: 10 }
                }
            }
        }
    };

    new Chart(
        document.getElementById('taxaCancelamentoChart').getContext('2d'),
        taxaCancelamentoConfig
    );

});



// Seletor de Período - Dropdown

document.addEventListener("DOMContentLoaded", () => {
    const selectorHeader = document.getElementById("periodSelector");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const selectedPeriod = document.getElementById("selectedPeriod");
    const kpiCards = document.querySelectorAll(".kpi-card");

    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Dados fictícios dos KPIs para cada período
    // Adicionei uma propriedade 'percentValue' para o valor numérico
    const kpiData = {
        "mesAtual": [
            { value: 4, label: "Contas Atrasadas", change: "+33%", changeDirection: "up", isDanger: true, percent: null, percentValue: null },
            { value: 3, label: "Notas Atrasadas", change: "-25%", changeDirection: "down", isDanger: false, percent: null, percentValue: null },
            { value: 7, label: "Atendimentos Cancelados", change: "+40%", changeDirection: "up", isDanger: false, percent: "20%", percentValue: 20 },
            { value: 28, label: "Atendimentos Concluídos", change: "+12%", changeDirection: "up", isDanger: false, percent: "80%", percentValue: 80 },
        ],
        "3meses": [
            { value: 12, label: "Contas Atrasadas", change: "-10%", changeDirection: "down", isDanger: false, percent: null, percentValue: null },
            { value: 8, label: "Notas Atrasadas", change: "+5%", changeDirection: "up", isDanger: false, percent: null, percentValue: null },
            { value: 20, label: "Atendimentos Cancelados", change: "-15%", changeDirection: "down", isDanger: false, percent: "15%", percentValue: 15 },
            { value: 85, label: "Atendimentos Concluídos", change: "+8%", changeDirection: "up", isDanger: false, percent: "85%", percentValue: 85 },
        ],
        "6meses": [
            { value: 25, label: "Contas Atrasadas", change: "+5%", changeDirection: "up", isDanger: true, percent: null, percentValue: null },
            { value: 15, label: "Notas Atrasadas", change: "+10%", changeDirection: "up", isDanger: false, percent: null, percentValue: null },
            { value: 35, label: "Atendimentos Cancelados", change: "+20%", changeDirection: "up", isDanger: true, percent: "10%", percentValue: 10 },
            { value: 160, label: "Atendimentos Concluídos", change: "-5%", changeDirection: "down", isDanger: false, percent: "90%", percentValue: 90 },
        ],
        "9meses": [
            { value: 30, label: "Contas Atrasadas", change: "-15%", changeDirection: "down", isDanger: false, percent: null, percentValue: null },
            { value: 22, label: "Notas Atrasadas", change: "-10%", changeDirection: "down", isDanger: false, percent: null, percentValue: null },
            { value: 45, label: "Atendimentos Cancelados", change: "+5%", changeDirection: "up", isDanger: true, percent: "8%", percentValue: 8 },
            { value: 250, label: "Atendimentos Concluídos", change: "+3%", changeDirection: "up", isDanger: false, percent: "92%", percentValue: 92 },
        ],
    };

    // Função para atualizar os valores dos KPIs
    const updateKpis = (period) => {
        const data = kpiData[period];
        if (!data) return;

        data.forEach((item, index) => {
            const card = kpiCards[index];
            if (card) {
                const kpiValue = card.querySelector(".kpi-value");
                kpiValue.textContent = item.value;

                // Trata o valor percentual com toFixed
                if (item.percentValue !== null) {
                    // Formata para 2 casas decimais e adiciona o símbolo de %
                    kpiValue.innerHTML += ` <span class="percent">(${item.percentValue.toFixed(2)}%)</span>`;
                }

                card.querySelector(".kpi-label").textContent = item.label;
                
                const kpiChange = card.querySelector(".kpi-change");
                kpiChange.textContent = item.change;
                kpiChange.classList.remove("up", "down");
                kpiChange.classList.add(item.changeDirection);
                
                if (item.isDanger) {
                    card.classList.add("danger");
                } else {
                    card.classList.remove("danger");
                }
            }
        });
    };

    // Funções para o seletor de período (sem mudanças)
    const getPeriodMonths = (numMonths) => {
        const today = new Date();
        const endDate = new Date(today);
        const startDate = new Date(today);
        startDate.setMonth(today.getMonth() - (numMonths - 1));

        const startMonthName = months[startDate.getMonth()];
        const startYear = startDate.getFullYear();
        const endMonthName = months[endDate.getMonth()];
        const endYear = endDate.getFullYear();

        if (numMonths === 1) {
            return `Mês Atual - ${startMonthName} de ${startYear}`;
        }

        if (startYear === endYear) {
            return `${numMonths} meses de análise - (${startMonthName} a ${endMonthName} de ${startYear})`;
        } else {
            return `${numMonths} meses de análise - (${startMonthName} de ${startYear} a ${endMonthName} de ${endYear})`;
        }
    };

    // Inicialização da página
    selectedPeriod.textContent = getPeriodMonths(1);
    updateKpis("mesAtual");

    // Abre/fecha dropdown
    selectorHeader.addEventListener("click", () => {
        dropdownMenu.classList.toggle("show");
        selectorHeader.classList.toggle("active");
    });

    // Seleciona a opção
    dropdownMenu.querySelectorAll("input[name='period']").forEach(input => {
        input.addEventListener("change", () => {
            const selectedValue = input.value;
            let displayValue = "";
            let numMonths = 1;

            if (selectedValue === "mesAtual") {
                displayValue = getPeriodMonths(1);
            } else {
                numMonths = parseInt(selectedValue.replace('meses', ''), 10);
                displayValue = getPeriodMonths(numMonths);
            }

            selectedPeriod.textContent = displayValue;
            updateKpis(selectedValue);
            dropdownMenu.classList.remove("show");
            selectorHeader.classList.remove("active");

            console.log("Período selecionado:", selectedValue);
        });
    });

    // Fecha clicando fora
    document.addEventListener("click", (e) => {
        if (!selectorHeader.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove("show");
            selectorHeader.classList.remove("active");
        }
    });
});


