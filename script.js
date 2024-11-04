// Valores iniciais para cada item
const itens = {
  "Mansão de Luxo": { valorAtual: 12000000, historico: [] },
  "Iphone 16": { valorAtual: 15000, historico: [] },
  "Videogame": { valorAtual: 7000, historico: [] }
};

// Função para dar lance em um item
function darLance(item) {
  let nome = document.getElementById("nomeUsuario").value.trim();

  // Verifica se o nome foi preenchido
  if (!nome) {
    alert("Por favor, insira seu nome para dar um lance.");
    return;
  }

  const valorLance = parseFloat(prompt(`Digite o valor do lance para ${item} (deve ser maior que R$ ${itens[item].valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}):`));

  // Verifica se o lance é válido (deve ser maior que o valor atual)
  if (isNaN(valorLance) || valorLance <= itens[item].valorAtual) {
    alert(`Lance inválido! O valor deve ser maior que R$ ${itens[item].valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`);
    return;
  }

  // Atualiza o valor atual e o histórico de lances
  itens[item].valorAtual = valorLance;
  itens[item].historico.push({ nome, valor: valorLance });

  // Atualiza a interface
  atualizarInterface(item);
}

// Função para atualizar a interface com o valor atual e o histórico de lances
function atualizarInterface(item) {
  // Atualiza o valor atual
  document.getElementById(`valor-${item.toLowerCase().replace(" ", "")}`).textContent = `Valor atual: R$ ${itens[item].valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  // Atualiza o histórico de lances
  const historicoDiv = document.getElementById(`historico-${item.toLowerCase().replace(" ", "")}`);
  const historico = itens[item].historico.map(lance => `${lance.nome}: R$ ${lance.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  historicoDiv.textContent = `Histórico de lances: ${historico.length > 0 ? historico.join(", ") : "Nenhum lance ainda."}`;
}