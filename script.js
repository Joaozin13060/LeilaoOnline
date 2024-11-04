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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para atualizar a interface
const updateUI = (item, valor, historico) => {
  document.getElementById(`valor-${item}`).innerText = `Valor atual: R$ ${valor.toFixed(2)}`;
  const historicoElement = document.getElementById(`historico-${item}`);
  historicoElement.innerHTML = `Histórico de lances: ${historico.join(', ') || 'Nenhum lance ainda.'}`;
};

// Função para dar um lance
window.darLance = async (item) => {
  const nomeUsuario = document.getElementById('nomeUsuario').value;
  const lance = prompt(`Digite seu lance para ${item.charAt(0).toUpperCase() + item.slice(1)}:`);

  // Referência do documento no Firestore
  const docRef = doc(db, 'leiloes', item);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const valorAtual = data.valor;
    const historico = data.historico || [];

    // Verifica se o lance é válido
    if (lance && !isNaN(lance) && parseFloat(lance) > valorAtual) {
      const novoValor = parseFloat(lance);
      historico.push(`${nomeUsuario}: R$ ${novoValor.toFixed(2)}`); // Atualiza o histórico

      // Atualiza Firestore
      await setDoc(docRef, {
        valor: novoValor,
        historico: historico
      });

      // Atualiza a interface do usuário
      updateUI(item, novoValor, historico);
    } else {
      alert('Lance inválido! O lance deve ser maior que o valor atual.');
    }
  } else {
    alert('Item não encontrado!');
  }
};

// Configurar o ouvinte para atualizações em tempo real
onSnapshot(collection(db, 'leiloes'), (snapshot) => {
  snapshot.forEach((doc) => {
    const data = doc.data();
    updateUI(doc.id, data.valor, data.historico || []);
  });
});

// Carregar dados do Firestore ao iniciar a página
window.onload = async () => {
  const querySnapshot = await getDocs(collection(db, 'leiloes'));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    updateUI(doc.id, data.valor, data.historico || []);
  });
};