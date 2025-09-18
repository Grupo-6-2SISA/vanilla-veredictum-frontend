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
      
        const userResponse = await fetch(`http://localhost:3000/funcionarios?email=${encodeURIComponent(email)}`);
        const users = await userResponse.json();

        // Verifica se o usuário com o e-mail fornecido existe
        if (!Array.isArray(users) || users.length === 0) {
            Utils.dom.showError('E-mail não cadastrado.');
            return;
        }

        const user = users[0];

        //Comparar a senha fornecida com a senha do usuário
        if (user.senha !== senha) {
            Utils.dom.showError('Senha incorreta.');
            return;
        }

        // Verificar se o usuário está ativo
        if (user.ativo === false) {
            Utils.dom.showError('Usuário inativo. Entre em contato com o suporte.');
            return;
        }

        
        Utils.dom.showSuccess('Login realizado com sucesso!');
        setTimeout(() => window.location.href = './visao_geral.html', 600);
    } catch (err) {
        console.error(err);
        Utils.dom.showError('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    }
    });