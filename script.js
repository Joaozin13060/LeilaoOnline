// script.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA4iuj1BIaH9T4jLaDlzVxwaWjunHCdZcI",
  authDomain: "leilao-royal.firebaseapp.com",
  databaseURL: "https://leilao-royal-default-rtdb.firebaseio.com",
  projectId: "leilao-royal",
  storageBucket: "leilao-royal.firebasestorage.app",
  messagingSenderId: "514656806526",
  appId: "1:514656806526:web:6fd5d92c01f5f5a14e1a2f",
  measurementId: "G-CYDFM4P7N4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para atualizar a interface
const updateUI = (item, valor, historico) => {
  document.getElementById(`valor-${item}`).innerText = `Valor atual: R$ ${valor.toFixed(2)}`;
  const historicoElement = document.getElementById(`historico-${item}`);
  historicoElement.innerHTML = `Histórico de lances: ${historico.join(', ') || 'Nenhum lance ainda.'}`;
};

// Definindo a função darLance como global
window.darLance = async (item) => {
  const nomeUsuario = document.getElementById('nomeUsuario').value;
  const lance = prompt(`Digite seu lance para ${item} (Valor atual: R$ ${valorAtual}):`);

  if (lance && !isNaN(lance) && parseFloat(lance) > valorAtual) {
    valorAtual = parseFloat(lance);
    historico.push(`${nomeUsuario}: R$ ${valorAtual.toFixed(2)}`);

    // Atualizar Firestore
    await setDoc(doc(db, 'leiloes', item), {
      valor: valorAtual,
      historico: historico
    });

    updateUI(item, valorAtual, historico);
  } else {
    alert('Lance inválido! O lance deve ser maior que o valor atual.');
  }
}

// Configurar o ouvinte para atualizações em tempo real
const unsubscribe = onSnapshot(collection(db, 'leiloes'), (snapshot) => {
  snapshot.forEach((doc) => {
    const data = doc.data();
    updateUI(doc.id, data.valor, data.historico);
  });
});

// Carregar dados do Firestore ao iniciar a página
window.onload = async () => {
  const querySnapshot = await getDocs(collection(db, 'leiloes'));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    updateUI(doc.id, data.valor, data.historico);
  });
}