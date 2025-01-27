const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");

console.log("App Conectada");
// conexion de la base de datos
conexion();
//crear server con express
const app = express();

//puerto de la app
const puerto = 3900;

//configurar cors
app.use(cors());

//habilitar express.json
app.use(express.json());
//middleware
app.use(express.urlencoded({ extended: true }));

app.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto: ${puerto}`);
});

//rutas
const rutas_Articulo = require("./rutas/Articulo");

app.use("/api", rutas_Articulo);
