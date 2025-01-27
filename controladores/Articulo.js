const Articulo = require("../modelos/Articulo");
const validarArticulo = require("../helpers/validar");
const fs = require("fs");
const path = require("path");
//crear ruta test
const test = (req, res) => {
  return res.status(200).json({
    status: "ok",
    mensaje: "ruta de prueba",
  });
};

//crear un post
const crear = (req, res) => {
  //recibir los datos
  const parametros = req.body;
  //validar los datos con validator
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Error faltan datos",
    });
  }
  //crear el objeto
  const articulo = new Articulo(parametros);

  //guardar en la base de datos
  try {
    articulo.save();
    return res.status(200).json({
      status: "ok",
      mensaje: "guardado",
      articulo: articulo,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "error al guardar los datos",
    });
  }
};
//listar todos los articulos
const listar = async (req, res) => {
  try {
    const ultimos = req.params.last || null;

    const consulta = await Articulo.find({}).sort({ fecha: -1 }).limit(ultimos);

    if (!consulta || consulta.length === 0) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se han encontrado articulos",
      });
    }
    return res.status(200).send({
      status: "success",
      parametro: req.params.ultimos,
      contador: consulta.length,
      consulta,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Ha ocurrido un error al listar",
    });
  }
};
//buscar un articulo por id
const uno = async (req, res) => {
  try {
    const id = req.params.id;

    const consulta = await Articulo.findById(id);

    if (!consulta || consulta.length === 0) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se han encontrado articulos",
      });
    }
    return res.status(200).send({
      status: "success",
      consulta,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Ha ocurrido un error al listar",
    });
  }
};
//eliminar uno de los articulos
const eliminar = async (req, res) => {
  try {
    const id = req.params.id;

    const consulta = await Articulo.findByIdAndDelete(id);

    if (!consulta || consulta.length === 0) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se han encontrado articulos",
      });
    }
    return res.status(200).send({
      status: "success",
      mensaje: "Articulo eliminado",
      articulo: consulta,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Ha ocurrido un error al listar",
    });
  }
};
//editar un articulo
const editar = async (req, res) => {
  try {
    const id = req.params.id;
    const parametros = req.body;
    try {
      validarArticulo(parametros);
    } catch (error) {
      return res.status(400).json({
        status: "error",
        mensaje: "Error faltan datos",
      });
    }

    // Buscar y actualizar el artículo
    const consulta = await Articulo.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!consulta) {
      return res.status(404).json({
        status: "error",
        mensaje: "Artículo no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      mensaje: "Artículo actualizado exitosamente",
      articulo: consulta,
    });
  } catch (error) {
    console.error("Error en el método editar:", error);
    return res.status(500).json({
      status: "error",
      mensaje: "Ha ocurrido un error al intentar actualizar el artículo",
    });
  }
};

const subir = async (req, res) => {
  //recoger el fichero de imagen subido
  if (!req.file && !req.files) {
    return res.status(500).json({
      status: "error",
      mensaje: "peticion invalida",
    });
  }

  //nombre del archivo
  let archivo = req.file.originalname;

  //extension del archivo
  let archivo_split = archivo.split(".");
  let extension = archivo_split[1];

  //comprobamos la extension correcta
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    //borrar archivo y dar respuesta
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "imagen invalida",
      });
    });
  }

  //id
  let articuloId = req.params.id;

  let articulo = await Articulo.findOneAndUpdate(
    { _id: articuloId },
    { imagen: req.file.filename },
    { new: true }
  )

    //devolver respuesta
    .then((articuloActualizado) => {
      return res.status(200).json({
        status: "success",
        archivo: articuloActualizado,
        fichero: req.file,
      });
    })

    .catch((error) => {
      return res.status(404).json({
        status: "error",
        mensaje: "error al actualizar " + error,
      });
    });
};
const imagen = (req, res) => {
  let fichero = req.params.fichero;
  let ruta = `./imagenes/articulos/${fichero}`;
  fs.stat(ruta, (error, existe) => {
    if (existe) {
      return res.sendFile(path.resolve(ruta));
    } else {
      return res.status(404).json({
        status: "error",
        mensaje: "imagen no encontrada",
        existe,
        fichero,
        ruta,
      });
    }
  });
};

const buscador = async (req, res) => {
  try {
    // Sacar el string de busqueda
    let busqueda = req.params.busqueda
    // Find OR y puedes aplicar expresiones reg
    // Orden
    // Ejecutar consulta
    let articulos = await Articulo.find({
      "$or": [
        { "titulo": { "$regex": busqueda, "$options": "i" } },
        { "contenido": { "$regex": busqueda, "$options": "i" } }
      ]
    }).sort({ fecha: -1 })
      .exec()

    if (!articulos || articulos.length <= 0) {

      return res.status(404).json({
        status: "error",
        mensaje: "No hay articulos que coincidan",
        articulos: articulos
      })
    }
    return res.status(200).json({
      status: "success",
      articulos
    })
    // Devolver resultados 
  } catch (error) {
    return res.status(404).json({
      status: "error",
      mensaje: "Fallo la algo a la hora de realizarla busqueda "
    })
  }
}
module.exports = {
  crear,
  listar,
  uno,
  eliminar,
  editar,
  test,
  subir,
  imagen,
  buscador,
};
