const express = require("express");
const router = express.Router();
const ArticuloControlado = require("../controladores/Articulo");
const multer = require("multer");
const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./imagenes/articulos");
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
  },
});

const subidas = multer({ storage: almacenamiento });
router.get("/test", ArticuloControlado.test);
router.post("/crear", ArticuloControlado.crear);
router.get("/articulos/:last?", ArticuloControlado.listar);
router.get("/articulo/:id", ArticuloControlado.uno);
router.delete("/articulo/:id", ArticuloControlado.eliminar);
router.put("/articulo/:id", ArticuloControlado.editar);
router.post("/subir-imagen/:id", [subidas.single("file0")], ArticuloControlado.subir);
router.get("/imagen/:fichero", ArticuloControlado.imagen);
router.get("/buscar/:busqueda", ArticuloControlado.buscador);
module.exports = router;
