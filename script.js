const VALOR_MINIMO_LANCE = 1000; // Defina o valor mínimo do lance
let lances = {
  'Mansão de Luxo': { valor: 12000000, contagem: 0 },
  'Iphone 16': { valor: 15000, contagem: 0 },
  'Videogame': { valor: 7000, contagem: 0 }
};
let historicoLances = {
  'Mansão de Luxo': [],
  'Iphone 16': [],
  'Videogame': []
};
let tempoRestante = 300; // 5 minutos em segundos

// Carregar dados do localStorage
function carregarDados() {
  const lancesStorage = JSON.parse(localStorage.getItem('lances'));
  const historicoStorage = JSON.parse(localStorage.getItem('historicoLances'));
  if (lancesStorage) {
    lances = lancesStorage;
  }
  if (historicoStorage) {
    historicoLances = historicoStorage;
  }
}

// Salvar dados no localStorage
function salvarDados() {
  localStorage.setItem('lances', JSON.stringify(lances));
  localStorage.setItem('historicoLances', JSON.stringify(historicoLances));
}

function iniciarTemporizador() {
  const intervalo = setInterval(() => {
    tempoRestante--;
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    document.getElementById("temporizador").innerText = `Tempo total restante: ${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
    if (tempoRestante <= 0) {
      clearInterval(intervalo);
      alert("O leilão terminou!");
      desabilitarLances();
    }
  }, 1000);
}

// Chame esta função no carregamento da página
carregarDados();
iniciarTemporizador();

function darLance(item) {
  const nomeUsuario = document.getElementById("nomeUsuario").value;
  if (!nomeUsuario) {
    alert("Por favor, digite seu nome antes de dar um lance.");
    return;
  }
  const lance = prompt(`Qual é o seu lance para ${item}?`);
  if (lance !== null && !isNaN(lance) && parseFloat(lance) >= lances[item].valor + VALOR_MINIMO_LANCE) {
    lances[item].valor = parseFloat(lance);
    lances[item].contagem++;
    // Adiciona o lance ao histórico com o nome do usuário
    historicoLances[item].push(`${nomeUsuario}: R$ ${lance}`);
    // Atualiza o valor exibido
    document.getElementById(`valor-${item.toLowerCase().replace(/ /g, '')}`).innerText = `R$ ${lances[item].valor.toFixed(2).replace('.', ',')}`;
    // Exibe o histórico de lances
    exibirHistorico(item);
    // Mostra a notificação
    mostrarNotificacao(`${nomeUsuario} deu um lance de R$ ${lance} em ${item}.`);
    // Salvar dados após dar lance
    salvarDados();
  } else if (lance !== null) {
    alert(`O lance deve ser maior que R$ ${lances[item].valor.toFixed(2).replace('.', ',')} + R$ ${VALOR_MINIMO_LANCE}.`);
  }
}

// Função para exibir o histórico de lances
function exibirHistorico(item) {
  const historicoElement = document.getElementById(`historico-${item.toLowerCase().replace(/ /g, '')}`);
  historicoElement.innerHTML = `Histórico de lances: ${historicoLances[item].join(', ') || 'Nenhum lance ainda.'}`;
}

function mostrarNotificacao(mensagem) {
  const areaNotificacao = document.getElementById("notificacao-area");
  const notificacao = document.createElement("div");
  notificacao.textContent = mensagem;
  notificacao.className = "notificacao";
  areaNotificacao.appendChild(notificacao);
  // Remove a notificação após 5 segundos
  setTimeout(() => {
    areaNotificacao.removeChild(notificacao);
  }, 5000);
}

function desabilitarLances() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach(button => {
    button.disabled = true; // Desabilita todos os botões de lance
  });
  determinarVencedores(); // Chama a função para determinar os vencedores
}

// Função para determinar os vencedores
function determinarVencedores() {
  const vencedores = {};
  for (let item in lances) {
    const maiorLance = Math.max(...historicoLances[item].map(lance => parseFloat(lance.split(': R$ ')[1].replace(',', '.'))));
    const vencedor = historicoLances[item].find(lance => lance.includes(maiorLance));
    vencedores[item] = vencedor;
  }
  alert(`Vencedores:\n${JSON.stringify(vencedores, null, 2)}`);
}

// Chame a função de carregamento de dados na inicialização
carregarDados();