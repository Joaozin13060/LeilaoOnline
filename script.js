// Valores iniciais para cada item
const itens = {
    "Mansão de Luxo": { valorAtual: 12000000, historico: [] },
    "Iphone 16": { valorAtual: 15000, historico: [] },
    "Videogame": { valorAtual: 7000, historico: [] }
};

// Função para dar lance em um item
function darLance(item) {
    let nome = prompt("Digite seu nome:");
    
    // Verifica se o nome foi preenchido
    while (!nome) {
        alert("Por favor, insira seu nome para dar um lance.");
        nome = prompt("Digite seu nome:");
    }

    const valorLance = parseFloat(prompt(`Digite o valor do lance para ${item}:`));

    // Verifica se o lance é válido
    if (isNaN(valorLance) || valorLance <= itens[item].valorAtual) {
        alert("Lance inválido! O valor deve ser maior que o valor atual.");
        return;
    }

    // Atualiza o valor atual e o histórico de lances
    itens[item].valorAtual = valorLance;
    itens[item].historico.push({ nome, valor: valorLance });

    // Atualiza a interface
    document.getElementById(`valor-${item.toLowerCase().replace(" ", "")}`).textContent = `Valor atual: R$ ${valorLance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    atualizarHistorico(item);
}

// Função para atualizar o histórico de lances
function atualizarHistorico(item) {
    const historicoDiv = document.getElementById(`historico-${item.toLowerCase().replace(" ", "")}`);
    const historico = itens[item].historico.map(lance => `${lance.nome}: R$ ${lance.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    historicoDiv.textContent = `Histórico de lances: ${historico.length > 0 ? historico.join(", ") : "Nenhum lance ainda."}`;
}
