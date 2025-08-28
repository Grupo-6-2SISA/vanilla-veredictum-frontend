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



document.addEventListener("DOMContentLoaded", () => {
  const selectorHeader = document.getElementById("periodSelector");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const selectedPeriod = document.getElementById("selectedPeriod");

  // Abre/fecha dropdown
  selectorHeader.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
    selectorHeader.classList.toggle("active");
  });

  // Seleciona a opção
  dropdownMenu.querySelectorAll("input[name='period']").forEach(input => {
    input.addEventListener("change", () => {
      selectedPeriod.textContent = input.nextElementSibling.textContent;
      dropdownMenu.classList.remove("show");
      selectorHeader.classList.remove("active");

      // Aqui você pode atualizar os gráficos com base no período
      console.log("Período selecionado:", input.value);
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


