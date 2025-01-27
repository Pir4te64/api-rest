const express = require("express");
const router = express.Router();
const ArticuloControlado = require("../controladores/Articulo");

router.post("/crear", ArticuloControlado.crear);
router.get("/articulos/:last?", ArticuloControlado.listar);
router.get("/articulo/:id", ArticuloControlado.uno);
router.delete("/articulo/:id", ArticuloControlado.eliminar);
router.put("/articulo/:id", ArticuloControlado.editar);
module.exports = router;
