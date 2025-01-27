const { Schema, model } = require("mongoose");

const ArticuloSchema = Schema({
  titulo: {
    type: String,
    required: true,
  },
  contenido: {
    type: String,
    required: true,
  },
  imagen: {
    type: String,
    default: "default.jpg",
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Articulo", ArticuloSchema, "articulos");
