document.getElementById('rec-senha-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('ID').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const repetirSenha = document.getElementById('repetir_senha').value.trim();

    if (!id || !email || !senha || !repetirSenha) {
        alert('Preencha todos os campos!');
        return;
    }

    if (senha !== repetirSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    // Busca funcionário pelo id e email
    const response = await fetch(`http://localhost:3000/funcionarios?id=${encodeURIComponent(id)}&email=${encodeURIComponent(email)}`);
    const funcionarios = await response.json();

    if (funcionarios.length === 0) {
        alert('Funcionário não encontrado!');
        return;
    }

    // Atualiza a senha do funcionário
    const funcionario = funcionarios[0];
    const updateResponse = await fetch(`http://localhost:3000/funcionarios/${funcionario.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha })
    });

    if (updateResponse.ok) {
        alert('Senha atualizada com sucesso!');
        window.location.href = './login.html';
    } else {
        alert('Erro ao atualizar senha. Tente novamente.');
    }
});