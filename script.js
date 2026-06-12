const API = "http://localhost:3000";

function mudarPainel(id) {
    const secoes = document.querySelectorAll(".conteudo-janela > div");
    secoes.forEach(secao => secao.style.display = "none");

    document.getElementById(id).style.display = "block";

    document.querySelectorAll(".link-aba").forEach(btn => btn.classList.remove("ativo"));

    if (id === "secao-quartos-lista") {
        document.getElementById("aba-quartos").classList.add("ativo");
        carregarQuartos();
    }

    if (id === "secao-total-reservas") {
        document.getElementById("aba-reservas").classList.add("ativo");
        carregarReservas();
    }

    if (id === "secao-reserva-nova") {
        carregarQuartosNoSelect();
    }
}


async function carregarQuartos() {
    try {
        const res = await fetch(`${API}/quartos/listar`);
        const dados = await res.json();

        const tabela = document.getElementById("tabela-quartos-corpo");
        tabela.innerHTML = "";

        dados.forEach(q => {
            const idQuarto = q.id;

            tabela.innerHTML += `
        <tr>
          <td>${q.numero}</td>
          <td>${q.tipo}</td>
          <td>${q.status || "Disponível"}</td>
          <td>
            <button class="botao-excluir-linha"
              onclick="abrirPop('Deseja realmente excluir o quarto ${q.numero}?', () => excluirQuartoAPI(${idQuarto}))">
              ❌ Excluir
            </button>
            <button class="botao-reservar-linha"
                onclick="mudarPainel('secao-reserva-nova')">
                🛎️ Reservar
            </button>
          </td>
        </tr>
      `;
        });

    } catch (err) {
        console.error("Erro ao carregar quartos:", err);
    }
}

async function excluirQuartoAPI(id) {
    try {
        const res = await fetch(`${API}/quartos/excluir/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            alert("Quarto excluído com sucesso!");
            fecharPop();
            carregarQuartos();
        }
    } catch (err) {
        console.error(err);
    }
}

async function gravarQuarto() {
    const numero = document.getElementById("txt-num-quarto").value;
    const tipo = document.getElementById("select-categoria-quarto").value;

    if (!numero || !tipo) {
        alert("Preencha todos os campos!");
        return;
    }

    await fetch(`${API}/quartos/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero, tipo })
    });

    alert("Quarto cadastrado!");
    mudarPainel("secao-quartos-lista");
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
          <td>${r.quarto?.numero || r.quarto}</td>
          <td>${r.data_entrada}</td>
          <td>${r.data_saida}</td>
          <td>
            <button class="botao-excluir-linha"
              onclick="abrirPop('Cancelar reserva de ${r.hospede}?', () => excluirReservaAPI(${r.id}))">
              ❌ Cancelar
            </button>
          </td>
        </tr>
      `;
        });

    } catch (err) {
        console.error(err);
    }
}

async function carregarQuartosNoSelect() {
    const res = await fetch(`${API}/quartos/listar`);
    const dados = await res.json();

    const select = document.getElementById("select-reserva-quarto");
    select.innerHTML = `<option value="">Selecione o quarto</option>`;

    dados.forEach(q => {
        select.innerHTML += `
      <option value="${q.id}">
        Quarto ${q.numero}
      </option>
    `;
    });
}

async function gravarReserva() {
    const hospede = document.getElementById("txt-hospede-nome").value;
    const entrada = document.getElementById("date-checkin").value;
    const saida = document.getElementById("date-checkout").value;
    const quarto_id = Number(document.getElementById("select-reserva-quarto").value);

    if (!hospede || !entrada || !saida || isNaN(quarto_id)) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    await fetch(`${API}/reservas/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            hospede,
            entrada,
            saida,
            quarto_id
        })
    });

    alert("Reserva cadastrada!");
    mudarPainel("secao-total-reservas");
}


async function excluirReservaAPI(id) {
    const res = await fetch(`${API}/reservas/excluir/${id}`, {
        method: "DELETE"
    });

    if (res.ok) {
        alert("Reserva cancelada!");
        fecharPop();
        carregarReservas();
    }
}


function fecharPop() {
    document.getElementById("pop-confirmacao").style.display = "none";
}

function abrirPop(mensagem, callback) {
    document.getElementById("pop-mensagem").innerText = mensagem;
    document.getElementById("pop-confirmacao").style.display = "block";

    document.getElementById("btn-pop-confirmar").onclick = callback;
}


window.onload = () => {
    mudarPainel("secao-quartos-lista");
};

    