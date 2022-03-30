const { format } = require("timeago.js");
const helpers = {};

//función para validar el rol del usuario y mostrar solo los modulos a los que tiene acceso
helpers.xif = (q, valor, options) => {
    if(q == valor)
    return options.fn(this);
};

//funcion para convertir el formato de fecha
helpers.timeago = (timestamp) => {
    return format(timestamp);
};

module.exports = helpers;