// Verificar se há usuário logado
let currentUser = localStorage.getItem('currentUser');
const users = JSON.parse(localStorage.getItem('users')) || {};

// Helpers de LocalStorage
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Mudar de aba
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    const activeTab = tab.getAttribute('data-tab');
    tab.classList.add('active');
    document.getElementById(activeTab).classList.add('active');
  });
});

// Login
if (window.location.pathname.includes('index.html')) {
  document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!users[email] || users[email].password !== password) {
      alert('E-mail ou senha inválidos!');
      return;
    }

    currentUser = email;
    localStorage.setItem('currentUser', currentUser);
    window.location.href = 'pagina.html';
  });
}

// Cadastro
if (window.location.pathname.includes('register.html')) {
  document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (users[email]) {
      alert('E-mail já cadastrado!');
      return;
    }

    users[email] = { name, password, treinos: [] };
    saveToLocalStorage('users', users);
    window.location.href = 'index.html';
  });
}

// Página principal (Gestão de Treinos)
if (window.location.pathname.includes('pagina.html')) {
  if (!currentUser) {
    window.location.href = 'index.html';
  }

  const user = users[currentUser];
  document.getElementById('user-name').innerText = `Nome: ${user.name}`;
  document.getElementById('user-email').innerText = `E-mail: ${currentUser}`;

  // Adicionar treino
  document.getElementById('adicionar-treino').addEventListener('click', function() {
    const nome = document.getElementById('treino-nome').value;
    const descricao = document.getElementById('treino-descricao').value;
    const dia = document.getElementById('treino-dia').value;

    if (nome && dia) {
      user.treinos.push({ nome, descricao, dia, concluido: false });
      saveToLocalStorage('users', users);
      console.log("Treino adicionado:", user.treinos); // Verifique se está sendo adicionado corretamente
      displayTreinos();
    }
  });

  // Função para exibir os treinos
  function displayTreinos() {
    const listaTreinos = document.getElementById('treino-lista');
    listaTreinos.innerHTML = ''; // Limpar a lista antes de renderizar

    if (user.treinos.length === 0) {
      listaTreinos.innerHTML = '<p>Nenhum treino adicionado ainda.</p>';
    }

    user.treinos.forEach((treino, pagina) => {
      const treinoElement = document.createElement('div');
      treinoElement.classList.add('treino-item');
      treinoElement.innerHTML = `
        <h3>${treino.nome}</h3>
        <p>${treino.descricao || 'Sem descrição'}</p>
        <p>${treino.dia}</p>
        <button class="concluir-btn" onclick="concluirTreino(${pagina})">Concluir</button>
        <button onclick="removerTreino(${pagina})">Remover</button>
      `;
      if (treino.concluido) {
        treinoElement.classList.add('concluido');
      }
      listaTreinos.appendChild(treinoElement);
    });
  }

  // Função para concluir treino
  function concluirTreino(pagina) {
    user.treinos[pagina].concluido = !user.treinos[pagina].concluido;
    saveToLocalStorage('users', users);
    displayTreinos();
  }

  // Função para remover treino
  function removerTreino(pagina) {
    user.treinos.splice(pagina, 1);
    saveToLocalStorage('users', users);
    displayTreinos();
  }

  // Exibir os treinos ao carregar a página
  displayTreinos();

  // Sair
  document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  });
}