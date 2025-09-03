document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a'); // Melhor usar a classe da nav

    sidebarLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // CORREÇÃO: Extrair o nome do arquivo de ambos os caminhos
        const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        const linkFile = linkPath.substring(linkPath.lastIndexOf('/') + 1);
        
        if (currentFile === linkFile) {
            link.classList.add('active');
            
            const menuText = link.querySelector('.menu-text');
            const menuIcon = link.querySelector('img');

            if (menuText) {
                menuText.classList.remove('menu-text');
                menuText.classList.add('menu-text-active');
            }
            
            if (menuIcon) {
                const iconSrc = menuIcon.getAttribute('src');
                const activeIconSrc = iconSrc.replace('.svg', '_black.svg');
                menuIcon.src = activeIconSrc;
            }
        }
    });
});