    document.getElementById('login-form').addEventListener('submit', async function (event) {
      event.preventDefault();

      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('senha').value.trim();

      if (!Utils.validators.validateEmail(email)) {
        Utils.dom.showError('Por favor, insira um e-mail válido.');
        return;
      }
      if (!senha) {
        Utils.dom.showError('Por favor, insira sua senha.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/funcionarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&ativo=true`);
        const funcionarios = await response.json();

        if (!Array.isArray(funcionarios) || funcionarios.length === 0) {
          Utils.dom.showError('Usuário não encontrado ou inativo!');
          return;
        }

        Utils.dom.showSuccess('Login realizado com sucesso!');
        setTimeout(() => window.location.href = './visao_geral.html', 600);
      } catch (err) {
        console.error(err);
        Utils.dom.showError('Erro ao conectar ao servidor.');
      }
    });