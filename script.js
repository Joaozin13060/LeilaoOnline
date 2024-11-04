// Defina o valor mínimo do lance
const VALOR_MINIMO_LANCE = 1000;

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

// Carregar dados do Firebase
function carregarDados() {
  const dbRef = firebase.database().ref('/');
  dbRef.once('value').then((snapshot) => {
    if (snapshot.exists()) {
      lances = snapshot.val().lances;
      historicoLances = snapshot.val().historicoLances;
      atualizarExibicao();
    }
  });
}

// Salvar dados no Firebase
function salvarDados() {
  firebase.database().ref('/').set({
    lances: lances,
    historicoLances: historicoLances
  });
}

// Atualizar exibição dos lances
function atualizarExibicao() {
  for (let item in lances) {
    document.getElementById(`valor-${item.toLowerCase().replace(/ /g, '')}`).innerText =
      `R$ ${lances[item].valor.toFixed(2).replace('.', ',')}`;
    exibirHistorico(item);
  }
}

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
    historicoLances[item].push(`${nomeUsuario}: R$ ${lance}`);
    atualizarExibicao();
    mostrarNotificacao(`${nomeUsuario} deu um lance de R$ ${lance} em ${item}.`);
    salvarDados(); // Salvar os dados após dar o lance
  } else if (lance !== null) {
    alert(`O lance deve ser maior que R$ ${lances[item].valor.toFixed(2).replace('.', ',')} + R$ ${VALOR_MINIMO_LANCE}.`);
  }
}

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
  setTimeout(() => {
    areaNotificacao.removeChild(notificacao);
  }, 5000);
}

// Carregar dados ao inicializar
carregarDados();