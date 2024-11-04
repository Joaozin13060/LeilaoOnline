// Importando funções do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBsAhR0CKD8xgzDMn83goCWs9sqQwCVcOs",
  authDomain: "leilao-royale.firebaseapp.com",
  databaseURL: "https://leilao-royale-default-rtdb.firebaseio.com",
  projectId: "leilao-royale",
  storageBucket: "leilao-royale.appspot.com",
  messagingSenderId: "813458416009",
  appId: "1:813458416009:web:70454c60db524e834c0158",
  measurementId: "G-F7ZJFKBQJV"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Configuração do leilão
const VALOR_MINIMO_LANCE = 1000; // Valor mínimo do lance
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
  const lancesRef = ref(database, 'lances/');
  onValue(lancesRef, (snapshot) => {
    if (snapshot.exists()) {
      lances = snapshot.val();
    }
  });
}

// Salvar dados no Firebase
function salvarDados() {
  set(ref(database, 'lances/'), lances);
}

// Iniciar temporizador
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

// Iniciar o leilão
function iniciarLeilao() {
  carregarDados();
  iniciarTemporizador();
}

// Dar um lance
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

    // Adicionar lance ao histórico
    historicoLances[item].push(`${nomeUsuario}: R$ ${lance}`);

    // Atualiza a exibição do valor
    document.getElementById(`valor-${item.toLowerCase().replace(/ /g, '')}`).innerText = `R$ ${lances[item].valor.toFixed(2).replace('.', ',')}`;

    // Exibir histórico de lances
    exibirHistorico(item);

    // Mostrar notificação
    mostrarNotificacao(`${nomeUsuario} deu um lance de R$ ${lance} em ${item}.`);

    // Salvar dados no Firebase
    salvarDados();
  } else if (lance !== null) {
    alert(`O lance deve ser maior que R$ ${lances[item].valor.toFixed(2).replace('.', ',')} + R$ ${VALOR_MINIMO_LANCE}.`);
  }
}

// Exibir histórico de lances
function exibirHistorico(item) {
  const historicoElement = document.getElementById(`historico-${item.toLowerCase().replace(/ /g, '')}`);
  historicoElement.innerHTML = `Histórico de lances: ${historicoLances[item].join(', ') || 'Nenhum lance ainda.'}`;
}

// Mostrar notificação
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

// Desabilitar lances
function desabilitarLances() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach(button => {
    button.disabled = true; // Desabilita todos os botões de lance
  });
  determinarVencedores(); // Chama a função para determinar os vencedores
}

// Determinar os vencedores
function determinarVencedores() {
  const vencedores = {};
  for (let item in lances) {
    const maiorLance = Math.max(...historicoLances[item].map(lance => parseFloat(lance.split(': R$ ')[1].replace(',', '.'))));
    const vencedor = historicoLances[item].find(lance => lance.includes(maiorLance));
    vencedores[item] = vencedor;
  }
  alert(`Vencedores:\n${JSON.stringify(vencedores, null, 2)}`);
}

// Iniciar o leilão quando a página for carregada
document.addEventListener("DOMContentLoaded", iniciarLeilao);