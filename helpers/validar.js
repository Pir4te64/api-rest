const validator = require("validator");

const validarArticulo = (parametros) => {
  
    let titulo =
      !validator.isEmpty(parametros.titulo) &&
      validator.isLength(parametros.titulo, { min: 5, max: undefined });
    let contenido = !validator.isEmpty(parametros.contenido);

    if (!titulo || !contenido) {
      throw new Error("No se ha validado la informacion");
    }
 
}

module.exports = validarArticulo;