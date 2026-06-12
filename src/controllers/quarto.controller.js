const prisma = require("../data/prisma");

const listar = async (req, res) => {
    try {

        const quartos = await prisma.quarto.findMany({
            include: {
                reservas: true
            }
        });

        res.status(200).json(quartos);

    } catch (err) {
        res.status(500).json(err);
    }
};


const buscarPorId = async (req, res) => {
    try {

        const { id } = req.params;

        const quarto = await prisma.quarto.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                reservas: true
            }
        });


        res.status(200).json(quarto);

    } catch (err) {
        res.status(500).json(err);
    }
};


const cadastrar = async (req, res) => {
    try {

        const quarto = req.body;


        const novo = await prisma.quarto.create({
            data: quarto
        });


        res.status(201).json(novo);


    } catch (err) {
        res.status(500).json(err);
    }
};

const editar = async (req, res) => {
    try {

        const { id } = req.params;


        const atualizado = await prisma.quarto.update({
            where: {
                id: Number(id)
            },
            data: req.body
        });


        res.status(200).json(atualizado);


    } catch (err) {
        res.status(500).json(err);
    }
};

const excluir = async (req, res) => {
    try {

        const { id } = req.params;


        const removido = await prisma.quarto.delete({
            where: {
                id: Number(id)
            }
        });


        res.status(200).json(removido);


    } catch (err) {
        res.status(500).json(err);
    }
};



module.exports = {
    listar,
    buscarPorId,
    cadastrar,
    editar,
    excluir
};