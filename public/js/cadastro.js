document.getElementById('cadastro-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    const novoUsuario = {
        nome,
        email,
        senha,
        ativo: false
    };

    const response = await fetch('http://localhost:3000/funcionarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario)
    });

    if (response.ok) {
        alert('Cadastro realizado com sucesso! Aguarde ativação.');
        window.location.href = './login.html';
    } else {
        alert('Erro ao cadastrar. Tente novamente.');
    }
});