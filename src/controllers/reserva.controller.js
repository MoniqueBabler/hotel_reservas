const prisma = require("../data/prisma");

const listar = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        quarto: true
      }
    });

    res.status(200).json(reservas);

  } catch (err) {
    console.log("ERRO LISTAR:", err);
    res.status(500).json({ error: err.message });
  }
};

const cadastrar = async (req, res) => {
  try {
    console.log("BODY RECEBIDO:", req.body);

    const { hospede, entrada, saida, quarto_id } = req.body;

    if (!hospede || !entrada || !saida || !quarto_id) {
      return res.status(400).json({
        error: "Campos obrigatórios faltando"
      });
    }

    const nova = await prisma.reserva.create({
      data: {
        hospede,
        data_entrada: new Date(entrada),
        data_saida: new Date(saida),
        quarto_id: Number(quarto_id)
      }
    });

    res.status(201).json(nova);

  } catch (err) {
    console.log("ERRO CADASTRAR:", err);
    res.status(500).json({ error: err.message });
  }
};


const editar = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    const reservaAtual = await prisma.reserva.findUnique({
      where: { id: Number(id) }
    });

    if (!reservaAtual) {
      return res.status(404).json({
        error: "Reserva não encontrada"
      });
    }

    const atualizado = await prisma.reserva.update({
      where: { id: Number(id) },
      data: {
        hospede: dados.hospede ?? reservaAtual.hospede,

        data_entrada: dados.entrada
          ? new Date(dados.entrada)
          : reservaAtual.data_entrada,

        data_saida: dados.saida
          ? new Date(dados.saida)
          : reservaAtual.data_saida,

        quarto_id: dados.quarto_id
          ? Number(dados.quarto_id)
          : reservaAtual.quarto_id
      }
    });

    res.status(200).json(atualizado);

  } catch (err) {
    console.log("ERRO EDITAR:", err);
    res.status(500).json({ error: err.message });
  }
};


const excluir = async (req, res) => {
  try {
    const { id } = req.params;

    const removido = await prisma.reserva.delete({
      where: { id: Number(id) }
    });

    res.status(200).json(removido);

  } catch (err) {
    console.log("ERRO EXCLUIR:", err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  listar,
  cadastrar,
  editar,
  excluir
};