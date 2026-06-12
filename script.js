const API = "http://localhost:3000";

function mudarPainel(id) {
  const secoes = document.querySelectorAll(".conteudo-janela > div");
  secoes.forEach(secao => secao.style.display = "none");

  document.getElementById(id).style.display = "block";

  // abas visuais
  document.querySelectorAll(".link-aba").forEach(btn => btn.classList.remove("ativo"));

  if (id === "secao-quartos-lista") {
    document.getElementById("aba-quartos").classList.add("ativo");
    carregarQuartos();
  }

  if (id === "secao-total-reservas") {
    document.getElementById("aba-reservas").classList.add("ativo");
    carregarReservas();
  }
}

async function carregarQuartos() {
  try {
    const res = await fetch(`${API}/quartos/listar`);
    const dados = await res.json();

    const tabela = document.getElementById("tabela-quartos-corpo");
    tabela.innerHTML = "";

    dados.forEach(q => {
      tabela.innerHTML += `
        <tr>
          <td>${q.numero}</td>
          <td>${q.tipo}</td>
          <td>${q.status || "Disponível"}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Erro ao carregar quartos:", err);
  }
}

async function gravarQuarto() {
  const numero = document.getElementById("txt-num-quarto").value;
  const tipo = document.getElementById("select-categoria-quarto").value;

  if (!numero || !tipo) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    await fetch(`${API}/quartos/cadastrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numero, tipo })
    });

    alert("Quarto cadastrado!");
    mudarPainel("secao-quartos-lista");

  } catch (err) {
    console.error("Erro ao cadastrar quarto:", err);
  }
}

async function carregarReservas() {
  try {
    const res = await fetch(`${API}/reservas/listar`);
    const dados = await res.json();

    const tabela = document.getElementById("tabela-todas-corpo");
    tabela.innerHTML = "";

    dados.forEach(r => {
      tabela.innerHTML += `
        <tr>
          <td>${r.hospede}</td>
          <td>${r.quarto}</td>
          <td>${r.entrada}</td>
          <td>${r.saida}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Erro ao carregar reservas:", err);
  }
}

async function gravarReserva() {
  const hospede = document.getElementById("txt-hospede-nome").value;
  const entrada = document.getElementById("date-checkin").value;
  const saida = document.getElementById("date-checkout").value;

  if (!hospede || !entrada || !saida) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    await fetch(`${API}/reservas/cadastrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hospede,
        entrada,
        saida
      })
    });

    alert("Reserva cadastrada!");
    mudarPainel("secao-total-reservas");

  } catch (err) {
    console.error("Erro ao cadastrar reserva:", err);
  }
}

function fecharPop() {
  document.getElementById("pop-confirmacao").style.display = "none";
}

function abrirPop(mensagem, callback) {
  document.getElementById("pop-mensagem").innerText = mensagem;
  document.getElementById("pop-confirmacao").style.display = "block";

  const btn = document.getElementById("btn-pop-confirmar");
  btn.onclick = callback;
}

window.onload = () => {
  mudarPainel("secao-quartos-lista");
};