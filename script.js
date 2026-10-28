
const perguntas = [
  "Você era próximo da vítima?",
  "Você esteve próximo à cena do crime nos últimos 10 dias?",
  "Você sabe qual foi a arma do crime?",
  "Você já mentiu quando era criança para não sofrer as consequências de determinadas ações?",
  "Você já cometeu um crime anteriormente?",
  "Você sabe onde era a casa da vítima?",
  "Existe algo que motivaria você a cometer um crime semelhante a esse?",
  "Você esteve no mesmo local que a vítima nos últimos 20 dias?",
  "Você possui porte de armas?",
  "Você conhece a família da vítima?"
];


let respostas = [];      
let perguntaAtual = 0;
let respostasSim = 0;    


const etapaPerguntas = document.getElementById("etapa-perguntas");
const etapaFinal = document.getElementById("etapa-final");
const etapaResultado = document.getElementById("etapa-resultado");
const perguntaTexto = document.getElementById("pergunta-texto");
const progressoTexto = document.getElementById("progresso-texto");
const progressoBarra = document.getElementById("progresso-barra");
const botaoSim = document.getElementById("botao-sim");
const botaoNao = document.getElementById("botao-nao");
const botaoFinalizar = document.getElementById("botao-finalizar");
const botaoReiniciar = document.getElementById("botao-reiniciar");
const tracoLinha = document.getElementById("traco-linha");
const classificacaoEl = document.getElementById("classificacao");
const totalSimEl = document.getElementById("total-sim");
const mensagemEl = document.getElementById("mensagem-resultado");
const revisaoEl = document.getElementById("revisao");

let pontosTraco = [];

function desenharTraco() {
  const largura = 600;
  const meio = 28;
  const passo = largura / (perguntas.length * 4);
  let caminho = "M0 " + meio;


  for (let i = 0; i < pontosTraco.length; i++) {
    const x = (i + 1) * passo;
    caminho += " L" + x.toFixed(1) + " " + pontosTraco[i].toFixed(1);
  }
  caminho += " L" + largura + " " + meio;
  tracoLinha.setAttribute("d", caminho);
}

function registrarNoTraco(foiSim) {
  const amplitude = foiSim ? 20 : 6;
  for (let i = 0; i < 4; i++) {
    const direcao = i % 2 === 0 ? -1 : 1;
    const variacao = amplitude * (0.6 + Math.random() * 0.4);
    pontosTraco.push(28 + direcao * variacao);
  }
  desenharTraco();
}

function mostrarPergunta() {
  perguntaTexto.textContent = perguntas[perguntaAtual];
  progressoTexto.textContent = "Pergunta " + (perguntaAtual + 1) + " de " + perguntas.length;
  progressoBarra.style.width = ((perguntaAtual + 1) / perguntas.length * 100) + "%";
}

function responder(foiSim) {
  respostas[perguntaAtual] = foiSim;
  registrarNoTraco(foiSim);
  perguntaAtual++;

  if (perguntaAtual < perguntas.length) {
    mostrarPergunta();
  } else {
    etapaPerguntas.hidden = true;
    etapaFinal.hidden = false;
    botaoFinalizar.focus();
  }
}


function finalizarTeste() {
  respostasSim = 0;
  for (let i = 0; i < respostas.length; i++) {
    if (respostas[i] === true) {
      respostasSim++;
    }
  }

  let classificacao;
  let mensagem;
  let nivel;

  if (respostasSim < 5) {
    classificacao = "Inocente";
    mensagem = "O traçado ficou estável. Nada aqui liga você à ocorrência. Está liberado.";
    nivel = "inocente";
  } else if (respostasSim === 5) {
    classificacao = "Suspeito";
    mensagem = "O traçado oscilou na medida certa para despertar dúvida. Fique à disposição da investigação.";
    nivel = "suspeito";
  } else if (respostasSim <= 8) {
    classificacao = "Cúmplice";
    mensagem = "Reações demais para quem diz não saber de nada. Há fortes indícios de que você ajudou de alguma forma.";
    nivel = "cumplice";
  } else {
    classificacao = "Culpado";
    mensagem = "O traçado não deixa margem para dúvida. Patrick Jane já sabia desde a primeira pergunta.";
    nivel = "culpado";
  }


  classificacaoEl.textContent = classificacao;
  totalSimEl.textContent = respostasSim;
  mensagemEl.textContent = mensagem;
  etapaResultado.dataset.nivel = nivel;


  revisaoEl.innerHTML = "";
  for (let i = 0; i < perguntas.length; i++) {
    const item = document.createElement("li");
    const texto = document.createElement("span");
    const marca = document.createElement("strong");

    texto.textContent = perguntas[i];
    marca.textContent = respostas[i] ? "Sim" : "Não";
    marca.className = respostas[i] ? "resp-sim" : "resp-nao";

    item.appendChild(texto);
    item.appendChild(marca);
    revisaoEl.appendChild(item);
  }

  etapaFinal.hidden = true;
  etapaResultado.hidden = false;
  classificacaoEl.setAttribute("tabindex", "-1");
  classificacaoEl.focus();
}

function reiniciar() {
  respostas = [];
  perguntaAtual = 0;
  respostasSim = 0;
  pontosTraco = [];
  desenharTraco();

  etapaResultado.hidden = true;
  etapaFinal.hidden = true;
  etapaPerguntas.hidden = false;
  mostrarPergunta();
  botaoSim.focus();
}


botaoSim.addEventListener("click", function () { responder(true); });
botaoNao.addEventListener("click", function () { responder(false); });
botaoFinalizar.addEventListener("click", finalizarTeste);
botaoReiniciar.addEventListener("click", reiniciar);

document.addEventListener("keydown", function (evento) {
  if (etapaPerguntas.hidden) return;
  const tecla = evento.key.toLowerCase();
  if (tecla === "s") responder(true);
  if (tecla === "n") responder(false);
});

mostrarPergunta();