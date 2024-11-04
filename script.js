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
const VALOR_MINIMO_LANCE = 1000;

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
    } else if (lance !== null) {
        alert(`O lance deve ser maior que R$ ${lances[item].valor.toFixed(2).replace('.', ',')} + R$ ${VALOR_MINIMO_LANCE}.`);
    }
}

// Atualiza a interface do usuário
function atualizarInterface() {
    for (let item in lances) {
        document.getElementById(`valor-${item.toLowerCase().replace(/ /g, '')}`).innerText = `R$ ${lances[item].valor.toFixed(2).replace('.', ',')}`;
        exibirHistorico(item);
    }
}

// Exibir histórico de lances
function exibirHistorico(item) {
    const historicoElement = document.getElementById(`historico-${item.toLowerCase().replace(/ /g, '')}`);
    historicoElement.innerHTML = `Histórico de lances: ${historicoLances[item].join(', ') || 'Nenhum lance ainda.'}`;
}

// Desabilitar lances ao término
function desabilitarLances() {
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.disabled = true; // Desabilita todos os botões de lance
    });
}

// Chamar a função para iniciar o temporizador
iniciarTemporizador();
