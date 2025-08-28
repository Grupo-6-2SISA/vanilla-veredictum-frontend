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