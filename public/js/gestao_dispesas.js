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
        tension: 0
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
                line: {
                    tension: 0 
                },
                point: {
                    hoverBackgroundColor: '#ff6b35',
                    hoverBorderColor: '#ff6b35'
                }
            }
        }
    });
}


function openModal() {
    document.getElementById('expenseModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('expenseModal').style.display = 'none';
    document.getElementById('expenseForm').reset();
}

window.onclick = function (event) {
    const modal = document.getElementById('expenseModal');
    if (event.target === modal) {
        closeModal();
    }
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




function openModal(tipo, data, mensagem, cliente) {
    document.getElementById('modalTipo').value = tipo;
    document.getElementById('modalData').value = data;
    document.getElementById('modalMensagem').value = mensagem;
    document.getElementById('modalCliente').value = cliente || '-';

    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

document.getElementById('modalOverlay').addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});



// ------------------------------ Gestão de despesas - Modal
function openModal() {
    document.getElementById("expenseModal").style.display = "block"
    const today = new Date().toISOString().split("T")[0]
    document.getElementById("expenseDate").value = today
}

function closeModal() {
    document.getElementById("expenseModal").style.display = "none"
    document.getElementById("expenseForm").reset()
}

function addExpense(event) {
    event.preventDefault()

    const label = document.getElementById("expenseLabel").value
    const url = document.getElementById("expenseUrl").value
    const date = document.getElementById("expenseDate").value
    const comment = document.getElementById("expenseComment").value
    const paid = document.querySelector('input[name="expensePaid"]:checked').value === "true"

    // Format date to DD/MM/YYYY
    const formattedDate = new Date(date).toLocaleDateString("pt-BR")

    // Add new expense
    expenses.push({
        label: label,
        date: formattedDate,
        paid: paid,
        url: url,
        comment: comment,
    })

    // Update table and close modal
    updateBillsTable()
    updateMonthTotal()
    closeModal()

    console.log("[v0] New expense added:", { label, date: formattedDate, paid, url, comment })
}

function updateBillsTable() {
    const tbody = document.getElementById("billsTableBody")
    tbody.innerHTML = ""

    expenses.forEach((expense, index) => {
        const row = document.createElement("tr")
        row.innerHTML = `
            <td>${expense.label}</td>
            <td>${expense.date}</td>
            <td><span class="status ${expense.paid ? "paid" : "unpaid"}">${expense.paid ? "Sim" : "Não"}</span></td>
            <td>
                <button class="edit-btn" onclick="togglePaidStatus(${index})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
            </td>
            <td><a href="#" class="info-link" onclick="showExpenseInfo(${index})">Ver mais</a></td>
        `
        tbody.appendChild(row)
    })
}

function togglePaidStatus(index) {
    expenses[index].paid = !expenses[index].paid
    updateBillsTable()
    updateMonthTotal()
    console.log("[v0] Toggled payment status for:", expenses[index].label)
}

function showExpenseInfo(index) {
    const expense = expenses[index]
    let info = `Despesa: ${expense.label}\nData: ${expense.date}\nStatus: ${expense.paid ? "Pago" : "Não Pago"}`

    if (expense.url) {
        info += `\nURL: ${expense.url}`
    }

    if (expense.comment) {
        info += `\nComentário: ${expense.comment}`
    }

    alert(info)
}


// --------------------------

function openModalEdit(btn) {
    // Pega a linha da tabela
    const row = btn.closest('tr');
    // Pega os dados das células
    const etiqueta = row.children[0].textContent.trim();
    const vencimento = row.children[1].textContent.trim().split('/').reverse().join('-'); // dd/mm/yyyy -> yyyy-mm-dd
    const pago = row.children[2].textContent.trim().toLowerCase() === 'sim' ? 'sim' : 'nao';
    // Se quiser buscar URL/comentário de outro lugar, adapte aqui:
    document.getElementById('edit-etiqueta').value = etiqueta;
    document.getElementById('edit-vencimento').value = vencimento;
    document.getElementById('edit-url').value = ''; // Adapte se tiver URL
    document.getElementById('edit-comentario').value = ''; // Adapte se tiver comentário
    document.querySelector('input[name="edit-pago"][value="' + pago + '"]').checked = true;
    document.getElementById('editExpenseModal').style.display = 'flex';
}

function closeModalEdit() {
    document.getElementById('editExpenseModal').style.display = 'none';
}

// Adiciona evento aos botões de edição
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const row = btn.closest('tr');
        const etiqueta = row.children[0].textContent.trim();
        const vencimento = row.children[1].textContent.trim().split('/').reverse().join('-'); // dd/mm/yyyy -> yyyy-mm-dd
        const pago = row.children[2].textContent.trim();
        // Se quiser buscar URL/comentário de outro lugar, adapte aqui:
        openModalEdit(etiqueta, '', vencimento, '', pago);
    });
});

// Fecha ao clicar fora do modal
window.onclick = function (event) {
    const modal = document.getElementById('editExpenseModal');
    if (event.target === modal) {
        closeModalEdit();
    }
}



// ---------------------------------------------------------------------------------------

function modalVerMais(link) {
    const row = link.closest('tr');
    const etiqueta = row.children[0].textContent.trim();
    const vencimento = row.children[1].textContent.trim().split('/').reverse().join('-');
    const pago = row.children[2].textContent.trim().toLowerCase() === 'sim' ? 'sim' : 'nao';

    document.getElementById('info-etiqueta').value = etiqueta;
    document.getElementById('info-vencimento').value = vencimento;
    document.getElementById('info-url').value = '';
    document.getElementById('info-comentario').value = '';
    document.querySelector('input[name="info-pago"][value="sim"]').checked = pago === 'sim';
    document.querySelector('input[name="info-pago"][value="nao"]').checked = pago === 'nao';
    document.getElementById('infoExpenseModal').style.display = 'flex';
}

function closeModalVerMais() {
    document.getElementById('infoExpenseModal').style.display = 'none';
}



/* ========================================================= */
/* Lógica para Seletor de Mês */
/* ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const monthSelectorBtn = document.querySelector('.month-selector-btn');
    const monthPickerPopup = document.getElementById('month-picker');
    const currentMonthDisplay = document.getElementById('current-month-display');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const monthButtonsContainer = document.querySelector('.month-buttons');
    const okBtn = document.getElementById('ok-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const monthDisplaySpan = monthSelectorBtn.querySelector('span');

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    let currentYear = new Date().getFullYear();
    let selectedMonthIndex = new Date().getMonth();

    function renderMonths() {
        monthButtonsContainer.innerHTML = '';
        for (let i = 0; i < 12; i++) {
            const button = document.createElement('button');
            button.textContent = months[i];
            if (i === selectedMonthIndex) {
                button.classList.add('selected');
            }
            button.addEventListener('click', () => {
                selectedMonthIndex = i;
                renderMonths(); // Atualiza a seleção
            });
            monthButtonsContainer.appendChild(button);
        }
        currentMonthDisplay.textContent = `${months[selectedMonthIndex]} ${currentYear}`;
    }

    // Abre o pop-up
    monthSelectorBtn.addEventListener('click', () => {
        monthPickerPopup.classList.remove('hidden');
        renderMonths();
    });

    // Navegação de mês/ano (opcional, pode ser simplificado)
    prevMonthBtn.addEventListener('click', () => {
        currentYear--;
        renderMonths();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentYear++;
        renderMonths();
    });

    // Ações do pop-up
    okBtn.addEventListener('click', () => {
        monthDisplaySpan.textContent = months[selectedMonthIndex];
        monthPickerPopup.classList.add('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        monthPickerPopup.classList.add('hidden');
    });
});

