const router = require("express").Router();

const {
    listar,
    cadastrar,
    editar,
    excluir
} = require("../controllers/reserva.controller");
router.get("/listar", listar);
router.post("/cadastrar", cadastrar);
router.put("/editar/:id", editar);
router.delete("/excluir/:id", excluir);
module.exports = router;