// Importar as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const VALOR_MINIMO_LANCE = 1000; // Defina o valor mínimo do lance
let lances = {
  'Mansão de Luxo': { valor: 12000000, contagem: 0, historico: [] },
  'Iphone 16': { valor: 15000, contagem: 0, historico: [] },
  'Videogame': { valor: 7000, contagem: 0, historico: [] }
};

// Atualiza os valores no Realtime Database
function atualizarLancesNoBanco() {
  set(ref(db, 'lances/'), lances);
}

// Carregar dados do Realtime Database
function carregarDadosDoBanco() {
  const lancesRef = ref(db, 'lances/');
  onValue(lancesRef, (snapshot) => {
    if (snapshot.exists()) {
      lances = snapshot.val();
      atualizarExibicaoValores();
    }
  });
}

// Atualiza a exibição dos valores na página
function atualizarExibicaoValores() {
  for (let item in lances) {
    document.getElementById(`valor-${item.toLowerCase().replace(/ /g, '')}`).innerText = `R$ ${lances[item].valor.toFixed(2).replace('.', ',')}`;
    exibirHistorico(item);
  }
}

// Função para dar lance
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
    lances[item].historico.push(`${nomeUsuario}: R$ ${lance}`); // Adiciona o lance ao histórico
    atualizarLancesNoBanco(); // Atualiza o banco de dados com o novo lance
    mostrarNotificacao(`${nomeUsuario} deu um lance de R$ ${lance} em ${item}.`);
  } else if (lance !== null) {
    alert(`O lance deve ser maior que R$ ${lances[item].valor.toFixed(2).replace('.', ',')} + R$ ${VALOR_MINIMO_LANCE}.`);
  }
}

// Função para exibir o histórico de lances
function exibirHistorico(item) {
  const historicoElement = document.getElementById(`historico-${item.toLowerCase().replace(/ /g, '')}`);
  historicoElement.innerHTML = `Histórico de lances: ${lances[item].historico.length > 0 ? lances[item].historico.join(', ') : 'Nenhum lance ainda.'}`;
}

// Função para mostrar notificações
function mostrarNotificacao(mensagem) {
  const areaNotificacao = document.getElementById("notificacao-area");
  const notificacao = document.createElement("div");
  notificacao.textContent = mensagem;
  notificacao.className = "notificacao";
  areaNotificacao.appendChild(notificacao);
  setTimeout(() => { areaNotificacao.removeChild(notificacao); }, 5000);
}

// Carregar dados ao inicializar
carregarDadosDoBanco();