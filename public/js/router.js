import {inilializeMenu} from './menu.js';
import {inilializeDashboard} from './dashboard.js';
import {inilializeVisaoGeral} from './visao_geral';


document.addEventListener('DOMContentLoaded', () => {
    // Exemplo de como você poderia usar uma rota
    const path = window.location.pathname;

    if (path.includes('./visao_geral.html')) {
        initializeVisaoGeral();
    } else if (path.includes('./dashboard.html')) {
        initializeSidebar();
    } else if (path.includes('./menu.js')) {
        initializeMenu();
    } else {
        // Inicializa ambos para a página principal
        initializeDashboard();
        initializeSidebar();
        initializeMenu();
    }
});