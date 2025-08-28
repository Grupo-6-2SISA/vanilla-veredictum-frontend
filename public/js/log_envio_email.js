document.addEventListener('DOMContentLoaded', () => {
    // Dados de exemplo (mantidos os mesmos)
    const data = {
        appointments: [
            { name: 'Davidson Mendes', day: '09/06/2025', time: '14:00' },
            { name: 'Gabriel Cordeiro', day: '09/06/2025', time: '17:30' },
        ],
        invoices: [
            { number: '034567890987654321001', dueDate: '11/06/2025' },
            { number: '234567890987654321002', dueDate: '13/06/2025' },
        ],
        birthdays: [
            { name: 'Manuela Monteiro', day: '21/06/2025' },
            { name: 'Luiz Gustavo Dantas', day: '27/06/2025' },
        ],
        bills: [
            { label: 'Água', dueDate: '09/07/2025' },
            { label: 'Luz', dueDate: '09/07/2025' },
        ]
    };

    // **FUNÇÃO MODIFICADA:** Agora ela cria divs em vez de tabelas
    const populateList = (listId, items, columns) => {
        const listContainer = document.getElementById(listId);
        listContainer.innerHTML = ''; // Limpa o conteúdo existente

        items.forEach(item => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-item');

            columns.forEach(key => {
                const infoP = document.createElement('p');
                infoP.textContent = item[key];
                listItem.appendChild(infoP);
            });
            listContainer.appendChild(listItem);
        });
    };

    // Popula todas as listas com os dados, chamando a nova função
    populateList('appointments-list', data.appointments, ['name', 'day', 'time']);
    populateList('invoices-list', data.invoices, ['number', 'dueDate']);
    populateList('birthdays-list', data.birthdays, ['name', 'day']);
    populateList('bills-list', data.bills, ['label', 'dueDate']);

    // Funcionalidade de toggle para os cards (mantida a mesma, pois não mudou a estrutura do cabeçalho)
    const toggleButtons = document.querySelectorAll('.toggle-button');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.card');
            const content = card.querySelector('.card-content');

            button.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        });
    });
});




let expenseChart;


const chartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
    datasets: [{
        label: 'Gastos Mensais',
        data: [150, 205, 180, 120, 190, 321, 173, 156, 180, 212],
        borderColor: '#333',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointBackgroundColor: '#333',
        pointBorderColor: '#333',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4
    }]
};


document.addEventListener('DOMContentLoaded', function () {
    initializeChart();
});

function initializeChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');

    expenseChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        color: '#666',
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#666',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            elements: {
                point: {
                    hoverBackgroundColor: '#ff6b35',
                    hoverBorderColor: '#ff6b35'
                }
            }
        }
    });
}


function addExpense(event) {
    event.preventDefault();

    const label = document.getElementById('expenseLabel').value;
    const date = document.getElementById('expenseDate').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const paid = document.getElementById('expensePaid').value === 'true';

    const formattedDate = new Date(date).toLocaleDateString('pt-BR');

    const tableBody = document.getElementById('billsTableBody');
    const newRow = tableBody.insertRow();

    newRow.innerHTML = `
        <td>${label}</td>
        <td>${formattedDate}</td>
        <td><span class="status ${paid ? 'paid' : 'unpaid'}">${paid ? 'Sim' : 'Não'}</span></td>
        <td>
            <button class="edit-btn" onclick="editExpense(this)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
            </button>
        </td>
        <td><a href="#" class="info-link">Ver mais</a></td>
    `;

    updateMonthlyTotal(amount);

    closeModal();

    alert('Despesa adicionada com sucesso!');
}

function updateMonthlyTotal(amount) {
    const currentTotal = parseFloat(document.getElementById('monthTotal').textContent.replace(',', '.'));
    const newTotal = currentTotal + amount;
    document.getElementById('monthTotal').textContent = newTotal.toFixed(2).replace('.', ',');
}


function editExpense(button) {
    const row = button.closest('tr');
    const cells = row.cells;

    const label = cells[0].textContent;
    const isPaid = cells[2].querySelector('.status').textContent === 'Sim';

    const newStatus = !isPaid;
    const statusElement = cells[2].querySelector('.status');

    statusElement.textContent = newStatus ? 'Sim' : 'Não';
    statusElement.className = `status ${newStatus ? 'paid' : 'unpaid'}`;

    alert(`Status da despesa "${label}" alterado para: ${newStatus ? 'Pago' : 'Não Pago'}`);
}


function updateMonth() {
    const selectedMonth = document.getElementById('monthSelect').value;

    const monthlyTotals = {
        'janeiro': '98,45',
        'fevereiro': '156,78',
        'março': '203,21',
        'abril': '89,67',
        'maio': '145,33',
        'junho': '124,33',
        'julho': '178,90',
        'agosto': '134,56',
        'setembro': '167,89',
        'outubro': '198,45',
        'novembro': '123,67',
        'dezembro': '234,78'
    };

    document.getElementById('monthTotal').textContent = monthlyTotals[selectedMonth] || '0,00';
}

document.addEventListener('DOMContentLoaded', function () {

    const tableRows = document.querySelectorAll('.bills-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function () {
            this.style.backgroundColor = '#f8f9fa';
        });

        row.addEventListener('mouseleave', function () {
            this.style.backgroundColor = '';
        });
    });


});



function toggleSwitch(element) {
    if (element.classList.contains('active')) {
        element.classList.remove('active');
        element.classList.add('inactive');
    } else {
        element.classList.remove('inactive');
        element.classList.add('active');
    }
}



document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});



// ------------------------------ Painel de Controle - Modal
function openModalVerMais() {
    document.getElementById("modalVerMais").style.display = "flex";
}

function closeModalVerMais() {
    document.getElementById("modalVerMais").style.display = "none";
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModalVerMais();
    }
});