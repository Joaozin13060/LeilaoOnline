// Importar funções necessárias do SDK
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBsAhR0CKD8xgzDMn83goCWs9sqQwCVcOs",
  authDomain: "leilao-royale.firebaseapp.com",
  databaseURL: "https://leilao-royale-default-rtdb.firebaseio.com",
  projectId: "leilao-royale",
  storageBucket: "leilao-royale.firebasestorage.app",
  messagingSenderId: "813458416009",
  appId: "1:813458416009:web:70454c60db524e834c0158",
  measurementId: "G-F7ZJFKBQJV"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Definições de lance
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

// Carregar dados do Firebase
function carregarDados() {
  const lancesRef = ref(database, 'lances/');
  onValue(lancesRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      lances = data.lances || lances;
      historicoLances = data.historicoLances || historicoLances;
      atualizarInterface();
    }
  });
}

// Salvar dados no Firebase
function salvarDados() {
  set(ref(database, 'lances/'), {
    lances: lances,
    historicoLances: historicoLances
  });
}

// Atualiza a interface do usuário
function atualizarInterface() {
  for (let item in lances) {
    document.getElementById(`valor-${item.toLowerCase().replace(/ /g, '')}`).innerText = `R$ ${lances[item].valor.toFixed(2).replace('.', ',')}`;
    exibirHistorico(item);
  }
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
    historicoLances[item].push(`${nomeUsuario}: R$ ${lance}`);
    atualizarInterface();
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

// Carregar dados na inicialização
carregarDados();
