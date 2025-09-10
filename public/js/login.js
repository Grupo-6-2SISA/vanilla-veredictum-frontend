document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    // Validação de e-mail usando utils.js
    if (!window.Utils.validators.validateEmail(email)) {
        window.Utils.dom.showError('E-mail inválido!');
        return;
    }

    // Busca funcionário pelo email, senha e ativo=true
    const response = await fetch(`http://localhost:3000/funcionarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&ativo=true`);
    const funcionarios = await response.json();

    if (funcionarios.length === 0) {
        alert('Usuário não encontrado ou inativo!');
        return;
    }

    // Login permitido
    window.Utils.dom.showSuccess('Login realizado com sucesso!');
    window.location.href = './visao_geral.html';
});