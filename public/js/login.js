document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    const response = await fetch(`http://localhost:3000/funcionarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&ativo=true`);
    const funcionarios = await response.json();

    if (funcionarios.length === 0) {
        alert('Usuário não encontrado ou inativo!');
        return;
    }

    window.location.href = './visao_geral.html';
});