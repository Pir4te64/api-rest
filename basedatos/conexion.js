const mongoose = require("mongoose");

const conexion = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mi_blog");
    console.log("Conexión exitosa");
  } catch (error) {
    console.log("Error de conexión", error);
    throw new Error("Error de conexión");
  }
};

module.exports = { conexion };
