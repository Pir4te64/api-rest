const validator = require("validator");
const Articulo = require("../modelos/Articulo");

//crear un post
const crear = (req, res) => {
  //recibir los datos
  const parametros = req.body;
  //validar los datos con validator
  try {
    let titulo =
      !validator.isEmpty(parametros.titulo) &&
      validator.isLength(parametros.titulo, { min: 5, max: undefined });
    let contenido = !validator.isEmpty(parametros.contenido);

    if (!titulo || !contenido) {
      return res.status(400).json({
        status: "error",
        mensaje: "error",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "error",
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

    // Validar datos con validator
    try {
      const tituloValido =
        !validator.isEmpty(parametros.titulo) &&
        validator.isLength(parametros.titulo, { min: 5, max: undefined });
      const contenidoValido = !validator.isEmpty(parametros.contenido);

      if (!tituloValido || !contenidoValido) {
        return res.status(400).json({
          status: "error",
          mensaje:
            "Falta el titulo o contenido, o no cumplen con los requisitos.",
        });
      }
    } catch (error) {
      return res.status(400).json({
        status: "error",
        mensaje: "Error en la validación de datos",
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

module.exports = {
  crear,
  listar,
  uno,
  eliminar,
  editar,
};
