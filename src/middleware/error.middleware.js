/*
===========================================================
Middleware global de manejo de errores
-----------------------------------------------------------
La idea de este middleware es que TODOS los errores
del backend terminen pasando por acá.

Entonces en vez de manejar errores en cada controller,
podemos usar next(error) y Express los redirige acá.

Esto mantiene el código mucho más limpio.
===========================================================
*/

const errorHandler = (error, req, res, next) => {

    // log simple para ver el error en consola
    console.error("ERROR:", error);

    /*
    Si el error ya trae status lo usamos.
    Si no, devolvemos 500 (error interno del servidor)
    */
    const status = error.status || 500;

    res.status(status).json({
        status: "error",
        message: error.message || "Error interno del servidor"
    });

};

export default errorHandler;