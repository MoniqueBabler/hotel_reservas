const router = require("express").Router();

const {
    listar,
    buscarPorId,
    cadastrar,
    editar,
    excluir
} = require("../controllers/quarto.controller");

router.get("/listar", listar);
router.get("/buscar/:id", buscarPorId);
router.post("/cadastrar", cadastrar);
router.put("/editar/:id", editar);
router.delete("/excluir/:id", excluir);
module.exports = router;