// Login
document.getElementById('login-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || {};
  if (users[email] && users[email].password === password) {
    localStorage.setItem('loggedUser', email);
    window.location.href = 'pagina.html'; // Redirecionar para a página principal
  } else {
    alert('Usuário ou senha incorretos!');
  }
});

// Cadastro
document.getElementById('register-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('new-email').value;
  const password = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (!email || !password || !confirmPassword) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  if (password !== confirmPassword) {
    alert('As senhas não coincidem!');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || {};
  if (users[email]) {
    alert('Usuário já existe!');
    return;
  }

  users[email] = { password };
  localStorage.setItem('users', JSON.stringify(users));
  alert('Cadastro realizado com sucesso!');
  window.location.href = 'index.html'; // Redirecionar para a página de login
});