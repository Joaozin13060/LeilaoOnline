// Configuração do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const VALOR_MINIMO_LANCE = 1000;

// Define os lances iniciais
let lances = {
    'Mansão de Luxo': { valor: 12000000, contagem: 0 },
    'Iphone 16': { valor: 15000, contagem: 0 },
    'Videogame': { valor: 7000, contagem: 0 }
};

let tempoRestante = 300; // 5 minutos em segundos

// Carregar dados do Firebase
function carregarDados() {
    const lancesRef = ref(database, 'lances');
    onValue(lancesRef, (snapshot) => {
        if (snapshot.exists()) {
            lances = snapshot.val();
            atualizarExibicao();
        } else {
            salvarDados(); // Salva dados iniciais se não existirem
        }
    });
}

// Salvar dados no Firebase
function salvarDados() {
    set(ref(database, 'lances'), lances);
}

// Atualiza a exibição dos lances
function atualizarExibicao() {
    for (let item in lances) {
        document.getElementById(`valor-${item.toLowerCase().replace(/ /g, '')}`).innerText = `R$ ${lances[item].valor.toFixed(2).replace('.', ',')}`;
        document.getElementById(`historico-${item.toLowerCase().replace(/ /g, '')}`).innerText = `Histórico de lances: ${lances[item].historico ? lances[item].historico.join(', ') : 'Nenhum lance ainda.'}`;
    }
}

// Iniciar o temporizador
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

        // Adiciona o lance ao histórico
        if (!lances[item].historico) {
            lances[item].historico = [];
        }
        lances[item].historico.push(`${nomeUsuario}: R$ ${lance}`);
        
        // Atualiza a exibição
        atualizarExibicao();
        
        // Salva os dados no Firebase
        salvarDados();
    } else if (lance !== null) {
        alert(`O lance deve ser maior que R$ ${lances[item].valor.toFixed(2).replace('.', ',')} + R$ ${VALOR_MINIMO_LANCE}.`);
    }
}

// Chame as funções de inicialização
carregarDados();
iniciarTemporizador();
