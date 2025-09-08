document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    const response = await fetch(`http://localhost:3001/usuarios?email=${email}&senha=${senha}`);
    const usuarios = await response.json();

    if (usuarios.length === 0) {
        alert('Usuário ou senha inválidos!');
        return;
    }

    const usuario = usuarios[0];
    if (usuario.ativo !== 'ATIVO') {
        alert('Usuário inativo. Não é possível acessar o sistema.');
        return;
    }

    window.location.href = './visao_geral.html';
});